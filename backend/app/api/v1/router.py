from fastapi import APIRouter
from app.api.v1.projects import router as projects_router
from app.api.v1.contact import router as contact_router
from app.api.v1.github import router as github_router
from app.api.v1.chat import router as chat_router
from app.api.v1.blog import router as blog_router

api_v1_router = APIRouter()

api_v1_router.include_router(projects_router)
api_v1_router.include_router(contact_router)
api_v1_router.include_router(github_router)
api_v1_router.include_router(chat_router)
api_v1_router.include_router(blog_router)
