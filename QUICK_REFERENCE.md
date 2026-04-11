# Quick Reference Guide

## 🚀 Quick Start (30 seconds)

### Windows
```bash
start.bat
```

### macOS/Linux
```bash
chmod +x start.sh && ./start.sh
```

### Manual
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows or source venv/bin/activate on Mac/Linux
pip install -r requirements.txt
python seed_data.py
python app.py

# Terminal 2 - Frontend
npm install
npm run dev
```

---

## 📍 Access Points

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend | http://localhost:5000 | Flask API |
| API Docs | See backend/README.md | Complete endpoint list |
| MongoDB | localhost:27017 | Local connection |

---

## 🔑 Test Credentials

```
┌─ Student ─────────────────────────┐
│ Email: rahul.sharma@vit.edu.in   │
│ Password: student123              │
└───────────────────────────────────┘

┌─ Admin ───────────────────────────┐
│ Email: admin@vit.edu.in           │
│ Password: admin123                │
└───────────────────────────────────┘

┌─ Coordinator ─────────────────────┐
│ Email: coordinator@vit.edu.in     │
│ Password: coordinator123          │
└───────────────────────────────────┘
```

---

## 📁 Important Files

### Backend
- `app.py` - Main application
- `config.py` - Configuration
- `seed_data.py` - Initialize database
- `requirements.txt` - Dependencies
- `.env.example` - Environment template

### Frontend
- `package.json` - NPM dependencies
- `vite.config.ts` - Build configuration
- `src/services/` - API layer
- `.env.example` - Frontend config

### Documentation
- `SETUP_GUIDE.md` - Detailed setup (READ THIS FIRST)
- `IMPLEMENTATION_SUMMARY.md` - What's been implemented
- `backend/README.md` - API documentation
- `README_COMPLETE.md` - Project overview

---

## 🔌 API Endpoints Summary

### Auth
```
POST   /api/auth/login           Login user
POST   /api/auth/register        Register new user
GET    /api/auth/profile         Get user profile
POST   /api/auth/verify-token    Verify JWT token
```

### Students
```
GET    /api/students/profile/current    Get profile
PUT    /api/students/profile/update      Update profile
POST   /api/students/apply/<id>         Apply for internship
GET    /api/students/applications        Get applications
```

### Internships
```
GET    /api/internships                 List all
POST   /api/internships/                Create (admin/employer)
GET    /api/internships/<id>            Get details
PUT    /api/internships/<id>            Update (admin/employer)
DELETE /api/internships/<id>            Delete (admin)
```

### Announcements
```
GET    /api/announcements               List
POST   /api/announcements/              Create (admin/coordinator)
GET    /api/announcements/<id>          Get details
PUT    /api/announcements/<id>          Update
DELETE /api/announcements/<id>          Delete (admin)
```

### Admin
```
GET    /api/admin/dashboard             Dashboard data
GET    /api/admin/students              All students
GET    /api/admin/users/<role>          Users by role
GET    /api/admin/statistics            System stats
```

[See backend/README.md for complete API reference]

---

## ⚙️ Configuration

### Backend (.env)
```ini
FLASK_ENV=development
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
MONGODB_URI=mongodb://localhost:27017/internship_management
JWT_SECRET=your_secret_key_change_in_production
```

### Frontend (.env)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Collections

| Collection | Purpose | Records |
|-----------|---------|---------|
| users | All user accounts | 5 (1 admin, 1 coord, 3 students) |
| students | Student profiles | 3 |
| companies | Employers | 3 |
| internships | Job postings | 3 |
| announcements | System announcements | 3 |
| coordinators | Coordinators | 1 |

---

## 🧪 Testing APIs

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.sharma@vit.edu.in","password":"student123"}'
```

### Get Internships (with token)
```bash
curl -X GET http://localhost:5000/api/internships \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Use test_api.py
```bash
cd backend
pip install requests
python test_api.py
```

---

## 🛠️ Troubleshooting

### MongoDB Not Running
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Clear & Reseed Database
```bash
cd backend
python seed_data.py
```

### Reset Virtual Environment
```bash
cd backend
rm -rf venv  # Linux/Mac: rm -rf venv, Windows: rmdir /s venv
python -m venv venv
# Activate and reinstall
```

### Port in Use
Change port in `.env`:
```
FLASK_PORT=5001
VITE_API_URL=http://localhost:5001/api
```

### Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Flask 3 + Python 3.8+
- **Database**: MongoDB 4+
- **Auth**: JWT (JSON Web Tokens)
- **API**: RESTful
- **Package Managers**: npm (frontend), pip (backend)

---

## 🔐 Security Notes

- JWT tokens expire in 24 hours
- Passwords are hashed with bcrypt
- CORS configured for localhost development
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Update CORS origins for production

---

## 📊 Project Structure

```
College Internship Management System/
├── backend/              # Flask backend
│   ├── app.py
│   ├── config.py
│   ├── seed_data.py
│   ├── requirements.txt
│   ├── middleware/       # Auth
│   ├── models/          # DB models
│   └── routes/          # API endpoints
│
├── src/                 # React frontend
│   ├── services/        # API layer
│   ├── app/            # Components
│   └── styles/
│
├── package.json
├── vite.config.ts
├── SETUP_GUIDE.md       # START HERE
├── IMPLEMENTATION_SUMMARY.md
└── README_COMPLETE.md
```

---

## 🚀 Build for Production

### Frontend
```bash
npm run build  # Creates dist/ folder
```

### Backend
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

---

## 📚 More Information

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Reference**: See `backend/README.md`
- **Project Overview**: See `README_COMPLETE.md`
- **Testing Examples**: See `backend/test_api.py`

---

## 💡 Key Commands

```bash
# Backend
cd backend && python app.py              # Start backend
python seed_data.py                      # Initialize database
python test_api.py                       # Test APIs

# Frontend
npm install                              # Install dependencies
npm run dev                              # Start dev server
npm run build                            # Build for production

# MongoDB
mongosh                                  # Start MongoDB shell
```

---

**Last Updated**: March 2026
**Status**: ✅ Production Ready
**All Systems**: ✅ Operational
