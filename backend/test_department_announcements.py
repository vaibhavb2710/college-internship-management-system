"""
Test script to verify department-specific announcements are working
Run: python test_department_announcements.py
"""

from app import create_app
from models.user import User
from models.student import Student
from models.announcement import Announcement
from database import get_collection
import json

def test_department_announcements():
    """Test department-specific announcement functionality"""
    app = create_app()
    
    with app.app_context():
        try:
            print("=" * 60)
            print("TESTING DEPARTMENT-SPECIFIC ANNOUNCEMENTS")
            print("=" * 60)
            
            # Get some existing students
            students_collection = get_collection('students')
            students = list(students_collection.find().limit(3))
            
            if not students:
                print("✗ No students found in database")
                return
            
            print(f"\nFound {len(students)} students to test with:")
            for student in students:
                print(f"  - {student.get('name', 'Unknown')} ({student.get('branch', 'Unknown')})")
            
            # Create a test announcement for CMPN department only
            print("\n" + "-" * 60)
            print("Creating test announcement for CMPN department...")
            announcement_id = Announcement.create(
                title="CMPN Department Internship - Test",
                content="This internship is only for CMPN students",
                sender_id="admin",
                sender_name="Test Admin",
                priority="high",
                target_type="department",
                target_departments=["CMPN"],
            )
            print(f"✓ Created announcement: {announcement_id}")
            
            # Create institute-wide announcement
            print("\n" + "-" * 60)
            print("Creating institute-wide announcement...")
            institute_announcement_id = Announcement.create(
                title="Institute-Wide Internship - Test",
                content="This internship is for all students",
                sender_id="admin",
                sender_name="Test Admin",
                priority="medium",
                target_type="institute",
                target_departments=[],
            )
            print(f"✓ Created announcement: {institute_announcement_id}")
            
            # Test filtering for each student
            print("\n" + "-" * 60)
            print("Testing announcement visibility by department:")
            print("-" * 60)
            
            for student in students:
                branch = student.get('branch', '')
                announcements = Announcement.get_by_department(branch)
                
                print(f"\nDepartment: {branch}")
                print(f"Total announcements visible: {len(announcements)}")
                
                for ann in announcements:
                    if 'Test' in ann.get('title', ''):
                        target_info = f"({ann.get('target_type', 'unknown')} - {ann.get('target_departments', [])})"
                        print(f"  ✓ {ann['title']} {target_info}")
            
            print("\n" + "=" * 60)
            print("✓ TESTS COMPLETED SUCCESSFULLY")
            print("=" * 60)
            
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    test_department_announcements()
