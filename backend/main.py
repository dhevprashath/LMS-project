from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import courses, features

app = FastAPI(title="LMS API (No Auth)", description="Backend for Single-User LMS", version="2.0.0")

# CORS Configuration
origins = ["*"] # Public API

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the LMS Public API"}

app.include_router(courses.router, prefix="/courses", tags=["Courses"])
app.include_router(features.router, prefix="/api", tags=["Features"])
