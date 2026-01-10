from abc import ABC, abstractmethod
from typing import List, Optional
import models

class ICertificateRepository(ABC):
    @abstractmethod
    def get_by_code(self, code: str) -> Optional[models.Certificate]: pass
    
    @abstractmethod
    def get_by_user_and_course(self, user_id: int, course_id: int) -> Optional[models.Certificate]: pass
    
    @abstractmethod
    def create(self, certificate: models.Certificate) -> models.Certificate: pass
    
    @abstractmethod
    def get_all_by_user(self, user_id: int) -> List[models.Certificate]: pass
    
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[models.User]: pass
    
    @abstractmethod
    def get_course_by_id(self, course_id: int) -> Optional[models.Course]: pass
