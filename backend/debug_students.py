#!/usr/bin/env python
"""Debug script to check student records"""

from app import create_app
from database import get_collection
from models.student import Student
from models.user import User

app = create_app()
with app.app_context():
    print("=" * 60)
    print("CHECKING STUDENT DATABASE")
    print("=" * 60)
    
    # Get all users
    users = list(get_collection('users').find())
    print(f"\nUSERS in database: {len(users)}")
    for u in users:
        print(f"  ID: {u['_id']} | Name: {u.get('first_name')} {u.get('last_name')} | Role: {u.get('role')}")
    
    # Get all students
    students = list(get_collection('students').find())
    print(f"\nSTUDENTS in database: {len(students)}")
    for s in students:
        print(f"  User ID: {s.get('user_id')}")
        print(f"    Branch: {s.get('branch')}")
        print(f"    Roll: {s.get('roll_number')}")
        print()
    
    # Test the Student.find_by_user_id function
    if users:
        print("\nTESTING Student.find_by_user_id for each user:")
        for u in users:
            user_id = str(u['_id'])
            student = Student.find_by_user_id(user_id)
            if student:
                print(f"  OK: User {user_id[:12]}... -> Found student with branch: {student.get('branch')}")
            else:
                print(f"  FAIL: User {user_id[:12]}... -> NO STUDENT RECORD FOUND")
    
    print("\n" + "=" * 60)
    print("CHECKING ANNOUNCEMENT FILTERING FOR EACH STUDENT")
    print("=" * 60)
    
    from models.announcement import Announcement
    
    if students:
        for s in students[:3]:  # Check first 3 students
            user_id = str(s.get('user_id'))
            branch = s.get('branch')
            print(f"\nStudent with branch: {branch}")
            
            # Simulate what the backend does
            announcements = Announcement.get_by_department(branch)
            print(f"   Found {len(announcements)} announcements:")
            for ann in announcements:
                target_type = ann.get('target_type', 'NOT SET')
                target_depts = ann.get('target_departments', [])
                print(f"     - {ann.get('title')[:40]:40} | type: {target_type:12} | depts: {target_depts}")

