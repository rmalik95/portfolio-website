# Security Implementation Guide
**Portfolio Website - Rishabh Malik**

## 📋 Overview

This document outlines the comprehensive security measures implemented in this portfolio website to protect against common web vulnerabilities and attacks.

## 🛡️ Implemented Security Measures

### 1. **Backend Security (FastAPI)**

#### Input Validation & Sanitization
- ✅ **Pydantic validators** for all input fields
- ✅ **HTML sanitization** using `bleach` library
- ✅ **XSS protection** - All user inputs are sanitized
- ✅ **SQL injection prevention** - MongoDB parameterized queries
- ✅ **Email validation** - Format checking + header injection prevention
- ✅ **Length limits** enforced on all fields

#### Rate Limiting
- ✅ **Contact form**: 5 submissions per hour per IP
- ✅ **General API**: 100 requests per 15 minutes
- ✅ **File uploads**: 10 uploads per hour
- ✅ **slowapi** middleware implementation

#### Security Headers
- ✅ `X-Frame-Options: DENY` (prevents clickjacking)
- ✅ `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Content-Security-Policy` (strict CSP)
- ✅ `Strict-Transport-Security` (HTTPS enforcement)
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy` (restricts browser features)

#### CORS Configuration
- ✅ **Strict origin whitelisting** (no wildcard `*`)
- ✅ **Specific HTTP methods** allowed (GET, POST only)
- ✅ **Specific headers** allowed
- ✅ **Credentials support** with secure configuration

#### Logging & Monitoring
- ✅ **Structured logging** with winston/logging module
- ✅ **Security event logging** (failed attempts, suspicious activity)
- ✅ **Separate security log file**
- ✅ **Error logging** without exposing sensitive information

#### Bot Detection
- ✅ **Honeypot field** detection
- ✅ **Form timing validation** (min 3 seconds)
- ✅ **reCAPTCHA v3** integration (optional)
- ✅ **Suspicious user-agent** blocking

#### File Upload Security
- ✅ **File type validation** (PDF only)
- ✅ **File size limits** (5MB max)
- ✅ **File integrity hashing** (SHA-256)
- ✅ **Safe file storage** (MongoDB with base64 encoding)

---

### 2. **Frontend Security (React)**

#### Input Validation
- ✅ **Client-side validation** (first line of defense)
- ✅ **Field length limits** enforced
- ✅ **Email format validation**
- ✅ **Real-time error feedback**

#### Bot Detection
- ✅ **Honeypot field** (hidden field that bots fill)
- ✅ **Form load time tracking**
- ✅ **Submission timing validation**
- ✅ **User interaction tracking**

#### XSS Protection
- ✅ **Input sanitization** before submission
- ✅ **React's built-in XSS protection** (automatic escaping)
- ✅ **No `dangerouslySetInnerHTML`** usage

#### Security Best Practices
- ✅ **HTTPS enforcement**
- ✅ **No sensitive data in client-side code**
- ✅ **Environment variables** for configuration
- ✅ **Secure error handling** (no sensitive info exposure)

---

## 🚀 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required environment variables:**
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret (optional)
- `SMTP_*` - Email configuration (for notifications)

#### Run the Secure Server
```bash
# Use the secure server implementation
python server_secure.py

# Or rename it to replace the original
mv server.py server_old.py
mv server_secure.py server.py
python server.py
```

### 2. Frontend Setup

#### Update Contact Component
```bash
cd frontend/src/components/sections

# Use the secure contact component
mv Contact.jsx Contact_old.jsx
mv Contact_secure.jsx Contact.jsx
```

#### Configure Environment Variables
Create `.env` in frontend root:
```bash
REACT_APP_BACKEND_URL=https://yourdomain.com
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

#### Build and Deploy
```bash
cd frontend
yarn install
yarn build
```

---

## 🔒 Security Checklist

### Before Deployment
- [ ] All `.env` files configured with secure values
- [ ] `.env` files NOT committed to Git (.gitignore verified)
- [ ] CORS origins set to specific domains (not `*`)
- [ ] Rate limiting configured appropriately
- [ ] HTTPS/SSL certificate installed
- [ ] Security headers verified
- [ ] MongoDB accessible only from application server
- [ ] Strong database credentials set
- [ ] Logging configured and tested
- [ ] Error messages don't expose sensitive information
- [ ] File upload limits tested
- [ ] Bot detection tested (honeypot, timing)

### Regular Maintenance
- [ ] Review logs weekly for suspicious activity
- [ ] Update dependencies monthly (`pip list --outdated`, `yarn outdated`)
- [ ] Run security audits (`npm audit`, `safety check`)
- [ ] Rotate secrets/API keys quarterly
- [ ] Backup database regularly
- [ ] Monitor rate limit violations
- [ ] Check SSL certificate expiration

