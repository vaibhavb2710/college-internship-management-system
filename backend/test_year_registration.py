import requests
import json

# New student registration with year
register_data = {
    "email": "test.student@vit.edu.in",
    "password": "test123",
    "first_name": "Test",
    "last_name": "Student",
    "role": "student",
    "roll_number": "2024TEST001",
    "branch": "CSE",
    "year": "Second Year",
    "phone": "+919876543210",
    "address": "Test Address",
    "education": "B.Tech CSE",
    "skills": ["Python", "JavaScript"],
    "linkedin_url": "https://linkedin.com/in/test"
}

response = requests.post('http://localhost:5000/api/auth/register', json=register_data)
print(f"Registration Status: {response.status_code}")

if response.status_code == 201:
    result = response.json()
    print(f"✓ Registration successful")
    print(f"  User ID: {result.get('user_id')}")
    print(f"  Token: {result.get('token')[:20]}...")
    
    # Now login and get profile
    login_data = {
        "email": "test.student@vit.edu.in",
        "password": "test123",
        "role": "student"
    }
    
    login_response = requests.post('http://localhost:5000/api/auth/login', json=login_data)
    login_result = login_response.json()
    token = login_result.get('token')
    
    if token:
        headers = {'Authorization': f'Bearer {token}'}
        profile_response = requests.get('http://localhost:5000/api/students/profile/current', headers=headers)
        profile = profile_response.json()
        
        print(f"\n✓ Profile Retrieved:")
        print(f"  Name: {profile.get('user_data', {}).get('first_name')} {profile.get('user_data', {}).get('last_name')}")
        print(f"  Roll: {profile.get('roll_number')}")
        print(f"  Branch: {profile.get('branch')}")
        print(f"  Year: {profile.get('year')}")
        print(f"  Skills: {profile.get('skills')}")
else:
    print(f"✗ Registration failed: {response.json()}")
