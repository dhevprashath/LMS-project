from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from models_course import EnrollmentSchema
from database import enrollment_collection, course_collection
import bson
from typing import List

router = APIRouter()

@router.post("/{course_id}", response_description="Enroll user in a course")
async def enroll_user(course_id: str, enrollment: EnrollmentSchema = Body(...)):
    # Check if course exists
    if (course := await course_collection.find_one({"_id": bson.ObjectId(course_id)})) is None:
         raise HTTPException(status_code=404, detail=f"Course {course_id} not found")

    # Check if already enrolled
    if (existing := await enrollment_collection.find_one({"user_id": enrollment.user_id, "course_id": course_id})) is not None:
         return {"message": "Already enrolled", "id": str(existing["_id"])}

    enrollment.course_id = course_id
    enrollment = jsonable_encoder(enrollment)
    new_enrollment = await enrollment_collection.insert_one(enrollment)
    return {"message": "Enrolled successfully", "id": str(new_enrollment.inserted_id)}

@router.get("/user/{user_id}", response_description="Get user enrollments")
async def get_user_enrollments(user_id: str):
    enrollments = []
    async for enrollment in enrollment_collection.find({"user_id": user_id}):
        enrollment["id"] = str(enrollment["_id"])
        del enrollment["_id"]
        enrollments.append(enrollment)
    return enrollments

@router.post("/{course_id}/progress", response_description="Update progress")
async def update_progress(course_id: str, user_id: str = Body(..., embed=True), module_title: str = Body(..., embed=True)):
     enrollment = await enrollment_collection.find_one({"user_id": user_id, "course_id": course_id})
     if enrollment:
         current_progress = enrollment.get("progress", [])
         if module_title not in current_progress:
             current_progress.append(module_title)
             await enrollment_collection.update_one(
                 {"_id": enrollment["_id"]},
                 {"$set": {"progress": current_progress}}
             )
         return {"status": "updated", "progress": current_progress}
     raise HTTPException(status_code=404, detail="Enrollment not found")
