import sqlite3
import uuid
from datetime import datetime

def seed_direct():
    print("Connecting to database...")
    # Fix: Connect to lms.db in the same folder as this script
    import os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(BASE_DIR, 'lms.db')
    print(f"DB Path: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Ensure Courses Exist
    courses = [
        ("Python Mastery", "Complete Python Course", "Beginner", 120),
        ("Java Programming", "Complete Java Course", "Intermediate", 150)
    ]
    
    db_courses = {} # title -> id

    for title, desc, level, duration in courses:
        cursor.execute("SELECT id FROM courses WHERE title = ?", (title,))
        row = cursor.fetchone()
        if not row:
            print(f"Creating course: {title}")
            cursor.execute("INSERT INTO courses (title, description, level, total_duration, created_at) VALUES (?, ?, ?, ?, ?)", 
                           (title, desc, level, duration, datetime.now()))
            db_courses[title] = cursor.lastrowid
        else:
            db_courses[title] = row[0]
            
    conn.commit()

    # 2. Get All Users
    cursor.execute("SELECT id, email FROM users")
    users = cursor.fetchall()
    print(f"Found {len(users)} users. Issuing certificates...")

    # 3. Issue Certificates
    for u in users:
        user_id = u[0]
        for title, course_id in db_courses.items():
            # Check if exists
            cursor.execute("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?", (user_id, course_id))
            if cursor.fetchone():
                continue
            
            code = f"LMS-{str(uuid.uuid4()).split('-')[0].upper()}"
            cursor.execute("""
                INSERT INTO certificates (user_id, course_id, certificate_code, issued_date)
                VALUES (?, ?, ?, ?)
            """, (user_id, course_id, code, datetime.now()))
            print(f"Issued '{title}' certificate to User {user_id}")

    conn.commit()
    conn.close()
    print("Done.")

if __name__ == "__main__":
    seed_direct()
