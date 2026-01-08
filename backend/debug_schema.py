
from database import SessionLocal
import models
import schemas
from pydantic import TypeAdapter

def debug():
    db = SessionLocal()
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == 1).all()
    print(f"Found {len(certs)} certs in DB")
    
    for c in certs:
        print(f"Cert ID: {c.id}, Code: {c.certificate_code}")
        print(f"Course ID: {c.course_id}")
        if c.course:
            print(f"Course Title: {c.course.title}")
        else:
            print("Course relation is None")
            
        try:
            pydantic_model = schemas.CertificateResponse.model_validate(c)
            print("Pydantic Validation Passed")
        except Exception as e:
            print(f"Pydantic Validation Failed: {e}")

if __name__ == "__main__":
    debug()
