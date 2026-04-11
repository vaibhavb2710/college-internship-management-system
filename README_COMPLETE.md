# College Internship Management System

A comprehensive full-stack web application for managing college internship programs, built with React, Flask, and MongoDB.

## 🎯 Features

- **Role-Based Access Control**: Student, Admin, Department Coordinator, Employer
- **Student Features**:
  - Browse internship opportunities
  - Apply for internships
  - Manage applications and profile
  - View announcements

- **Admin Features**:
  - Dashboard with system statistics
  - Manage all users and students
  - Create and manage internships
  - View comprehensive analytics

- **Coordinator Features**:
  - Department-specific dashboard
  - Manage department students
  - Evaluate student internships
  - Create announcements

- **Employer Features**:
  - Post internship opportunities
  - View and manage applicants
  - Submit student feedback
  - Manage company profile

## 📋 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB 4.0+

### Installation & Startup

**Windows Users:**
```bash
start.bat
```

**macOS/Linux Users:**
```bash
chmod +x start.sh
./start.sh
```

**Manual Setup:**

1. **Backend Setup**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed_data.py
python app.py
```

2. **Frontend Setup** (in new terminal)
```bash
npm install
cp .env.example .env
npm run dev
```

### Test Accounts

After running `seed_data.py`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Student | rahul.sharma@vit.edu.in | student123 |
| Admin | admin@vit.edu.in | admin123 |
| Coordinator | coordinator@vit.edu.in | coordinator123 |

## 🏗️ Architecture

```
Frontend (React + TypeScript)
     ↓
    API Proxy (Vite)
     ↓
Backend (Flask + Python)
     ↓
Database (MongoDB)
```

## 📁 Project Structure

```
College Internship Management System/
├── backend/                    # Flask REST API
│   ├── app.py                 # Main application
│   ├── config.py              # Configuration
│   ├── seed_data.py          # Database initialization
│   ├── models/               # Data models
│   ├── routes/               # API endpoints
│   ├── middleware/           # JWT authentication
│   └── requirements.txt       # Python dependencies
│
├── src/                       # Frontend source
│   ├── services/             # API service layer
│   ├── app/
│   │   ├── components/       # React components
│   │   ├── routes.ts        # Router
│   │   └── App.tsx
│   └── styles/
│
├── package.json              # Frontend dependencies
├── vite.config.ts           # Vite configuration
├── SETUP_GUIDE.md           # Detailed setup guide
└── README.md                # This file
```

## 🔐 Authentication

- JWT-based token authentication
- Tokens stored in localStorage
- Automatic token refresh on login
- Protected routes and API endpoints

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get profile
- `POST /api/auth/verify-token` - Verify token

### Internships
- `GET /api/internships` - List internships
- `GET /api/internships/<id>` - Get details
- `POST /api/internships` - Create (Admin/Employer)

### Students
- `GET /api/students/profile/current` - Get profile
- `PUT /api/students/profile/update` - Update
- `POST /api/students/apply/<id>` - Apply

### Announcements
- `GET /api/announcements` - List
- `POST /api/announcements` - Create (Admin/Coordinator)

[See backend/README.md for complete API documentation]

## 🗄️ Database

MongoDB collections:
- **users** - All user accounts
- **students** - Student profiles
- **companies** - Employer companies
- **internships** - Internship postings
- **announcements** - System announcements
- **coordinators** - Coordinator profiles

## 🛠️ Development

### Frontend Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
```

### Backend Development
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

## 🧪 Testing

### Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.sharma@vit.edu.in","password":"student123"}'

# Get internships (with token)
curl -X GET http://localhost:5000/api/internships \
  -H "Authorization: Bearer <token>"
```

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed installation and configuration
- [Backend README](backend/README.md) - Backend API documentation
- [Services README](src/services/README.md) - Frontend API services

## 🚢 Deployment

### Build Frontend
```bash
npm run build
```
Output: `dist/` folder (deploy to web server)

### Deploy Backend
1. Change `FLASK_ENV=production`
2. Update `JWT_SECRET` with strong key
3. Configure MongoDB for production
4. Update CORS allowed origins
5. Use production WSGI server (Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

## 🔧 Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running:
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
Change ports in `.env`:
```
FLASK_PORT=5001
```

### CORS Errors
Check that backend is running and frontend .env has correct API URL

### Virtual Environment Issues
Recreate the virtual environment:
```bash
cd backend
rm -rf venv  # Linux/macOS: rm -rf venv; Windows: rmdir /s venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 📊 Technology Stack

### Frontend
- React 18.3
- TypeScript
- Tailwind CSS
- Vite 6.3
- React Router
- Axios
- Shadcn UI Components

### Backend
- Flask 3.0
- Python 3.8+
- MongoDB/PyMongo
- JWT Authentication
- Flask-CORS

### Database
- MongoDB 4.0+

## 📝 Key Files

| File | Purpose |
|------|---------|
| `app.py` | Flask app factory |
| `config.py` | App configuration |
| `seed_data.py` | Database initialization |
| `middleware/auth.py` | JWT authentication |
| `vite.config.ts` | Frontend build config |
| `start.bat / start.sh` | Quick start scripts |

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## 📄 License

MIT License - See LICENSE file

## 👥 Support

For issues or questions:
1. Check SETUP_GUIDE.md
2. Review backend/README.md
3. Check browser console for frontend errors
4. Verify MongoDB is running

## 🎓 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/)

---

**Last Updated**: March 2026
**Status**: Production Ready
**Version**: 1.0.0
