from pydantic import BaseModel, Field
from typing import List, Optional

class CourseModule(BaseModel):
    title: str
    video_url: Optional[str] = None
    content: Optional[str] = None # text content or doc link
    duration: str

class CourseSchema(BaseModel):
    title: str = Field(...)
    description: str = Field(...)
    instructor: str = Field(...)
    thumbnail: Optional[str] = None
    category: str = Field(default="Development")
    modules: List[CourseModule] = []
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Introduction to React",
                "description": "Learn the basics of React.js",
                "instructor": "John Doe",
                "thumbnail": "https://example.com/image.png",
                "category": "Development",
                "modules": [
                    {
                        "title": "Setup",
                        "video_url": "https://youtu.be/xxx",
                        "duration": "10 mins"
                    }
                ]
            }
        }
    }

class CourseUpdateSchema(BaseModel):
    title: Optional[str]
    description: Optional[str]
    instructor: Optional[str]
    thumbnail: Optional[str]

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Introduction to React Hooks",
                "description": "Learn modern React"
            }
        }
    }

class EnrollmentSchema(BaseModel):
    user_id: str
    course_id: str
    progress: List[str] = []
    is_completed: bool = False
    enrolled_at: Optional[str] = None
