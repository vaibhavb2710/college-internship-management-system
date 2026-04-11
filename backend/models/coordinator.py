from database import get_collection
from bson.objectid import ObjectId
from datetime import datetime
from utils.departments import get_department_aliases, normalize_department

class Coordinator:
    """Coordinator model"""
    
    @staticmethod
    def create(user_id, department, designation=None):
        """Create coordinator profile"""
        coordinator_data = {
            'user_id': ObjectId(user_id),
            'department': normalize_department(department),
            'designation': designation or 'Department Coordinator',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        coordinators_collection = get_collection('coordinators')
        result = coordinators_collection.insert_one(coordinator_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_user_id(user_id):
        """Find coordinator by user ID"""
        try:
            coordinators_collection = get_collection('coordinators')
            return coordinators_collection.find_one({'user_id': ObjectId(user_id)})
        except:
            return None
    
    @staticmethod
    def get_department_students(department):
        """Get all students in a department"""
        try:
            students_collection = get_collection('students')
            aliases = get_department_aliases(department)
            return list(students_collection.find({'branch': {'$in': aliases}}))
        except:
            return []
    
    @staticmethod
    def get_department_internships(department):
        """Get internships for students in a department"""
        students = Coordinator.get_department_students(department)
        student_ids = [s['_id'] for s in students]
        try:
            internships_collection = get_collection('internships')
            return list(internships_collection.find({'applicants': {'$in': student_ids}}))
        except:
            return []
