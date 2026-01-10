import sqlite3
import os
import requests
import sys

# 1. Check DB File
BASE_DIR = os.path.join(os.getcwd(), 'backend')
db_path = os.path.join(BASE_DIR, 'lms.db')

print(f"Checking DB at: {db_path}")
if os.path.exists(db_path):
    print(f"File size: {os.path.getsize(db_path)} bytes")
else:
    print("ERROR: DB file not found at expected path!")

# 2. Check Content
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = 3")
    user = cursor.fetchone()
    print(f"User 3 in DB: {user}")
    
    cursor.execute("SELECT * FROM certificates WHERE user_id = 3")
    certs = cursor.fetchall()
    print(f"Certificates for User 3 in DB ({len(certs)}):")
    for c in certs:
        print(c)
    conn.close()
except Exception as e:
    print(f"DB Read Error: {e}")

# 3. Check API
print("\n--- Checking API ---")
try:
    response = requests.get("http://127.0.0.1:8000/certificates/user/3")
    print(f"API Status: {response.status_code}")
    print(f"API Response: {response.text}")
except Exception as e:
    print(f"API Request Error: {e}")
