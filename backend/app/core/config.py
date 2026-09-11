import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Meraj Alam AI Portfolio API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Database (Supabase PostgreSQL / SQLite fallback)
    DATABASE_URL: str = "sqlite:///./local_portfolio.db"
    
    # Supabase Cloud
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Google Gemini AI
    GEMINI_API_KEY: str = ""
    
    # GitHub Integration
    GITHUB_USERNAME: str = "merajsiddieque"
    GITHUB_TOKEN: str = ""

    # Knowledge Base / Resume
    RESUME_PDF_PATH: str = ""
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000"

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def normalized_database_url(self) -> str:
        url = self.DATABASE_URL.strip()
        if not url:
            return "sqlite:///./local_portfolio.db"
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
        elif "postgresql+psycopg://" in url:
            url = url.replace("postgresql+psycopg://", "postgresql+psycopg2://", 1)
        return url

    class Config:
        env_file = ("backend/.env", ".env", "../backend/.env", "../.env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
