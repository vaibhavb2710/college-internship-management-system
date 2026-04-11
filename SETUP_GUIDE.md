# College Internship Management System - Complete Setup Guide

## Overview

This is a full-stack College Internship Management System with:
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Python Flask + MongoDB
- **Database**: MongoDB
- **Authentication**: JWT-based

## Project Structure

```
College Internship Management System/
├── backend/                    # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration
│   ├── seed_data.py           # Database seeding script
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── middleware/
│   │   └── auth.py            # JWT authentication
│   ├── models/                # MongoDB models
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── internship.py
│   │   ├── announcement.py
│   │   ├── company.py
│   │   └── coordinator.py
│   └── routes/                # API endpoints
│       ├── auth.py
│       ├── students.py
│       ├── internships.py
│       ├── announcements.py
│       ├── companies.py
│       ├── admin.py
│       ├── coordinator.py
│       └── employer.py
│
├── src/                       # React frontend
│   ├── services/              # API service layer
│   │   ├── apiClient.ts
│   │   ├── auth.ts
│   │   ├── student.ts
│   │   ├── internship.ts
│   │   ├── announcement.ts
│   │   ├── company.ts
│   │   ├── admin.ts
│   │   ├── coordinator.ts
│   │   └── employer.ts
│   └── app/
│       ├── components/        # React components
│       ├── routes.ts          # Router configuration
│       └── App.tsx
│
├── package.json               # Frontend dependencies
├── vite.config.ts            # Vite configuration with API proxy
├── tsconfig.json             # TypeScript configuration
└── .env.example              # Frontend environment variables
```

## Prerequisites

### System Requirements
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- MongoDB 4.0+ (for database)

### Installation

#### 1. Install Node.js and npm
- Download from: https://nodejs.org/
- Verify: `node --version` and `npm --version`

#### 2. Install Python
- Download from: https://www.python.org/downloads/
- Verify: `python --version`

#### 3. Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Follow installation guide for your OS
- Verify MongoDB is running: `mongosh` or `mongo`

## Setup Instructions

### Backend Setup

1. **Navigate to backend folder**
```bash
cd backend
```

2. **Create virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings (default MongoDB URI should work):
# FLASK_ENV=development
# FLASK_HOST=127.0.0.1
# FLASK_PORT=5000
# MONGODB_URI=mongodb://localhost:27017/internship_management
# JWT_SECRET=your_secret_key_change_in_production
```

5. **Seed database with initial data**
```bash
python seed_data.py
```

Expected output:
```
✓ Admin created: ...
✓ Coordinator created: ...
✓ Student created: Rahul
✓ Student created: Priya
✓ Student created: Anjali
✓ Company created: Infosys Limited
✓ Company created: Tata Consultancy Services
✓ Company created: Google India
✓ Internship created: Software Development Intern
✓ Internship created: Data Science & Analytics Intern
✓ Internship created: Full Stack Developer Intern
✓ Announcement created: Summer Internship Drive 2026
✓ Announcement created: Tech Talk: Career in AI/ML
✓ Announcement created: Internship Report Submission Deadline

✅ Database seeding completed successfully!
```

6. **Start backend server**
```bash
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

### Frontend Setup

1. **Navigate to project root** (if not already there)
```bash
cd "College Internship Management System"
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit if needed (default should work):
# VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

Expected output:
```
  VITE v6.3.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Testing the Application

### Test Accounts (Auto-created from seed data)

#### Student
- Email: `rahul.sharma@vit.edu.in`
- Password: `student123`
- Role: Student
- Roll No: 2021INFT001

#### Admin
- Email: `admin@vit.edu.in`
- Password: `admin123`
- Role: Admin

#### Coordinator
- Email: `coordinator@vit.edu.in`
- Password: `coordinator123`
- Role: Coordinator
- Department: INFT

### Login Flow
1. Open http://localhost:5173
2. Select role (Student, Admin, etc.)
3. Enter email and password from above
4. Click Login
5. You'll be redirected to the role-specific dashboard

### Available Internships
The seeded data includes internships from:
- Infosys Limited - Pune
- Tata Consultancy Services - Mumbai
- Google India - Bangalore

## Key Features Implemented

### Authentication
- ✓ User registration
- ✓ User login with role-based access
- ✓ JWT token generation and validation
- ✓ Protected API endpoints
- ✓ Role-based access control (RBAC)

