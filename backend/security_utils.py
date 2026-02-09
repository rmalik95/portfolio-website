"""
Security utilities for portfolio website backend.
Implements XSS protection, input sanitization, and security validation.
"""

import bleach
import re
from typing import Optional
import hashlib
import secrets
from datetime import datetime, timedelta
import httpx
import os


class InputSanitizer:
    """Sanitize and validate user inputs to prevent XSS and injection attacks"""

    @staticmethod
    def sanitize_text(text: str, max_length: Optional[int] = None) -> str:
        """
        Sanitize text input by removing potentially dangerous HTML/scripts.

        Args:
            text: Input text to sanitize
            max_length: Optional maximum length to enforce

        Returns:
            Sanitized text safe for storage and display
        """
        if not text:
            return ""

        # Remove all HTML tags (no tags allowed in contact form)
        sanitized = bleach.clean(text, tags=[], strip=True)

        # Remove control characters and null bytes
        sanitized = re.sub(r'[\x00-\x1F\x7F]', '', sanitized)

        # Trim whitespace
        sanitized = sanitized.strip()

        # Enforce max length if specified
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]

        return sanitized

    @staticmethod
    def validate_email_security(email: str) -> bool:
        """
        Additional email security validation beyond format checking.
        Prevents email header injection attacks.

        Args:
            email: Email address to validate

        Returns:
            True if email passes security checks, False otherwise
        """
        # Check for newlines, carriage returns (header injection)
        if re.search(r'[\r\n]', email):
            return False

        # Check for header injection patterns
        header_injection_pattern = r'(content-type:|bcc:|cc:|to:|from:)'
        if re.search(header_injection_pattern, email, re.IGNORECASE):
            return False

        # Check for suspicious patterns
        if '..' in email or email.startswith('.') or email.endswith('.'):
            return False

        return True

    @staticmethod
    def detect_sql_injection_patterns(text: str) -> bool:
        """
        Detect common SQL injection patterns in input.

        Note: This is defense-in-depth. Primary protection is parameterized queries.

        Args:
            text: Input text to check

        Returns:
            True if potential SQL injection detected, False otherwise
        """
        # Common SQL injection patterns
        sql_patterns = [
            r"(\bunion\b.*\bselect\b)",
            r"(\bor\b.*=.*)",
            r"(--|#|\/\*)",
            r"(\bdrop\b.*\btable\b)",
            r"(\binsert\b.*\binto\b)",
            r"(\bdelete\b.*\bfrom\b)",
            r"(\bupdate\b.*\bset\b)",
            r"(xp_cmdshell|exec\s+master)",
            r"(\bselect\b.*\bfrom\b.*\bwhere\b)",
        ]

        text_lower = text.lower()
        for pattern in sql_patterns:
            if re.search(pattern, text_lower):
                return True

        return False


class SecurityValidator:
    """Additional security validation checks"""

    @staticmethod
    def validate_honeypot(honeypot_value: Optional[str]) -> bool:
        """
        Validate honeypot field - should be empty for legitimate users.

        Args:
            honeypot_value: Value of honeypot field

        Returns:
            True if validation passes (field is empty), False if likely bot
        """
        return not honeypot_value or len(honeypot_value.strip()) == 0

    @staticmethod
    def validate_submission_timing(form_load_time: Optional[int],
                                   submit_time: Optional[int],
                                   min_time_ms: int = 3000) -> bool:
        """
        Validate form submission timing to detect bots.

        Args:
            form_load_time: Timestamp when form was loaded (milliseconds)
            submit_time: Timestamp when form was submitted (milliseconds)
            min_time_ms: Minimum time required for legitimate submission

        Returns:
            True if timing is valid, False if submitted too quickly (likely bot)
        """
        if not form_load_time or not submit_time:
            # If timing data not provided, allow (optional field)
            return True

        time_taken = submit_time - form_load_time
        return time_taken >= min_time_ms

    @staticmethod
    async def verify_recaptcha(token: str, secret_key: str,
                               min_score: float = 0.5) -> tuple[bool, float]:
        """
        Verify Google reCAPTCHA v3 token.

        Args:
            token: reCAPTCHA token from frontend
            secret_key: reCAPTCHA secret key
            min_score: Minimum score required (0.0-1.0)

        Returns:
            Tuple of (is_human: bool, score: float)
        """
        if not token or not secret_key:
            return False, 0.0

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://www.google.com/recaptcha/api/siteverify',
                    data={
                        'secret': secret_key,
                        'response': token
                    },
                    timeout=5.0
                )

                result = response.json()
                success = result.get('success', False)
                score = result.get('score', 0.0)

                return success and score >= min_score, score

        except Exception as e:
            # Log error but don't block submission on reCAPTCHA failure
            print(f"reCAPTCHA verification error: {e}")
            return True, 0.0  # Fail open (allow submission)


class SecurityHasher:
    """Security-related hashing functions"""

    @staticmethod
    def hash_file(file_content: bytes) -> str:
        """
        Generate SHA-256 hash of file content for integrity verification.

        Args:
            file_content: File content as bytes

        Returns:
            Hexadecimal hash string
        """
        return hashlib.sha256(file_content).hexdigest()

    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """
        Generate cryptographically secure random token.

        Args:
            length: Length of token in bytes

        Returns:
            Hexadecimal token string
        """
        return secrets.token_hex(length)


class RateLimitTracker:
    """Simple in-memory rate limit tracking (for development/small scale)"""

    def __init__(self):
        self._requests: dict[str, list[datetime]] = {}

    def is_rate_limited(self, identifier: str, max_requests: int,
                       window_seconds: int) -> bool:
        """
        Check if identifier (IP address) has exceeded rate limit.

        Args:
            identifier: Unique identifier (e.g., IP address)
            max_requests: Maximum requests allowed in window
            window_seconds: Time window in seconds

        Returns:
            True if rate limited, False otherwise
        """
        now = datetime.now()
        cutoff = now - timedelta(seconds=window_seconds)

        # Get request history for this identifier
        if identifier not in self._requests:
            self._requests[identifier] = []

        # Remove old requests outside the window
        self._requests[identifier] = [
            req_time for req_time in self._requests[identifier]
            if req_time > cutoff
        ]

        # Check if limit exceeded
        if len(self._requests[identifier]) >= max_requests:
            return True

        # Add current request
        self._requests[identifier].append(now)
        return False

    def cleanup_old_entries(self, max_age_seconds: int = 3600):
        """Remove entries older than max_age_seconds to prevent memory bloat"""
        cutoff = datetime.now() - timedelta(seconds=max_age_seconds)

        for identifier in list(self._requests.keys()):
            self._requests[identifier] = [
                req_time for req_time in self._requests[identifier]
                if req_time > cutoff
            ]

            # Remove empty entries
            if not self._requests[identifier]:
                del self._requests[identifier]
