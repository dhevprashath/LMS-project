from sqlalchemy.orm import Session
from repositories.interfaces.course_repository_interface import ICourseRepository
import models

class CourseRepository(ICourseRepository):
    def __init__(self, db: Session):
        self.db = db

    def create_course(self, course: models.Course) -> models.Course:
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course
    
    def get_all_courses(self):
        return self.db.query(models.Course).all()
    
    def get_course_by_id(self, course_id: int):
        return self.db.query(models.Course).filter(models.Course.id == course_id).first()
    
    def add_lesson(self, lesson: models.Lesson):
        self.db.add(lesson)
        self.db.commit()
        self.db.refresh(lesson)
        return lesson
    
    def get_lessons_by_course(self, course_id: int):
        return self.db.query(models.Lesson).filter(models.Lesson.course_id == course_id).all()

    def get_enrollment(self, user_id: int, course_id: int):
         return self.db.query(models.Enrollment).filter(
            models.Enrollment.user_id == user_id,
            models.Enrollment.course_id == course_id
        ).first()
    
    def create_enrollment(self, enrollment: models.Enrollment):
        self.db.add(enrollment)
        self.db.commit()
        self.db.refresh(enrollment)
        return enrollment
    
    def update_enrollment(self, enrollment: models.Enrollment):
        self.db.commit()
        self.db.refresh(enrollment)
        return enrollment

    def get_certificate(self, user_id: int, course_id: int):
        return self.db.query(models.Certificate).filter(
            models.Certificate.user_id == user_id,
            models.Certificate.course_id == course_id
        ).first()
    
    def create_certificate(self, certificate: models.Certificate):
        self.db.add(certificate)
        self.db.commit()
        self.db.refresh(certificate)
        return certificate

    def create_attendance(self, attendance: models.Attendance):
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance
        
    def get_user_by_id(self, user_id: int):
         return self.db.query(models.User).filter(models.User.id == user_id).first()
