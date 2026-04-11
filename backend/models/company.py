from database import get_collection
from bson.objectid import ObjectId
from datetime import datetime

class Company:
    """Company/Employer model"""
    
    @staticmethod
    def create(name, email, industry, location, website=None, **kwargs):
        """Create company profile"""
        company_data = {
            'name': name,
            'email': email.lower(),
            'industry': industry,
            'location': location,
            'website': website or '',
            'logo': '',
            'internships_posted': [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            **kwargs
        }
        
        companies_collection = get_collection('companies')
        result = companies_collection.insert_one(company_data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_id(company_id):
        """Find company by ID"""
        try:
            companies_collection = get_collection('companies')
            return companies_collection.find_one({'_id': ObjectId(company_id)})
        except:
            return None
    
    @staticmethod
    def find_by_email(email):
        """Find company by email"""
        companies_collection = get_collection('companies')
        return companies_collection.find_one({'email': email.lower()})
    
    @staticmethod
    def get_all():
        """Get all companies"""
        companies_collection = get_collection('companies')
        return list(companies_collection.find())
    
    @staticmethod
    def update(company_id, **kwargs):
        """Update company"""
        kwargs['updated_at'] = datetime.utcnow()
        try:
            companies_collection = get_collection('companies')
            result = companies_collection.update_one(
                {'_id': ObjectId(company_id)},
                {'$set': kwargs}
            )
            return result.modified_count > 0
        except:
            return False
