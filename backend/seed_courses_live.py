import asyncio
from database import course_collection
from models_course import CourseSchema, CourseModule

async def seed_data():
    # Clear existing courses for demo
    await course_collection.delete_many({})
    
    courses = [
        {
            "title": "Introduction to React",
            "description": "Master React.js from scratch. This course covers everything from components to hooks.",
            "instructor": "Sarah Smith",
            "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
            "category": "Development",
            "modules": [
                {"title": "1. Introduction & Setup", "video_url": "w7ejDZ8SWv8", "duration": "10:00"},
                {"title": "2. Components & Props", "video_url": "kVeOpcw4GWY", "duration": "15:30"},
                {"title": "3. State & Lifecycle", "video_url": "dGcsHMXbSOA", "duration": "20:00"}
            ]
        },
        {
            "title": "Python for Data Science",
            "description": "Learn Python for data analysis and machine learning.",
            "instructor": "Mike Johnson",
            "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
            "category": "Data Science",
            "modules": [
                {"title": "1. Python Basics", "video_url": "_uQrJ0TkZlc", "duration": "12:00"},
                {"title": "2. NumPy & Pandas", "video_url": "r-uOLxNrNk4", "duration": "25:00"}
            ]
        },
        {
            "title": "Digital Marketing 101",
            "description": "Basics of SEO, SEM, and Social Media Marketing.",
            "instructor": "Jessica Brown",
            "thumbnail": "https://cdn-icons-png.flaticon.com/512/1998/1998087.png",
            "category": "Marketing",
            "modules": [
                {"title": "1. What is Digital Marketing?", "video_url": "bixR-KIJKYM", "duration": "08:00"},
            ]
        }
    ]

    for course_data in courses:
        modules = [CourseModule(**m) for m in course_data["modules"]]
        course_data["modules"] = modules
        # Create without validation for quick seeding or use proper schema
        # Inserting dict directly to avoid pydantic async complexity in simple script
        course_data["modules"] = [m.dict() for m in modules]
        await course_collection.insert_one(course_data)
        print(f"Inserted: {course_data['title']}")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_data())
