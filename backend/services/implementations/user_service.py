from services.interfaces.user_service_interface import IUserService
from repositories.interfaces.user_repository_interface import IUserRepository
from dtos import schemas
import models
from passlib.context import CryptContext
from fastapi import HTTPException, status

class UserService(IUserService):
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo
        self.pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

    def _verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def _get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def register_user(self, user_create: schemas.UserCreate) -> schemas.UserResponse:
        # Convert DTO to Entity logic
        user_create.email = user_create.email.lower()
        if self.user_repo.get_by_email(user_create.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = self._get_password_hash(user_create.password)
        new_user = models.User(
            email=user_create.email, 
            password=hashed_password, 
            fullname=user_create.fullname
        )
        saved_user = self.user_repo.create(new_user)
        
        # Create Profile
        new_profile = models.Profile(user_id=saved_user.id)
        self.user_repo.create_profile(new_profile)
        
        return saved_user

    def login_user(self, user_login: schemas.UserLogin) -> schemas.Token:
        user_login.email = user_login.email.lower()
        user = self.user_repo.get_by_email(user_login.email)
        
        if not user or not self._verify_password(user_login.password, user.password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
            
        return {
            "access_token": f"user_{user.id}_{user.email}", 
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email,
            "fullname": user.fullname
        }

    def get_all_users(self) -> list[schemas.UserResponse]:
        return self.user_repo.get_all()

    def update_profile(self, user_id: int, profile_update: schemas.UserProfileUpdate) -> schemas.UserResponse:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if profile_update.fullname:
            user.fullname = profile_update.fullname
            
        if profile_update.email:
            if profile_update.email != user.email:
                existing = self.user_repo.get_by_email(profile_update.email)
                if existing:
                    raise HTTPException(status_code=400, detail="Email already currently in use")
                user.email = profile_update.email.lower()

        # Update Profile fields
        # user.profile should be loaded by SQLAlchemy if accessed within session
        # If not, we might need eager loading in repo, but lazy loading works if session is open.
        if not user.profile:
             new_profile = models.Profile(user_id=user.id)
             self.user_repo.create_profile(new_profile)
             # Refreshing user to get profile relation
             user = self.user_repo.get_by_id(user_id)
        
        if profile_update.bio is not None:
            user.profile.bio = profile_update.bio
        if profile_update.title is not None:
            user.profile.title = profile_update.title
        if profile_update.avatar is not None:
            user.profile.avatar = profile_update.avatar
            
        return self.user_repo.update(user)
