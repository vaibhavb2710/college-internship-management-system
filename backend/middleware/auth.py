from functools import wraps
from flask import request, jsonify
import jwt
from datetime import datetime, timedelta
from config import Config

def encode_token(user_id, role):
    """Generate JWT token"""
    try:
        payload = {
            'user_id': str(user_id),
            'role': role,
            'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRATION_HOURS)
        }
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)
        return token
    except Exception as e:
        return None

def decode_token(token):
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            print(f"[AUTH] Authorization header: {auth_header[:50]}...")
            try:
                token = auth_header.split(' ')[1]
                print(f"[AUTH] Token extracted: {token[:20]}...")
            except IndexError:
                print(f"[AUTH] Invalid header format")
                return jsonify({'error': 'Invalid authorization header format'}), 401
        
        if not token:
            print(f"[AUTH] No token provided")
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = decode_token(token)
        print(f"[AUTH] Decoded payload: {payload}")
        
        if not payload:
            print(f"[AUTH] Invalid or expired token")
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Store user info in request context
        request.user_id = payload['user_id']
        request.user_role = payload['role']
        
        print(f"[AUTH] Setting request.user_id = {request.user_id}")
        print(f"[AUTH] Setting request.user_role = {request.user_role}")
        print(f"[AUTH] Token validation successful")
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(*roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, 'user_role') or request.user_role not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
