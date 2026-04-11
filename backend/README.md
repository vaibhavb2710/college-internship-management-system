# College Internship Management System - Backend

Flask-based REST API backend for the College Internship Management System with MongoDB.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Roles**: Student, Admin, Department Coordinator, Employer
- **Internship Management**: Post, search, and apply for internships
- **Announcements**: Create and share announcements
- **Company Management**: Register and manage companies
- **Dashboard APIs**: Role-specific dashboard endpoints

## Prerequisites

- Python 3.8+
- MongoDB 4.0+
- pip (Python package manager)

## Installation

1. **Clone/Setup Backend**
```bash
cd backend
```

2. **Create Virtual Environment**
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup Environment Variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB connection details
```

## Running the Backend

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile
- `POST /verify-token` - Verify JWT token

### Students (`/api/students`)
- `GET /profile/current` - Get current student profile
- `PUT /profile/update` - Update student profile
- `POST /apply/<internship_id>` - Apply for internship
- `GET /applications` - Get student applications

### Internships (`/api/internships`)
- `GET /` - Get all internships
- `GET /<internship_id>` - Get internship details
- `POST /` - Create internship (admin/employer)
- `PUT /<internship_id>` - Update internship (admin/employer)
- `DELETE /<internship_id>` - Delete internship (admin)

### Announcements (`/api/announcements`)
- `GET /` - Get announcements
- `GET /<announcement_id>` - Get announcement details
- `POST /` - Create announcement (admin/coordinator)
- `PUT /<announcement_id>` - Update announcement
- `DELETE /<announcement_id>` - Delete announcement (admin)

### Companies (`/api/companies`)
- `GET /` - Get all companies
- `GET /<company_id>` - Get company details
- `POST /` - Create company (admin)
- `PUT /<company_id>` - Update company (admin/employer)

### Admin (`/api/admin`)
- `GET /dashboard` - Admin dashboard data
- `GET /students` - Get all students
- `GET /users/<role>` - Get users by role
- `GET /statistics` - Get comprehensive statistics

### Coordinator (`/api/coordinator`)
- `GET /dashboard` - Coordinator dashboard
- `GET /department-students` - Get department students
- `POST /student/<student_id>/evaluate` - Evaluate student

### Employer (`/api/employer`)
- `GET /company` - Get company profile
- `GET /internships` - Get company internships
- `GET /internship/<internship_id>/applicants` - Get internship applicants
- `POST /internship/<internship_id>/feedback` - Submit student feedback

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": string,
  "password": string (hashed),
  "first_name": string,
  "last_name": string,
  "role": string (student|admin|coordinator|employer),
  "is_active": boolean,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Students Collection
```json
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "roll_number": string,
  "branch": string,
  "year": string,
  "skills": [string],
  "linkedin_url": string,
  "applications": [ObjectId],
  "internships": [ObjectId],
  "created_at": datetime,
  "updated_at": datetime
}
```

### Internships Collection
```json
{
  "_id": ObjectId,
  "company_id": ObjectId,
  "role": string,
  "description": string,
  "eligibility": [string],
  "duration": string,
  "stipend": string,
  "mode": string (In-office|Remote|Hybrid),
  "location": string,
  "skills_required": [string],
  "applicants": [ObjectId],
  "status": string (active|inactive),
  "created_at": datetime,
  "updated_at": datetime
}
```

### Announcements Collection
```json
{
  "_id": ObjectId,
  "title": string,
  "content": string,
  "sender_id": ObjectId,
  "sender_name": string,
  "priority": string (high|medium|low),
  "target_role": [string],
  "is_internship_posting": boolean,
  "internship_details": object,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Companies Collection
```json
{
  "_id": ObjectId,
  "name": string,
  "email": string,
  "industry": string,
  "location": string,
  "website": string,
  "logo": string,
  "internships_posted": [ObjectId],
  "created_at": datetime,
  "updated_at": datetime
}
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`

Update these URLs in `app.py` for production.

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens have a default expiration of 24 hours.

## Development

For development with automatic reloading:

```bash
pip install python-dotenv
export FLASK_ENV=development
python app.py
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Default: `mongodb://localhost:27017/internship_management`

### Import Errors
- Ensure all packages are installed: `pip install -r requirements.txt`
- Check Python path: `python -c "import flask"`

### Port Already in Use
- Change FLASK_PORT in .env file
- Or kill existing process: `lsof -ti:5000 | xargs kill` (macOS/Linux)

## License

MIT License
