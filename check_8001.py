import requests
try:
    print("Requesting http://127.0.0.1:8001/certificates/user/3")
    r = requests.get("http://127.0.0.1:8001/certificates/user/3")
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text}")
except Exception as e:
    print(f"Error: {e}")
