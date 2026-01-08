import sqlite3
import uuid
from datetime import datetime

def seed_direct():
    print("Connecting to database...")
    conn = sqlite3.connect('lms.db')
    cursor = conn.cursor()
    
    # Check users
    cursor.execute("SELECT id, email, fullname FROM users")
    users = cursor.fetchall()
    print(f"Found {len(users)} users.")
    for u in users:
        print(f" - User: {u[0]} {u[1]}")

    # Check courses
    cursor.execute("SELECT id, title FROM courses")
    courses = cursor.fetchall()
    print(f"Found {len(courses)} courses.")
    
    if not courses:
        print("No courses found! creating a dummy course...")
        cursor.execute("INSERT INTO courses (title, description, level, total_duration, created_at) VALUES (?, ?, ?, ?, ?)", 
                       ("Python Mastery", "Complete Python Course", "Beginner", 120, datetime.now()))
        conn.commit()
        courses = [(cursor.lastrowid, "Python Mastery")]

    # Issue certificates for User ID 4 (and others) if they don't have one
    target_user_id = 4
    
    # Check if user 4 exists in the list we fetched
    user_exists = any(u[0] == target_user_id for u in users)
    if not user_exists: 
        print(f"User {target_user_id} not found in DB. Fallback to issuing for all users.")
    
    users_to_process = [u for u in users if u[0] == target_user_id] if user_exists else users
    
    for user in users_to_process:
        uid = user[0]
        # Pick first course
        course_id = courses[0][0]
        course_title = courses[0][1]
        
        # Check existing
        cursor.execute("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?", (uid, course_id))
        if cursor.fetchone():
            print(f"User {uid} already has certificate for {course_title}")
            continue
            
        code = f"LMS-{str(uuid.uuid4()).split('-')[0].upper()}"
        now = datetime.now()
        
        cursor.execute("""
            INSERT INTO certificates (user_id, course_id, certificate_code, issued_date)
            VALUES (?, ?, ?, ?)
        """, (uid, course_id, code, now))
        print(f"Issued certificate {code} to User {uid} for {course_title}")

    conn.commit()
    conn.close()
    print("Done.")

if __name__ == "__main__":
    seed_direct()
