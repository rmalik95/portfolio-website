"""
Security middleware for FastAPI application.
Implements security headers, rate limiting, and request validation.
"""

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
from typing import Callable
import os


logger = logging.getLogger(__name__)


# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all responses.
    Implements OWASP recommended security headers.
    """

    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)

        # Security headers
        security_headers = {
            # Prevent clickjacking
            "X-Frame-Options": "DENY",

            # Prevent MIME type sniffing
            "X-Content-Type-Options": "nosniff",

            # XSS Protection (legacy browsers)
            "X-XSS-Protection": "1; mode=block",

            # Referrer Policy
            "Referrer-Policy": "strict-origin-when-cross-origin",

            # Permissions Policy (formerly Feature-Policy)
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",

            # Content Security Policy
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self'; "
                "connect-src 'self'; "
                "frame-src https://www.google.com/recaptcha/; "
                "object-src 'none'; "
                "upgrade-insecure-requests;"
            ),

            # Strict Transport Security (HTTPS only)
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        }

        for header, value in security_headers.items():
            response.headers[header] = value

        # Remove server version header
        if "server" in response.headers:
            del response.headers["server"]

        return response


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """
    Validate incoming requests for security issues.
    Block suspicious requests before they reach endpoints.
    """

    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    MAX_HEADER_SIZE = 8192  # 8KB

    async def dispatch(self, request: Request, call_next: Callable):
        # Check content length
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.MAX_CONTENT_LENGTH:
            logger.warning(
                f"Request blocked: Content-Length too large ({content_length} bytes) from {request.client.host}"
            )
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"error": "Request entity too large"}
            )

        # Check headers size
        headers_size = sum(len(k) + len(v) for k, v in request.headers.items())
        if headers_size > self.MAX_HEADER_SIZE:
            logger.warning(
                f"Request blocked: Headers too large ({headers_size} bytes) from {request.client.host}"
            )
            return JSONResponse(
                status_code=status.HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE,
                content={"error": "Request header fields too large"}
            )

        # Block requests with suspicious user agents (optional)
        user_agent = request.headers.get("user-agent", "").lower()
        suspicious_agents = ["sqlmap", "nikto", "nmap", "masscan", "nessus"]
        if any(agent in user_agent for agent in suspicious_agents):
            logger.warning(
                f"Request blocked: Suspicious user-agent ({user_agent}) from {request.client.host}"
            )
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={"error": "Forbidden"}
            )

        response = await call_next(request)
        return response


class SecurityLoggingMiddleware(BaseHTTPMiddleware):
    """
    Log security-relevant events and suspicious activity.
    """

    async def dispatch(self, request: Request, call_next: Callable):
        # Log request details
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")

        # Process request
        response = await call_next(request)

        # Log security events
        if response.status_code in [401, 403, 429]:
            logger.warning(
                f"Security event: {response.status_code} | "
                f"IP: {client_ip} | "
                f"Path: {request.url.path} | "
                f"Method: {request.method} | "
                f"User-Agent: {user_agent}"
            )

        # Log failed requests
        if response.status_code >= 400:
            logger.info(
                f"Failed request: {response.status_code} | "
                f"IP: {client_ip} | "
                f"Path: {request.url.path}"
            )

        return response


def setup_cors(app, allowed_origins: list[str]):
    """
    Configure CORS with strict settings.

    Args:
        app: FastAPI application instance
        allowed_origins: List of allowed origin URLs
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,  # Specific origins only
        allow_credentials=True,
        allow_methods=["GET", "POST"],  # Only methods we use
        allow_headers=[
            "Content-Type",
            "Authorization",
            "X-CSRF-Token",
            "X-Requested-With"
        ],  # Specific headers only
        max_age=600,  # Cache preflight for 10 minutes
    )


def setup_rate_limiting(app):
    """
    Configure rate limiting for the application.

    Args:
        app: FastAPI application instance
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Rate limit decorators for different endpoints
def rate_limit_contact_form():
    """Rate limit for contact form: 5 requests per hour"""
    return limiter.limit("5/hour")


def rate_limit_general_api():
    """Rate limit for general API: 100 requests per 15 minutes"""
    return limiter.limit("100/15minutes")


def rate_limit_file_upload():
    """Rate limit for file uploads: 10 requests per hour"""
    return limiter.limit("10/hour")
