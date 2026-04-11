import requests
import json

# Login with existing student
login_data = {
    "email": "rahul.sharma@vit.edu.in",
    "password": "student123",
    "role": "student"
}

response = requests.post('http://localhost:5000/api/auth/login', json=login_data)
print("Login Response:", response.status_code)
login_result = response.json()
token = login_result.get('token')

if token:
    # Get profile
    headers = {'Authorization': f'Bearer {token}'}
    profile_response = requests.get('http://localhost:5000/api/students/profile/current', headers=headers)
    profile = profile_response.json()
    
    print("\nStudent Profile:")
    print(f"  Name: {profile.get('user_data', {}).get('first_name')} {profile.get('user_data', {}).get('last_name')}")
    print(f"  Branch: {profile.get('branch')}")
    print(f"  Year: {profile.get('year')}")
    print(f"  Roll Number: {profile.get('roll_number')}")
else:
    print("Login failed:", login_result)
