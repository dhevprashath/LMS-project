
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

def seed_courses():
    db = SessionLocal()
    
    # Define courses to add
    courses_data = [
        {
            "title": "Java Programming Masterclass",
            "description": "Learn Java from scratch. Covers OOP, Streams, and everything you need to become a Java Developer.",
            "level": "Beginner",
            "thumbnail": "https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg",
            "total_duration": "12h",
            "resource_url": "https://www.youtube.com/watch?v=eIrMbAQSU34",
            "lessons": [
                {
                    "title": "Java Tutorial for Beginners",
                    "video_url": "https://www.youtube.com/watch?v=eIrMbAQSU34",
                    "duration": 60,
                    "content": "Introduction to Java syntax and basic concepts."
                }
            ]
        },
        {
            "title": "Python for Beginners",
            "description": "Python is the #1 programming language for Data Science and AI. Learn it now.",
            "level": "Beginner",
            "thumbnail": "https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg",
            "total_duration": "6h",
            "resource_url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
            "lessons": [
                 {
                    "title": "Python Full Course",
                    "video_url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                    "duration": 360,
                    "content": "Complete Python programming course."
                }
            ]
        },
        {
            "title": "AI Development Bootcamp",
            "description": "Dive into Artificial Intelligence and Machine Learning fundamentals.",
            "level": "Advanced",
            "thumbnail": "https://img.youtube.com/vi/JMUxmLyrhSk/maxresdefault.jpg",
            "total_duration": "10h",
            "resource_url": "https://www.youtube.com/watch?v=JMUxmLyrhSk",
            "lessons": [
                 {
                    "title": "Intro to AI",
                    "video_url": "https://www.youtube.com/watch?v=JMUxmLyrhSk",
                    "duration": 60,
                    "content": "What is AI? How does it work?"
                }
            ]
        },
        {
            "title": "ReactJS Fundamentals",
            "description": "Master React.js and build modern, interactive web applications.",
            "level": "Intermediate",
            "thumbnail": "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
            "total_duration": "5h",
            "resource_url": "https://www.youtube.com/watch?v=SqcY0GlETPk",
            "lessons": [
                 {
                    "title": "React JS Crash Course",
                    "video_url": "https://www.youtube.com/watch?v=SqcY0GlETPk",
                    "duration": 300,
                    "content": "Complete React Tutorial."
                }
            ]
        }
    ]

    print("Checking courses...")
    for data in courses_data:
        existing = db.query(models.Course).filter(models.Course.title == data["title"]).first()
        
        # Calculate duration
        duration_int = 0
        if "h" in data["total_duration"]:
             duration_int = int(data["total_duration"].replace("h", "")) * 60

        if not existing:
            print(f"Adding course: {data['title']}")
            course = models.Course(
                title=data["title"],
                description=data["description"],
                level=data["level"],
                thumbnail=data["thumbnail"],
                total_duration=duration_int,
                resource_url=data.get("resource_url")
            )
            db.add(course)
            db.commit()
            db.refresh(course)
            
            # Add Lessons
            for l_data in data["lessons"]:
                lesson = models.Lesson(
                    course_id=course.id,
                    title=l_data["title"],
                    video_url=l_data["video_url"],
                    duration=l_data["duration"],
                    content=l_data["content"]
                )
                db.add(lesson)
            db.commit()
        else:
            print(f"Updating existing course: {data['title']}")
            # Update fields if changed (specifically resource_url)
            existing.resource_url = data.get("resource_url")
            existing.thumbnail = data["thumbnail"] # Update thumbnail as well just in case
            db.commit()
            print(f"Updated resource_url for {data['title']}")

    db.close()
    print("Seed/Update complete.")

if __name__ == "__main__":
    seed_courses()