### Student Features
- ✓ View profile
- ✓ Update profile with skills
- ✓ Browse internships
- ✓ Apply for internships
- ✓ View applications
- ✓ View announcements
- ✓ AI Career Roadmap (UI ready, backend integration needed)

### Admin Features
- ✓ Dashboard with statistics
- ✓ Manage all students
- ✓ Manage users by role
- ✓ View system statistics

### Coordinator Features
- ✓ Dashboard with department stats
- ✓ View department students
- ✓ Evaluate internships
- ✓ Manage announcements

### Employer Features
- ✓ View company profile
- ✓ Post internships
- ✓ View applicants
- ✓ Submit feedback for students

### General Features
- ✓ Announcements system
- ✓ Real-time data from database
- ✓ Role-specific dashboards
- ✓ API proxy configuration

## API Endpoints Summary

### Auth Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile
- `POST /verify-token` - Verify JWT token

### Student Routes (`/api/students`)
- `GET /profile/current` - Get student profile
- `PUT /profile/update` - Update profile
- `POST /apply/<internship_id>` - Apply for internship
- `GET /applications` - Get applications

### Internship Routes (`/api/internships`)
- `GET /` - Get all internships
- `GET /<id>` - Get internship details
- `POST /` - Create internship (admin/employer)
- `PUT /<id>` - Update internship
- `DELETE /<id>` - Delete internship (admin)

### More routes available in backend README

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running
- On Windows: Start MongoDB service or run `mongod`
- Check MongoDB URI in `.env` file

### Port Already in Use
```
OSError: [Errno 48] Address already in use
```
**Solution**:
- Change `FLASK_PORT` in `.env` to a different port (e.g., 5001)
- Or kill existing process using the port

### Module Not Found Error
```
ModuleNotFoundError: No module named 'flask'
```
**Solution**:
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Ensure backend is running on `http://localhost:5000`
- Check vite.config.ts proxy settings
- Backend CORS is configured for `localhost:5173`

### Frontend API Not Working
1. Check browser console for error details
2. Verify backend is running (`http://localhost:5000/api/health` should return `{"status": "ok"}`)
3. Check `.env` file in frontend for correct API URL
4. Restart frontend dev server

## Database Schema

### Users Collection
Stores user credentials for all roles (student, admin, coordinator, employer)

### Students Collection
Stores additional student information linked to users

### Internships Collection
Stores internship postings with company, role, eligibility, and applicants

### Announcements Collection
Stores announcements and internship postings

### Companies Collection
Stores employer/company information

### Coordinators Collection
Stores department coordinator information

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
FLASK_ENV=development
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
MONGODB_URI=mongodb://localhost:27017/internship_management
JWT_SECRET=your_secret_key_change_in_production
```

## Development Workflow

### Backend Development
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

### Frontend Development
```bash
npm run dev  # Runs on http://localhost:5173
```

### Testing APIs
Use Postman or curl:
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.sharma@vit.edu.in","password":"student123"}'

# Get internships (with token)
curl -X GET http://localhost:5000/api/internships \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Production Deployment

### Change Sensitive Settings
1. Update `JWT_SECRET` in backend `.env`
2. Change `FLASK_ENV` to `production`
3. Update `VITE_API_URL` to production domain
4. Enable HTTPS
5. Update CORS allowed origins

### Build Frontend
```bash
npm run build
```

Outputs to `dist/` folder

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB won't connect | Check if mongod is running |
| Port 5000 in use | Change FLASK_PORT in .env |
| npm dependencies fail | Delete node_modules and package-lock.json, run npm install |
| Token invalid on page reload | Token stored in localStorage, clear if corrupted |
| CORS errors | Ensure backend CORS config includes frontend URL |

## Support & Documentation

- **Backend Documentation**: See `backend/README.md`
- **Frontend Services**: See `src/services/README.md`
- **API Examples**: Available in relevant service files

## Next Steps

1. ✓ Start backend server
2. ✓ Seed database
3. ✓ Start frontend
4. ✓ Test login with provided credentials
5. ✓ Explore features by role
6. Implement additional features as needed
7. Deploy to production

---

**Created**: March 2026
**Tech Stack**: React + Flask + MongoDB
**Status**: Fully Functional Backend & Frontend Integration Complete
