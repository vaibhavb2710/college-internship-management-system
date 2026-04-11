# 🔧 Debugging: Department-Specific Announcements

## Issue Description
When a coordinator selects specific departments for an announcement, it's not working properly.

## Root Cause Analysis

The system has the following components that need to sync:

```
Frontend (Coordinator Dashboard)
├─ Select departments via checkboxes
├─ Store in announcementForm.targetDepartments array
└─ Send to API with target_type='department'
     │
     ↓
Backend (API receives and stores)
├─ Get target_departments from request
├─ Save to MongoDB with target_type='department'
└─ Store target_departments array
     │
     ↓
Backend (Student fetches announcements)
├─ Get student's branch from Student collection
├─ Query MongoDB for matching announcements
└─ Filter using $in query on target_departments
     │
     ↓
Frontend (Student Dashboard)
└─ Display filtered announcements
```

## How to Debug

### Step 1: Enable Debug Console Logging
All three components now have comprehensive debug logging:

**Frontend (Coordinator):**
```javascript
// When publishing announcement, console shows:
[FORM DEBUG] Announcement Form State:
  targetType: 'department'
  targetDepartments: ['INFT', 'CSED']
[SENDING TO API]: { ... full data ... }
```

**Backend (API receives):**
```python
# Terminal shows:
[ANNOUNCEMENT DATA]
  target_type: 'department'
  target_departments: ['INFT', 'CSED']
[CREATED ANNOUNCEMENT]
  Stored target_type: 'department'
  Stored target_departments: ['INFT', 'CSED']
```

**Backend (Student fetches):**
```python
[GET_BY_DEPARTMENT QUERY]
  Student department: 'INFT'
  Found 3 announcements
    [1] TechCorp Full Stack Developer
         target_type: 'department'
         target_departments: ['INFT', 'CSED']
```

**Frontend (Student Dashboard):**
```javascript
[ANNOUNCEMENTS FETCH]
  Student branch: 'INFT'
  Total announcements from API: 3
  [1] TechCorp Full Stack Developer
       target_type: 'department'
       target_departments: ['INFT','CSED']
```

### Step 2: Manual Test Flow

#### Test Case 1: Department-Specific Announcement

1. **Login as Coordinator:**
   - Email: rajesh.kumar@vit.edu.in (or any coordinator)
   - Department: INFT

2. **Create Announcement:**
   - Company Name: "TestCorp"
   - Role: "Test Developer"
   - Select: "Department Specific"
   - Check: "INFT" only
   - Click: "Publish Announcement"

3. **Check Browser Console (F12):**
   - Look for: `[FORM DEBUG] Announcement Form State:`
   - Verify: `targetDepartments: ['INFT']`
   - Verify: `target_type: 'department'`

4. **Check Backend Terminal:**
   - Look for: `[ANNOUNCEMENT DATA]`
   - Verify: `target_departments: ['INFT', 'CSED'] or ['INFT']`
   - Look for: `[CREATED ANNOUNCEMENT]`
   - Verify: `Stored target_departments` matches what was sent

5. **Login as Student from INFT:**
   - Go to Dashboard
   - Check Browser Console (F12)
   - Look for: `[ANNOUNCEMENTS FETCH]`
   - Verify: Announcement appears in the list

6. **Login as Student from CSED (Different Department):**
   - Go to Dashboard
   - Check Browser Console (F12)
   - Verify: TestCorp announcement should NOT appear (since only INFT selected)

#### Test Case 2: Institute-Wide Announcement

1. **Login as Coordinator:**
   - Create Announcement
   - Select: "Institute-Wide"
   - Publish

2. **Check:**
   - Should appear for ALL students, regardless of department
   - Check console logs

#### Test Case 3: Multiple Departments

1. **Login as Coordinator:**
   - Create Announcement
   - Select: "Department Specific"
   - Check: "INFT", "CSED", "MECH"
   - Publish

2. **Test with Students:**
   - INFT student: Should see announcement ✓
   - CSED student: Should see announcement ✓
   - ECE student: Should NOT see announcement ✗
   - MECH student: Should see announcement ✓

## What to Check

### Frontend Issues

```javascript
// In coordinator-dashboard.tsx handlePublishAnnouncement function:

console.log('[FORM DEBUG]', announcementForm);
// Should show:
// {
//   targetType: 'department',
//   targetDepartments: ['INFT', 'CSED'],
//   ...
// }
```

**Checklist:**
- [ ] Checkboxes can be selected
- [ ] Selected departments appear in the list
- [ ] targetDepartments array is not empty
- [ ] targetType is set to 'department' (not 'institute')

### Backend Issues

```python
# In /routes/announcements.py create_announcement function
# Shows what data was received and stored

[ANNOUNCEMENT DATA]
  target_type: 'department'
  target_departments: ['INFT', 'CSED']
[CREATED ANNOUNCEMENT]
  Stored target_type: 'department'
  Stored target_departments: ['INFT', 'CSED']
```

