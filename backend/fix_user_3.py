import sqlite3
import os
from datetime import datetime
import uuid
import sys

# Add backend to path to import utils if needed
sys.path.append(os.path.join(os.path.dirname(__file__)))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'lms.db')
print(f"Connecting to: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Check/Insert User 3
cursor.execute("SELECT id FROM users WHERE id = 3")
if not cursor.fetchone():
    print("User 3 MISSING. Inserting dummy User 3...")
    # We need to insert with ID 3 specifically.
    # Note: Auto-increment might skip if we force ID, but that's fine for SQLite.
    try:
        cursor.execute("INSERT OR REPLACE INTO users (id, email, password, fullname, created_at) VALUES (?, ?, ?, ?, ?)", 
                       (3, "user3@example.com", "hashed_password_placeholder", "Restored User 3", datetime.now()))
        conn.commit()
        print("User 3 inserted.")
    except Exception as e:
        print(f"Error inserting User 3: {e}")
else:
    print("User 3 exists.")

# 2. Re-run Seed Logic for Certificate Issuance (copy-paste logic for safety)
print("Checking certificates for all users...")
conn.row_factory = sqlite3.Row # enable accessing by name if needed, but we use tuples below
cursor = conn.cursor()

# Get Courses
cursor.execute("SELECT id, title FROM courses WHERE title IN ('Python Mastery', 'Java Programming')")
courses = cursor.fetchall()
course_map = {c[1]: c[0] for c in courses}
print(f"Courses found: {course_map}")

# Get Users
cursor.execute("SELECT id FROM users")
users = cursor.fetchall()

for u in users:
    uid = u[0]
    for title, cid in course_map.items():
        cursor.execute("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?", (uid, cid))
        if not cursor.fetchone():
            code = f"LMS-{str(uuid.uuid4()).split('-')[0].upper()}"
            cursor.execute("INSERT INTO certificates (user_id, course_id, certificate_code, issued_date) VALUES (?, ?, ?, ?)",
                           (uid, cid, code, datetime.now()))
            print(f"Issued {title} certificate to User {uid}")
        else:
            # print(f"User {uid} has {title}")
            pass

conn.commit()
conn.close()
print("Fix complete.")
