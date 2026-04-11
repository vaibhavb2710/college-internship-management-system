from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.coordinator import Coordinator
from models.student import Student
from models.user import User
from utils.departments import get_department_aliases
from datetime import datetime

coordinator_bp = Blueprint('coordinator', __name__)

@coordinator_bp.route('/dashboard', methods=['GET'])
@token_required
@role_required('coordinator')
def get_coordinator_dashboard():
    """Get coordinator dashboard"""
    try:
        coordinator = Coordinator.find_by_user_id(request.user_id)
        
        if not coordinator:
            return jsonify({'error': 'Coordinator profile not found'}), 404
        
        department = coordinator['department']
        
        # Get department students
        students = Coordinator.get_department_students(department)
        
        # Get department internships
        internships = Coordinator.get_department_internships(department)
        
        return jsonify({
            'coordinator': {
                'department': department,
                'designation': coordinator.get('designation')
            },
            'total_students': len(students),
            'ongoing_internships': len(internships),
            'students': [
                {
                    '_id': str(s['_id']),
                    'roll_number': s.get('roll_number'),
                    'branch': s.get('branch'),
                    'year': s.get('year')
                }
                for s in students
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coordinator_bp.route('/department-students', methods=['GET'])
@token_required
@role_required('coordinator')
def get_department_students():
    """Get all students in coordinator's department"""
    try:
        coordinator = Coordinator.find_by_user_id(request.user_id)
        
        if not coordinator:
            return jsonify({'error': 'Coordinator profile not found'}), 404
        
        students = Coordinator.get_department_students(coordinator['department'])
        
        result = []
        for student in students:
            user = User.find_by_id(str(student['user_id']))
            if user:
                result.append({
                    '_id': str(student['_id']),
                    'name': f"{user.get('first_name')} {user.get('last_name')}",
                    'email': user.get('email'),
                    'roll_number': student.get('roll_number'),
                    'branch': student.get('branch'),
                    'year': student.get('year'),
                    'skills': student.get('skills', []),
                    'coordinator_evaluation': student.get('coordinator_evaluation'),
                    'internship_report': student.get('internship_report'),
                    'employer_feedback': student.get('employer_feedback'),
                    'internship_certificate': student.get('internship_certificate')
                })
        
        return jsonify({'students': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@coordinator_bp.route('/student/<student_id>/evaluate', methods=['POST'])
@token_required
@role_required('coordinator')
def evaluate_student(student_id):
    """Evaluate student internship"""
    try:
        data = request.get_json()

        coordinator = Coordinator.find_by_user_id(request.user_id)
        if not coordinator:
            return jsonify({'error': 'Coordinator profile not found'}), 404

        student = Student.find_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        coordinator_department = coordinator.get('department')
        allowed_departments = get_department_aliases(coordinator_department)
        if student.get('branch') not in allowed_departments:
            return jsonify({
                'error': f"You can only evaluate students from {coordinator_department}"
            }), 403

        if not student.get('internship_report'):
            return jsonify({
                'error': 'Student has not uploaded internship report yet'
            }), 400

        def parse_score(field_name, fallback_name, max_score):
            raw_value = data.get(field_name, data.get(fallback_name, 0))
            try:
                numeric_value = float(raw_value)
            except (TypeError, ValueError):
                numeric_value = 0.0
            return max(0.0, min(numeric_value, float(max_score)))

        technical_skills = parse_score('technical_skills', 'technicalSkills', 50)
        task_execution = parse_score('task_execution', 'taskExecution', 30)
        viva_presentation = parse_score('viva_presentation', 'vivaPresentation', 20)
        report_quality = parse_score('report_quality', 'reportQuality', 30)
        supervisor_feedback = parse_score('supervisor_feedback', 'supervisorFeedback', 10)
        company_grade = parse_score('company_grade', 'companyGrade', 10)

        total_score = (
            technical_skills
            + task_execution
            + viva_presentation
            + report_quality
            + supervisor_feedback
            + company_grade
        )
        percentage = round((total_score / 150) * 100, 2) if total_score > 0 else 0

        coordinator_user = User.find_by_id(request.user_id)
        coordinator_name = ''
        if coordinator_user:
            coordinator_name = f"{coordinator_user.get('first_name', '')} {coordinator_user.get('last_name', '')}".strip()

        evaluation = {
            'coordinator_id': request.user_id,
            'coordinator_name': coordinator_name,
            'department': coordinator_department,
            'technical_skills': technical_skills,
            'task_execution': task_execution,
            'viva_presentation': viva_presentation,
            'report_quality': report_quality,
            'supervisor_feedback': supervisor_feedback,
            'company_grade': company_grade,
            'total_score': round(total_score, 2),
            'percentage': percentage,
            'remarks': data.get('remarks', data.get('comments', '')),
            'status': data.get('status', 'completed'),
            'evaluated_at': datetime.utcnow().isoformat()
        }

        Student.update(
            student_id,
            coordinator_evaluation=evaluation,
            evaluation=evaluation  # Backward compatibility with old field name
        )

        return jsonify({
            'message': 'Evaluation submitted successfully',
            'evaluation': evaluation
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
