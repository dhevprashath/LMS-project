from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from models import UserSchema, UserLoginSchema, Token
from database import user_collection
from auth_utils import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_description="Register a new user", response_model=UserSchema)
async def register_user(user: UserSchema = Body(...)):
    user = jsonable_encoder(user)
    
    # Check if user already exists
    existing_user = await user_collection.find_one({"email": user["email"]})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash password
    user["password"] = get_password_hash(user["password"])
    
    new_user = await user_collection.insert_one(user)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user

@router.post("/login", response_description="Login user", response_model=Token)
async def login_user(user: UserLoginSchema = Body(...)):
    # Check if user exists
    existing_user = await user_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(user.password, existing_user["password"]):
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials"
        )

    # Create token
    access_token = create_access_token(data={"sub": existing_user["email"], "role": existing_user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
