"""
Database configuration and async session management
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Load settings from .env file"""
    database_url: str 
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    gemini_api_key: str = ""
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    
    class Config:
        env_file = ".env"
        extra = "ignore" 

@lru_cache()
def get_settings():
    return Settings()

# --- DATABASE ENGINE SETUP ---
settings = get_settings()

# Prepare the URL for Asyncpg
db_url = settings.database_url
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create the Async Engine
engine = create_async_engine(
    db_url, 
    echo=True,
    connect_args={"ssl": "require"} # Required for Supabase/Vercel
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for models
Base = declarative_base()

async def get_db():
    """Dependency for FastAPI routes to handle session lifecycle"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()