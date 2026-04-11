from flask import Flask, send_from_directory, send_file
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import config
from database import create_indexes
import os

# Initialize MongoDB
mongo = PyMongo()

def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    # Get the dist folder path
    dist_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dist')
    
    app = Flask(__name__, static_folder=dist_folder, static_url_path='')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    mongo.init_app(app)
    
    # Create database indexes on app startup
    with app.app_context():
        create_indexes()
    
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.students import student_bp
    from routes.internships import internship_bp
    from routes.announcements import announcement_bp
    from routes.companies import company_bp
    from routes.admin import admin_bp
    from routes.coordinator import coordinator_bp
    from routes.employer import employer_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/students')
    app.register_blueprint(internship_bp, url_prefix='/api/internships')
    app.register_blueprint(announcement_bp, url_prefix='/api/announcements')
    app.register_blueprint(company_bp, url_prefix='/api/companies')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(coordinator_bp, url_prefix='/api/coordinator')
    app.register_blueprint(employer_bp, url_prefix='/api/employer')
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'ok', 'message': 'Backend is running'}, 200
    
    # Serve static files
    @app.route('/assets/<path:path>')
    def serve_assets(path):
        return send_from_directory(os.path.join(dist_folder, 'assets'), path)
    
    # Serve index.html for all non-API routes (client-side routing)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        # If it's an API route, don't serve index.html
        if path.startswith('api/'):
            return {'error': 'Not Found'}, 404
        
        # Serve index.html for all other routes
        index_path = os.path.join(dist_folder, 'index.html')
        if os.path.exists(index_path):
            return send_file(index_path)
        return {'error': 'Frontend files not found. Please run: npm run build'}, 404
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=app.config['FLASK_HOST'],
        port=app.config['FLASK_PORT'],
        debug=app.config.get('DEBUG', False),
        use_reloader=False  # Disable reloader on Windows to prevent socket errors
    )
