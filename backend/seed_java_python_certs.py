from sqlalchemy.orm import Session
from database import SessionLocal
import models
import uuid
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
def get_password_hash(password):
    return pwd_context.hash(password)

def seed_java_python_certs():
    db = SessionLocal()
    
    # Target User ID 5
    user_id = 5
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        print(f"User ID {user_id} not found. Creating User 5...")
        # Create a dummy user to fill the slot or FORCE id=5
        # Since ID is usually autoincrement, forcing might be tricky if not careful, 
        # but in SQLAlchemy we can just specify it often.
        # Alternatively, we can just insert a new user and hope it matches or update the frontend, 
        # but the request implies "fix it".
        
        # We will try to create a user with specific ID if supported (mysql usually allows, sqlite does too)
        user = models.User(
            id=5,
            email="user5@example.com",
            fullname="User Five",
            password=get_password_hash("password")
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
            print(f"Created User: {user.email} (ID: {user.id})")
        except Exception as e:
            print(f"Could not create user 5: {e}")
            db.rollback()
            # Try to fetch again in case of race or just pick ANY user
            user = db.query(models.User).first()
            user_id = user.id
    else:
        print(f"Found User: {user.email} (ID: 5)")

    # Define Courses to Ensure
    courses_data = [
        {
            "title": "Python Programming Masterclass",
            "description": "Complete Python bootcamp from zero to hero.",
            "level": "Intermediate",
            "total_duration": 1200
        },
        {
            "title": "Java Enterprise Edition",
            "description": "Master Java for enterprise application development.",
            "level": "Advanced", 
            "total_duration": 1500
        }
    ]
    
    for c_data in courses_data:
        # Check if course exists
        course = db.query(models.Course).filter(models.Course.title == c_data["title"]).first()
        if not course:
            print(f"Creating course: {c_data['title']}")
            course = models.Course(**c_data)
            db.add(course)
            db.commit()
            db.refresh(course)
        else:
            print(f"Course exists: {course.title} (ID: {course.id})")
            
        # Issue Certificate
        existing_cert = db.query(models.Certificate).filter(
            models.Certificate.user_id == user.id,
            models.Certificate.course_id == course.id
        ).first()
        
        if existing_cert:
            print(f"Certificate already exists for {c_data['title']}")
        else:
            cert_code = str(uuid.uuid4()).split('-')[0].upper()
            cert = models.Certificate(
                user_id=user.id,
                course_id=course.id,
                certificate_code=f"LMS-{cert_code}",
                issued_date=datetime.now()
            )
            db.add(cert)
            db.commit()
            print(f"Issued Certificate: {cert.certificate_code} for {c_data['title']}")

    db.close()
    print("Done seeding certificates.")

if __name__ == "__main__":
    seed_java_python_certs()
