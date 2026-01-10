from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter()

# --- Courses ---

@router.post("/", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(
        title=course.title,
        description=course.description,
        level=course.level,
        thumbnail=course.thumbnail,
        total_duration=course.total_duration
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/", response_model=List[schemas.CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@router.get("/{course_id}", response_model=schemas.CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# --- Lessons ---

@router.post("/{course_id}/lessons", response_model=schemas.LessonResponse)
def add_lesson(course_id: int, lesson: schemas.LessonCreate, db: Session = Depends(get_db)):
    # Check course exists
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db_lesson = models.Lesson(**lesson.dict(), course_id=course_id)
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.get("/{course_id}/lessons", response_model=List[schemas.LessonResponse])
def get_lessons(course_id: int, db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course_id).all()
    return lessons

# --- Enrollment & Completion ---

@router.post("/{course_id}/enroll", response_model=schemas.EnrollmentResponse)
def enroll_course(course_id: int, user_id: int = Body(..., embed=True), db: Session = Depends(get_db)):
    # Check if course exists
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Check if already enrolled
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == user_id,
        models.Enrollment.course_id == course_id
    ).first()

    if enrollment:
        return enrollment # Already enrolled

    new_enrollment = models.Enrollment(user_id=user_id, course_id=course_id)
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@router.get("/{course_id}/status/{user_id}", response_model=schemas.EnrollmentResponse)
def get_enrollment_status(course_id: int, user_id: int, db: Session = Depends(get_db)):
     enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == user_id,
        models.Enrollment.course_id == course_id
    ).first()
     if not enrollment:
         raise HTTPException(status_code=404, detail="Not enrolled")
     return enrollment

@router.post("/{course_id}/complete", response_model=schemas.CertificateResponse)
def complete_course(course_id: int, user_id: int = Body(..., embed=True), db: Session = Depends(get_db)):
    # 1. Verify Enrollment
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == user_id,
        models.Enrollment.course_id == course_id
    ).first()

    if not enrollment:
        raise HTTPException(status_code=400, detail="User not enrolled in this course")

    # 2. Mark as Completed
    enrollment.is_completed = True
    
    # 3. Add Attendance Record (Course Completion)
    # Check if attendance exists to avoid duplicates for the same day/event? 
    # For now, just add a record indicating completion.
    attendance = models.Attendance(
        user_id=user_id,
        course_id=course_id,
        status="Completed",
        # date defaults to now
    )
    db.add(attendance)
    
    db.commit()

    # 4. Issue Certificate
    # We can reuse the logic from certificate_routes or call it directly. 
    # For simplicity, we'll replicate the core logic or redirect the client to call issue endpoint.
    # Better to do it here transactionally.
    
    from certificate_routes import issue_certificate
    # Note: reusing the route function directly might be tricky due to Depends interactions.
    # It's cleaner to just call the logic.
    
    # Check if certificate exists
    existing_cert = db.query(models.Certificate).filter(
        models.Certificate.user_id == user_id,
        models.Certificate.course_id == course_id
    ).first()
    
    if existing_cert:
        return existing_cert

    import uuid
    cert_code = str(uuid.uuid4()).split('-')[0].upper()
    cert = models.Certificate(
        user_id=user_id,
        course_id=course_id,
        certificate_code=f"LMS-{cert_code}"
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)

    # Generate PDF (Async ideally, but blocking for now)
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        course = db.query(models.Course).filter(models.Course.id == course_id).first()
        from utils.pdf_generator import generate_certificate_pdf
        generate_certificate_pdf(user.fullname, course.title, cert.issued_date, cert.certificate_code)
    except Exception as e:
        print(f"PDF Generation failed: {e}") 
        # Don't fail the request, certificate record is created.

    return cert

