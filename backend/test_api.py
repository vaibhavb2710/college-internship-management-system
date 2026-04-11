"""
API Testing Guide and Examples
This file contains examples of how to test the API endpoints
"""

# Setup
# Make sure the backend is running on http://localhost:5000
# and the database is populated with seed data

BASE_URL = "http://localhost:5000/api"

# ============= AUTHENTICATION =============

# 1. LOGIN
import requests
import json

def test_login():
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": "rahul.sharma@vit.edu.in",
        "password": "student123"
    }
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    
    return data.get('token')  # Return token for subsequent requests

# 2. GET PROFILE
def test_get_profile(token):
    url = f"{BASE_URL}/auth/profile"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# 3. VERIFY TOKEN
def test_verify_token(token):
    url = f"{BASE_URL}/auth/verify-token"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.post(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# ============= INTERNSHIPS =============

# 4. GET ALL INTERNSHIPS
def test_get_internships(token):
    url = f"{BASE_URL}/internships"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data.get('internships', []))} internships")
    if data.get('internships'):
        print(f"First internship: {json.dumps(data['internships'][0], indent=2)}")

# 5. GET INTERNSHIP DETAILS
def test_get_internship_details(token, internship_id):
    url = f"{BASE_URL}/internships/{internship_id}"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# ============= STUDENTS =============

# 6. GET CURRENT STUDENT PROFILE
def test_get_student_profile(token):
    url = f"{BASE_URL}/students/profile/current"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# 7. UPDATE STUDENT PROFILE
def test_update_student_profile(token):
    url = f"{BASE_URL}/students/profile/update"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "skills": ["React", "Node.js", "Python", "MongoDB", "Docker"],
        "linkedin_url": "https://linkedin.com/in/rahulsharma"
    }
    response = requests.put(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# 8. APPLY FOR INTERNSHIP
def test_apply_for_internship(token, internship_id):
    url = f"{BASE_URL}/students/apply/{internship_id}"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.post(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# 9. GET APPLICATIONS
def test_get_applications(token):
    url = f"{BASE_URL}/students/applications"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data.get('applications', []))} applications")

# ============= ANNOUNCEMENTS =============

# 10. GET ANNOUNCEMENTS
def test_get_announcements(token):
    url = f"{BASE_URL}/announcements"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data.get('announcements', []))} announcements")
    if data.get('announcements'):
        print(f"First announcement: {json.dumps(data['announcements'][0], indent=2)}")

# ============= COMPANIES =============

# 11. GET ALL COMPANIES
def test_get_companies(token):
    url = f"{BASE_URL}/companies"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Found {len(data.get('companies', []))} companies")

# ============= EXECUTION EXAMPLE =============

if __name__ == "__main__":
    print("=" * 60)
    print("API TESTING - College Internship Management System")
    print("=" * 60)
    print()
    
    # Login first
    print("1. Testing LOGIN...")
    token = test_login()
    print()
    
    if token:
        print("2. Testing GET PROFILE...")
        test_get_profile(token)
        print()
        
        print("3. Testing GET INTERNSHIPS...")
        test_get_internships(token)
        print()
        
        print("4. Testing GET STUDENT PROFILE...")
        test_get_student_profile(token)
        print()
        
        print("5. Testing UPDATE STUDENT PROFILE...")
        test_update_student_profile(token)
        print()
        
        print("6. Testing GET ANNOUNCEMENTS...")
        test_get_announcements(token)
        print()
        
        print("7. Testing GET COMPANIES...")
        test_get_companies(token)
        print()
        
        print("=" * 60)
        print("All tests completed!")
        print("=" * 60)
    else:
        print("Login failed - stopped testing")
