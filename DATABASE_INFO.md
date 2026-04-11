# 📊 Database Information - Internship Management System

## Database Location 🗂️

**Physical Storage Path:**
```
C:\ProgramData\MongoDB\data\db
```

**Database Name:**
```
internship_management
```

**Connection String:**
```
mongodb://localhost:27017/internship_management
```

---

## Database Collections 📋

| Collection | Documents | Purpose |
|------------|-----------|---------|
| **users** | 6 | User accounts (students, admin, coordinators) |
| **students** | 4 | Student profiles with detailed information |
| **companies** | 3 | Employer company information |
| **internships** | 3 | Internship opportunities |
| **announcements** | 3 | Announcements & notifications |
| **coordinators** | 1 | Department coordinators |

---

## MongoDB Configuration ⚙️

**Installation Path:**
```
C:\Program Files\MongoDB\Server\8.2
```

**Configuration File:**
```
C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg
```

**Service Status:** Running (Windows Service)

---

## How to Access the Database 🔍

### Option 1: MongoDB Shell (Command Line)
```powershell
"C:\Program Files\MongoDB\Server\8.2\bin\mongosh.exe"
```

Then in the shell:
```javascript
use internship_management
db.students.find()        // View all students
db.users.find()          // View all users
db.internships.find()    // View all internships
```

### Option 2: MongoDB Compass (GUI) 🖥️
1. Download from: https://www.mongodb.com/products/tools/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse collections visually

### Option 3: Python Script (Recommended for Quick Preview)
```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['internship_management']

# View all students
students = list(db.students.find())
for student in students:
    print(student)
```

---

## Data Structure Examples 📝

### Student Document
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "roll_number": "2021INFT001",
  "branch": "INFT",
  "year": "Third Year",
  "skills": ["React", "Node.js", "Python"],
  "resume": "Base64-encoded-file",
  "certifications": ["Base64-file-1", "Base64-file-2"],
  "created_at": "2026-03-03T07:44:00Z",
  "updated_at": "2026-03-03T10:08:00Z"
}
```

### User Document
```json
{
  "_id": "ObjectId",
  "email": "student@vit.edu.in",
  "password": "hashed-password",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"
}
```

---

## Helpful MongoDB Commands 💻

```javascript
// View database size
db.stats()

// Count documents in a collection
db.students.countDocuments()

// View specific student
db.students.findOne({ roll_number: "2021INFT001" })

// View all students with specific branch
db.students.find({ branch: "INFT" })

// Export to JSON (from PowerShell/Terminal)
mongoexport --uri="mongodb://localhost:27017/internship_management" --collection=students --out=students.json

// Import from JSON
mongoimport --uri="mongodb://localhost:27017/internship_management" --collection=students --file=students.json
```

---

## Key Files in Data Directory 📁

| File | Purpose |
|------|---------|
| `*.wt` | WiredTiger storage engine files (actual data) |
| `WiredTiger` | Storage engine configuration |
| `mongod.lock` | MongoDB process lock file |
| `journal/` | Transaction journal for crash recovery |
| `diagnostic.data/` | Diagnostic logging |

---

## Backing Up Your Database 💾

### Backup Using mongodump
```powershell
"C:\Program Files\MongoDB\Server\8.2\bin\mongodump.exe" --uri="mongodb://localhost:27017/internship_management" --out="C:\Backups\internship_management_backup"
```

### Restore Using mongorestore
```powershell
"C:\Program Files\MongoDB\Server\8.2\bin\mongorestore.exe" --uri="mongodb://localhost:27017" "C:\Backups\internship_management_backup"
```

---

## Quick Stats 📈

- **Total Documents:** 20
- **Total Collections:** 6
- **Database Type:** NoSQL (Document-based)
- **Storage Engine:** WiredTiger
- **Authentication:** Required (configured in backend)

---

## Important Notes ⚠️

1. **MongoDB must be running** as a service for the application to work
2. **Data is persistent** - Changes made through the app are saved to disk
3. **Database updates** are logged with timestamps (`created_at`, `updated_at`)
4. **File uploads** (resume, certificates) are stored as Base64 in documents
5. **Indexes** are created automatically on app startup for performance

---

## Environment Variables 🔧

Located in `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/internship_management
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
JWT_SECRET=dev-secret-key-change-in-production
```

---

## Troubleshooting 🛠️

**MongoDB Service Not Running?**
```powershell
# Check service status
Get-Service MongoDB

# Start service
Start-Service MongoDB

# Stop service
Stop-Service MongoDB
```

**Connection Refused?**
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify connection string in config

**Database Files Corrupted?**
- Stop MongoDB: `Stop-Service MongoDB`
- Delete/backup `C:\ProgramData\MongoDB\data\db`
- Restart MongoDB: `Start-Service MongoDB`
- Re-seed data: `python seed_data.py`

---

**Last Updated:** March 3, 2026
**Database Version:** MongoDB 8.2
**Created By:** System Admin
