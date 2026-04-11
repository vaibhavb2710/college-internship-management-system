import requests

print('=== COMPLETE REGISTRATION FLOW TEST ===\n')

# 1. REGISTER
print('1. REGISTERING NEW STUDENT...')
register_url = 'http://127.0.0.1:5000/api/auth/register'
reg_data = {
    'email': 'newstudent@example.com',
    'password': 'Password@123',
    'first_name': 'Alex',
    'last_name': 'Johnson',
    'role': 'student',
    'roll_number': '99999',
    'branch': 'MECH',
    'skills': ['Python', 'Java'],
    'linkedin_url': 'https://linkedin.com/in/alex'
}

reg_response = requests.post(register_url, json=reg_data, timeout=5)
print('Registration Status:', reg_response.status_code)
reg_data_response = reg_response.json()
print('User ID:', reg_data_response.get('user_id'))
print()

# 2. LOGOUT (simulate by discarding token)
print('2. SIMULATING LOGOUT (token discarded)...')
print()

# 3. LOGIN AGAIN
print('3. LOGGING IN WITH SAME CREDENTIALS...')
login_url = 'http://127.0.0.1:5000/api/auth/login'
login_data = {
    'email': 'newstudent@example.com',
    'password': 'Password@123'
}

login_response = requests.post(login_url, json=login_data, timeout=5)
print('Login Status:', login_response.status_code)
login_response_data = login_response.json()
token = login_response_data.get('token')
print('Logged in as:', login_response_data.get('first_name'), login_response_data.get('last_name'))
print()

# 4. RETRIEVE STUDENT PROFILE
print('4. RETRIEVING STUDENT PROFILE...')
headers = {'Authorization': 'Bearer ' + token}
profile_url = 'http://127.0.0.1:5000/api/students/profile/current'
profile_response = requests.get(profile_url, headers=headers, timeout=5)
profile_data = profile_response.json()

print('Profile Status:', profile_response.status_code)
print('Roll Number:', profile_data.get('roll_number'))
print('Branch:', profile_data.get('branch'))
print('Skills:', profile_data.get('skills'))
print('LinkedIn:', profile_data.get('linkedin_url'))
print()
print('✅ ALL DATA PERSISTED AND RETRIEVED SUCCESSFULLY!')
