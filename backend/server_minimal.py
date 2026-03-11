"""
Minimal FastAPI server for portfolio website.
Provides only resume download functionality using filesystem storage.
No MongoDB required.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
import logging
import shutil

# Setup
ROOT_DIR = Path(__file__).parent
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

load_dotenv(ROOT_DIR / '.env')

# Create app
app = FastAPI(
    title="Portfolio API",
    description="Minimal API for resume downloads",
    version="1.0.0"
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class ResumeMetadata(BaseModel):
    filename: str
    file_size: int
    uploaded_at: str
    download_url: str


# ============================================
# Resume Endpoints
# ============================================

@app.get("/")
async def root():
    """Health check"""
    return {
        "message": "Portfolio API - Resume Service",
        "status": "healthy",
        "endpoints": ["/api/resume", "/api/resume/download"]
    }


@app.get("/api/resume")
async def get_resume_metadata():
    """Get resume metadata"""
    resume_path = UPLOAD_DIR / "resume.pdf"
    
    if not resume_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No resume found. Please upload a resume first."
        )
    
    stat = resume_path.stat()
    
    return ResumeMetadata(
        filename="resume.pdf",
        file_size=stat.st_size,
        uploaded_at=datetime.fromtimestamp(stat.st_mtime).isoformat(),
        download_url="/api/resume/download"
    )


@app.get("/api/resume/download")
async def download_resume():
    """Download the resume PDF"""
    resume_path = UPLOAD_DIR / "resume.pdf"
    
    if not resume_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No resume found. Please upload a resume first."
        )
    
    return FileResponse(
        path=resume_path,
        media_type="application/pdf",
        filename="resume.pdf",
        headers={
            "Content-Disposition": "attachment; filename=resume.pdf",
            "Cache-Control": "public, max-age=604800",  # Cache for 7 days
        }
    )


@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume PDF (admin only - add authentication in production)
    """
    # Validate file type
    if not file.content_type or file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )
    
    # Validate filename
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file name. Must be a PDF."
        )
    
    # Validate file size (max 10MB)
    file_content = await file.read()
    file_size = len(file_content)
    max_size = 10 * 1024 * 1024  # 10MB
    
    if file_size > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds {max_size // (1024*1024)}MB limit"
        )
    
    # Save file
    resume_path = UPLOAD_DIR / "resume.pdf"
    
    try:
        with open(resume_path, "wb") as f:
            f.write(file_content)
        
        logger.info(f"Resume uploaded: {file.filename}, size: {file_size} bytes")
        
        return {
            "message": "Resume uploaded successfully",
            "filename": "resume.pdf",
            "size": file_size,
            "download_url": "/api/resume/download"
        }
    
    except Exception as e:
        logger.error(f"Failed to save resume: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to save resume"
        )


# ============================================
# CORS Configuration
# ============================================

cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

logger.info(f"CORS configured for: {cors_origins}")


# ============================================
# Startup Event
# ============================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("Portfolio API started")
    logger.info(f"Upload directory: {UPLOAD_DIR}")
    logger.info(f"CORS origins: {cors_origins}")
    
    # Check if resume exists
    resume_path = UPLOAD_DIR / "resume.pdf"
    if resume_path.exists():
        logger.info(f"Resume found: {resume_path}")
    else:
        logger.warning("No resume found. Upload one at /api/resume/upload")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server_minimal:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
