# Department-Specific Internship Posting Feature

## Overview
The system allows Institute Admins to post internship opportunities that are visible to **specific departments only**, rather than posting to all students institute-wide.

---

## ✅ Feature Status: FULLY IMPLEMENTED

### What's Working:

#### 1. **Admin Dashboard - Announcement Form**
Location: Admin Dashboard → Add Announcement Section

**Two posting options:**

##### Option A: Institute-Wide (All Students)
- 📢 **Target**: ALL students across ALL departments
- 📊 **Coverage**: CMPN, INFT, EXTC, EXCS, BIOMED (All 2,450 students)
- ✅ **Use Case**: Internships open to students from any branch

##### Option B: Department-Specific
- 📍 **Target**: ONLY students from selected departments
- 🎯 **Coverage**: Select 1 or more departments
- ✅ **Use Case**: Internships requiring specific branch expertise
  - CMPN-specific roles (Data Science, AI/ML positions)
  - INFT-specific roles (Web Development, Mobile App)
  - EXTC-specific roles (IoT, Embedded Systems)
  - EXCS-specific roles (Cybersecurity, Cloud)
  - BIOMED-specific roles (Medical Devices, Healthcare IT)

---

## 📋 How to Post Department-Specific Internships

### Step-by-Step Guide:

#### **Step 1: Access Admin Dashboard**
- Login as an Institute Admin/Coordinator
- Click "Add Announcement" from the left sidebar

#### **Step 2: Fill Internship Details**
```
Company Name*           → e.g., "TCS"
Internship Role*        → e.g., "Full Stack Developer"
Location               → e.g., "Bangalore, Karnataka"
Duration               → e.g., "3 months"
Payment Status         → Toggle between "Unpaid" / "Paid"
Stipend Amount         → If Paid selected (e.g., "₹20,000/month")
Required Skills        → e.g., "React, Node.js, MongoDB"
Description            → Detailed job description
Deadline               → Application deadline date
```

#### **Step 3: Select Target Audience (KEY FEATURE)

**Option A: Entire Institute**
```
Radio Button: 🏢 "Entire Institute"
Description: "This announcement will be visible to ALL students 
             across all departments (CMPN, INFT, EXTC, EXCS, BIOMED)"
```

**Option B: Specific Departments** ⭐
```
Radio Button: 🎯 "Specific Departments"

Select Departments (Checkboxes):
☑️ CMPN   (680 students)  → Computer Engineering
☑️ INFT   (520 students)  → Information Technology
☑️ EXTC   (480 students)  → Electronics & Telecom
☑️ EXCS   (420 students)  → Computer Science & Engineering
☑️ BIOMED (350 students)  → Biomedical Engineering

Example: Select CMPN + INFT if role requires web/AI skills
```

#### **Step 4: Verify & Publish**
```
Confirmation Message:
✅ "This announcement will be published to [Selected Department] students"

Example: "Published to CMPN and INFT students (1,200 total)"
```

Click **"Publish Announcement"** button

---

## 🔍 How Students See Department-Specific Posts

### Student Dashboard Behavior:
✅ **Students automatically see:**
- ✓ ALL institute-wide internships
- ✓ Only internships posted for THEIR department

❌ **Students will NOT see:**
- ✗ Internships posted for different departments

### Example:
```
Admin posts for CMPN department only:

Student from CMPN  → ✅ Sees the opportunity
Student from INFT  → ❌ Does NOT see it
Student from EXTC  → ❌ Does NOT see it
```

---

## 🗄️ Database Structure

### Announcement Document Fields:
```json
{
  "_id": "ObjectId",
  "title": "Internship Title",
  "content": "Description",
  "target_type": "institute" | "department",
  "target_departments": ["CMPN", "INFT"],  // Only if department-specific
  "internship_data": {
    "company_name": "Company",
    "role": "Role",
    "location": "Location",
    "duration": "3 months",
    "stipend": "₹20,000",
    "skills": ["React", "Node.js"],
    "deadline": "2026-04-30"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## 🔧 Backend API Endpoints

### Create Department-Specific Announcement
```
POST /announcements
Headers: Authorization: Bearer <token>

Request Body:
{
  "title": "Full Stack Developer - Intern",
  "content": "Join our team...",
  "target_type": "department",
  "target_departments": ["CMPN", "INFT"],
  "target_role": ["student"],
  "priority": "high",
  "internship_data": {
    "company_name": "TCS",
    "role": "Full Stack Developer",
    "location": "Pune",
    "duration": "3 months",
    "is_paid": true,
    "stipend": "₹20,000/month",
    "skills": ["React", "Node.js", "MongoDB"],
    "description": "..."
  }
}

