from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Normalize email
    user.email = user.email.lower()
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(email=user.email, password=hashed_password, fullname=user.fullname)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create Profile
    new_profile = models.Profile(user_id=new_user.id)
    db.add(new_profile)
    db.commit()
    
    print(f"User registered: {new_user.email}")
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    user.email = user.email.lower()
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        print(f"Login failed: User {user.email} not found")
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    if not verify_password(user.password, db_user.password):
        print(f"Login failed: Invalid password for {user.email}")
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Simple token response (returning user info as token for simplicity as requested 'no jwt unless necessary' but passlib is used)
    # Actually user requested "No JWT required (basic session-style logic is fine)"
    # But strictly speaking, returning a token that frontend stores is easiest.
    # I'll return a fake token or just the user details wrapped.
    # The Schema expects 'access_token'. I'll just use the email as a simple token or a random string.
    
    return {
        "access_token": f"user_{db_user.id}_{db_user.email}", 
        "token_type": "bearer",
        "user_id": db_user.id,
        "email": db_user.email,
        "fullname": db_user.fullname
    }

@router.get("/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.put("/profile/{user_id}", response_model=schemas.UserResponse)
def update_profile(user_id: int, profile_data: schemas.UserProfileUpdate, db: Session = Depends(get_db)):
    # Fetch User
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update User fields
    if profile_data.fullname:
        user.fullname = profile_data.fullname
    if profile_data.email:
        # Check uniqueness if email is changing
        if profile_data.email != user.email:
             existing = db.query(models.User).filter(models.User.email == profile_data.email).first()
             if existing:
                 raise HTTPException(status_code=400, detail="Email already currently in use")
             user.email = profile_data.email.lower()

    # Update Profile fields
    # Ensure profile exists (it should, but safety first)
    if not user.profile:
        new_profile = models.Profile(user_id=user.id)
        db.add(new_profile)
        db.commit()
        db.refresh(user)

    if profile_data.bio is not None:
        user.profile.bio = profile_data.bio
    if profile_data.title is not None:
        user.profile.title = profile_data.title
    if profile_data.avatar is not None:
        user.profile.avatar = profile_data.avatar
        
    db.commit()
    db.refresh(user)
    return user
