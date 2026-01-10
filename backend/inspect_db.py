import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'lms.db')
print(f"Connecting to: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("\n--- USERS ---")
cursor.execute("SELECT id, email, fullname FROM users")
for row in cursor.fetchall():
    print(row)

print("\n--- CERTIFICATES ---")
cursor.execute("SELECT user_id, course_id, certificate_code FROM certificates")
for row in cursor.fetchall():
    print(row)

conn.close()
