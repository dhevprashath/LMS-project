
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import datetime
import uuid

def seed_certificates():
    db = SessionLocal()
    try:
        user_id = 3
        
        # 1. Ensure User 3 exists
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            print(f"User {user_id} not found. Creating dummy user.")
            user = models.User(id=user_id, email="dhevprashath@gmail.com", password="password", fullname="dhevprashath")
            db.add(user)
            db.commit()
            
        # 2. Ensure Courses exist
        courses_data = [
            {"title": "Python Programming", "description": "Learn Python from scratch", "level": "Beginner"},
            {"title": "Java Programming", "description": "Master Java concepts", "level": "Intermediate"}
        ]
        
        course_ids = []
        for c_data in courses_data:
            course = db.query(models.Course).filter(models.Course.title == c_data["title"]).first()
            if not course:
                print(f"Creating course: {c_data['title']}")
                course = models.Course(**c_data)
                db.add(course)
                db.commit()
                db.refresh(course)
            course_ids.append(course.id)
            
        # 3. Issue Certificates
        for cid in course_ids:
            cert = db.query(models.Certificate).filter(
                models.Certificate.user_id == user_id,
                models.Certificate.course_id == cid
            ).first()
            
            if not cert:
                print(f"Issuing certificate for Course ID {cid} to User {user_id}...")
                new_cert = models.Certificate(
                    user_id=user_id,
                    course_id=cid,
                    certificate_code=f"LMS-{str(uuid.uuid4()).split('-')[0].upper()}",
                    issued_date=datetime.datetime.now()
                )
                db.add(new_cert)
                db.commit()
            else:
                print(f"Certificate for Course ID {cid} already exists.")
                
        # 4. Verify
        final_certs = db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()
        print(f"User 3 now has {len(final_certs)} certificates.")
        for c in final_certs:
            print(f" - {c.certificate_code} (Course: {c.course.title if c.course else 'Unknown'})")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_certificates()
