from abc import ABC, abstractmethod
from dtos import schemas
from typing import List

class IUserService(ABC):
    @abstractmethod
    def register_user(self, user_create: schemas.UserCreate) -> schemas.UserResponse:
        pass
        
    @abstractmethod
    def login_user(self, user_login: schemas.UserLogin) -> schemas.Token:
        pass
        
    @abstractmethod
    def get_all_users(self) -> List[schemas.UserResponse]:
        pass
        
    @abstractmethod
    def update_profile(self, user_id: int, profile_update: schemas.UserProfileUpdate) -> schemas.UserResponse:
        pass
