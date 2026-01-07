from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from models import CourseSchema
from database import course_collection
import bson

router = APIRouter()

@router.post("/", response_description="Add new course")
async def create_course(course: CourseSchema = Body(...)):
    course = jsonable_encoder(course)
    new_course = await course_collection.insert_one(course)
    course["id"] = str(new_course.inserted_id)
    return course

@router.get("/", response_description="List all courses")
async def list_courses():
    courses = []
    async for course in course_collection.find():
        course["id"] = str(course["_id"])
        del course["_id"]
        courses.append(course)
    return courses

@router.get("/{id}", response_description="Get a single course")
async def show_course(id: str):
    try:
        if (course := await course_collection.find_one({"_id": bson.ObjectId(id)})) is not None:
            course["id"] = str(course["_id"])
            del course["_id"]
            return course
    except:
        pass
    raise HTTPException(status_code=404, detail=f"Course {id} not found")
