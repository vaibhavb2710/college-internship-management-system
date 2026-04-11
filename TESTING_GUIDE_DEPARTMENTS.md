# 🧪 COMPLETE Testing Guide: Department-Specific Announcements

## ✅ Prerequisites

- ✓ Backend running on http://127.0.0.1:5000
- ✓ Frontend running on http://localhost:5173
- ✓ Browser DevTools open (F12)
- ✓ Console tab visible
- ✓ MongoDB running

---

## 📋 Test Flow

### PART 1: Create Department-Specific Announcement

#### Step 1.1: Login as Coordinator
```
URL: http://localhost:5173
Email: rajesh.kumar@vit.edu.in
Password: coordinator
Department: INFT
```

#### Step 1.2: Navigate to Announcements
- Click "Add Announcement" in sidebar
- Scroll down to "Announcement Visibility" section

#### Step 1.3: Fill Basic Info
```
Company Name: TestCorp Solutions
Role: Test Developer Intern
Location: Pune
Duration: 3 months
```

#### Step 1.4: Select Department Specific
- Click radio button for "Department Specific"
- **CHECK CONSOLE:** Should see no errors

#### Step 1.5: Select Departments
- Check these boxes:
  - ☑ INFT (Information Technology)
  - ☑ CSED (Computer Science)
  - Leave others unchecked

#### Step 1.6: Check Confirmation Message
```
Below the checkboxes should show:
"Selected: Information Technology, Computer Science"
```

#### Step 1.7: Publish Announcement
- Click "Publish Announcement"
- **CHECK CONSOLE (F12):**

```javascript
Look for this in browser console:

[FORM DEBUG] Announcement Form State:
  targetType: 'department'
  targetDepartments: ['INFT', 'CSED']
  targetDepartments length: 2
[SENDING TO API]: {
  target_type: 'department',
  target_departments: ['INFT', 'CSED'],
  ...
}
```

- **CHECK BACKEND TERMINAL:**
```python
Look for this in terminal:

[ANNOUNCEMENT DATA]
  target_type: 'department'
  target_departments: ['INFT', 'CSED']
[CREATED ANNOUNCEMENT]
  Stored target_type: 'department'
  Stored target_departments: ['INFT', 'CSED']
```

**If either is missing or shows empty arrays, STOP and DEBUG first!**

---

### PART 2: Verify Student Can See (INFT Department)

#### Step 2.1: Logout
- Click logout button
- Verify redirected to login page

#### Step 2.2: Login as INFT Student
```
Email: priya.sharma@vit.edu.in
Password: student
(Any student from INFT department)
```

#### Step 2.3: Go to Dashboard
- Should see "Announcements" section
- **CRITICAL:** Open Browser Console (F12) > Console tab

#### Step 2.4: Check Console Output
```javascript
Look for:
[ANNOUNCEMENTS FETCH]
  Student branch: 'INFT'
  Response: { announcements: [{...}, {...}] }
  Total announcements from API: 2  ← Should include our TestCorp
  [1] TestCorp Solutions
       target_type: 'department'
       target_departments: ['INFT','CSED']
       ✓ SHOULD APPEAR
```

**Expected Result:** TestCorp announcement appears in the announcements section

---

### PART 3: Verify Student Cannot See (Different Department)

#### Step 3.1: Logout
-Click logout
- Back to login page

#### Step 3.2: Login as ECE Student
```
Email: rahul.patel@vit.edu.in
Password: student
(Choose a student from ECE or other non-INFT, non-CSED department)
```

#### Step 3.3: Go to Dashboard
- Open Console (F12)

#### Step 3.4: Check Console Output
```javascript
Look for:
[ANNOUNCEMENTS FETCH]
  Student branch: 'ECE'  ← Different from INFT/CSED
  Total announcements from API: X
  [1] TestCorp Solutions
       target_type: 'department'
       target_departments: ['INFT','CSED']
       ✗ SHOULD NOT APPEAR
```

**Expected Result:** TestCorp announcement does NOT appear (since ECE not selected)

---

## 🔍 Complete Debug Checklist

### Frontend Debugging

- [ ] **Coordinator can select departments:**
  ```
  Go to Announcements tab
  Select "Department Specific"
  Try clicking checkboxes
  Result: Checkboxes get checked/unchecked
  ```

- [ ] **Form state is correct:**
  ```
  Open Console (F12)
  Trigger publish
  Look for [FORM DEBUG] output
  Check targetType: 'department'
  Check targetDepartments: ['INFT', 'CSED'] (not empty)
  ```

- [ ] **Data is sent to API:**
  ```
  Open Network tab (F12)
  Filter: XHR
  Trigger publish
  Click POST /api/announcements
  Check Payload section
  Look for: "target_type": "department"
  Look for: "target_departments": ["INFT", "CSED"]
  ```

### Backend Debugging

- [ ] **Backend receives correct data:**
  ```
  Check terminal where backend is running
  Should show [ANNOUNCEMENT DATA] section
  Verify target_type: 'department'
  Verify target_departments: ['INFT', 'CSED']
  ```

- [ ] **Backend stores correctly:**
  ```
  Check terminal
  Should show [CREATED ANNOUNCEMENT] section
  Verify Stored target_type: 'department'
  Verify Stored target_departments: ['INFT', 'CSED']
  ```

