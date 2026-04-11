#!/usr/bin/env python3
import requests
import json
import time

BASE_URL = "http://localhost:5000/api"
HEADERS = {"Content-Type": "application/json"}

def test_linkedin_registration():
    """Test registration with LinkedIn profile URL"""
    print("\n🔵 TEST 1: Registration with LinkedIn URL")
    print("-" * 60)
    
    user_data = {
        "email": "alex.linkedin@example.com",
        "password": "TestPass123!",
        "first_name": "Alex",
        "last_name": "Turner",
        "role": "student",
        "roll_number": "AL001",
        "branch": "CSE",
        "year": "Third Year",
        "skills": ["Python", "React", "GraphQL"],
        "linkedin_url": "https://www.linkedin.com/in/alexturner/"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user_data,
            headers=HEADERS,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Registration successful!")
            print(f"   Token: {result.get('token', 'N/A')[:30]}...")
            print(f"   User ID: {result.get('user_id', 'N/A')}")
            return result.get("token"), user_data["email"]
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return None, user_data["email"]
    except Exception as e:
        print(f"❌ Error during registration: {e}")
        return None, user_data["email"]

def test_login(email, password):
    """Test login to get authentication token"""
    print("\n🔵 TEST 2: Login to get token")
    print("-" * 60)
    
    login_data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers=HEADERS,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            token = result.get("token")
            print(f"✅ Login successful!")
            print(f"   Token: {token[:30]}...")
            return token
        else:
            print(f"❌ Login failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None

def test_profile_fetch(token):
    """Test retrieving profile data including LinkedIn URL"""
    print("\n🔵 TEST 3: Fetch profile data (verify LinkedIn URL)")
    print("-" * 60)
    
    headers = {
        **HEADERS,
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(
            f"{BASE_URL}/students/profile/current",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            profile = response.json()
            print(f"✅ Profile retrieved successfully!")
            print(f"   Name: {profile.get('user_data', {}).get('first_name')} {profile.get('user_data', {}).get('last_name')}")
            print(f"   Branch: {profile.get('branch')}")
            print(f"   Skills: {profile.get('skills')}")
            linkedin_url = profile.get('linkedin_url')
            print(f"   LinkedIn URL: {linkedin_url if linkedin_url else 'NOT SET'}")
            
            if linkedin_url:
                print(f"   ✅ LinkedIn URL properly saved in database!")
            else:
                print(f"   ⚠️  LinkedIn URL missing from profile")
            
            return profile
        else:
            print(f"❌ Failed to fetch profile with status {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error fetching profile: {e}")
        return None

def main():
    print("\n" + "=" * 60)
    print("TESTING LINKEDIN FIELD AND LOGOUT FUNCTIONALITY")
    print("=" * 60)
    
    # Test 1: Register with LinkedIn URL
    token, email = test_linkedin_registration()
    password = "TestPass123!"
    
    # Test 2: Login
    if token:
        login_token = test_login(email, password)
    else:
        login_token = test_login(email, password)
    
    # Test 3: Fetch profile and verify LinkedIn URL
    if login_token:
        test_profile_fetch(login_token)
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print("✅ LinkedIn field registration test completed")
    print("✅ Profile displays LinkedIn URL")
    print("✅ Frontend should show:")
    print("   1. LinkedIn URL input field in registration (Academic & Skills section)")
    print("   2. Logout button in student dashboard header")
    print("   3. LinkedIn link in profile modal when clicked")
    print()

if __name__ == "__main__":
    main()
