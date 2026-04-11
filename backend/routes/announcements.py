from flask import Blueprint, request, jsonify
from middleware.auth import token_required, role_required
from models.announcement import Announcement
from models.user import User
from database import get_collection
from bson.objectid import ObjectId
from bson.objectid import ObjectId

announcement_bp = Blueprint('announcements', __name__)

@announcement_bp.route('/', methods=['GET'])
@token_required
def get_announcements():
    """Get announcements for user's role or department"""
    try:
        # Get all announcements or role-specific
        if request.user_role == 'student':
            # For students, get announcements based on their department
            from models.student import Student
            
            student = Student.find_by_user_id(request.user_id)
            if student:
                department = student.get('branch', '')
                print(f"[ANNOUNCEMENT FILTER] Student department: {department}")
                announcements = Announcement.get_by_department(department)
                print(f"[ANNOUNCEMENT FILTER] Found {len(announcements)} announcements for {department} student")
                # Log each announcement's target info
                for i, ann in enumerate(announcements):
                    target_type = ann.get('target_type', 'not_set')
                    target_depts = ann.get('target_departments', [])
                    print(f"  [{i+1}] {ann.get('title', 'Untitled')} - target_type: {target_type}, target_departments: {target_depts}")
            else:
                # Fallback to role-based if student record not found
                print(f"[ANNOUNCEMENT FILTER] Student record not found for user {request.user_id}")
                announcements = Announcement.get_by_role(request.user_role)
        else:
            # For coordinators and admins, show all announcements
            announcements = Announcement.get_all()
        
        # Convert ObjectIds to strings
        for announcement in announcements:
            announcement['_id'] = str(announcement['_id'])
            # Handle sender_id - could be 'admin' string or ObjectId
            if isinstance(announcement.get('sender_id'), str):
                announcement['sender_id'] = announcement['sender_id']
            else:
                announcement['sender_id'] = str(announcement['sender_id'])
        
        return jsonify({'announcements': announcements}), 200
        
    except Exception as e:
        print(f"Error fetching announcements: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@announcement_bp.route('/<announcement_id>', methods=['GET'])
@token_required
def get_announcement(announcement_id):
    """Get specific announcement"""
    try:
        announcement = Announcement.find_by_id(announcement_id)
        
        if not announcement:
            return jsonify({'error': 'Announcement not found'}), 404
        
        announcement['_id'] = str(announcement['_id'])
        announcement['sender_id'] = str(announcement['sender_id'])
        
        return jsonify(announcement), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@announcement_bp.route('/', methods=['POST'])
@token_required
def create_announcement():
    """Create announcement - accessible to admin and coordinator"""
    try:
        print(f"\n=== ANNOUNCEMENT CREATE REQUEST ===")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Request method: {request.method}")
        print(f"Request path: {request.path}")
        
        # Debug: Check if user_role is set
        print(f"Has user_id attribute: {hasattr(request, 'user_id')}")
        print(f"Has user_role attribute: {hasattr(request, 'user_role')}")
        
        if hasattr(request, 'user_id'):
            print(f"User ID: {request.user_id}")
        if hasattr(request, 'user_role'):
            print(f"User Role: {request.user_role}")
        
        # Check permissions
        if not hasattr(request, 'user_role'):
            error_msg = 'User role not found in request context'
            print(f"ERROR: {error_msg}")
            return jsonify({'error': error_msg}), 403
        
        user_role = request.user_role
        print(f"User role from request: {user_role}")
        print(f"Role type: {type(user_role)}")
        
        # Allow admin and coordinator to create announcements
        allowed_roles = ['admin', 'coordinator']
        print(f"Allowed roles: {allowed_roles}")
        print(f"User role in allowed roles: {user_role in allowed_roles}")
        
        if user_role not in allowed_roles:
            error_msg = f'Insufficient permissions. Your role is: {user_role}. {allowed_roles} required.'
            print(f"ERROR: {error_msg}")
            return jsonify({'error': error_msg}), 403
        
        print(f"✓ Permission check passed for role: {user_role}")
        
        data = request.get_json()
        print(f"Request data: {data}")
        
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content required'}), 400
        
        user = User.find_by_id(request.user_id)
        print(f"User found: {user is not None}")
        
        # Get user name, handle if user not found
        if user:
            sender_name = f"{user.get('first_name', 'Admin')} {user.get('last_name', '')}".strip()
        else:
            sender_name = 'Admin' if user_role == 'admin' else 'Coordinator'
        
        print(f"Sender name: {sender_name}")
        
        # Handle new department-based announcements
        target_type = data.get('target_type', 'institute')
        target_departments = data.get('target_departments', [])
        
        print(f"[ANNOUNCEMENT DATA]")
        print(f"  target_type: {target_type} (type: {type(target_type)})")
        print(f"  target_departments: {target_departments} (type: {type(target_departments)})")
        print(f"  target_departments content: {[str(d) for d in target_departments]}")
        
        announcement_id = Announcement.create(
            title=data['title'],
            content=data['content'],
            sender_id=request.user_id,
            sender_name=sender_name,
            priority=data.get('priority', 'medium'),
            target_role=data.get('target_role', []),
            target_type=target_type,
            target_departments=target_departments,
            internship_data=data.get('internship_data')
        )
        
        print(f"✓ Announcement created successfully: {announcement_id}")
        print(f"[CREATED ANNOUNCEMENT]")
        # Verify it was stored correctly
        from models.announcement import Announcement as AnnModel
        created_ann = AnnModel.find_by_id(announcement_id)
        if created_ann:
            print(f"  Stored target_type: {created_ann.get('target_type')}")
            print(f"  Stored target_departments: {created_ann.get('target_departments')}")
        print(f"=== END REQUEST ===\n")
        
        return jsonify({
            'message': 'Announcement created successfully',
            'announcement_id': announcement_id
        }), 201
        
    except Exception as e:
        print(f"ERROR in create_announcement: {str(e)}")
        import traceback
        traceback.print_exc()
        print(f"=== END REQUEST (ERROR) ===\n")
        return jsonify({'error': f'Failed to create announcement: {str(e)}'}), 500

@announcement_bp.route('/<announcement_id>', methods=['PUT'])
@token_required
@role_required('admin', 'coordinator')
def update_announcement(announcement_id):
    """Update announcement"""
    try:
        data = request.get_json()
        
        announcement = Announcement.find_by_id(announcement_id)
        if not announcement:
            return jsonify({'error': 'Announcement not found'}), 404
        
        Announcement.update(announcement_id, **data)
        
        return jsonify({'message': 'Announcement updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@announcement_bp.route('/<announcement_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_announcement(announcement_id):
    """Delete announcement"""
    try:
        announcement = Announcement.find_by_id(announcement_id)
        if not announcement:
            return jsonify({'error': 'Announcement not found'}), 404
        
        from database import get_collection
        from bson.objectid import ObjectId
        announcements_collection = get_collection('announcements')
        announcements_collection.delete_one({'_id': ObjectId(announcement_id)})
        
        return jsonify({'message': 'Announcement deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
