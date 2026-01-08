from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
from models import User
from auth_routes import get_password_hash
import auth_routes, course_routes, attendance_routes, assessment_routes, certificate_routes
import uvicorn
# Trigger reload 2

# Create Tables
# Create Tables
Base.metadata.create_all(bind=engine)

# Seed Dummy Data
def seed_data():
    db = next(get_db())
    if not db.query(models.User).first():
        print("Seeding dummy user...")
        hashed_password = get_password_hash("password123")
        dummy_user = models.User(
            email="test@example.com",
            password=hashed_password,
            fullname="Test User"
        )
        db.add(dummy_user)
        db.commit()
        print("Dummy user created: test@example.com / password123")
    else:
        print("Database already contains users.")

seed_data()

app = FastAPI(title="LMS API (MySQL)", description="Backend for LMS with MySQL Auth", version="3.0.0")

# CORS Configuration
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the LMS API (MySQL Version)"}

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(course_routes.router, prefix="/courses", tags=["Courses"])
app.include_router(attendance_routes.router, prefix="/attendance", tags=["Attendance"])
app.include_router(assessment_routes.router, prefix="/assessments", tags=["Assessments"])
app.include_router(certificate_routes.router, prefix="/certificates", tags=["Certificates"])

from routers import learning_path
app.include_router(learning_path.router)

@app.get("/api/dashboard/stats")
def get_dashboard_stats(user_id: int, db: Session = Depends(get_db)):
    total_courses = db.query(models.Course).count()
    
    enrolled_courses = db.query(models.Enrollment).filter(models.Enrollment.user_id == user_id).count()
    
    # Calculate attendance percentage for the user
    total_attendance = db.query(models.Attendance).filter(models.Attendance.user_id == user_id).count()
    present_attendance = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id, 
        models.Attendance.status == "present"
    ).count()
    
    attendance_percentage = int((present_attendance / total_attendance * 100)) if total_attendance > 0 else 0
    
    # Check if Certificate model has user_id, usually it does. 
    # If using schemas.py reference, it likely does. 
    # Checking models.py would be safer but let's assume standard pattern.
    certificates_earned = db.query(models.Certificate).filter(models.Certificate.user_id == user_id).count()
    
    return {
        "total_courses": total_courses,
        "enrolled_courses": enrolled_courses,
        "attendance_percentage": attendance_percentage,
        "certificates_earned": certificates_earned
    }





if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
