from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.path_generator import generate_schedule
from utils.pdf_generator import create_learning_path_pdf

router = APIRouter(prefix="/learning-path", tags=["Learning Path"])

class PathRequest(BaseModel):
    course_name: str
    days: int
    hours_per_day: int

@router.post("/generate")
async def generate_learning_path(request: PathRequest):
    return generate_schedule(request.course_name, request.days, request.hours_per_day)

@router.post("/download")
async def download_learning_path_pdf(request: PathRequest):
    data = generate_schedule(request.course_name, request.days, request.hours_per_day)
    pdf_buffer = create_learning_path_pdf(data)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={request.course_name}_path.pdf"}
    )