Response: 201 Created
{
  "message": "Announcement created successfully",
  "announcement_id": "507f1f77bcf86cd799439011"
}
```

### Fetch Announcements for Student
```
GET /announcements
Headers: Authorization: Bearer <token>

Response: Auto-filters based on student's branch
- Returns ALL institute-wide announcements
- Returns ONLY announcements for student's department
- Filters internally using get_by_department(student.branch)
```

---

## ✨ Key Features

| Feature | Status | Details |
|---------|--------|---------|
| **Department Selection** | ✅ Implemented | 5 departments (CMPN, INFT, EXTC, EXCS, BIOMED) |
| **Multi-Select** | ✅ Implemented | Post to 1 or more departments at once |
| **Institute-Wide Option** | ✅ Implemented | Post to all students option available |
| **Auto-Filtering** | ✅ Implemented | Students auto-see only their dept postings |
| **Database Storage** | ✅ Implemented | target_type & target_departments stored |
| **Backend Filtering** | ✅ Implemented | get_by_department() method active |
| **UI Indicators** | ✅ Implemented | Shows department emojis & student counts |
| **Validation** | ✅ Implemented | Requires ≥1 department for mode-specific posts |

---

## 🧪 Testing the Feature

### Manual Test Steps:

**1. Admin: Post for CMPN only**
```
1. Go to Admin Dashboard
2. Click "Add Announcement"
3. Fill: Company="Meta", Role="Backend Engineer"
4. Select: 🎯 Specific Departments
5. Check: ☑️ CMPN only
6. Click "Publish"
```

**2. Login as CMPN Student**
```
→ Should see "Meta - Backend Engineer" posting in announcements
```

**3. Login as INFT Student**
```
→ Should NOT see "Meta - Backend Engineer" posting
```

**4. Admin: Post institute-wide**
```
1. Go to Admin Dashboard
2. Click "Add Announcement"
3. Fill: Company="Google", Role="SWE Intern"
4. Select: 🏢 Entire Institute
5. Click "Publish"
```

**5. Any Student (CMPN, INFT, EXTC, EXCS, BIOMED)**
```
→ Should see "Google - SWE Intern" posting
```

---

## 🚀 Usage Recommendations

### When to Use Each Mode:

**🏢 Use "Entire Institute" when:**
- Role is open to all branches (Web dev, Data Science, etc.)
- No specific department requirements
- Role uses general skills (programming, communication)

**🎯 Use "Specific Departments" when:**
- Role targets specific technical expertise:
  - CMPN/INFT: AI/ML, Web, Backend, Data Science
  - EXTC: IoT, Embedded Systems, Signal Processing
  - EXCS: Cybersecurity, Cloud, DevOps
  - BIOMED: Medical Devices, Healthcare IT
- Company wants specialized candidates
- Limited internship spots for specific roles

### Example Scenarios:

```
TCS Posts "General IT Intern"
→ 🏢 Entire Institute (suitable for all)

Google Posts "Data Science Intern"
→ 🎯 CMPN + INFT (AI/ML specialists)

L&T Posts "IoT Engineer"
→ 🎯 EXTC only (embedded systems)

Healthcare Company Posts "Medical Device Dev"
→ 🎯 BIOMED + EXCS (healthcare & tech)
```

---

## 📊 Department Statistics

```
Total Students: 2,450

CMPN  (Computer):        680 students   28%
INFT  (IT):              520 students   21%
EXTC  (Electronics):     480 students   20%
EXCS  (CS & Eng):        420 students   17%
BIOMED (Biomedical):     350 students   14%
```

---

## 🐛 Troubleshooting

### Issue: Department selector not showing
- **Solution**: Select "🎯 Specific Departments" radio button first

### Issue: Publish button disabled
- **Solution**: Ensure at least 1 department is selected for department-mode posts

### Issue: Student not seeing posting
- **Solution**: Verify admin selected correct department matching student's branch

### Issue: All departments visible to one student
- **Solution**: Check if posting was set to "Entire Institute" mode

---

## 📝 Notes

✅ Feature is **fully implemented and production-ready**
✅ All 5 departments are **properly configured**
✅ Database **automatically filters** based on student's branch
✅ Student dashboard **auto-shows** only relevant postings
✅ Backward compatible with **institute-wide postings**

---

**Last Updated**: March 4, 2026
**Status**: ✅ Live & Functional
