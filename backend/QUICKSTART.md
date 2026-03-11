# Backend Quick Start Guide

> **Note:** The backend has been **simplified** to only handle resume downloads. Contact form uses EmailJS instead. No MongoDB required.

---

## 📋 Prerequisites

- **Python 3.8+** installed on your system
- **pip** (Python package installer)

## 🚀 Quick Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### 3. Install Dependencies

```bash
pip install -r requirements-minimal.txt
```

### 4. Configure Environment Variables (Optional)

Create a `.env` file in the backend directory:

```bash
touch .env
```

Add the following configuration:

```env
# CORS Configuration (frontend URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Environment
NODE_ENV=development
```

### 5. Add Your Resume

Place your resume PDF in the `uploads/` directory:

```bash
mkdir -p uploads
cp /path/to/your/resume.pdf uploads/resume.pdf
```

Or upload via API after starting the server:
```bash
curl -X POST http://localhost:8000/api/resume/upload \
  -F "file=@/path/to/your/resume.pdf"
```

### 6. Run the Server

```bash
# Run the minimal server
python server_minimal.py

# Or use uvicorn directly
uvicorn server_minimal:app --reload --host 0.0.0.0 --port 8000
```

The server will start on **http://localhost:8000**

Check the API at **http://localhost:8000/docs**

---

## 📦 Tech Stack (Minimal)

This simplified backend uses:
- **FastAPI 0.110.1** - Modern, fast web framework
- **Uvicorn 0.25.0** - ASGI server
- **Pydantic 2.6.4+** - Data validation
- **python-multipart** - File upload handling

**Removed** (not needed anymore):
- ❌ MongoDB and Motor
- ❌ Security packages (slowapi, bleach, etc.)
- ❌ Email libraries
- ❌ JWT authentication
- ❌ Database drivers

---

## 🔍 API Endpoints

### Health Check
```
GET  /                    - API info and health check
```

### Resume Endpoints
```
GET  /api/resume          - Get resume metadata
GET  /api/resume/download - Download resume PDF
POST /api/resume/upload   - Upload new resume (replace existing)
```

### Example Usage

**Get Resume Info:**
```bash
curl http://localhost:8000/api/resume
```

**Download Resume:**
```bash
curl http://localhost:8000/api/resume/download -o resume.pdf
```

**Upload Resume:**
```bash
curl -X POST http://localhost:8000/api/resume/upload \
  -F "file=@resume.pdf"
```

---

## 🛠️ Common Commands

### Activate Virtual Environment

```bash
# You need to do this every time you work on the backend
cd backend
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### Install New Package

```bash
# Make sure venv is activated first
pip install package-name

# Update requirements
pip freeze > requirements-minimal.txt
```

### Deactivate Virtual Environment

```bash
deactivate
```

### Run with Auto-Reload

```bash
uvicorn server_minimal:app --reload --host 0.0.0.0 --port 8000
```

---

## 🔗 Connecting Frontend to Backend

### 1. Update Frontend Environment

Add to `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2. Frontend Will Show Resume Button

When `REACT_APP_BACKEND_URL` is set, the Hero section and Navigation will show a "Download Resume" button that links to the backend.

### 3. Production Deployment

Update the CORS origins in backend `.env`:

```env
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

---

## 📁 File Structure

```
backend/
├── server_minimal.py           # NEW: Minimal server (resume only)
├── requirements-minimal.txt    # NEW: Minimal dependencies
├── .env                        # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
├── uploads/                    # Resume storage (not in git)
│   └── resume.pdf             # Your resume file
└── venv/                      # Virtual environment (not in git)
```

**Old files (no longer needed):**
- ~~server.py~~ - Old full server
- ~~server_secure.py~~ - Old secure server
- ~~security_middleware.py~~ - Security features (removed)
- ~~security_utils.py~~ - Security utilities (removed)
- ~~requirements.txt~~ - Old heavy dependencies

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Resume Not Found Error

```bash
# Make sure uploads directory exists
mkdir -p uploads

# Add your resume
cp /path/to/resume.pdf uploads/resume.pdf

# Or upload via API
curl -X POST http://localhost:8000/api/resume/upload \
  -F "file=@/path/to/your/resume.pdf"
