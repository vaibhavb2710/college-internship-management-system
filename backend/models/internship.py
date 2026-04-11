from database import get_collection
from bson.objectid import ObjectId
from datetime import datetime

class Internship:
    """Internship/Job posting model"""
    
    @staticmethod
    def create(company_id, role, description, eligibility, duration, 
               stipend, mode, location, skills_required, **kwargs):
        """Create new internship posting"""
        internship_data = {
            'company_id': ObjectId(company_id),
            'role': role,
            'description': description,
            'eligibility': eligibility,
            'duration': duration,
            'stipend': stipend,
            'mode': mode,  # In-office, Remote, Hybrid
            'location': location,
            'skills_required': skills_required,
            'applicants': [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'status': 'active',
            **kwargs
        }
        
        internships_collection = get_collection('internships')
        result = internships_collection.insert_one(internship_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_id(internship_id):
        """Find internship by ID"""
        try:
            internships_collection = get_collection('internships')
            return internships_collection.find_one({'_id': ObjectId(internship_id)})
        except:
            return None
    
    @staticmethod
    def get_all(status='active'):
        """Get all internships"""
        query = {'status': status} if status else {}
        internships_collection = get_collection('internships')
        return list(internships_collection.find(query).sort('created_at', -1))
    
    @staticmethod
    def get_by_company(company_id):
        """Get internships by company"""
        try:
            internships_collection = get_collection('internships')
            return list(internships_collection.find({'company_id': ObjectId(company_id)}))
        except:
            return []
    
    @staticmethod
    def add_applicant(internship_id, student_id):
        """Add student to internship applicants"""
        try:
            internships_collection = get_collection('internships')
            internships_collection.update_one(
                {'_id': ObjectId(internship_id)},
                {'$addToSet': {'applicants': ObjectId(student_id)}}
            )
            return True
        except:
            return False
    
    @staticmethod
    def update(internship_id, **kwargs):
        """Update internship"""
        kwargs['updated_at'] = datetime.utcnow()
        try:
            internships_collection = get_collection('internships')
            result = internships_collection.update_one(
                {'_id': ObjectId(internship_id)},
                {'$set': kwargs}
            )
            return result.modified_count > 0
        except:
            return False
