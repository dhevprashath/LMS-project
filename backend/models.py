from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Course Content Models ---
class Lesson(BaseModel):
    title: str
    video_url: Optional[str] = None
    content: Optional[str] = None
    duration_minutes: int = 15

class Module(BaseModel):
    title: str
    lessons: List[Lesson] = []

class CourseSchema(BaseModel):
    title: str = Field(...)
    description: str = Field(...)
    level: str = Field(..., pattern="^(Beginner|Intermediate|Advanced)$")
    thumbnail: Optional[str] = None
    modules: List[Module] = []
    total_duration: int = 0  # Calculated automatically

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Python for Beginners",
                "description": "Start your coding journey",
                "level": "Beginner",
                "modules": [{
                    "title": "Basics",
                    "lessons": [{"title": "Variables", "duration_minutes": 10}]
                }]
            }
        }
    }

# --- Single User Tracking Models ---
class Enrollment(BaseModel):
    course_id: str
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active" # active, completed

class Attendance(BaseModel):
    course_id: str
    date: datetime = Field(default_factory=datetime.utcnow)
    status: str = "present"

class Assessment(BaseModel):
    course_id: str
    module_title: str
    score: int
    passed: bool
    date: datetime = Field(default_factory=datetime.utcnow)

class CertificateRequest(BaseModel):
    course_id: str
    course_title: str