```

### Import Errors

```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements-minimal.txt
```

### Virtual Environment Issues

```bash
# Delete and recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements-minimal.txt
```

---

## ⚠️ Important Notes

1. **Always activate venv** before running any Python commands
   ```bash
   source venv/bin/activate
   ```

2. **Never commit:**
   - `venv/` directory (in .gitignore)
   - `.env` file (in .gitignore)
   - `uploads/` directory (in .gitignore)

3. **Do commit:**
   - `requirements-minimal.txt` when you add packages
   - `server_minimal.py` changes

4. **File Storage:**
   - Resumes are stored in `uploads/resume.pdf`
   - Only one resume at a time (uploading replaces the old one)
   - Backup your resume file before replacing

5. **No Authentication:**
   - `/api/resume/upload` has no authentication
   - Add auth if exposing to public internet
   - Or just upload resume manually to `uploads/`

---

## 🎯 What Changed?

### Removed:
- ✅ Contact form endpoints (using EmailJS instead)
- ✅ MongoDB database (using filesystem)
- ✅ Status check endpoints (not needed)
- ✅ Heavy security packages (simpler for portfolio)
- ✅ Email sending (using EmailJS)
- ✅ reCAPTCHA integration
- ✅ Rate limiting middleware
- ✅ Complex authentication

### Kept:
- ✅ Resume download endpoint
- ✅ Resume upload endpoint
- ✅ Basic CORS protection
- ✅ File validation (PDF only, size limits)
- ✅ FastAPI core functionality

---

## 🚢 Deployment

### Option 1: Deploy Backend Separately

Deploy to platforms like:
- **Heroku** (easy, free tier available)
- **Railway** (modern, simple)
- **Render** (free tier)
- **AWS EC2** (more control)
- **Google Cloud Run** (serverless)

Update `CORS_ORIGINS` to match your frontend domain.

### Option 2: Skip Backend (Use Static File)

If you don't want to manage a backend:

1. Put `resume.pdf` in `frontend/public/`
2. Update frontend code to link to `/resume.pdf`
3. No backend needed at all!

**To switch to static file:**
- Remove `REACT_APP_BACKEND_URL` from frontend `.env`
- Hero will show "Get in Touch" instead of "Download Resume"
- Add resume link to Navigation manually if needed

---

## 💡 Alternative: Static File Approach

Don't want to run a backend at all? Use static hosting:

```bash
# Put resume in frontend
cp resume.pdf frontend/public/resume.pdf
```

Then in your React components, link to:
```jsx
<a href="/resume.pdf" download>Download Resume</a>
```

No server, no database, just static files! ✨

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Deployment](https://www.uvicorn.org/deployment/)
- [Main README](../README.md)

---

**Need help?** Check the [main README](../README.md) or the FastAPI docs!

## 📋 Prerequisites

- **Python 3.8+** installed on your system
- **MongoDB** (local installation or MongoDB Atlas account)
- **pip** (Python package installer)

## 🚀 Quick Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
touch .env
```

Add the following configuration:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
# Or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/

