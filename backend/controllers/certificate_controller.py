from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from dtos import schemas
from repositories.implementations.certificate_repository import CertificateRepository
from services.implementations.certificate_service import CertificateService
from typing import List

router = APIRouter()

def get_certificate_service(db: Session = Depends(get_db)) -> CertificateService:
    repo = CertificateRepository(db)
    return CertificateService(repo)

@router.get("/download/{certificate_code}")
def download_certificate(certificate_code: str, service: CertificateService = Depends(get_certificate_service)):
    pdf_buffer = service.get_download_stream(certificate_code)
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=Certificate-{certificate_code}.pdf"}
    )

@router.post("/{course_id}/issue", response_model=schemas.CertificateResponse)
def issue_certificate(course_id: int, user_id: int, service: CertificateService = Depends(get_certificate_service)):
    return service.issue_certificate(course_id, user_id)

@router.get("/user/{user_id}", response_model=List[schemas.CertificateResponse])
def get_user_certificates(user_id: int, service: CertificateService = Depends(get_certificate_service)):
    certs = service.get_user_certificates(user_id)
    return certs

@router.get("/{course_id}/{user_id}", response_model=schemas.CertificateResponse)
def get_certificate(course_id: int, user_id: int, service: CertificateService = Depends(get_certificate_service)):
    return service.get_certificate(course_id, user_id)
