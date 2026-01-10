from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dtos import schemas
from repositories.implementations.user_repository import UserRepository
from services.implementations.user_service import UserService
from typing import List

router = APIRouter()

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repo = UserRepository(db)
    return UserService(repo)

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, service: UserService = Depends(get_user_service)):
    return service.register_user(user)

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, service: UserService = Depends(get_user_service)):
    return service.login_user(user)

@router.get("/users", response_model=List[schemas.UserResponse])
def get_users(service: UserService = Depends(get_user_service)):
    return service.get_all_users()

@router.put("/profile/{user_id}", response_model=schemas.UserResponse)
def update_profile(user_id: int, profile_data: schemas.UserProfileUpdate, service: UserService = Depends(get_user_service)):
    return service.update_profile(user_id, profile_data)
