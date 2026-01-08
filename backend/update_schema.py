
import sqlite3
import os

DB_FILE = "lms.db"

def update_schema():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} not found.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        print("Checking for 'resource_url' column in 'courses' table...")
        cursor.execute("SELECT resource_url FROM courses LIMIT 1")
        print("'resource_url' column already exists.")
    except sqlite3.OperationalError:
        print("Adding 'resource_url' column to 'courses' table...")
        cursor.execute("ALTER TABLE courses ADD COLUMN resource_url TEXT")
        print("Done.")

    try:
        print("Checking for 'course_id' column in 'attendance' table...")
        cursor.execute("SELECT course_id FROM attendance LIMIT 1")
        print("'course_id' column already exists.")
    except sqlite3.OperationalError:
        print("Adding 'course_id' column to 'attendance' table...")
        cursor.execute("ALTER TABLE attendance ADD COLUMN course_id INTEGER REFERENCES courses(id)")
        print("Done.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_schema()
