import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'lms.db')
print(f"Connecting to: {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Placeholders using ui-avatars or placehold.co
thumbnails = {
    "Python Mastery": "https://ui-avatars.com/api/?name=Python+Mastery&background=random&size=512",
    "Java Programming": "https://ui-avatars.com/api/?name=Java+Programming&background=random&size=512",
    "Java Enterprise Edition": "https://ui-avatars.com/api/?name=Java+EE&background=random&size=512" 
}

cursor.execute("SELECT id, title FROM courses")
courses = cursor.fetchall()

for cid, title in courses:
    thumb = thumbnails.get(title, f"https://ui-avatars.com/api/?name={title}&background=random&size=512")
    print(f"Updating '{title}' with thumbnail: {thumb}")
    cursor.execute("UPDATE courses SET thumbnail = ? WHERE id = ?", (thumb, cid))

conn.commit()
conn.close()
print("Thumbnails updated.")
