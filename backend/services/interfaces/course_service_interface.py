from abc import ABC, abstractmethod
from typing import List
from dtos import schemas

class ICourseService(ABC):
    @abstractmethod
    def create_course(self, course: schemas.CourseCreate) -> schemas.CourseResponse: pass
    
    @abstractmethod
    def get_courses(self) -> List[schemas.CourseResponse]: pass
    
    @abstractmethod
    def get_course(self, course_id: int) -> schemas.CourseResponse: pass
    
    @abstractmethod
    def add_lesson(self, course_id: int, lesson: schemas.LessonCreate) -> schemas.LessonResponse: pass
    
    @abstractmethod
    def get_lessons(self, course_id: int) -> List[schemas.LessonResponse]: pass
    
    @abstractmethod
    def enroll_course(self, course_id: int, user_id: int) -> schemas.EnrollmentResponse: pass
    
    @abstractmethod
    def get_status(self, course_id: int, user_id: int) -> schemas.EnrollmentResponse: pass
    
    @abstractmethod
    def complete_course(self, course_id: int, user_id: int) -> schemas.CertificateResponse: pass
