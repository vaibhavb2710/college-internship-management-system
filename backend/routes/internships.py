from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.internship import Internship
from models.company import Company

internship_bp = Blueprint('internships', __name__)

@internship_bp.route('/', methods=['GET'])
@token_required
def get_internships():
    """Get all internships"""
    try:
        internships = Internship.get_all()
        
        # Convert ObjectId to string
        for internship in internships:
            internship['_id'] = str(internship['_id'])
            internship['company_id'] = str(internship['company_id'])
            
            # Add company details
            company = Company.find_by_id(str(internship['company_id']))
            if company:
                internship['company'] = {
                    '_id': str(company['_id']),
                    'name': company.get('name'),
                    'location': company.get('location')
                }
        
        return jsonify({'internships': internships}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@internship_bp.route('/<internship_id>', methods=['GET'])
@token_required
def get_internship(internship_id):
    """Get internship details"""
    try:
        internship = Internship.find_by_id(internship_id)
        
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        internship['_id'] = str(internship['_id'])
        internship['company_id'] = str(internship['company_id'])
        
        # Add company details
        company = Company.find_by_id(str(internship['company_id']))
        if company:
            internship['company'] = {
                '_id': str(company['_id']),
                'name': company.get('name'),
                'location': company.get('location'),
                'industry': company.get('industry'),
                'website': company.get('website')
            }
        
        return jsonify(internship), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@internship_bp.route('/', methods=['POST'])
@token_required
@role_required('admin', 'employer')
def create_internship():
    """Create new internship"""
    try:
        data = request.get_json()
        
        # Get company
        company = Company.find_by_email(request.headers.get('X-Company-Email'))
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        required_fields = ['role', 'description', 'duration', 'stipend', 'mode', 'location']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        internship_id = Internship.create(
            company_id=str(company['_id']),
            role=data['role'],
            description=data['description'],
            eligibility=data.get('eligibility', []),
            duration=data['duration'],
            stipend=data['stipend'],
            mode=data['mode'],
            location=data['location'],
            skills_required=data.get('skills_required', [])
        )
        
        return jsonify({
            'message': 'Internship created successfully',
            'internship_id': internship_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@internship_bp.route('/<internship_id>', methods=['PUT'])
@token_required
@role_required('admin', 'employer')
def update_internship(internship_id):
    """Update internship"""
    try:
        data = request.get_json()
        
        internship = Internship.find_by_id(internship_id)
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        Internship.update(internship_id, **data)
        
        return jsonify({'message': 'Internship updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@internship_bp.route('/<internship_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_internship(internship_id):
    """Delete internship"""
    try:
        internship = Internship.find_by_id(internship_id)
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        Internship.update(internship_id, status='inactive')
        
        return jsonify({'message': 'Internship deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
