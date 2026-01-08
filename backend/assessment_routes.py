from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter()

# --- Create Question ---
@router.post("/", response_model=schemas.AssessmentResponse)
def create_question(question: schemas.AssessmentCreate, course_id: int, db: Session = Depends(get_db)):
    db_question = models.Assessment(**question.dict(), course_id=course_id)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# --- Get Questions ---
@router.get("/{course_id}", response_model=List[schemas.AssessmentResponse])
def get_questions(course_id: int, db: Session = Depends(get_db)):
    return db.query(models.Assessment).filter(models.Assessment.course_id == course_id).all()

# --- Generate Quiz ---
class QuizRequest(schemas.BaseModel):
    topic: str

@router.post("/generate", response_model=List[schemas.AssessmentCreate])
def generate_quiz(request: QuizRequest):
    from services.quiz_generator import generate_quiz_questions
    questions = generate_quiz_questions(request.topic)
    return questions

# --- Submit Result ---
@router.post("/{course_id}/submit", response_model=schemas.AssessmentResultResponse)
def submit_assessment(course_id: int, user_id: int, score: int, db: Session = Depends(get_db)):
    # Simple submission, logic to calculate score could be here if answers were sent
    result = models.AssessmentResult(
        course_id=course_id,
        user_id=user_id,
        score=score
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result