- [ ] **MongoDB has correct data:**
  ```
  Open MongoDB Compass or CLI
  Go to internship_management > announcements
  Find the TestCorp announcement
  Check: target_type is 'department'
  Check: target_departments is ['INFT', 'CSED']
  ```

### Student Filtering Debugging

- [ ] **INFT Student can see announcement:**
  ```
  Login as INFT student
  Go to Dashboard
  Open Console
  Look for [ANNOUNCEMENTS FETCH]
  Should show TestCorp in list
  Should see target_departments: ['INFT','CSED']
  ```

- [ ] **ECE Student cannot see announcement:**
  ```
  Login as ECE student
  Go to Dashboard
  Open Console
  Look for [ANNOUNCEMENTS FETCH]
  Should NOT show TestCorp in list
  ```

- [ ] **CSED Student can see announcement:**
  ```
  Login as CSED student
  Go to Dashboard
  Should SEE TestCorp (since CSED is in target_departments)
  ```

---

##  Troubleshooting by Symptom

### Symptom 1: Checkboxes Won't Check

**Debug Steps:**
1. Open Console (F12)
2. Check for any JavaScript errors (red text)
3. Try clicking each checkbox slowly
4. Type in console: `document.querySelectorAll('[id^="dept-"]')`
   - Should show 8 checkboxes

**Solution Checklist:**
- [ ] JavaScript is enabled
- [ ] No JS errors in console
- [ ] availableDepartments array has values
- [ ] Checkbox onChange handler is defined

---

### Symptom 2: Form Shows targetDepartments is Empty []

**Debug Steps:**
1. Open Console
2. Publish announcement
3. Look at `[FORM DEBUG]` output
4. Check if `targetDepartments length: 0`

**Solution:**
- [ ] Verify checkboxes are actually checked before publishing
- [ ] Check if state is updating immediately after clicking
- [ ] Verify availableDepartments const is not empty

---

### Symptom 3: Backend Receives Empty target_departments

**Debug Steps:**
```
Terminal shows:
[ANNOUNCEMENT DATA]
  target_departments: []  ← This is wrong!
```

**Possible Causes:**
- Frontend not sending the data
- Data structure mismatch
- API path issue

**Solution:**
1. Check Network tab in browser
2. Look at POST request payload
3. Verify target_departments is an array with values
4. Check if backend is even receiving the field

---

### Symptom 4: All Students See All Announcements

**Debug Steps:**
1. Login as different students
2. Open Console
3. Look at `[ANNOUNCEMENTS FETCH]` output
4. Check if all announcements appear for all students

**Possible Causes:**
- Department codes don't match
- MongoDB query is broken
- get_by_department not being called

**Solution:**
1. Check student's `branch` field in database
2. Verify department codes in announcements match
3. Check if target_type and target_departments are being stored
4. Verify MongoDB query in models/announcement.py

---

### Symptom 5: Student Doesn't Exist Error

**Solution:**
- Make sure student has been created with a branch
- Check Students collection in MongoDB
- Verify student.branch matches department codes

---

## 📊 Data Comparison Table

Create a table to verify data flow:

```
Coordinator Selects

| Checkbox | Checked |
|----------|---------|
| INFT     | ✓       |
| CSED     | ✓       |
| MECH     | ✗       |

                    ↓

Frontend Form State
{
  targetType: 'department',
  targetDepartments: ['INFT', 'CSED']
}

                    ↓

Sent to Backend
{
  target_type: 'department',
  target_departments: ['INFT', 'CSED']
}

                    ↓

Stored in MongoDB
{
  target_type: 'department',
  target_departments: ['INFT', 'CSED']
}

                    ↓

Student Filtering
INFT Student: branch='INFT' → ✓ SHOW (in target_departments)
CSED Student: branch='CSED' → ✓ SHOW (in target_departments)
ECE Student: branch='ECE' → ✗ HIDE (not in target_departments)
MECH Student: branch='MECH' → ✗ HIDE (not in target_departments)
```

---

## 🎯 Success Criteria

Your implementation works correctly when:

- ✅ Coordinator can select departments
- ✅ Selected departments are shown in confirmation message
- ✅ Console shows correct data in [FORM DEBUG]
- ✅ Backend shows correct data in terminal
- ✅ Announcement appears in MongoDB with correct fields
- ✅ Students from selected departments see announcement
- ✅ Students from other departments don't see announcement
- ✅ No JavaScript errors in console

---

## 🐛 If There's Still an Issue

Copy-paste this information:

```
1. Browser Console Output (F12 > Console):
   [Paste the [FORM DEBUG] output here]

2. Backend Terminal Output:
   [Paste the [ANNOUNCEMENT DATA] output here]

3. Database Content:
   [Paste the announcement document from MongoDB here]

4. What you expected:
   [Describe what should happen]

5. What actually happened:
   [Describe what did happen]
```

---

## Quick Test Commands

### Reset announcements
```javascript
// In browser console, create fresh test:
DELETE /api/announcements  // (if delete endpoint exists)
// Or delete via MongoDB
```

### View student dept codes
```python
# In MongoDB:
db.students.find({}, {roll_number: 1, branch: 1})
```

### View all announcements
```python
# In MongoDB:
db.announcements.find().forEach(doc => {
  print(doc.title + " -> target_departments: " + JSON.stringify(doc.target_departments));
});
```

---

**Ready to test? Start with Part 1 and follow each step!**

If you get stuck at any point, check the console output - it will tell you exactly what's wrong!
