
import requests

BASE_URL = "http://localhost:8000"
USER_ID = 2  # Assuming this user exists from previous context

def test_update():
    print(f"Testing update for User {USER_ID}...")
    
    # 1. Get current data
    # (We don't have a direct get_user endpoint easily accessible without auth list, but let's try update directly)
    
    payload = {
        "fullname": "Test Script User",
        "bio": "Updated via Python script",
        "email": "test_script@example.com"
    }
    
    print(f"Sending PUT to {BASE_URL}/auth/profile/{USER_ID} with payload: {payload}")
    
    try:
        response = requests.put(f"{BASE_URL}/auth/profile/{USER_ID}", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: Profile updated.")
        else:
            print("FAILURE: API returned error.")
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_update()
