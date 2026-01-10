from abc import ABC, abstractmethod
from typing import List, Optional
import models

class IUserRepository(ABC):
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[models.User]:
        pass

    @abstractmethod
    def create(self, user: models.User) -> models.User:
        pass

    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[models.User]:
        pass

    @abstractmethod
    def update(self, user: models.User) -> models.User:
        pass
        
    @abstractmethod
    def create_profile(self, profile: models.Profile) -> models.Profile:
        pass
    
    @abstractmethod
    def get_all(self) -> List[models.User]:
        pass
