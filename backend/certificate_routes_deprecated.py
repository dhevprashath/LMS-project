from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import uuid

router = APIRouter()

from fastapi.responses import StreamingResponse

@router.get("/download/{certificate_code}")
def download_certificate(certificate_code: str, db: Session = Depends(get_db)):
    # Find certificate
    cert = db.query(models.Certificate).filter(models.Certificate.certificate_code == certificate_code).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
        
    user = db.query(models.User).filter(models.User.id == cert.user_id).first()
    course = db.query(models.Course).filter(models.Course.id == cert.course_id).first()
    
    from utils.pdf_generator import generate_certificate_pdf
    pdf_buffer = generate_certificate_pdf(user.fullname, course.title, str(cert.issued_date), cert.certificate_code)
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=Certificate-{certificate_code}.pdf"}
    )

@router.post("/{course_id}/issue", response_model=schemas.CertificateResponse)
def issue_certificate(course_id: int, user_id: int, db: Session = Depends(get_db)):
    # Check if already issued
    existing = db.query(models.Certificate).filter(
        models.Certificate.user_id == user_id,
        models.Certificate.course_id == course_id
    ).first()
    
    if existing:
        return existing
        
    # Verify course completion (optional logic)
    
    cert_code = str(uuid.uuid4()).split('-')[0].upper()
    
    cert = models.Certificate(
        user_id=user_id,
        course_id=course_id,
        certificate_code=f"LMS-{cert_code}"
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)

    # Generate PDF
    user = db.query(models.User).filter(models.User.id == user_id).first()
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    
    from utils.pdf_generator import generate_certificate_pdf
    generate_certificate_pdf(user.fullname, course.title, cert.issued_date, cert.certificate_code)

    return cert

@router.get("/user/{user_id}", response_model=list[schemas.CertificateResponse])
def get_user_certificates(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()

@router.get("/{course_id}/{user_id}", response_model=schemas.CertificateResponse)
def get_certificate(course_id: int, user_id: int, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter(
        models.Certificate.user_id == user_id,
        models.Certificate.course_id == course_id
    ).first()
    
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert

    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=Certificate-{certificate_code}.pdf"}
    )
