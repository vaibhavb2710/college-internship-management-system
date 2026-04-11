from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.company import Company
from models.internship import Internship
from models.student import Student
from models.user import User
from datetime import datetime

employer_bp = Blueprint('employer', __name__)


def _parse_rating(value, default=0):
    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        numeric_value = float(default)
    return max(0.0, min(5.0, numeric_value))


@employer_bp.route('/students', methods=['GET'])
@token_required
@role_required('employer')
def get_students_for_employer():
    """Get students list for employer evaluation."""
    try:
        students = Student.get_all()
        result = []

        for student in students:
            user = User.find_by_id(str(student.get('user_id')))
            if not user:
                continue

            result.append({
                '_id': str(student.get('_id')),
                'name': f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
                'email': user.get('email'),
                'roll_number': student.get('roll_number'),
                'branch': student.get('branch'),
                'year': student.get('year'),
                'employer_feedback': student.get('employer_feedback'),
                'internship_certificate': student.get('internship_certificate')
            })

        return jsonify({'students': result}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@employer_bp.route('/student/<student_id>/evaluate', methods=['POST'])
@token_required
@role_required('employer')
def evaluate_student(student_id):
    """Submit employer evaluation and internship completion certificate for a student."""
    try:
        data = request.get_json() or {}

        student = Student.find_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        technical_skills = _parse_rating(data.get('technical_skills'))
        punctuality = _parse_rating(data.get('punctuality'))
        teamwork = _parse_rating(data.get('teamwork'))
        communication = _parse_rating(data.get('communication'))
        problem_solving = _parse_rating(data.get('problem_solving'))
        provided_overall = data.get('overall_rating')

        if provided_overall is None:
            overall_rating = round(
                (technical_skills + punctuality + teamwork + communication + problem_solving) / 5.0, 2
            )
        else:
            overall_rating = _parse_rating(provided_overall)

        employer_user = User.find_by_id(request.user_id)
        evaluator_name = ''
        evaluator_designation = 'Employer'
        if employer_user:
            evaluator_name = f"{employer_user.get('first_name', '')} {employer_user.get('last_name', '')}".strip()
            if not evaluator_name:
                evaluator_name = employer_user.get('email', 'Employer')

        feedback = {
            'evaluator_id': request.user_id,
            'evaluator_name': evaluator_name or 'Employer',
            'evaluator_designation': evaluator_designation,
            'technical_skills': technical_skills,
            'punctuality': punctuality,
            'teamwork': teamwork,
            'communication': communication,
            'problem_solving': problem_solving,
            'overall_rating': overall_rating,
            'performance': data.get('performance', ''),
            'remarks': data.get('remarks', ''),
            'institute_feedback': data.get('institute_feedback', ''),
            'submitted_at': datetime.utcnow().isoformat()
        }

        certificate = data.get('certificate')
        if not certificate or not certificate.get('data_url'):
            return jsonify({'error': 'Completion certificate is required'}), 400

        internship_certificate = {
            'file_name': certificate.get('file_name', 'completion_certificate'),
            'file_type': certificate.get('file_type', 'application/octet-stream'),
            'file_size': certificate.get('file_size', 0),
            'data_url': certificate.get('data_url'),
            'uploaded_at': certificate.get('uploaded_at', datetime.utcnow().isoformat()),
            'issued_by': feedback['evaluator_name']
        }

        Student.update(
            student_id,
            employer_feedback=feedback,
            internship_certificate=internship_certificate
        )

        return jsonify({
            'message': 'Employer evaluation submitted successfully',
            'employer_feedback': feedback,
            'internship_certificate': internship_certificate
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employer_bp.route('/company', methods=['GET'])
@token_required
@role_required('employer')
def get_company_profile():
    """Get employer's company profile"""
    try:
        from database import get_collection
        
        # Find company by employer email
        user_email = 'employer@company.com'  # In real app, get from user
        companies_collection = get_collection('companies')
        company = companies_collection.find_one({'email': user_email})
        
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        company['_id'] = str(company['_id'])
        
        return jsonify(company), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employer_bp.route('/internships', methods=['GET'])
@token_required
@role_required('employer')
def get_company_internships():
    """Get company's internship postings"""
    try:
        from database import get_collection
        
        # Find company by employer
        user_email = 'employer@company.com'  # In real app, get from user
        companies_collection = get_collection('companies')
        company = companies_collection.find_one({'email': user_email})
        
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        internships = Internship.get_by_company(str(company['_id']))
        
        # Convert ObjectIds
        for internship in internships:
            internship['_id'] = str(internship['_id'])
            internship['company_id'] = str(internship['company_id'])
        
        return jsonify({'internships': internships}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employer_bp.route('/internship/<internship_id>/applicants', methods=['GET'])
@token_required
@role_required('employer')
def get_internship_applicants(internship_id):
    """Get applicants for an internship"""
    try:
        internship = Internship.find_by_id(internship_id)
        
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        applicants = []
        for student_id in internship.get('applicants', []):
            student = Student.find_by_id(str(student_id))
            if student:
                user = User.find_by_id(str(student['user_id']))
                if user:
                    applicants.append({
                        'student_id': str(student['_id']),
                        'name': f"{user.get('first_name')} {user.get('last_name')}",
                        'email': user.get('email'),
                        'roll_number': student.get('roll_number'),
                        'branch': student.get('branch'),
                        'skills': student.get('skills', []),
                        'linkedin': student.get('linkedin_url', '')
                    })
        
        return jsonify({'applicants': applicants}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@employer_bp.route('/internship/<internship_id>/feedback', methods=['POST'])
@token_required
@role_required('employer')
def submit_student_feedback(internship_id):
    """Submit feedback for a student"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        
        if not student_id:
            return jsonify({'error': 'Student ID required'}), 400
        
        student = Student.find_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Store feedback
        feedback = {
            'internship_id': internship_id,
            'rating': data.get('rating'),
            'performance': data.get('performance'),
            'technical_skills': data.get('technical_skills'),
            'soft_skills': data.get('soft_skills'),
            'remarks': data.get('remarks'),
            'submitted_at': 'now'
        }
        
        Student.update(student_id, employer_feedback=feedback)
        
        return jsonify({'message': 'Feedback submitted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
