
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import uuid

def seed_certificates():
    db = SessionLocal()
    
    # Get all users
    users = db.query(models.User).all()
    if not users:
        print("No users found. Please register a user first.")
        return

    # Courses to issue certificates for
    target_courses = ["Python for Beginners", "ReactJS Fundamentals"]
    
    for user in users:
        print(f"Processing user: {user.email} (ID: {user.id})")
        for course_title in target_courses:
            course = db.query(models.Course).filter(models.Course.title == course_title).first()
            if not course:
                print(f"Course '{course_title}' not found. Make sure to run seed_courses.py first.")
                continue
                
            # Check if certificate exists
            existing = db.query(models.Certificate).filter(
                models.Certificate.user_id == user.id,
                models.Certificate.course_id == course.id
            ).first()
            
            if existing:
                print(f"  - Certificate for '{course_title}' already exists.")
            else:
                cert_code = str(uuid.uuid4()).split('-')[0].upper()
                cert = models.Certificate(
                    user_id=user.id,
                    course_id=course.id,
                    certificate_code=f"LMS-{cert_code}"
                )
                db.add(cert)
                print(f"  - Issued certificate for '{course_title}'")
            
    db.commit()
    db.close()
    print("Certificate seeding complete.")

if __name__ == "__main__":
    seed_certificates()
