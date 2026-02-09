# Backend Quick Start Guide

## ✅ Installation Complete!

All Python packages have been successfully installed in a virtual environment.

---

## 🚀 How to Run the Backend

### 1. Activate the Virtual Environment

**Every time** you work on the backend, activate the virtual environment first:

```bash
cd /Users/malik/Documents/repos/portfolio-website/backend
source venv/bin/activate
```

You'll see `(venv)` appear in your terminal prompt when activated.

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Important variables to set:**
- `MONGO_URL` - Your MongoDB connection string
- `DB_NAME` - Database name
- `CORS_ORIGINS` - Your frontend URL (e.g., `http://localhost:3000`)

### 3. Run the Secure Server

```bash
# Option 1: Run the secure server directly
python server_secure.py

# Option 2: Replace the original server
mv server.py server_original.py
mv server_secure.py server.py
python server.py
```

### 4. Deactivate Virtual Environment (when done)

```bash
deactivate
```

---

## 📦 What Was Installed

### Security Packages:
- ✅ **slowapi** - Rate limiting for FastAPI
- ✅ **bleach** - HTML sanitization and XSS protection
- ✅ **httpx** - HTTP client for reCAPTCHA verification
- ✅ **aiosmtplib** - Async email sending

### Core Packages:
- ✅ FastAPI, Uvicorn
- ✅ Motor (async MongoDB driver)
- ✅ Pydantic (data validation)
- ✅ Cryptography libraries
- ✅ JWT authentication
- ✅ And all other dependencies

---

## 🔍 Verify Installation

```bash
# Activate venv first
source venv/bin/activate

# Check installed packages
pip list

# Test import
python -c "import fastapi; import slowapi; import bleach; print('All imports successful!')"
```

---

## 🛠️ Common Commands

```bash
# Install new package
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt  # Update requirements

# Update existing packages
pip install --upgrade -r requirements.txt

# Check for outdated packages
pip list --outdated
```

---

## ⚠️ Important Notes

1. **Always activate venv** before running Python commands
2. **Never commit** the `venv/` directory (already in `.gitignore`)
3. **Do commit** `requirements.txt` changes
4. **Configure `.env`** before first run
5. **Use `pip` not `pip3`** when venv is activated

---

## 📚 Next Steps

1. ✅ Packages installed
2. ⏭️ Configure `.env` file
3. ⏭️ Create MongoDB database
4. ⏭️ Test server: `python server_secure.py`
5. ⏭️ Update frontend to use secure Contact form

See **[SECURITY.md](../SECURITY.md)** for full security documentation.
