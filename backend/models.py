from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(255))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    avatar = Column(String(500), default="https://ui-avatars.com/api/?name=User&background=ramdom")
    bio = Column(Text, nullable=True)
    title = Column(String(100), default="Learner")
    social_links = Column(JSON, nullable=True) # {"twitter": "...", "linkedin": "..."}

    user = relationship("User", back_populates="profile")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    level = Column(String(50), default="Beginner")
    thumbnail = Column(String(500), nullable=True)
    resource_url = Column(String(500), nullable=True) # For external courses like YouTube/W3Schools
    total_duration = Column(Integer, default=0) # Stored in minutes/hours string or int
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lessons = relationship("Lesson", back_populates="course")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True) # Text content or HTML
    video_url = Column(String(500), nullable=True)
    duration = Column(Integer, default=15) # minutes
    
    course = relationship("Course", back_populates="lessons")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    is_completed = Column(Boolean, default=False)
    
    user = relationship("User")
    course = relationship("Course")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    status = Column(String(50), default="present") # present, absent
    date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    lesson = relationship("Lesson")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    question = Column(Text, nullable=False)
    option_a = Column(String(255))
    option_b = Column(String(255))
    option_c = Column(String(255))
    option_d = Column(String(255))
    correct_option = Column(String(10)) # 'a', 'b', 'c', 'd'

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    score = Column(Integer)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    certificate_code = Column(String(100), unique=True)
    issued_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    course = relationship("Course")
