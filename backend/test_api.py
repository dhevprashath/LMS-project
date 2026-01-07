import requests
import sys

def test_register():
    url = "http://localhost:8000/auth/register"
    payload = {
        "fullname": "API Test User",
        "email": "apitest@example.com",
        "password": "password123",
        "role": "student"
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        if response.status_code == 200:
            print("SUCCESS: User registered.")
        elif response.status_code == 400 and "already exists" in response.text:
             print("SUCCESS: Connection worked (User already exists).")
    except Exception as e:
        print(f"FAILED to connect to API: {e}")

if __name__ == "__main__":
    test_register()
