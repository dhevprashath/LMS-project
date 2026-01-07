import asyncio
from database import course_collection
import os

courses = [
    {
        "title": "Python Programming Masterclass",
        "description": "Learn Python from scratch to advanced. Covers Data Science and Web Dev.",
        "level": "Beginner",
        "total_duration": 120,
        "modules": [
            {
                "title": "Introduction to Python",
                "lessons": [
                    {"title": "Installing Python", "duration_minutes": 10},
                    {"title": "Variables and Types", "duration_minutes": 15}
                ]
            },
            {
                "title": "Control Flow",
                "lessons": [
                    {"title": "If/Else Statements", "duration_minutes": 20},
                    {"title": "Loops", "duration_minutes": 25}
                ]
            }
        ]
    },
    {
        "title": "React.js for Modern Web Dev",
        "description": "Build interactive UIs with React and Hooks.",
        "level": "Intermediate",
        "total_duration": 180,
         "modules": [
            {
                "title": "React Basics",
                "lessons": [
                    {"title": "Components & Props", "duration_minutes": 30},
                    {"title": "State & Hooks", "duration_minutes": 45}
                ]
            }
        ]
    },
    {
        "title": "Advanced System Design",
        "description": "Learn how to architect scalable systems.",
        "level": "Advanced", 
        "total_duration": 200,
        "modules": []
    }
]

async def seed_data():
    print("Seeding database...")
    # Clear existing courses to prevent dupes during dev
    await course_collection.delete_many({})
    
    result = await course_collection.insert_many(courses)
    print(f"Inserted {len(result.inserted_ids)} courses.")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_data())
