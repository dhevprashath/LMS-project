from fastapi import APIRouter, Body, HTTPException, status
from models import Enrollment, Attendance, Assessment
from database import database
from bson import ObjectId
from datetime import datetime

router = APIRouter()
enrollment_collection = database.get_collection("enrollments")
attendance_collection = database.get_collection("attendance")
assessment_collection = database.get_collection("assessments")
course_collection = database.get_collection("courses")

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    # Helper to count documents
    total_courses = await course_collection.count_documents({})
    enrolled_count = await enrollment_collection.count_documents({})
    completed_courses = await enrollment_collection.count_documents({"status": "completed"})
    
    # Calculate attendance percentage (Mock calculation for single user)
    present_days = await attendance_collection.count_documents({"status": "present"})
    total_days = max(1, present_days + 5) # Dummy logic for total days
    attendance_pct = int((present_days / total_days) * 100)

    return {
        "total_courses": total_courses,
        "enrolled_courses": enrolled_count,
        "completed_courses": completed_courses,
        "attendance_percentage": attendance_pct,
        "certificates_earned": completed_courses # 1 cert per completed course
    }

@router.post("/enroll")
async def enroll_course(enrollment: Enrollment = Body(...)):
    # Check if already enrolled
    existing = await enrollment_collection.find_one({"course_id": enrollment.course_id})
    if existing:
        return {"message": "Already enrolled"}
    
    await enrollment_collection.insert_one(enrollment.dict())
    return {"message": "Enrolled successfully"}

@router.post("/attendance")
async def mark_attendance(attendance: Attendance = Body(...)):
    await attendance_collection.insert_one(attendance.dict())
    return {"message": "Attendance marked"}

@router.get("/enrollments")
async def get_my_courses():
    cursor = enrollment_collection.find({})
    enrollments = await cursor.to_list(length=100)
    
    # Fetch details for each course
    results = []
    for enroll in enrollments:
        if "course_id" in enroll:
             # Find course info
             try:
                course = await course_collection.find_one({"_id": ObjectId(enroll["course_id"])})
                if course:
                    course["id"] = str(course["_id"])
                    del course["_id"]
                    results.append(course)
             except:
                 pass
    return results
