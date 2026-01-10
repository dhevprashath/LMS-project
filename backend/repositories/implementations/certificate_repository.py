from sqlalchemy.orm import Session
from repositories.interfaces.certificate_repository_interface import ICertificateRepository
import models

class CertificateRepository(ICertificateRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_by_code(self, code: str):
        return self.db.query(models.Certificate).filter(models.Certificate.certificate_code == code).first()
    
    def get_by_user_and_course(self, user_id: int, course_id: int):
        return self.db.query(models.Certificate).filter(
            models.Certificate.user_id == user_id,
            models.Certificate.course_id == course_id
        ).first()
    
    def create(self, certificate: models.Certificate):
        self.db.add(certificate)
        self.db.commit()
        self.db.refresh(certificate)
        return certificate
    
    def get_all_by_user(self, user_id: int):
        return self.db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()
        
    def get_user_by_id(self, user_id: int):
        return self.db.query(models.User).filter(models.User.id == user_id).first()
        
    def get_course_by_id(self, course_id: int):
        return self.db.query(models.Course).filter(models.Course.id == course_id).first()
