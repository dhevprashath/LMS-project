from abc import ABC, abstractmethod
from typing import List, Any
from dtos import schemas

class ICertificateService(ABC):
    @abstractmethod
    def get_download_stream(self, certificate_code: str) -> Any: pass
    
    @abstractmethod
    def issue_certificate(self, course_id: int, user_id: int) -> schemas.CertificateResponse: pass
    
    @abstractmethod
    def get_user_certificates(self, user_id: int) -> List[schemas.CertificateResponse]: pass
    
    @abstractmethod
    def get_certificate(self, course_id: int, user_id: int) -> schemas.CertificateResponse: pass
