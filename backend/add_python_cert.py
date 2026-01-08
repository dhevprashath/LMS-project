import sqlite3
import uuid
from datetime import datetime

def add_python_cert():
    print("Connecting to database...")
    conn = sqlite3.connect('lms.db')
    cursor = conn.cursor()
    
    # 1. Ensure Python Course exists
    print("Checking for Python course...")
    cursor.execute("SELECT id, title FROM courses WHERE title LIKE '%Python%'")
    course = cursor.fetchone()
    
    if not course:
        print("Creating 'Python Programming Masterclass' course...")
        cursor.execute("""
            INSERT INTO courses (title, description, level, total_duration, created_at) 
            VALUES (?, ?, ?, ?, ?)
        """, ("Python Programming Masterclass", "Deep dive into Python 3, covering data structures, OOP, and web development.", "Intermediate", 180, datetime.now()))
        conn.commit()
        course_id = cursor.lastrowid
        course_title = "Python Programming Masterclass"
    else:
        course_id = course[0]
        course_title = course[1]
        print(f"Found existing Python course: {course_title} (ID: {course_id})")

    # 2. Issue Certificate to User 4 (and check if user exists)
    # We will try to find the user by checking the last used ID or just 4 as per previous context
    # Let's list users to be safe
    cursor.execute("SELECT id, email, fullname FROM users")
    users = cursor.fetchall()
    
    # Simple logic: Issue to ALL users just to be safe for the demo, or specifically target '4'
    # The user said "add python couser for certification" - implies for THEM.
    # Previous context showed User ID 4.
    
    target_ids = []
    
    # Try to find ID 4
    user_4 = next((u for u in users if u[0] == 4), None)
    if user_4:
        target_ids.append(4)
    else:
        # If 4 doesn't exist, pick the last one created (likely the current user)
        if users:
            target_ids.append(users[-1][0])
            
    if not target_ids:
        print("No users found!")
        return

    for user_id in target_ids:
        # Check if already has it
        cursor.execute("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?", (user_id, course_id))
        if cursor.fetchone():
            print(f"User {user_id} already has certificate for {course_title}")
        else:
            code = f"LMS-PY-{str(uuid.uuid4()).split('-')[0].upper()}"
            cursor.execute("""
                INSERT INTO certificates (user_id, course_id, certificate_code, issued_date)
                VALUES (?, ?, ?, ?)
            """, (user_id, course_id, code, datetime.now()))
            print(f"Issued certificate {code} to User {user_id} for '{course_title}'")
        
    conn.commit()
    conn.close()
    print("Done.")

if __name__ == "__main__":
    add_python_cert()
