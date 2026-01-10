from abc import ABC, abstractmethod
from typing import List, Optional
import models

class ICourseRepository(ABC):
    @abstractmethod
    def create_course(self, course: models.Course) -> models.Course: pass
    
    @abstractmethod
    def get_all_courses(self) -> List[models.Course]: pass
    
    @abstractmethod
    def get_course_by_id(self, course_id: int) -> Optional[models.Course]: pass
    
    # Lessons
    @abstractmethod
    def add_lesson(self, lesson: models.Lesson) -> models.Lesson: pass
    
    @abstractmethod
    def get_lessons_by_course(self, course_id: int) -> List[models.Lesson]: pass

    # Enrollments
    @abstractmethod
    def get_enrollment(self, user_id: int, course_id: int) -> Optional[models.Enrollment]: pass
    
    @abstractmethod
    def create_enrollment(self, enrollment: models.Enrollment) -> models.Enrollment: pass
    
    @abstractmethod
    def update_enrollment(self, enrollment: models.Enrollment) -> models.Enrollment: pass

    # Certificates
    @abstractmethod
    def get_certificate(self, user_id: int, course_id: int) -> Optional[models.Certificate]: pass
    
    @abstractmethod
    def create_certificate(self, certificate: models.Certificate) -> models.Certificate: pass

    # Attendance
    @abstractmethod
    def create_attendance(self, attendance: models.Attendance) -> models.Attendance: pass
    
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[models.User]: pass
