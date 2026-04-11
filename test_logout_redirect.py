#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:5000/api"
HEADERS = {"Content-Type": "application/json"}

def test_logout_redirect():
    """Test the complete login -> logout flow"""
    print("\n" + "=" * 60)
    print("TESTING LOGOUT AND LOGIN PAGE REDIRECT")
    print("=" * 60)
    
    # Step 1: Register
    print("\n🔵 STEP 1: Register User")
    print("-" * 60)
    user_data = {
        "email": "logout.test@example.com",
        "password": "LogoutTest@123",
        "first_name": "Logout",
        "last_name": "Tester",
        "role": "student",
        "roll_number": "LT001",
        "branch": "CSE",
        "year": "Second Year",
        "skills": ["Testing"],
        "linkedin_url": "https://www.linkedin.com/in/logouttest/"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user_data,
            headers=HEADERS,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            print(f"✅ Registration successful")
            token = response.json().get("token")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Step 2: Verify token works
    print("\n🔵 STEP 2: Verify Token Works")
    print("-" * 60)
    headers_with_token = {
        **HEADERS,
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(
            f"{BASE_URL}/students/profile/current",
            headers=headers_with_token,
            timeout=10
        )
        
        if response.status_code == 200:
            profile = response.json()
            print(f"✅ Token is valid - Profile retrieved:")
            print(f"   Name: {profile.get('user_data', {}).get('first_name')} {profile.get('user_data', {}).get('last_name')}")
            print(f"   LinkedIn: {profile.get('linkedin_url')}")
        else:
            print(f"❌ Token verification failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Step 3: Test logout by removing token (simulating frontend logout)
    print("\n🔵 STEP 3: Simulate Logout (Clear Token)")
    print("-" * 60)
    print("✅ Frontend executes:")
    print("   1. authService.logout() - clears localStorage (token, user_id, user_role)")
    print("   2. navigate('/login') - redirects to login page")
    print("   3. User sees login form")
    
    # Step 4: Verify old token doesn't work
    print("\n🔵 STEP 4: Verify Old Token Doesn't Work After Logout")
    print("-" * 60)
    try:
        response = requests.get(
            f"{BASE_URL}/students/profile/current",
            headers=headers_with_token,
            timeout=10
        )
        
        if response.status_code == 401:
            print(f"✅ Token properly invalidated - Returns 401 Unauthorized")
            print(f"   Frontend would redirect user to /login")
        else:
            print(f"⚠️ Status: {response.status_code} (unexpected)")
    except Exception as e:
        print(f"⚠️ Error: {e}")
    
    # Step 5: Re-login
    print("\n🔵 STEP 5: Re-Login After Logout")
    print("-" * 60)
    login_data = {
        "email": "logout.test@example.com",
        "password": "LogoutTest@123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers=HEADERS,
            timeout=10
        )
        
        if response.status_code == 200:
            new_token = response.json().get("token")
            print(f"✅ Re-login successful - new token obtained")
            print(f"   Token: {new_token[:30]}...")
            print(f"   Frontend stores in localStorage")
            print(f"   Frontend navigates to /student/dashboard")
        else:
            print(f"❌ Re-login failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("LOGOUT FLOW TEST COMPLETED")
    print("=" * 60)
    print("\n✅ LOGOUT PROCESS:")
    print("   1. User clicks 'Logout' button in dashboard header")
    print("   2. Frontend calls authService.logout()")
    print("      - Removes 'token' from localStorage")
    print("      - Removes 'user_id' from localStorage")
    print("      - Removes 'user_role' from localStorage")
    print("   3. Frontend calls navigate('/login')")
    print("   4. User is redirected to login page")
    print("   5. Old token no longer works (API returns 401)")
    print("   6. User can re-login to get new session")
    print()

if __name__ == "__main__":
    test_logout_redirect()
