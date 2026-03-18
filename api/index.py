import json
import re
import os
import io
import PyPDF2
import docx
from typing import List
from contextlib import asynccontextmanager
from google import genai
from fastapi import FastAPI, Depends, HTTPException, status, Body, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from dotenv import load_dotenv

# Import local modules
from . import models
from . import schemas
from . import auth
from .database import engine, get_db, Base, get_settings

# --- 1. CONFIGURATION ---
load_dotenv()
settings = get_settings()

if not settings.gemini_api_key:
    raise ValueError("Missing GEMINI_API_KEY in environment variables")

ai_client = genai.Client(api_key=settings.gemini_api_key)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup in Supabase
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables verified & API is Live!")
    yield

# Prepare the App with lifespan
app = FastAPI()

# CORS Fix for React (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
async def root():
    return {"message": "Job Tracker API is Online", "version": "1.0.0"}

# --- 2. RESUME PARSING ---
@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text = ""
        filename = file.filename.lower()
        
        if filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
            
            if not extracted_text.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="Could not extract text from PDF. It may be scanned. Please use a text-based file."
                )
                
        elif filename.endswith(".docx"):
            doc = docx.Document(io.BytesIO(content))
            for para in doc.paragraphs:
                extracted_text += para.text + "\n"
        elif filename.endswith(".txt"):
            extracted_text = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported format. Use PDF, DOCX, or TXT")
        
        return {"text": extracted_text.strip()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing error: {str(e)}")

# --- 3. JOB ENDPOINTS ---

# --- 3. JOB ENDPOINTS ---

@app.get("/api/jobs", response_model=List[schemas.JobResponse])
async def get_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(
        select(models.Job)
        .where(models.Job.user_id == current_user.id)
        .options(selectinload(models.Job.company))
    )
    return result.scalars().all()

@app.post("/api/jobs", response_model=schemas.JobResponse)
async def create_job(
    job: schemas.JobCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    res = await db.execute(select(models.Company).where(models.Company.name == job.company_name))
    company = res.scalar_one_or_none() or models.Company(name=job.company_name)
    if not company.id:
        db.add(company)
        await db.flush()
        
    db_job = models.Job(
        user_id=current_user.id,
        company_id=company.id,
        title=job.title,
        job_url=job.job_url,
        location=job.location,
        salary_range=job.salary_range,
        status=job.status,
        notes=job.notes
    )
    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)
    
    result = await db.execute(
        select(models.Job)
        .where(models.Job.id == db_job.id)
        .options(selectinload(models.Job.company))
    )
    return result.scalar_one()

# ADD THIS DELETE ROUTE HERE
@app.delete("/api/jobs/{job_id}")
async def delete_job(
    job_id: int, 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    result = await db.execute(
        select(models.Job).where(models.Job.id == job_id, models.Job.user_id == current_user.id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    await db.delete(job)
    await db.commit()
    return {"message": "Job deleted successfully"}

# --- 4. AI ANALYSIS ---

@app.post("/api/analyze-match")
async def analyze_match(data: dict = Body(...)):
    job_text = data.get("jobDescription", "").strip()
    resume_text = data.get("resumeText", "").strip()
    
    if not job_text or not resume_text:
        raise HTTPException(status_code=400, detail="Missing data")
    
    # SYSTEM INSTRUCTION: Keeps the response fast and strictly JSON
    sys_instruct = "You are a professional career coach. You must return ONLY a JSON object. No conversational text."
    
    prompt = f"""
    Compare this Resume and Job Description.
    RESUME: {resume_text[:4000]} # Truncate to save tokens/time
    JOB: {job_text[:4000]}
    
    Return this exact JSON format:
    {{
      "score": int, 
      "missingKeywords": ["list", "of", "strings"], 
      "resumeFix": "one specific sentence to add", 
      "strategy": "one sentence interview tip"
    }}
    """
    
    try:
        # Using the preview model for best performance in March 2026
        response = ai_client.models.generate_content(
            model='gemini-3-flash-preview', 
            contents=prompt,
            config={'system_instruction': sys_instruct}
        )
        
        # Robust JSON extraction using regex
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if not match:
            raise ValueError("AI failed to return valid JSON format")
            
        return json.loads(match.group())
        
    except Exception as e:
        print(f"Detailed AI Error: {str(e)}") # Visible in Vercel Logs
        raise HTTPException(status_code=500, detail="AI Analysis timed out or failed. Please try a shorter description.")
    
#SAVE RESUME ENDPOINT
@app.post("/api/user/save-resume")
async def save_resume(
    data: dict = Body(...), 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    text = data.get("resumeText")
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    current_user.resume_text = text
    await db.commit()
    return {"message": "Resume saved to profile!"}

# --- 5. AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.User).where(models.User.email == user.email))
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=auth.get_password_hash(user.password),
        full_name=user.full_name
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.User).where(models.User.username == form_data.username))
    user = res.scalar_one_or_none()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

#health
@app.get("/api/health")
async def health_check():
    return {"status": "online", "database": "connected"}

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=8000, reload=True)