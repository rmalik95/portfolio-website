# Portfolio Website

A modern, responsive portfolio website built with React and Tailwind CSS, featuring a clean design and EmailJS integration for contact form functionality.

## 🚀 Tech Stack

### Frontend
- **React 19.0.0** - Modern React with hooks
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components built with Radix UI
- **EmailJS** - Email service integration for contact form
- **craco** - Create React App Configuration Override
- **React Hook Form + Zod** - Form validation
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend (Optional)
- **FastAPI 0.110.1** - Modern Python web framework (minimal setup)
- **Uvicorn** - ASGI server
- **Filesystem storage** - Resume PDF storage (no database needed)

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Python 3.8+** (only if using backend)
- **MongoDB** (only if using backend) for resume downloads
## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio-website
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (choose one)
npm install
# or
yarn install

# Create environment file
touch .env
```

Add the following to `frontend/.env`:

```env
# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key

# Backend URL (optional - only if using backend)
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 3. Backend Setup (Optional)
 - for Resume Downloads)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install minimal dependencies
pip install -r requirements-minimal.txt

# Add your resume
mkdir -p uploads
cp /path/to/your/resume.pdf uploads/resume.pdf

# Optional: Create environment file
cp .env.example .env
# Edit .env with your CORS origins if needed

## 🚀 Running the Project

### Development Mode

#### Frontend Only (Recommended for Quick Start)

```bash
cd frontend
npm start
# or
yarn start
```

The website will open at [http://localhost:3000](http://localhost:3000)

#### With Backend

**Terminal 1 - Backend:**
```bashminimal
cd backend
source venv/bin/activate
python server_secure.py
# Backend runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

### Production Build

```bash
cd frontend
npm run build
# or
yarn build
```

The optimized production build will be in the `frontend/build/` directory.

## 📁 Project Structure

```
portfolio-website/
├── frontend/                 # React application
│   ├── public/              # Static files
│   │   └── images/          # Image assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── layout/      # Layout components (Header, Footer)
│   │   │   ├── sections/    # Page sections (Hero, About, Projects, etc.)
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── data/            # Mock data and content
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── plugins/             # Custom webpack plugins - resume only)
│   ├── server_minimal.py    # Minimal server for resume downloads
│   ├── requirements-minimal.txt  # Minimal Python dependencies
│   ├── uploads/             # Resume storage directoryer (optional)
│   ├── server_secure.py     # Secure server implementation
│   ├── security_*.py        # Security utilities
│   ├── requirements.txt     # Python dependencies
│   └── QUICKSTART.md        # Backend setup guide
└── docs/                    # Documentation
    ├── EMAILJS_SETUP_GUIDE.md
    ├── SECURITY.md
    └── TESTING_REPORT.md
```

## 🔧 Configuration

### EmailJS Setup

1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Copy your Service ID, Template ID, and Public Key
5. Add them to `frontend/.env`

See [docs/EMAILJS_SETUP_GUIDE.md](docs/EMAILJS_SETUP_GUIDE.md) for detailed instructions.

### Customizing Content

Edit `frontend/src/data/mock.js` to update:
- Personal information
- Work experience
- Projects
- Skills
- Social media links

### Adding Images

Place images in `frontend/public/images/` and reference them as `/images/filename.jpg` in your code.

## 🚢 Deployment

### Cloudflare Pages (Recommended) - Automated

This repository is configured with GitHub Actions for **automatic deployment** to Cloudflare Pages when you push to the `main` branch.

**Setup Steps:**

1. Create a Cloudflare Pages project (Direct Upload mode)
2. Generate a Cloudflare API token
3. Add required secrets to GitHub repository:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - Environment variables (EmailJS credentials, backend URL)
4. Push to `main` branch - deployment happens automatically!

📖 **Detailed setup guide:** [docs/CLOUDFLARE_DEPLOYMENT.md](docs/CLOUDFLARE_DEPLOYMENT.md)

The workflow file is located at [.github/workflows/cloudflare-pages.yml](.github/workflows/cloudflare-pages.yml)

### Other Platforms

The build output is a static React app that can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 📚 Documentation

- [Cloudflare Deployment Guide](docs/CLOUDFLARE_DEPLOYMENT.md) - **GitHub Actions automated deployment setup**
- [EmailJS Setup Guide](docs/EMAILJS_SETUP_GUIDE.md)
- [EmailJS Quick Reference](docs/EMAILJS_QUICK_REF.md)
- [Security Documentation](docs/SECURITY.md)
- [Security Audit Report](docs/SECURITY_AUDIT_EMAILJS.md)
- [Testing Report](docs/TESTING_REPORT.md)
- [Backend Quick Start](backend/QUICKSTART.md)

## 🔒 Security

- Environment variables are git-ignored
- EmailJS credentials are stored securely
- Contact form includes validation and sanitization
- Rate limiting and XSS protection in backend (if used)

See [docs/SECURITY.md](docs/SECURITY.md) for complete security documentation.

## 🛠️ Available Scripts

### Frontend

```bash
npm start       # Start development server
npm run build   # Create production build
npm test        # Run tests
```

### Backendminimal.py             # Run minimal server (resume only)
pip install -r requirements-minimal.txt  # Install dependencies
pip freeze > requirements-minimal.txt    # Run secure server
python server.py                     # Run basic server
pip install -r requirements.txt      # Install dependencies
pip freeze > requirements.txt        # Update dependencies
```

## 📝 License

This project is private and proprietary.

## 🤝 Contact

For questions or support, use the contact form on the website!
