from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter()

@router.post("/", response_model=schemas.AttendanceResponse)
def mark_attendance(attendance: schemas.AttendanceCreate, user_id: int, db: Session = Depends(get_db)):
    # TODO: In real app, user_id comes from token.
    # Check duplicate
    existing = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id,
        models.Attendance.course_id == attendance.course_id,
        models.Attendance.lesson_id == attendance.lesson_id
    ).first()
    
    if existing:
        return existing
    
    db_attendance = models.Attendance(**attendance.dict(), user_id=user_id)
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

from datetime import timedelta, date

@router.get("/{user_id}/streak")
def get_user_streak(user_id: int, db: Session = Depends(get_db)):
    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id
    ).order_by(models.Attendance.date.desc()).all()
    
    if not attendance_records:
        return {"streak": 0}
        
    streak = 0
    today = date.today()
    last_date = None
    
    # Simple streak logic
    # Set of unique dates attended
    attended_dates = sorted(list(set([record.date.date() for record in attendance_records])), reverse=True)
    
    if not attended_dates:
         return {"streak": 0}

    # Check if streak is active (attended today or yesterday)
    if attended_dates[0] != today and attended_dates[0] != today - timedelta(days=1):
        return {"streak": 0}
        
    current = today
    # Adjust start if they haven't attended today yet but kept streak from yesterday
    if attended_dates[0] == today - timedelta(days=1):
        current = today - timedelta(days=1)
        
    for d in attended_dates:
        if d == current:
            streak += 1
            current -= timedelta(days=1)
        else:
            break
            
    return {"streak": streak}

@router.get("/{user_id}", response_model=List[schemas.AttendanceResponse])
def get_user_attendance(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Attendance).filter(models.Attendance.user_id == user_id).all()
