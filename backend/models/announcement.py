from database import get_collection
from bson.objectid import ObjectId
from datetime import datetime
from utils.departments import get_department_aliases, normalize_department

class Announcement:
    """Announcement model"""
    
    @staticmethod
    def create(title, content, sender_id, sender_name, priority='medium',
               target_role=None, internship_data=None, target_type='institute',
               target_departments=None, **kwargs):
        """Create announcement
        
        target_type: 'institute' (all students) or 'department' (specific departments)
        target_departments: list of department codes (e.g., ['INFT', 'EXCS'])
        """
        # Handle sender_id - convert to ObjectId unless it's the special 'admin' string
        try:
            if sender_id == 'admin':
                sender_id_value = 'admin'
            else:
                sender_id_value = ObjectId(sender_id)
        except:
            sender_id_value = sender_id
        
        normalized_departments = []
        for dept in (target_departments or []):
            canonical_dept = normalize_department(dept)
            if canonical_dept and canonical_dept not in normalized_departments:
                normalized_departments.append(canonical_dept)

        announcement_data = {
            'title': title,
            'content': content,
            'sender_id': sender_id_value,
            'sender_name': sender_name,
            'priority': priority,  # high, medium, low
            'target_role': target_role or [],  # Roles this applies to
            'target_type': target_type,  # 'institute' or 'department'
            'target_departments': normalized_departments,  # Canonical department codes
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            **kwargs
        }
        
        # If this is an internship posting announcement
        if internship_data:
            announcement_data['is_internship_posting'] = True
            announcement_data['internship_details'] = internship_data
        else:
            announcement_data['is_internship_posting'] = False
        
        announcements_collection = get_collection('announcements')
        result = announcements_collection.insert_one(announcement_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_all():
        """Get all announcements"""
        announcements_collection = get_collection('announcements')
        return list(announcements_collection.find().sort('created_at', -1))
    
    @staticmethod
    def get_by_role(role):
        """Get announcements for specific role"""
        announcements_collection = get_collection('announcements')
        return list(announcements_collection.find({
            '$or': [
                {'target_role': {'$in': [role]}},
                {'target_role': []}
            ]
        }).sort('created_at', -1))
    
    @staticmethod
    def get_by_department(department):
        """Get announcements for a specific department
        
        Returns announcements that are either:
        - Institute-wide (target_type: 'institute')
        - Department-specific and include this department
        """
        announcements_collection = get_collection('announcements')
        department_aliases = get_department_aliases(department)
        
        # Build the query
        query = {
            '$or': [
                # Institute-wide announcements (new format)
                {'target_type': 'institute'},
                # Department-specific announcements that include this department
                {
                    'target_type': 'department',
                    'target_departments': {'$in': department_aliases}
                },
                # Backward compatibility: announcements without target_type are treated as institute-wide
                {
                    'target_type': {'$exists': False},
                    'target_departments': {'$exists': False}
                }
            ]
        }
        
        print(f"[GET_BY_DEPARTMENT QUERY]")
        print(f"  Student department: '{department}'")
        print(f"  Department aliases used for filtering: {department_aliases}")
        print(f"  Query: {query}")
        
        results = list(announcements_collection.find(query).sort('created_at', -1))
        
        print(f"  Found {len(results)} announcements")
        for i, ann in enumerate(results):
            print(f"    [{i+1}] {ann.get('title', 'Untitled')}")
            print(f"         target_type: {ann.get('target_type')}")
            print(f"         target_departments: {ann.get('target_departments')}")
        
        return results
    
    @staticmethod
    def find_by_id(announcement_id):
        """Find announcement by ID"""
        try:
            announcements_collection = get_collection('announcements')
            return announcements_collection.find_one({'_id': ObjectId(announcement_id)})
        except:
            return None
    
    @staticmethod
    def update(announcement_id, **kwargs):
        """Update announcement"""
        kwargs['updated_at'] = datetime.utcnow()
        try:
            announcements_collection = get_collection('announcements')
            result = announcements_collection.update_one(
                {'_id': ObjectId(announcement_id)},
                {'$set': kwargs}
            )
            return result.modified_count > 0
        except:
            return False
