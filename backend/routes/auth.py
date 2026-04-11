from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required, encode_token, decode_token
from models.user import User
from models.student import Student
from models.coordinator import Coordinator
from models.company import Company
from utils.departments import CANONICAL_DEPARTMENTS, normalize_department

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        email = data['email'].lower()
        
        # Validate student email domain
        if data['role'] == 'student' and not email.endswith('@vit.edu.in'):
            return jsonify({'error': 'Students must register with a valid @vit.edu.in email address'}), 400
        
        # Check if user already exists
        if User.find_by_email(email):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user_id = User.create(
            email=email,
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role']
        )
        
        # Create role-specific profile
        if data['role'] == 'student':
            if 'roll_number' not in data or 'branch' not in data:
                return jsonify({'error': 'Roll number and branch required for student'}), 400

            normalized_branch = normalize_department(data['branch'])
            if normalized_branch not in CANONICAL_DEPARTMENTS:
                return jsonify({
                    'error': f"Invalid branch. Allowed values: {', '.join(CANONICAL_DEPARTMENTS)}"
                }), 400
            
            print(f"Creating student with roll_number: {data['roll_number']}")
            
            Student.create(
                user_id=user_id,
                roll_number=data['roll_number'],
                branch=normalized_branch,
                year=data.get('year', 'First Year'),
                skills=data.get('skills', []),
                linkedin_url=data.get('linkedin_url', ''),
                phone=data.get('phone', ''),
                address=data.get('address', ''),
                education=data.get('education', ''),
                internship_experience=data.get('internshipExperience', ''),
                professional_experience=data.get('professionalExperience', ''),
                resume=data.get('resume', ''),
                certifications=data.get('certifications', [])
            )
            
            print(f"Student created successfully with roll_number: {data['roll_number']}")
        
        elif data['role'] == 'coordinator':
            if 'department' not in data:
                return jsonify({'error': 'Department required for coordinator'}), 400

            normalized_department = normalize_department(data['department'])
            if normalized_department not in CANONICAL_DEPARTMENTS:
                return jsonify({
                    'error': f"Invalid department. Allowed values: {', '.join(CANONICAL_DEPARTMENTS)}"
                }), 400

            Coordinator.create(
                user_id=user_id,
                department=normalized_department
            )
        
        elif data['role'] == 'employer':
            if 'company_name' not in data:
                return jsonify({'error': 'Company name required for employer'}), 400
            
            Company.create(
                name=data['company_name'],
                email=email,
                industry=data.get('industry', ''),
                location=data.get('location', '')
            )
        
        # Generate token
        token = encode_token(user_id, data['role'])
        
        return jsonify({
            'message': 'Registration successful',
            'user_id': user_id,
            'token': token,
            'role': data['role']
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data['email'].lower()
        password = data['password']

        # For student login, validate email domain
        role = data.get('role', 'student')  # Default to student if role not specified
        if role == 'student' and not email.endswith('@vit.edu.in'):
            return jsonify({'error': 'Students must login with a valid @vit.edu.in email address'}), 400
        
        user = User.find_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not User.verify_password(user['password'], password):
            return jsonify({'error': 'Invalid credentials'}), 401

        if role and role != user['role']:
            return jsonify({'error': f"Role mismatch: account belongs to '{user['role']}'"}), 403
        
        # Generate token
        token = encode_token(str(user['_id']), user['role'])
        
        return jsonify({
            'message': 'Login successful',
            'user_id': str(user['_id']),
            'token': token,
            'role': user['role'],
            'first_name': user['first_name'],
            'last_name': user['last_name']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    """Get current user profile"""
    try:
        user = User.get_profile(request.user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get role-specific info
        if user['role'] == 'student':
            student = Student.find_by_user_id(request.user_id)
            if student:
                user['student_info'] = {
                    'roll_number': student.get('roll_number'),
                    'branch': student.get('branch'),
                    'year': student.get('year'),
                    'skills': student.get('skills', [])
                }
        
        return jsonify(user), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify-token', methods=['POST'])
@token_required
def verify_token():
    """Verify JWT token"""
    return jsonify({
        'valid': True,
        'user_id': request.user_id,
        'role': request.user_role
    }), 200
