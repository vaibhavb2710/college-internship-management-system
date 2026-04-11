from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.user import User
from models.student import Student
from models.internship import Internship
from models.company import Company
from models.announcement import Announcement

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@token_required
@role_required('admin')
def get_admin_dashboard():
    """Get admin dashboard data"""
    try:
        # Get statistics
        total_students = len(Student.get_all())
        total_companies = len(Company.get_all())
        total_internships = len(Internship.get_all())
        total_announcements = len(Announcement.get_all())
        
        # Get users by role
        users_by_role = {}
        roles = ['student', 'admin', 'coordinator', 'employer']
        
        for role in roles:
            count = 0
            # This is a simplified count - in production, use aggregation
            users_by_role[role] = count
        
        return jsonify({
            'statistics': {
                'total_students': total_students,
                'total_companies': total_companies,
                'total_internships': total_internships,
                'total_announcements': total_announcements,
                'users_by_role': users_by_role
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/students', methods=['GET'])
@token_required
@role_required('admin')
def get_all_students():
    """Get all students"""
    try:
        students = Student.get_all()
        
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
                    'year': student.get('year')
                })
        
        return jsonify({'students': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<role>', methods=['GET'])
@token_required
@role_required('admin')
def get_users_by_role(role):
    """Get users by role"""
    try:
        from database import get_collection
        users_collection = get_collection('users')
        users = list(users_collection.find({'role': role}, {'password': 0}))
        
        for user in users:
            user['_id'] = str(user['_id'])
        
        return jsonify({'users': users}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/statistics', methods=['GET'])
@token_required
@role_required('admin')
def get_statistics():
    """Get comprehensive statistics"""
    try:
        students = Student.get_all()
        companies = Company.get_all()
        internships = Internship.get_all()
        
        # Branch-wise breakdown
        branch_breakdown = {}
        for student in students:
            branch = student.get('branch', 'Unknown')
            branch_breakdown[branch] = branch_breakdown.get(branch, 0) + 1
        
        # Skill-wise breakdown
        skill_breakdown = {}
        for student in students:
            for skill in student.get('skills', []):
                skill_breakdown[skill] = skill_breakdown.get(skill, 0) + 1
        
        return jsonify({
            'total_students': len(students),
            'total_companies': len(companies),
            'total_internships': len(internships),
            'branch_breakdown': branch_breakdown,
            'skill_breakdown': skill_breakdown
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
