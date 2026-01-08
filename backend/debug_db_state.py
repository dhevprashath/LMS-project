
from database import SessionLocal
import models

def check_db():
    db = SessionLocal()
    users = db.query(models.User).all()
    with open("db_state.txt", "w") as f:
        f.write(f"--- DATABASE REPORT ---\n")
        f.write(f"Total Users: {len(users)}\n")
        for u in users:
            cert_count = db.query(models.Certificate).filter(models.Certificate.user_id == u.id).count()
            f.write(f"User ID: {u.id} | Email: {u.email} | Name: {u.fullname} | Certificates: {cert_count}\n")
            
            if cert_count > 0:
                certs = db.query(models.Certificate).filter(models.Certificate.user_id == u.id).all()
                for c in certs:
                    course_name = c.course.title if c.course else 'No Course'
                    f.write(f"  - Cert: {c.certificate_code} ({course_name})\n")

    db.close()

if __name__ == "__main__":
    check_db()
