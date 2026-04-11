from database import get_collection
from bson.objectid import ObjectId
import bcrypt
from datetime import datetime

class User:
    """User model for database operations"""
    
    @staticmethod
    def create(email, password, first_name, last_name, role, **kwargs):
        """Create a new user"""
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_data = {
            'email': email.lower(),
            'password': hashed_password.decode('utf-8'),
            'first_name': first_name,
            'last_name': last_name,
            'role': role,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True,
            **kwargs
        }
        
        users_collection = get_collection('users')
        result = users_collection.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        users_collection = get_collection('users')
        return users_collection.find_one({'email': email.lower()})
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        # Handle special admin user case
        if user_id == 'admin':
            return {
                '_id': 'admin',
                'first_name': 'Institute',
                'last_name': 'Admin',
                'email': 'amit.alyani@vit.edu.in',
                'role': 'admin'
            }
        
        try:
            users_collection = get_collection('users')
            return users_collection.find_one({'_id': ObjectId(user_id)})
        except:
            return None
    
    @staticmethod
    def verify_password(stored_hash, password):
        """Verify password against stored hash"""
        return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
    
    @staticmethod
    def update(user_id, **kwargs):
        """Update user"""
        kwargs['updated_at'] = datetime.utcnow()
        try:
            users_collection = get_collection('users')
            result = users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': kwargs}
            )
            return result.modified_count > 0
        except:
            return False
    
    @staticmethod
    def get_profile(user_id):
        """Get user profile without password"""
        user = User.find_by_id(user_id)
        if user:
            user.pop('password', None)
            user['_id'] = str(user['_id'])
        return user
