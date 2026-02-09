# API Contracts - Rishabh Malik Portfolio

## Overview
This document captures the API contracts for the portfolio website backend integration.

---

## 1. Contact Form API

### POST `/api/contact`
Submits a contact form message.

**Request Body:**
```json
{
  "name": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "subject": "string (required)",
  "message": "string (required, min 20 chars, max 1000 chars)"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "created_at": "datetime",
  "status": "pending"
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "Validation error message"
}
```

### GET `/api/contact`
Retrieves all contact submissions (for admin purposes).

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "created_at": "datetime",
    "status": "pending | read | responded"
  }
]
```

---

## 2. Resume API

### POST `/api/resume/upload`
Uploads a resume PDF file.

**Request:** `multipart/form-data`
- `file`: PDF file (required, max 5MB)

**Response (201 Created):**
```json
{
  "id": "string",
  "filename": "string",
  "original_filename": "string",
  "file_size": "integer",
  "content_type": "string",
  "uploaded_at": "datetime",
  "is_active": true
}
```

### GET `/api/resume`
Gets the active resume metadata.

**Response (200 OK):**
```json
{
  "id": "string",
  "filename": "string",
  "original_filename": "string",
  "file_size": "integer",
  "uploaded_at": "datetime",
  "download_url": "/api/resume/download"
}
```

### GET `/api/resume/download`
Downloads the active resume PDF file.

**Response:** Binary PDF file with appropriate headers.

---

## 3. Mock Data to Replace

### Contact Form (frontend/src/components/sections/Contact.jsx)
Currently simulates submission with `setTimeout`. Replace with actual API call:
```javascript
// Before (mock)
await new Promise(resolve => setTimeout(resolve, 1500));

// After (API integration)
const response = await axios.post(`${API}/contact`, formData);
```

### Resume Download (multiple locations)
Currently links to `/resume.pdf`. Replace with API endpoint:
```javascript
// Before
href="/resume.pdf"

// After
href={`${BACKEND_URL}/api/resume/download`}
```

---

## 4. Database Collections

### `contact_submissions`
```json
{
  "_id": "ObjectId",
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "created_at": "datetime",
  "status": "string (pending|read|responded)",
  "ip_address": "string (optional)",
  "user_agent": "string (optional)"
}
```

### `resumes`
```json
{
  "_id": "ObjectId",
  "id": "string (UUID)",
  "filename": "string",
  "original_filename": "string",
  "file_data": "Binary (GridFS or base64)",
  "file_size": "integer",
  "content_type": "string",
  "uploaded_at": "datetime",
  "is_active": "boolean"
}
```

---

## 5. Frontend Integration Points

| Component | Current State | Integration Required |
|-----------|--------------|---------------------|
| Contact.jsx | Mock setTimeout | POST /api/contact |
| Hero.jsx | Static /resume.pdf | GET /api/resume/download |
| Navigation.jsx | Static /resume.pdf | GET /api/resume/download |

---

## 6. Environment Variables

### Backend (.env)
- `MONGO_URL` - MongoDB connection string (existing)
- `DB_NAME` - Database name (existing)

### Frontend (.env)
- `REACT_APP_BACKEND_URL` - Backend API URL (existing)
