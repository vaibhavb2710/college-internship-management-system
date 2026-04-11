#!/usr/bin/env python
"""Check what's being stored in the database"""

from app import create_app
from database import get_collection

app = create_app()
with app.app_context():
    announcements = list(get_collection('announcements').find().sort('created_at', -1).limit(5))
    
    print("\nLATEST 5 ANNOUNCEMENTS IN DATABASE:")
    print("=" * 80)
    
    for ann in announcements:
        print(f"\nTitle: {ann.get('title')}")
        print(f"  target_type: {ann.get('target_type')} (should be: 'institute' or 'department')")
        print(f"  target_departments: {ann.get('target_departments')} (should be: list of codes like ['INFT'])")
        print(f"  Created at: {ann.get('created_at')}")
        print("-" * 80)
    
    # Now check what students see
    print("\n\nTESTING WHAT EACH STUDENT SEES:")
    print("=" * 80)
    
    students = list(get_collection('students').find())
    from models.announcement import Announcement
    
    for std in students:
        branch = std.get('branch')
        print(f"\nStudent with branch: {branch}")
        
        # Get announcements for this student
        filtered = Announcement.get_by_department(branch)
        print(f"  This student sees: {len(filtered)} announcements")
        
        # Show which ones are dept-specific
        dept_specific = [a for a in filtered if a.get('target_type') == 'department']
        if dept_specific:
            print(f"  Department-specific ones:")
            for a in dept_specific:
                print(f"    - {a.get('title')} (target_departments: {a.get('target_departments')})")
