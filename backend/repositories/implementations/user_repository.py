from sqlalchemy.orm import Session
from repositories.interfaces.user_repository_interface import IUserRepository
import models

class UserRepository(IUserRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(models.User).filter(models.User.email == email).first()

    def create(self, user: models.User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_id(self, user_id: int):
        return self.db.query(models.User).filter(models.User.id == user_id).first()
        
    def update(self, user: models.User):
        self.db.commit()
        self.db.refresh(user)
        return user

    def create_profile(self, profile: models.Profile):
        self.db.add(profile)
        self.db.commit()
        return profile
    
    def get_all(self):
        return self.db.query(models.User).all()
