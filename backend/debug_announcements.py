#!/usr/bin/env python
"""Debug script to check announcement filtering"""

from app import create_app
from database import get_collection
import json

app = create_app()
with app.app_context():
    # Check what announcements exist
    announcements = list(get_collection('announcements').find().limit(10))
    print('=== ANNOUNCEMENTS IN DATABASE ===')
    for ann in announcements:
        print(f"Title: {ann.get('title')}")
        print(f"  target_type: {ann.get('target_type', 'NOT SET')}")
        print(f"  target_departments: {ann.get('target_departments', 'NOT SET')}")
        print()

    # Check students
    students = list(get_collection('students').find().limit(10))
    print('\n=== STUDENTS IN DATABASE ===')
    for std in students:
        print(f"Name: {std.get('first_name')} {std.get('last_name')}")
        print(f"  Branch: {std.get('branch')}")
        print()

    # Test the query logic
    if students:
        print(f'\n=== TESTING FILTER FOR {students[0].get("branch")} STUDENT ===')
        student_branch = students[0].get('branch')
        
        # This is the query from get_by_department
        query = {
            '$or': [
                {'target_type': 'institute'},
                {
                    'target_type': 'department',
                    'target_departments': {'$in': [student_branch]}
                },
                {
                    'target_type': {'$exists': False},
                    'target_departments': {'$exists': False}
                }
            ]
        }
        
        print(f"Query: {query}")
        results = list(get_collection('announcements').find(query))
        print(f"Found {len(results)} announcements for {student_branch} student:")
        for r in results:
            print(f"  - {r.get('title')} (target_type: {r.get('target_type')}, target_departments: {r.get('target_departments')})")

