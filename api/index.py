import json
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
import models
import schemas
import auth
from database import engine, get_db, Base

# --- 1. CONFIGURATION ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env file")

ai_client = genai.Client(api_key=GEMINI_API_KEY)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created & API is Live!")
    yield

app = FastAPI(title="Job Tracker API", lifespan=lifespan)

# CORS Fix for React (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Job Tracker API is Online"}

# --- 2. RESUME PARSING (PDF, DOCX, TXT) ---
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text = ""
        filename = file.filename.lower()
        
        if filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:  # Only add if text was extracted
                    extracted_text += page_text + "\n"
            
            # If no text extracted, PDF might be scanned/image-based
            if not extracted_text.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="Could not extract text from PDF. It may be scanned/image-based. Please use a text-based PDF or convert to .txt"
                )
                
        elif filename.endswith(".docx"):
            doc = docx.Document(io.BytesIO(content))
            for para in doc.paragraphs:
                extracted_text += para.text + "\n"
        elif filename.endswith(".txt"):
            extracted_text = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF, DOCX, or TXT")
        
        final_text = extracted_text.strip()
        
        if not final_text:
            raise HTTPException(status_code=400, detail="No text found in file")
            
        print(f"Extracted {len(final_text)} characters from {filename}")
        return {"text": final_text}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Parse Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Could not read the file: {str(e)}")
# --- 3. JOB ENDPOINTS (CREATE, READ, UPDATE, DELETE) ---

@app.get("/jobs", response_model=List[schemas.JobResponse])
async def get_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Job).options(selectinload(models.Job.company)))
    return result.scalars().all()

@app.post("/jobs", response_model=schemas.JobResponse)
async def create_job(
    job: schemas.JobCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    # Handle Company
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
    
    # RELOAD WITH EAGER LOADING
    await db.refresh(db_job)
    result = await db.execute(
        select(models.Job)
        .where(models.Job.id == db_job.id)
        .options(selectinload(models.Job.company))
    )
    return result.scalar_one()

@app.put("/jobs/{job_id}", response_model=schemas.JobResponse)
async def update_job(job_id: int, job_update: schemas.JobCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Job).where(models.Job.id == job_id).options(selectinload(models.Job.company))
    )
    db_job = result.scalar_one_or_none()
    
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Update Company name if it changed
    c_res = await db.execute(select(models.Company).where(models.Company.name == job_update.company_name))
    company = c_res.scalar_one_or_none() or models.Company(name=job_update.company_name)
    if not company.id:
        db.add(company)
        await db.flush()

    # Explicitly update fields
    db_job.company_id = company.id
    db_job.title = job_update.title
    db_job.job_url = job_update.job_url
    db_job.location = job_update.location
    db_job.salary_range = job_update.salary_range
    db_job.status = job_update.status
    db_job.notes = job_update.notes
    
    await db.commit()
    await db.refresh(db_job)
    return db_job

@app.delete("/jobs/{job_id}")
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Job).where(models.Job.id == job_id))
    job = result.scalar_one_or_none()
    if job:
        await db.delete(job)
        await db.commit()
    return {"message": "Deleted"}

# --- 4. AI ANALYSIS ENDPOINT (MOCK VERSION) ---
'''/*
@app.post("/analyze-match")
async def analyze_match(data: dict = Body(...)):
    job_text = data.get("jobDescription", "")
    resume_text = data.get("resumeText", "")
    
    import random
    
    job_title = data.get("jobTitle", "")
    
    strategies = [
        "Prepare a story about a time you optimized system performance under pressure.",
        "Focus on your experience working in cross-functional teams.",
        "Highlight a project where you took ownership from concept to deployment.",
        "Prepare examples of how you've handled production incidents.",
        "Emphasize your experience mentoring junior engineers."
    ]
    
    fixes = [
        f"Add a bullet point highlighting your experience with distributed systems.",
        f"Include specific metrics about performance improvements you've achieved.",
        f"Mention your experience with the specific tech stack they're using.",
        f"Add examples of system design experience at scale.",
        f"Highlight collaborative projects with product and design teams."
    ]
    
    return {
        "score": random.randint(78, 94),
        "missingKeywords": random.sample(["Docker", "Kubernetes", "CI/CD", "TypeScript", "GraphQL", "Microservices", "AWS", "System Design"], 3),
        "resumeFix": random.choice(fixes),
        "strategy": random.choice(strategies)
    }
'''
#real gemini api version below
@app.post("/analyze-match")
async def analyze_match(data: dict = Body(...)):
    job_text = data.get("jobDescription", "")
    resume_text = data.get("resumeText", "")
    
    if not job_text or not resume_text:
        raise HTTPException(status_code=400, detail="Missing job description or resume")
    
    prompt = f"""
    You are an expert technical recruiter. Analyze how well this candidate's resume matches the job description.
    
    RESUME:
    {resume_text}
    
    JOB DESCRIPTION:
    {job_text}
    
    Return ONLY a valid JSON object (no markdown, no backticks) with these exact keys:
    - "score": integer between 0-100
    - "missingKeywords": array of 3-5 important missing technical skills
    - "resumeFix": one specific actionable suggestion to improve the resume for this role
    - "strategy": one concrete interview preparation tip based on the job requirements
    
    Example format: {{"score": 85, "missingKeywords": ["Docker", "AWS"], "resumeFix": "Add metrics...", "strategy": "Prepare examples..."}}
    """
    
    try:
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',  
            contents=prompt
        )
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Gemini Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")
# --- 5. AUTH ENDPOINTS ---
@app.post("/auth/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
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

@app.post("/auth/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.User).where(models.User.username == form_data.username))
    user = res.scalar_one_or_none()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)