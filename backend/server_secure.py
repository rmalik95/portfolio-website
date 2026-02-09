"""
Secure FastAPI server for portfolio website with comprehensive security guardrails.
Implements:
- Input validation & sanitization
- Rate limiting
- Security headers
- XSS protection
- SQL injection prevention (via parameterized queries with MongoDB)
- CSRF protection
- Structured logging
- Bot detection (honeypot, timing)
"""

from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import io

# Import security modules
from security_middleware import (
    SecurityHeadersMiddleware,
    RequestValidationMiddleware,
    SecurityLoggingMiddleware,
    setup_cors,
    setup_rate_limiting,
    rate_limit_contact_form,
    rate_limit_general_api,
    rate_limit_file_upload,
    limiter,
)
from security_utils import (
    InputSanitizer,
    SecurityValidator,
    SecurityHasher,
)


# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(
    title="Portfolio API",
    description="Secure API for portfolio website with contact form",
    version="1.0.0",
    docs_url="/docs" if os.getenv("DEBUG", "False") == "True" else None,  # Disable docs in production
    redoc_url=None,  # Disable redoc
)

# Create API router
api_router = APIRouter(prefix="/api")

# Configure structured logging
logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO")),
    format='%(asctime)s | %(levelname)s | %(name)s | %(message)s',
    handlers=[
        logging.FileHandler(os.getenv("LOG_FILE_PATH", "./logs/app.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Security logger
security_logger = logging.getLogger("security")
security_handler = logging.FileHandler(os.getenv("SECURITY_LOG_FILE", "./logs/security.log"))
security_handler.setFormatter(logging.Formatter('%(asctime)s | SECURITY | %(message)s'))
security_logger.addHandler(security_handler)
security_logger.setLevel(logging.WARNING)


# ============================================
# Security Helper Functions
# ============================================

def log_security_event(event: str, request: Request, details: dict = None):
    """Log security-related events"""
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")

    log_entry = f"{event} | IP: {client_ip} | Path: {request.url.path} | UA: {user_agent}"
    if details:
        log_entry += f" | Details: {details}"

    security_logger.warning(log_entry)


# ============================================
# Pydantic Models with Enhanced Validation
# ============================================

class ContactCreate(BaseModel):
    """Contact form submission with strict validation"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=20, max_length=1000)

    # Bot detection fields (optional)
    honeypot: Optional[str] = Field(default=None, alias="website")  # Honeypot field
    form_load_time: Optional[int] = None  # Milliseconds
    submit_time: Optional[int] = None  # Milliseconds
    recaptcha_token: Optional[str] = None

    @validator('name', 'subject', 'message')
    def sanitize_text_fields(cls, v):
        """Sanitize text fields to prevent XSS"""
        return InputSanitizer.sanitize_text(v)

    @validator('email')
    def validate_email_security(cls, v):
        """Additional email security validation"""
        if not SecurityValidator.validate_honeypot(v):
            raise ValueError("Invalid email format")

        # Check for email header injection
        if not InputSanitizer.validate_email_security(v):
            raise ValueError("Email contains invalid characters")

        return v.lower()

    @validator('message')
    def check_sql_injection(cls, v):
        """Detect potential SQL injection patterns"""
        if InputSanitizer.detect_sql_injection_patterns(v):
            raise ValueError("Message contains invalid patterns")
        return v

    class Config:
        populate_by_name = True  # Allow both honeypot and website


class ContactResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    status: str = "pending"


class ResumeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    filename: str
    original_filename: str
    file_size: int
    content_type: str
    uploaded_at: datetime
    is_active: bool = True


class ResumeMetadata(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_size: int
    uploaded_at: datetime
    download_url: str


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# ============================================
# API Endpoints
# ============================================

@api_router.get("/")
@limiter.limit("100/minute")
async def root(request: Request):
    """Health check endpoint"""
    return {"message": "Portfolio API v1.0", "status": "healthy"}


# ============================================
# Contact Form Endpoints (with heavy security)
# ============================================

@api_router.post("/contact", response_model=ContactResponse, status_code=201)
@limiter.limit("5/hour")  # Strict rate limit for contact form
async def submit_contact_form(contact: ContactCreate, request: Request):
    """
    Submit a contact form message with comprehensive security checks.

    Security measures:
    - Input validation and sanitization
    - Rate limiting (5 submissions per hour per IP)
    - Honeypot field detection
    - Form timing validation
    - reCAPTCHA verification (if configured)
    - SQL injection pattern detection
    - XSS protection
    """
    try:
        client_ip = request.client.host if request.client else "unknown"

        # 1. Honeypot check (bot detection)
        if not SecurityValidator.validate_honeypot(contact.honeypot):
            log_security_event("HONEYPOT_TRIGGERED", request, {
                "honeypot_value": contact.honeypot
            })
            # Return success to not reveal honeypot to bots
            return JSONResponse(
                status_code=201,
                content={"message": "Message sent successfully"}
            )

        # 2. Form timing validation (bot detection)
        if not SecurityValidator.validate_submission_timing(
            contact.form_load_time,
            contact.submit_time,
            min_time_ms=int(os.getenv("MIN_FORM_SUBMIT_TIME", "3000"))
        ):
            log_security_event("FORM_SUBMITTED_TOO_FAST", request, {
                "time_taken": contact.submit_time - contact.form_load_time if contact.submit_time and contact.form_load_time else 0
            })
            # Rate limit more aggressively
            raise HTTPException(
                status_code=429,
                detail="Please slow down and try again"
            )

        # 3. reCAPTCHA verification (if configured)
        recaptcha_secret = os.getenv("RECAPTCHA_SECRET_KEY")
        if recaptcha_secret and contact.recaptcha_token:
            is_human, score = await SecurityValidator.verify_recaptcha(
                contact.recaptcha_token,
                recaptcha_secret,
                min_score=float(os.getenv("RECAPTCHA_MIN_SCORE", "0.5"))
            )

            if not is_human:
                log_security_event("RECAPTCHA_FAILED", request, {"score": score})
                raise HTTPException(
                    status_code=400,
                    detail="reCAPTCHA verification failed"
                )

        # 4. Create contact submission
        contact_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        contact_doc = {
            "id": contact_id,
            "name": contact.name,  # Already sanitized by validator
            "email": contact.email,  # Already validated
            "subject": contact.subject,  # Already sanitized
            "message": contact.message,  # Already sanitized and checked
            "created_at": now.isoformat(),
            "status": "pending",
            "ip_address": client_ip,
            "user_agent": request.headers.get("user-agent", ""),
            "referrer": request.headers.get("referer", ""),
        }

        # 5. Store in MongoDB (parameterized query - safe from SQL injection)
        await db.contact_submissions.insert_one(contact_doc)

        logger.info(f"Contact form submission received from {contact.email} (IP: {client_ip})")

        # 6. TODO: Send email notification (implement with aiosmtplib)
        # await send_contact_notification(contact)

        return ContactResponse(
            id=contact_id,
            name=contact.name,
            email=contact.email,
            subject=contact.subject,
            message=contact.message,
            created_at=now,
            status="pending"
        )

    except HTTPException:
        raise
    except Exception as e:
        # Log error without exposing details to client
        logger.error(f"Contact form error: {str(e)}", exc_info=True)
        log_security_event("CONTACT_FORM_ERROR", request, {"error": str(e)})

        # Generic error message
        raise HTTPException(
            status_code=500,
            detail="Failed to process submission. Please try again later."
        )


@api_router.get("/contact", response_model=List[ContactResponse])
@limiter.limit("30/minute")
async def get_contact_submissions(request: Request):
    """
    Get all contact form submissions.
    TODO: Add authentication/authorization for admin access only.
    """
    try:
        submissions = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)

        result = []
        for sub in submissions:
            if isinstance(sub.get('created_at'), str):
                sub['created_at'] = datetime.fromisoformat(sub['created_at'])
            result.append(ContactResponse(**sub))

        return result

    except Exception as e:
        logger.error(f"Error fetching contact submissions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch submissions"
        )


# ============================================
# Resume Endpoints
# ============================================

@api_router.post("/resume/upload", response_model=ResumeResponse, status_code=201)
@limiter.limit("10/hour")  # Rate limit file uploads
async def upload_resume(file: UploadFile = File(...), request: Request = None):
    """
    Upload a resume PDF file with security checks.

    Security measures:
    - File type validation (PDF only)
    - File size limit (5MB)
    - Rate limiting
    - File integrity hashing
    """
    try:
        # 1. Validate file type (strict check)
        if not file.content_type or file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

        # 2. Validate filename
        if not file.filename or not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file name"
            )

        # 3. Read and validate file size
        file_content = await file.read()
        file_size = len(file_content)

        max_size = int(os.getenv("MAX_FILE_SIZE", str(5 * 1024 * 1024)))  # 5MB default
        if file_size > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {max_size // (1024*1024)}MB limit"
            )

        # 4. Generate file hash for integrity
        file_hash = SecurityHasher.hash_file(file_content)

        resume_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        filename = f"resume_{resume_id}.pdf"

        # 5. Deactivate existing active resumes
        await db.resumes.update_many(
            {"is_active": True},
            {"$set": {"is_active": False}}
        )

        # 6. Store in MongoDB
        resume_doc = {
            "id": resume_id,
            "filename": filename,
            "original_filename": file.filename,
            "file_data": base64.b64encode(file_content).decode('utf-8'),
            "file_size": file_size,
            "file_hash": file_hash,  # For integrity verification
            "content_type": file.content_type,
            "uploaded_at": now.isoformat(),
            "is_active": True
        }

        await db.resumes.insert_one(resume_doc)

        logger.info(f"Resume uploaded: {filename}, size: {file_size} bytes, hash: {file_hash}")

        return ResumeResponse(
            id=resume_id,
            filename=filename,
            original_filename=file.filename,
            file_size=file_size,
            content_type=file.content_type,
            uploaded_at=now,
            is_active=True
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resume upload error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to upload resume"
        )


@api_router.get("/resume", response_model=ResumeMetadata)
@limiter.limit("60/minute")
async def get_resume_metadata(request: Request):
    """Get the active resume metadata"""
    try:
        resume = await db.resumes.find_one(
            {"is_active": True},
            {"_id": 0, "file_data": 0}  # Exclude binary data
        )

        if not resume:
            raise HTTPException(status_code=404, detail="No resume found")

        if isinstance(resume.get('uploaded_at'), str):
            resume['uploaded_at'] = datetime.fromisoformat(resume['uploaded_at'])

        return ResumeMetadata(
            id=resume['id'],
            filename=resume['filename'],
            original_filename=resume['original_filename'],
            file_size=resume['file_size'],
            uploaded_at=resume['uploaded_at'],
            download_url="/api/resume/download"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching resume metadata: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch resume")


@api_router.get("/resume/download")
@limiter.limit("30/minute")
async def download_resume(request: Request):
    """
    Download the active resume PDF file.

    Security measures:
    - Rate limiting
    - Content-Disposition header to prevent inline execution
    - File integrity verification
    """
    try:
        resume = await db.resumes.find_one({"is_active": True})

        if not resume:
            raise HTTPException(status_code=404, detail="No resume found")

        # Decode base64 file data
        file_data = base64.b64decode(resume['file_data'])

        # Verify file integrity (if hash exists)
        if 'file_hash' in resume:
            current_hash = SecurityHasher.hash_file(file_data)
            if current_hash != resume['file_hash']:
                logger.error(f"File integrity check failed for resume {resume['id']}")
                raise HTTPException(
                    status_code=500,
                    detail="File integrity verification failed"
                )

        # Create streaming response with security headers
        return StreamingResponse(
            io.BytesIO(file_data),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={resume['original_filename']}",
                "Content-Length": str(resume['file_size']),
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "public, max-age=604800",  # Cache for 7 days
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Resume download error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to download resume")


# ============================================
# Status Check Endpoints
# ============================================

@api_router.post("/status", response_model=StatusCheck)
@limiter.limit("60/minute")
async def create_status_check(input: StatusCheckCreate, request: Request):
    """Create a status check entry"""
    try:
        status_dict = input.model_dump()
        status_obj = StatusCheck(**status_dict)

        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()

        await db.status_checks.insert_one(doc)
        return status_obj

    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create status check")


@api_router.get("/status", response_model=List[StatusCheck])
@limiter.limit("60/minute")
async def get_status_checks(request: Request):
    """Get all status checks"""
    try:
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])

        return status_checks

    except Exception as e:
        logger.error(f"Error fetching status checks: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch status checks")


# ============================================
# Include router in main app
# ============================================

app.include_router(api_router)


# ============================================
# Setup Security Middleware
# ============================================

# 1. Security headers
app.add_middleware(SecurityHeadersMiddleware)

# 2. Request validation
app.add_middleware(RequestValidationMiddleware)

# 3. Security logging
app.add_middleware(SecurityLoggingMiddleware)

# 4. CORS (strict configuration)
cors_origins = os.getenv('CORS_ORIGINS', '').split(',')
cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]

if not cors_origins:
    logger.warning("No CORS origins configured! Using restrictive defaults.")
    cors_origins = ["https://rishabhmalik.com"]

setup_cors(app, cors_origins)

# 5. Rate limiting
setup_rate_limiting(app)

logger.info(f"Security configured: CORS origins = {cors_origins}")


# ============================================
# Startup and Shutdown Events
# ============================================

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    # Create logs directory if it doesn't exist
    logs_dir = Path("./logs")
    logs_dir.mkdir(exist_ok=True)

    logger.info("Portfolio API started successfully")
    logger.info(f"Environment: {os.getenv('NODE_ENV', 'development')}")
    logger.info(f"Rate limiting enabled: {os.getenv('RATE_LIMIT_ENABLED', 'True')}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    client.close()
    logger.info("Portfolio API shutdown")


# ============================================
# Custom Exception Handlers
# ============================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler - never expose internal errors"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)

    # Log security event
    log_security_event("UNHANDLED_EXCEPTION", request, {"error": type(exc).__name__})

    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )
