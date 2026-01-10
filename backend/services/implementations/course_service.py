from services.interfaces.course_service_interface import ICourseService
from repositories.interfaces.course_repository_interface import ICourseRepository
from dtos import schemas
import models
from fastapi import HTTPException
import uuid

class CourseService(ICourseService):
    def __init__(self, course_repo: ICourseRepository):
        self.course_repo = course_repo

    def create_course(self, course: schemas.CourseCreate) -> schemas.CourseResponse:
        db_course = models.Course(
            title=course.title,
            description=course.description,
            level=course.level,
            thumbnail=course.thumbnail,
            total_duration=course.total_duration
        )
        return self.course_repo.create_course(db_course)

    def get_courses(self) -> list[schemas.CourseResponse]:
        return self.course_repo.get_all_courses()

    def get_course(self, course_id: int) -> schemas.CourseResponse:
        course = self.course_repo.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course

    def add_lesson(self, course_id: int, lesson: schemas.LessonCreate) -> schemas.LessonResponse:
        course = self.course_repo.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
            
        # Convert DTO to Model
        db_lesson = models.Lesson(**lesson.dict(), course_id=course_id)
        return self.course_repo.add_lesson(db_lesson)

    def get_lessons(self, course_id: int) -> list[schemas.LessonResponse]:
        return self.course_repo.get_lessons_by_course(course_id)

    def enroll_course(self, course_id: int, user_id: int) -> schemas.EnrollmentResponse:
        course = self.course_repo.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
            
        enrollment = self.course_repo.get_enrollment(user_id, course_id)
        if enrollment:
            return enrollment
            
        new_enrollment = models.Enrollment(user_id=user_id, course_id=course_id)
        return self.course_repo.create_enrollment(new_enrollment)

    def get_status(self, course_id: int, user_id: int) -> schemas.EnrollmentResponse:
        enrollment = self.course_repo.get_enrollment(user_id, course_id)
        if not enrollment:
            raise HTTPException(status_code=404, detail="Not enrolled")
        return enrollment

    def complete_course(self, course_id: int, user_id: int) -> schemas.CertificateResponse:
        enrollment = self.course_repo.get_enrollment(user_id, course_id)
        if not enrollment:
             raise HTTPException(status_code=400, detail="User not enrolled in this course")
        
        enrollment.is_completed = True
        self.course_repo.update_enrollment(enrollment)
        
        # Add Attendance
        attendance = models.Attendance(
            user_id=user_id,
            course_id=course_id,
            status="Completed"
        )
        self.course_repo.create_attendance(attendance)
        
        # Issue Certificate
        existing_cert = self.course_repo.get_certificate(user_id, course_id)
        if existing_cert:
            return existing_cert
            
        cert_code = str(uuid.uuid4()).split('-')[0].upper()
        cert = models.Certificate(
            user_id=user_id,
            course_id=course_id,
            certificate_code=f"LMS-{cert_code}"
        )
        saved_cert = self.course_repo.create_certificate(cert)
        
        # Generate PDF
        try:
            user = self.course_repo.get_user_by_id(user_id)
            course = self.course_repo.get_course_by_id(course_id) # Should exist
            
            # Need to fix import path for pdf_generator or move it.
            # Assuming utils is in sys.path or relative import
            from utils.pdf_generator import generate_certificate_pdf
            generate_certificate_pdf(user.fullname, course.title, saved_cert.issued_date, saved_cert.certificate_code)
        except Exception as e:
            print(f"PDF Generation failed: {e}")
            
        return saved_cert
