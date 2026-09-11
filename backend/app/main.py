import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.init_db import init_db
from app.api.v1.router import api_v1_router
from app.services.resume_loader import resume_kb

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database schemas & default seed data...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.warning(f"Database initialization encountered an error: {e}")

    logger.info("Loading resume into knowledge base...")
    try:
        loaded = resume_kb.load_from_pdf()
        if loaded:
            logger.info(f"Resume knowledge base loaded: {resume_kb.get_metadata()}")
        else:
            logger.warning("Resume knowledge base could not find a valid PDF file. Will search again when requests arrive.")
    except Exception as e:
        logger.error(f"Error loading resume into knowledge base: {e}")

    yield
    logger.info("Portfolio API shutting down gracefully.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance backend API for Meraj Alam's AI Portfolio & SaaS Platform",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routers: Both at root (for /projects, /blog, /contact, /github-stats, /chat) and /api/v1
app.include_router(api_v1_router)
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

from fastapi.responses import RedirectResponse

@app.get("/resume", tags=["Resume"])
@app.get(f"{settings.API_V1_STR}/resume", tags=["Resume"])
def redirect_to_resume():
    supabase_url = settings.SUPABASE_URL.strip().rstrip("/")
    if supabase_url:
        return RedirectResponse(url=f"{supabase_url}/storage/v1/object/public/resume/Meraj_Alam_Resume.pdf", status_code=307)
    return RedirectResponse(url="/resume.pdf", status_code=307)

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "resume_kb": resume_kb.get_metadata()
    }

@app.get("/", tags=["System"])
def root_status():
    return {
        "message": "Welcome to Meraj Alam Portfolio API",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "endpoints": {
            "projects": "/projects",
            "blog": "/blog",
            "contact": "/contact",
            "github_stats": "/github-stats",
            "chat": "/chat",
        },
        "resume_kb": resume_kb.get_metadata()
    }
