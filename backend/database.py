"""Database module for MongoDB connection"""
from flask import current_app
from pymongo import MongoClient

def get_db():
    """Get the MongoDB database instance"""
    if 'mongo_client' not in current_app.config:
        current_app.config['mongo_client'] = MongoClient(
            current_app.config['MONGO_URI'],
            serverSelectionTimeoutMS=5000
        )
    
    client = current_app.config['mongo_client']
    db_name = 'internship_management'
    return client[db_name]

def get_collection(collection_name):
    """Get a specific collection from the database"""
    return get_db()[collection_name]

def create_indexes():
    """Create database indexes for better query performance"""
    try:
        from pymongo import DESCENDING, ASCENDING
        from flask import current_app
        import threading
        
        # Get the current app
        app = current_app._get_current_object()
        
        # Run index creation in a separate thread to avoid blocking app startup
        def create_indexes_async():
            try:
                # Use app context in the thread
                with app.app_context():
                    db = get_db()
                    
                    # Users collection indexes
                    db['users'].create_index('email', unique=True)
                    db['users'].create_index('role')
                    
                    # Students collection indexes
                    db['students'].create_index('user_id', unique=True)
                    db['students'].create_index('roll_number')
                    db['students'].create_index('branch')
                    
                    # Internships collection indexes
                    db['internships'].create_index('company_id')
                    db['internships'].create_index('status')
                    
                    # Companies collection indexes
                    db['companies'].create_index('email', unique=True)
                    
                    # Announcements collection indexes
                    db['announcements'].create_index([('created_at', DESCENDING)])
                    
                    # Coordinators collection indexes
                    db['coordinators'].create_index('user_id', unique=True)
                    db['coordinators'].create_index('department')
                    
                    print("Database indexes created successfully")
            except Exception as e:
                print(f"Warning: Could not create all indexes: {e}")
        
        # Start index creation in background thread
        thread = threading.Thread(target=create_indexes_async, daemon=True)
        thread.start()
        
    except Exception as e:
        print(f"Warning: Could not start index creation: {e}")
