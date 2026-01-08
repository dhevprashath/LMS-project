from sqlalchemy.orm import Session
from database import SessionLocal
import models

def debug_db():
    db = SessionLocal()
    try:
        print("--- USERS ---")
        users = db.query(models.User).all()
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Name: {u.fullname}")
            
        print("\n--- CERTIFICATES ---")
        certs = db.query(models.Certificate).all()
        for c in certs:
            print(f"Code: {c.certificate_code}, UserID: {c.user_id}, CourseID: {c.course_id}")
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_db()
