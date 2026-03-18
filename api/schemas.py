from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from .models import JobStatus

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    created_at: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CompanyResponse(BaseModel):
    id: int
    name: str
    class Config: from_attributes = True

class JobCreate(BaseModel):
    company_name: str
    title: str
    job_url: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    status: JobStatus = JobStatus.SAVED
    notes: Optional[str] = None # <--- The JD goes here

class JobResponse(BaseModel):
    id: int
    title: str
    company: Optional[CompanyResponse]
    status: JobStatus
    location: Optional[str]
    notes: Optional[str]
    ai_match_score: Optional[float]
    created_at: datetime
    class Config: from_attributes = True