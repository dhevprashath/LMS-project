
from database import SessionLocal
import models

db = SessionLocal()
try:
    user_id = 3
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()
    print(f"Checking certificates for user {user_id} via ORM...")
    print(f"Found {len(certs)} certificates.")
    for c in certs:
        print(f"ID: {c.id}, Code: {c.certificate_code}, UserID: {c.user_id}, CourseID: {c.course_id}")
        if c.course:
            print(f"  Course Title: {c.course.title}")
        else:
            print("  Course is None")
finally:
    db.close()