**Checklist:**
- [ ] target_type is being received correctly
- [ ] target_departments array is not empty
- [ ] Data matches what was sent from frontend

### Filtering Issues

```python
# In /models/announcement.py get_by_department function
# Shows what the student is supposed to see

[GET_BY_DEPARTMENT QUERY]
  Student department: 'INFT'
  Found 3 announcements
    [1] TestCorp...
         target_type: 'department'
         target_departments: ['INFT', 'CSED']
```

**Checklist:**
- [ ] Student department is extracted correctly
- [ ] Query finds matching announcements
- [ ] target_departments array contains student's department

## Common Issues and Fixes

### Issue 1: targetDepartments is Empty

**Problem:** Checkboxes don't update the form state

**Check:**
```javascript
// In coordinator-dashboard.tsx, the checkbox onChange handler:
onChange={(e) => {
  if (e.target.checked) {
    setAnnouncementForm({
      ...announcementForm,
      targetDepartments: [...announcementForm.targetDepartments, dept.code]
    });
  } else {
    // Remove from array
  }
}}
```

**Fix:**
- Verify checkboxes are being clicked
- Check browser console to see if state updates
- Verify availableDepartments array has values

### Issue 2: Backend Not Receiving Departments

**Problem:** Console shows `target_departments: []`

**Check:**
```python
# In routes/announcements.py
target_departments = data.get('target_departments', [])
print(f"Received departments: {target_departments}")
```

**Possible Causes:**
- Frontend not sending the data
- API key/path issue
- Data structure mismatch

### Issue 3: Student Not Seeing Filtered Announcements

**Problem:** All students see all announcements (no filtering)

**Check:**
```python
# In models/announcement.py get_by_department
# Verify the MongoDB query:
query = {
    '$or': [
        {'target_type': 'institute'},
        {'target_type': 'department', 'target_departments': {'$in': [department]}},
        {'target_type': {'$exists': False}, 'target_departments': {'$exists': False}}
    ]
}
```

**Possible Causes:**
- Student's branch field is different from department codes
- MongoDB query syntax issue
- Department codes mismatch (case sensitivity)

### Issue 4: Department Code Mismatch

**Problem:** Coordinator selects "INFT", student branch is "IT"

Check if department codes match:
- Coordinator form: Uses ['INFT', 'CSED', 'MECH', ...]
- Student collection: Stores branch as ['INFT', 'IT', ...]

**Fix:** Ensure both use the same department codes

## Testing Commands

### Start the system
```bash
dev-start.bat
```

### Clear announcements and start fresh
```python
# In MongoDB:
db.announcements.deleteMany({})
```

### View all announcements in database
```python
# In MongoDB:
db.announcements.find().pretty()
```

### View student departments
```python
# In MongoDB:
db.students.find({}, {user_id: 1, branch: 1})
```

## Expected Database Structure

```javascript
// Announcement document
{
  "_id": ObjectId(...),
  "title": "TestCorp Full Stack Developer",
  "content": "...",
  "target_type": "department",          // ← Must be 'department'
  "target_departments": ["INFT", "CSED"],  // ← Must have dept codes
  "sender_id": ObjectId(...),
  "sender_name": "Dr. Rajesh Kumar",
  "created_at": ISODate(...),
  ...
}

// Student document
{
  "_id": ObjectId(...),
  "user_id": ObjectId(...),
  "branch": "INFT",                   // ← Must match department codes
  "roll_number": "2021INFT001",
  ...
}
```

## Quick Diagnostic

Run this in sequence:

1. **Create announcement as coordinator:**
   - Open dev console (F12)
   - Look for `[FORM DEBUG]` and `[SENDING TO API]`
   - Copy the announcement data

2. **Check backend logs:**
   - Look for `[ANNOUNCEMENT DATA]` and `[CREATED ANNOUNCEMENT]`
   - Compare with what was sent

3. **Login as student and refresh:**
   - Open dev console (F12)
   - Look for `[ANNOUNCEMENTS FETCH]`
   - See if announcement appears

4. **Check database directly:**
   - Look at announcements collection
   - Verify target_departments is an array with codes

##  Next Steps

1. **Gather Debug Logs:**
   - Run the test flow above
   - Take screenshots of browser console output
   - Copy backend terminal output

2. **Compare Data:**
   - What is sent from frontend?
   - What is received by backend?
   - What is stored in database?
   - What is fetched by student?

3. **Identify Mismatch:**
   - Is it a frontend issue (not sending)?
   - Is it a backend issue (not storing)?
   - Is it a filtering issue (not querying)?

##  If Still Not Working

Check these in order:
1. [ ] Department codes match (both use 'INFT' not 'IT')
2. [ ] targetDepartments array is not empty
3. [ ] target_type is set correctly ('department')
4. [ ] Backend receives and stores the data
5. [ ] Student's branch field matches department codes
6. [ ] MongoDB query syntax is correct

**Need help?** Check the debug console output - it will tell you exactly where the issue is!
