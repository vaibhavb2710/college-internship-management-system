from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.student import Student
from models.user import User
from models.internship import Internship
from bson.objectid import ObjectId

student_bp = Blueprint('students', __name__)

@student_bp.route('/<student_id>', methods=['GET'])
@token_required
def get_student(student_id):
    """Get student profile"""
    try:
        student = Student.find_by_id(student_id)
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get associated user data
        user = User.find_by_id(str(student['user_id']))
        
        student['_id'] = str(student['_id'])
        student['user_id'] = str(student['user_id'])
        
        if user:
            student['user_data'] = {
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'email': user.get('email')
            }
        
        return jsonify(student), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/profile/current', methods=['GET'])
@token_required
def get_current_student():
    """Get current user's student profile"""
    try:
        student = Student.find_by_user_id(request.user_id)
        
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        print(f"Fetched student document: {student}")
        print(f"Roll number from database: {student.get('roll_number')}")
        
        user = User.find_by_id(request.user_id)
        
        student['_id'] = str(student['_id'])
        student['user_id'] = str(student['user_id'])
        
        if user:
            user.pop('password', None)
            student['user_data'] = user
            student['user_data']['_id'] = str(user['_id'])
        
        print(f"Returning student profile with roll_number: {student.get('roll_number')}")
        return jsonify(student), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/profile/update', methods=['PUT'])
@token_required
@role_required('student')
def update_student_profile():
    """Update student profile"""
    try:
        data = request.get_json()
        log_data = dict(data or {})
        if isinstance(log_data.get('internship_report'), dict) and 'data_url' in log_data['internship_report']:
            sanitized_report = dict(log_data['internship_report'])
            sanitized_report['data_url'] = '<omitted base64>'
            log_data['internship_report'] = sanitized_report
        print(f"Received update data: {log_data}")
        print(f"User ID: {request.user_id}")
        
        student = Student.find_by_user_id(request.user_id)
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Update student record
        update_fields = {}
        if 'skills' in data:
            update_fields['skills'] = data['skills']
        if 'linkedin_url' in data:
            update_fields['linkedin_url'] = data['linkedin_url']
        if 'year' in data:
            update_fields['year'] = data['year']
        if 'phone' in data:
            update_fields['phone'] = data['phone']
        if 'address' in data:
            update_fields['address'] = data['address']
        if 'education' in data:
            update_fields['education'] = data['education']
        if 'roll_number' in data:
            update_fields['roll_number'] = data['roll_number']
        if 'internship_experience' in data:
            update_fields['internship_experience'] = data['internship_experience']
        if 'professional_experience' in data:
            update_fields['professional_experience'] = data['professional_experience']
        if 'resume' in data:
            update_fields['resume'] = data['resume']
        if 'certifications' in data:
            update_fields['certifications'] = data['certifications']
        if 'internship_report' in data:
            update_fields['internship_report'] = data['internship_report']
        
        log_update_fields = dict(update_fields)
        if isinstance(log_update_fields.get('internship_report'), dict) and 'data_url' in log_update_fields['internship_report']:
            sanitized_report = dict(log_update_fields['internship_report'])
            sanitized_report['data_url'] = '<omitted base64>'
            log_update_fields['internship_report'] = sanitized_report
        print(f"Update fields: {log_update_fields}")
        
        if update_fields:
            Student.update(str(student['_id']), **update_fields)
            print(f"Student record updated")
        
        # Update user record
        user_update = {}
        if 'first_name' in data:
            user_update['first_name'] = data['first_name']
        if 'last_name' in data:
            user_update['last_name'] = data['last_name']
        
        if user_update:
            User.update(request.user_id, **user_update)
            print(f"User record updated")
        
        # Fetch updated profile to return
        updated_student = Student.find_by_user_id(request.user_id)
        updated_user = User.find_by_id(request.user_id)
        
        response_data = {
            'message': 'Profile updated successfully',
            'student': {
                'year': updated_student.get('year'),
                'phone': updated_student.get('phone'),
                'address': updated_student.get('address'),
                'education': updated_student.get('education'),
                'skills': updated_student.get('skills'),
                'linkedin_url': updated_student.get('linkedin_url'),
                'roll_number': updated_student.get('roll_number'),
                'resume': updated_student.get('resume'),
                'certifications': updated_student.get('certifications'),
                'internship_report': updated_student.get('internship_report')
            },
            'user': {
                'first_name': updated_user.get('first_name'),
                'last_name': updated_user.get('last_name')
            }
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

@student_bp.route('/apply/<internship_id>', methods=['POST'])
@token_required
@role_required('student')
def apply_internship(internship_id):
    """Apply for an internship"""
    try:
        student = Student.find_by_user_id(request.user_id)
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        # Add to student's applications
        Student.apply_for_internship(str(student['_id']), internship_id)
        
        # Add student to internship applicants
        Internship.add_applicant(internship_id, str(student['_id']))
        
        return jsonify({'message': 'Application submitted successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/applications', methods=['GET'])
@token_required
@role_required('student')
def get_applications():
    """Get student applications"""
    try:
        student = Student.find_by_user_id(request.user_id)
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        applications = []
        for internship_id in student.get('applications', []):
            internship = Internship.find_by_id(str(internship_id))
            if internship:
                internship['_id'] = str(internship['_id'])
                internship['company_id'] = str(internship['company_id'])
                applications.append(internship)
        
        return jsonify({'applications': applications}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
