from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from database import get_db
from dtos import schemas
from repositories.implementations.course_repository import CourseRepository
from services.implementations.course_service import CourseService
from typing import List

router = APIRouter()

def get_course_service(db: Session = Depends(get_db)) -> CourseService:
    repo = CourseRepository(db)
    return CourseService(repo)

@router.post("/", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, service: CourseService = Depends(get_course_service)):
    return service.create_course(course)

@router.get("/", response_model=List[schemas.CourseResponse])
def get_courses(service: CourseService = Depends(get_course_service)):
    return service.get_courses()

@router.get("/{course_id}", response_model=schemas.CourseResponse)
def get_course(course_id: int, service: CourseService = Depends(get_course_service)):
    return service.get_course(course_id)

@router.post("/{course_id}/lessons", response_model=schemas.LessonResponse)
def add_lesson(course_id: int, lesson: schemas.LessonCreate, service: CourseService = Depends(get_course_service)):
    return service.add_lesson(course_id, lesson)

@router.get("/{course_id}/lessons", response_model=List[schemas.LessonResponse])
def get_lessons(course_id: int, service: CourseService = Depends(get_course_service)):
    return service.get_lessons(course_id)

@router.post("/{course_id}/enroll", response_model=schemas.EnrollmentResponse)
def enroll_course(course_id: int, user_id: int = Body(..., embed=True), service: CourseService = Depends(get_course_service)):
    return service.enroll_course(course_id, user_id)

@router.get("/{course_id}/status/{user_id}", response_model=schemas.EnrollmentResponse)
def get_enrollment_status(course_id: int, user_id: int, service: CourseService = Depends(get_course_service)):
    return service.get_status(course_id, user_id)

@router.post("/{course_id}/complete", response_model=schemas.CertificateResponse)
def complete_course(course_id: int, user_id: int = Body(..., embed=True), service: CourseService = Depends(get_course_service)):
    return service.complete_course(course_id, user_id)
