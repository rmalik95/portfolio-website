from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import io


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Contact Form Models
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=20, max_length=1000)

class ContactResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    status: str = "pending"

# Resume Models
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

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ============================================
# Contact Form Endpoints
# ============================================

@api_router.post("/contact", response_model=ContactResponse, status_code=201)
async def submit_contact_form(contact: ContactCreate, request: Request):
    """Submit a contact form message"""
    contact_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    # Get optional metadata
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent", "")
    
    contact_doc = {
        "id": contact_id,
        "name": contact.name,
        "email": contact.email,
        "subject": contact.subject,
        "message": contact.message,
        "created_at": now.isoformat(),
        "status": "pending",
        "ip_address": ip_address,
        "user_agent": user_agent
    }
    
    await db.contact_submissions.insert_one(contact_doc)
    
    logger.info(f"New contact form submission from {contact.email}")
    
    return ContactResponse(
        id=contact_id,
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message,
        created_at=now,
        status="pending"
    )

@api_router.get("/contact", response_model=List[ContactResponse])
async def get_contact_submissions():
    """Get all contact form submissions"""
    submissions = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    
    result = []
    for sub in submissions:
        if isinstance(sub.get('created_at'), str):
            sub['created_at'] = datetime.fromisoformat(sub['created_at'])
        result.append(ContactResponse(**sub))
    
    return result


# ============================================
# Resume Endpoints
# ============================================

@api_router.post("/resume/upload", response_model=ResumeResponse, status_code=201)
async def upload_resume(file: UploadFile = File(...)):
    """Upload a resume PDF file"""
    # Validate file type
    if not file.content_type or file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    # Validate file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if file_size > max_size:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
    
    resume_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    filename = f"resume_{resume_id}.pdf"
    
    # Deactivate any existing active resumes
    await db.resumes.update_many(
        {"is_active": True},
        {"$set": {"is_active": False}}
    )
    
    # Store in MongoDB with base64 encoded file data
    resume_doc = {
        "id": resume_id,
        "filename": filename,
        "original_filename": file.filename or "resume.pdf",
        "file_data": base64.b64encode(file_content).decode('utf-8'),
        "file_size": file_size,
        "content_type": file.content_type,
        "uploaded_at": now.isoformat(),
        "is_active": True
    }
    
    await db.resumes.insert_one(resume_doc)
    
    logger.info(f"Resume uploaded: {filename}, size: {file_size} bytes")
    
    return ResumeResponse(
        id=resume_id,
        filename=filename,
        original_filename=file.filename or "resume.pdf",
        file_size=file_size,
        content_type=file.content_type,
        uploaded_at=now,
        is_active=True
    )

@api_router.get("/resume", response_model=ResumeMetadata)
async def get_resume_metadata():
    """Get the active resume metadata"""
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

@api_router.get("/resume/download")
async def download_resume():
    """Download the active resume PDF file"""
    resume = await db.resumes.find_one({"is_active": True})
    
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
    
    # Decode base64 file data
    file_data = base64.b64decode(resume['file_data'])
    
    # Create streaming response
    return StreamingResponse(
        io.BytesIO(file_data),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={resume['original_filename']}",
            "Content-Length": str(resume['file_size'])
        }
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()