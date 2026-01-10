from services.interfaces.certificate_service_interface import ICertificateService
from repositories.interfaces.certificate_repository_interface import ICertificateRepository
from dtos import schemas
import models
from fastapi import HTTPException
import uuid
# Note: StreamingResponse needs to be handled in the controller if possible, 
# or we return the buffer/generator here. The interface said Any.
# Better to return the buffer.

class CertificateService(ICertificateService):
    def __init__(self, cert_repo: ICertificateRepository):
        self.cert_repo = cert_repo

    def get_download_stream(self, certificate_code: str):
        cert = self.cert_repo.get_by_code(certificate_code)
        if not cert:
            raise HTTPException(status_code=404, detail="Certificate not found")
            
        user = self.cert_repo.get_user_by_id(cert.user_id)
        course = self.cert_repo.get_course_by_id(cert.course_id)
        
        from utils.pdf_generator import generate_certificate_pdf
        pdf_buffer = generate_certificate_pdf(user.fullname, course.title, str(cert.issued_date), cert.certificate_code)
        
        return pdf_buffer

    def issue_certificate(self, course_id: int, user_id: int) -> schemas.CertificateResponse:
        existing = self.cert_repo.get_by_user_and_course(user_id, course_id)
        if existing:
            return existing
            
        cert_code = str(uuid.uuid4()).split('-')[0].upper()
        cert = models.Certificate(
            user_id=user_id,
            course_id=course_id,
            certificate_code=f"LMS-{cert_code}"
        )
        saved_cert = self.cert_repo.create(cert)
        
        # Generate PDF (side effect)
        try:
            user = self.cert_repo.get_user_by_id(user_id)
            course = self.cert_repo.get_course_by_id(course_id)
            from utils.pdf_generator import generate_certificate_pdf
            generate_certificate_pdf(user.fullname, course.title, saved_cert.issued_date, saved_cert.certificate_code)
        except Exception as e:
            print(f"PDF Generation failed: {e}")
            
        return saved_cert

    def get_user_certificates(self, user_id: int) -> list[schemas.CertificateResponse]:
        return self.cert_repo.get_all_by_user(user_id)

    def get_certificate(self, course_id: int, user_id: int) -> schemas.CertificateResponse:
        cert = self.cert_repo.get_by_user_and_course(user_id, course_id)
        if not cert:
            raise HTTPException(status_code=404, detail="Certificate not found")
        return cert
