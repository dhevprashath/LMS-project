import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.lms_db

user_collection = database.get_collection("users")
course_collection = database.get_collection("courses")
enrollment_collection = database.get_collection("enrollments")
student_collection = database.get_collection("students")

# Helper to fix ObjectId serialization if needed
def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "fullname": student["fullname"],
        "email": student["email"],
        "course_of_study": student["course_of_study"],
        "year": student["year"],
        "GPA": student["GPA"],
    }
