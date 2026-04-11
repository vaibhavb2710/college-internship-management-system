from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.company import Company
from models.internship import Internship

company_bp = Blueprint('companies', __name__)

@company_bp.route('/', methods=['GET'])
@token_required
def get_companies():
    """Get all companies"""
    try:
        companies = Company.get_all()
        
        # Convert ObjectIds to strings
        for company in companies:
            company['_id'] = str(company['_id'])
        
        return jsonify({'companies': companies}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@company_bp.route('/<company_id>', methods=['GET'])
@token_required
def get_company(company_id):
    """Get company details"""
    try:
        company = Company.find_by_id(company_id)
        
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        company['_id'] = str(company['_id'])
        
        # Get company internships
        internships = Internship.get_by_company(company_id)
        company['internships'] = [
            {
                '_id': str(i['_id']),
                'role': i['role'],
                'mode': i['mode'],
                'location': i['location']
            }
            for i in internships
        ]
        
        return jsonify(company), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@company_bp.route('/', methods=['POST'])
@token_required
@role_required('admin')
def create_company():
    """Create company"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'industry', 'location']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if company already exists
        if Company.find_by_email(data['email']):
            return jsonify({'error': 'Company with this email already exists'}), 400
        
        company_id = Company.create(
            name=data['name'],
            email=data['email'],
            industry=data['industry'],
            location=data['location'],
            website=data.get('website', '')
        )
        
        return jsonify({
            'message': 'Company created successfully',
            'company_id': company_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@company_bp.route('/<company_id>', methods=['PUT'])
@token_required
@role_required('admin', 'employer')
def update_company(company_id):
    """Update company"""
    try:
        data = request.get_json()
        
        company = Company.find_by_id(company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        Company.update(company_id, **data)
        
        return jsonify({'message': 'Company updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
