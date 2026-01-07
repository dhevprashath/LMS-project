from fastapi import APIRouter, HTTPException
from database import enrollment_collection, course_collection
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
import io
from fastapi.responses import StreamingResponse
import bson

router = APIRouter()

@router.get("/download/{course_id}/{user_id}")
async def download_certificate(course_id: str, user_id: str):
    # Verify enrollment & completion
    enrollment = await enrollment_collection.find_one({"user_id": user_id, "course_id": course_id})
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    course = await course_collection.find_one({"_id": bson.ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # In a real app, check if progress is 100%. For demo, allow download if enrolled.
    
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=landscape(letter))
    width, height = landscape(letter)
    
    # Border
    c.setStrokeColor(colors.gold)
    c.setLineWidth(5)
    c.rect(30, 30, width-60, height-60)
    
    # Content
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width/2, height-100, "Certificate of Completion")
    
    c.setFont("Helvetica", 24)
    c.drawCentredString(width/2, height-200, "This is to certify that")
    
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(width/2, height-250, "Student Name") # In real app, fetch user name
    
    c.setFont("Helvetica", 24)
    c.drawCentredString(width/2, height-320, "has successfully completed the course")
    
    c.setFont("Helvetica-BoldOblique", 28)
    c.setFillColor(colors.blue)
    c.drawCentredString(width/2, height-370, course["title"])
    
    c.setFont("Helvetica", 14)
    c.setFillColor(colors.black)
    c.drawCentredString(width/2, 100, "LMS Academy Official Certificate")
    
    c.save()
    buffer.seek(0)
    
    headers = {
        'Content-Disposition': f'attachment; filename="certificate_{course_id}.pdf"'
    }
    return StreamingResponse(buffer, headers=headers, media_type='application/pdf')