DB_NAME=portfolio_db

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email Configuration (if using backend email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password

# reCAPTCHA (optional)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret

# Environment
ENVIRONMENT=development
```

### 5. Run the Server

```bash
# Run the secure server (recommended)
python server_secure.py

# Or run the basic server
python server.py
```

The server will start on **http://localhost:8000**

Check the API documentation at **http://localhost:8000/docs**

---

## 📦 Tech Stack

### Core Framework
- **FastAPI 0.110.1** - Modern, fast web framework for Python
- **Uvicorn 0.25.0** - Lightning-fast ASGI server
- **Pydantic 2.6.4+** - Data validation using Python type hints

### Database
- **MongoDB 4.5.0** (pymongo)
- **Motor 3.3.1** - Async MongoDB driver for Python

### Security & Authentication
- **slowapi 0.1.9+** - Rate limiting for FastAPI
- **bleach 6.1.0+** - HTML sanitization and XSS protection
- **PyJWT 2.10.1+** - JSON Web Token implementation
- **bcrypt 4.1.3** - Password hashing
- **passlib 1.7.4+** - Password hashing library

### Communication
- **httpx 0.27.0+** - Modern HTTP client (for reCAPTCHA verification)
- **aiosmtplib 3.0.0+** - Async SMTP client for sending emails

### Development Tools
- **pytest 8.0.0+** - Testing framework
- **black 24.1.1+** - Code formatter
- **isort 5.13.2+** - Import sorter
- **flake8 7.0.0+** - Linting
- **mypy 1.8.0+** - Static type checker

### Additional Utilities
- **python-dotenv** - Environment variable management
- **python-multipart** - Form data parsing
- **requests** - HTTP library
- **pandas & numpy** - Data processing (if needed)
- **typer** - CLI application builder

---

## 🔍 API Endpoints

Once the server is running, visit:

**Interactive API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Common Endpoints:**
```
POST   /api/contact      - Submit contact form
GET    /api/health       - Health check endpoint
POST   /api/auth/login   - User authentication
GET    /api/projects     - Get projects (if implemented)
```

---

## 🛠️ Common Commands

### Activate Virtual Environment

```bash
# You need to do this every time you work on the backend
cd backend
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### Install New Package

```bash
# Make sure venv is activated first
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt
```

### Update All Packages

```bash
pip install --upgrade -r requirements.txt
```

### Deactivate Virtual Environment

```bash
deactivate
```

### Run with Auto-Reload

```bash
uvicorn server_secure:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests

```bash
pytest
pytest -v  # Verbose output
pytest tests/test_specific.py  # Run specific test file
```

### Code Formatting

```bash
# Format code with black
black .

# Sort imports
isort .

# Check code style
flake8 .

# Type checking
mypy .
```

---

## 🔒 Security Features

The backend includes several security features:

1. **Rate Limiting** - Prevents abuse by limiting request frequency
2. **CORS Protection** - Controls which domains can access the API
3. **Input Sanitization** - Prevents XSS attacks using bleach
4. **JWT Authentication** - Secure user authentication
5. **Environment Variables** - Sensitive data stored securely
6. **Async Operations** - Non-blocking I/O for better performance

---

## 🔗 Connecting Frontend to Backend

### 1. Update Frontend Environment

Add to `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2. Frontend Will Automatically Use Backend

The frontend checks for `REACT_APP_BACKEND_URL` and uses the backend if available. If not set, it falls back to EmailJS.

### 3. Production Deployment

Update the CORS origins in backend `.env`:

```env
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

---

## 📁 Project Structure

```
backend/
├── server.py              # Basic FastAPI server
├── server_secure.py       # Production-ready secure server
├── security_middleware.py # Security middleware
├── security_utils.py      # Security utilities
├── requirements.txt       # Python dependencies
├── QUICKSTART.md         # This file
├── .env                  # Environment variables (not in git)
└── venv/                 # Virtual environment (not in git)
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### MongoDB Connection Error

- Check if MongoDB is running: `mongosh` or `mongo`
- Verify `MONGO_URL` in `.env`
- For Atlas: Check network access and whitelist your IP

### Import Errors

```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Virtual Environment Issues

```bash
# Delete and recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## ⚠️ Important Notes

1. **Always activate venv** before running any Python commands
   ```bash
   source venv/bin/activate
   ```

2. **Never commit sensitive files:**
   - `venv/` directory (already in `.gitignore`)
   - `.env` file (already in `.gitignore`)
   - Any files containing credentials

3. **Do commit:**
   - `requirements.txt` when you add new packages
   - Code changes to `.py` files

4. **Security Best Practices:**
   - Change default JWT secret in production
   - Use strong MongoDB credentials
   - Enable MongoDB authentication
   - Use environment-specific `.env` files
   - Enable HTTPS in production

5. **Performance Tips:**
   - Use `server_secure.py` in production
   - Enable rate limiting
   - Use Redis for caching (if needed)
   - Monitor with logging and metrics

---

## 📚 Next Steps

### For Development

1. ✅ Install Python and dependencies
2. ✅ Set up MongoDB
3. ✅ Configure `.env` file
4. ✅ Run `python server_secure.py`
5. ⏭️ Test endpoints at http://localhost:8000/docs
6. ⏭️ Connect frontend to backend

### For Production

1. ⏭️ Set up production MongoDB (MongoDB Atlas recommended)
2. ⏭️ Configure production environment variables
3. ⏭️ Deploy to cloud platform (AWS, Google Cloud, Heroku, etc.)
4. ⏭️ Set up domain and SSL certificate
5. ⏭️ Configure monitoring and logging
6. ⏭️ Set up automated backups

---

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Motor Documentation](https://motor.readthedocs.io/)
- [Uvicorn Deployment](https://www.uvicorn.org/deployment/)
- [Security Best Practices](../docs/SECURITY.md)

---

## 💡 Alternative: Use EmailJS Instead

If you prefer not to set up a backend, the portfolio website works perfectly with EmailJS:

1. No backend setup required
2. Free tier: 200 emails/month
3. Simple configuration in frontend `.env`
4. No server maintenance needed

See [docs/EMAILJS_SETUP_GUIDE.md](../docs/EMAILJS_SETUP_GUIDE.md) for setup instructions.

---

**Need help?** Check the [main README](../README.md) or contact form documentation!