---

## 🧪 Testing Security Features

### Test Rate Limiting
```bash
# Test contact form rate limit (should block after 5 requests)
for i in {1..10}; do
  curl -X POST https://yourdomain.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"This is a test message for rate limiting"}' &
done
```

### Test Honeypot Detection
```bash
# This should be silently rejected
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","subject":"Test","message":"Test message","website":"http://spam.com"}'
```

### Test Input Sanitization
```bash
# XSS attempt - should be sanitized
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@example.com","subject":"Test","message":"<img src=x onerror=alert(1)>"}'
```

### Test Security Headers
```bash
# Check security headers
curl -I https://yourdomain.com
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Ensure frontend domain is listed in `CORS_ORIGINS` in backend `.env`
```bash
# .env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Issue: Rate Limit Blocking Legitimate Users
**Solution**: Adjust rate limits in `backend/.env`
```bash
RATE_LIMIT_CONTACT=10  # Increase from 5 to 10
```

### Issue: Form Submission Fails Immediately
**Solution**: Check if honeypot field is accidentally visible or form timing is too strict
```javascript
// Adjust minimum time in Contact_secure.jsx
const minSubmitTime = 2000; // Reduce from 3000ms to 2000ms
```

---

## 📊 Monitoring & Alerts

### Log Files
- **Application logs**: `./logs/app.log`
- **Security logs**: `./logs/security.log`

### What to Monitor
1. **Rate limit violations** - High frequency may indicate attack
2. **Honeypot triggers** - Bot activity detected
3. **Failed validation** - Potential SQL injection or XSS attempts
4. **4xx/5xx errors** - Application issues
5. **Unusual patterns** - Spikes in traffic, geographic anomalies

### Setting Up Alerts (Optional)
Configure email alerts for critical security events:
```python
# In security_utils.py
async def send_security_alert(event, details):
    # Send email via SMTP
    # Implement based on your email provider
    pass
```

---

## 🔐 Advanced Security (Optional)

### 1. Implement Google reCAPTCHA v3
1. Get API keys from [Google reCAPTCHA](https://www.google.com/recaptcha)
2. Add to backend `.env`:
   ```
   RECAPTCHA_SECRET_KEY=your_secret_key
   RECAPTCHA_MIN_SCORE=0.5
   ```
3. Add to frontend:
   ```javascript
   // Load reCAPTCHA script in index.html
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>

   // Get token before form submission
   const token = await grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'});
   ```

### 2. Database Encryption at Rest
```python
# Encrypt sensitive fields before storing
from cryptography.fernet import Fernet

cipher = Fernet(os.getenv("ENCRYPTION_KEY"))
encrypted_message = cipher.encrypt(message.encode())
```

### 3. Implement Content Security Policy Reporting
```python
# Add CSP report endpoint
@app.post("/api/csp-report")
async def csp_violation_report(request: Request):
    report = await request.json()
    logger.warning(f"CSP Violation: {report}")
    return {"status": "reported"}
```

### 4. IP Geolocation Blocking
Block requests from high-risk countries:
```python
import geoip2.database

def check_ip_location(ip: str) -> bool:
    reader = geoip2.database.Reader('GeoLite2-Country.mmdb')
    response = reader.country(ip)
    blocked_countries = ['XX', 'YY']  # ISO country codes
    return response.country.iso_code not in blocked_countries
```

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security Best Practices](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://react.dev/learn/security)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## 🆘 Security Incident Response

### If You Detect a Security Breach:
1. **Isolate** - Take affected systems offline
2. **Assess** - Determine scope and impact
3. **Contain** - Stop the breach from spreading
4. **Eradicate** - Remove the threat
5. **Recover** - Restore systems from clean backups
6. **Document** - Log all actions taken
7. **Review** - Conduct post-incident analysis

### Emergency Contacts:
- **Database Admin**: [Contact Info]
- **Hosting Provider**: [Support Contact]
- **DNS Provider**: [Support Contact]

---

## ✅ Security Audit Log

| Date | Auditor | Findings | Actions Taken |
|------|---------|----------|---------------|
| 2026-02-09 | Claude AI | Comprehensive security implementation | All critical measures implemented |
| | | | |

---

## 📝 License & Disclaimer

This security implementation is provided as-is. While comprehensive measures have been implemented, no system is 100% secure. Regular audits, updates, and monitoring are essential.

**Last Updated**: February 9, 2026
**Version**: 1.0.0
