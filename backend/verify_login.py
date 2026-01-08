import urllib.request
import json

url = "http://127.0.0.1:8000/auth/login"
data = {
    "email": "test@example.com",
    "password": "password123"
}
headers = {'Content-Type': 'application/json'}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"Error: {e.code} {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Failed: {e}")
