from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# --- ALL PYDANTIC MODELS HERE ---

# User
class UserCreate(BaseModel):
    fullname: Optional[str] = None
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    fullname: Optional[str] = None
    email: EmailStr
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    avatar: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    fullname: Optional[str] = None

# Lesson
class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration: int = 15

class LessonResponse(LessonCreate):
    id: int
    course_id: int

    class Config:
        from_attributes = True

# Course
class CourseCreate(BaseModel):
    title: str
    description: str
    level: str = "Beginner"
    thumbnail: Optional[str] = None
    resource_url: Optional[str] = None
    total_duration: int = 0
    # Lessons can be created separately or nested if needed, simplified here

class CourseResponse(CourseCreate):
    id: int
    created_at: datetime
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True

# Enrollment
class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentResponse(EnrollmentBase):
    id: int
    user_id: int
    enrolled_at: datetime
    is_completed: bool
    
    class Config:
        from_attributes = True

# Attendance
class AttendanceCreate(BaseModel):
    course_id: Optional[int] = None 
    lesson_id: Optional[int] = None

    status: str = "present"

class AttendanceResponse(AttendanceCreate):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

# Assessment
class AssessmentCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str # 'a', 'b', 'c', 'd'

class AssessmentResponse(AssessmentCreate):
    id: int
    course_id: int
    
    class Config:
        from_attributes = True

# Assessment Result
class AssessmentResultBase(BaseModel):
    course_id: int
    score: int

class AssessmentResultResponse(AssessmentResultBase):
    id: int
    user_id: int
    submitted_at: datetime

    class Config:
        from_attributes = True

# Certificate
class CertificateCourse(BaseModel):
    title: str
    class Config:
        from_attributes = True

class CertificateResponse(BaseModel):
    id: int
    course_id: int
    certificate_code: str
    issued_date: datetime
    user_id: int
    course: Optional[CertificateCourse] = None

    class Config:
        from_attributes = True
