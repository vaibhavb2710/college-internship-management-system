from database import get_collection
from bson.objectid import ObjectId
from datetime import datetime

class Student:
    """Student model"""
    
    @staticmethod
    def create(user_id, roll_number, branch, year, skills=None, linkedin_url=None, phone=None, address=None, education=None, internship_experience=None, professional_experience=None, resume=None, certifications=None, internship_report=None, employer_feedback=None, internship_certificate=None):
        """Create student profile"""
        student_data = {
            'user_id': ObjectId(user_id),
            'roll_number': roll_number,
            'branch': branch,
            'year': year,
            'skills': skills or [],
            'linkedin_url': linkedin_url or '',
            'phone': phone or '',
            'address': address or '',
            'education': education or '',
            'internship_experience': internship_experience or '',
            'professional_experience': professional_experience or '',
            'resume': resume or '',
            'certifications': certifications or [],
            'internship_report': internship_report or None,
            'employer_feedback': employer_feedback or None,
            'internship_certificate': internship_certificate or None,
            'applications': [],
            'internships': [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        students_collection = get_collection('students')
        result = students_collection.insert_one(student_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_user_id(user_id):
        """Find student by user ID"""
        try:
            students_collection = get_collection('students')
            return students_collection.find_one({'user_id': ObjectId(user_id)})
        except:
            return None
    
    @staticmethod
    def find_by_id(student_id):
        """Find student by ID"""
        try:
            students_collection = get_collection('students')
            return students_collection.find_one({'_id': ObjectId(student_id)})
        except:
            return None
    
    @staticmethod
    def update(student_id, **kwargs):
        """Update student"""
        kwargs['updated_at'] = datetime.utcnow()
        try:
            students_collection = get_collection('students')
            result = students_collection.update_one(
                {'_id': ObjectId(student_id)},
                {'$set': kwargs}
            )
            return result.modified_count > 0
        except:
            return False
    
    @staticmethod
    def get_all():
        """Get all students"""
        students_collection = get_collection('students')
        return list(students_collection.find())
    
    @staticmethod
    def apply_for_internship(student_id, internship_id):
        """Add internship to student's applications"""
        try:
            students_collection = get_collection('students')
            students_collection.update_one(
                {'_id': ObjectId(student_id)},
                {'$addToSet': {'applications': ObjectId(internship_id)}}
            )
            return True
        except:
            return False
