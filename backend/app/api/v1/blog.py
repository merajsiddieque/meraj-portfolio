from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.blog import BlogResponse, BlogCreate
from app.services.blog_service import BlogService

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.get("", response_model=List[BlogResponse])
def get_blog_posts(
    limit: int = Query(50, ge=1, le=100),
    published_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    service = BlogService(db)
    return service.list_blog_posts(limit=limit, published_only=published_only)

@router.get("/{slug}", response_model=BlogResponse)
def get_blog_post_by_slug(slug: str, db: Session = Depends(get_db)):
    service = BlogService(db)
    post = service.get_blog_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail=f"Blog post with slug '{slug}' not found")
    return post

@router.post("", response_model=BlogResponse, status_code=201)
def create_blog_post(post_in: BlogCreate, db: Session = Depends(get_db)):
    service = BlogService(db)
    return service.create_blog_post(post_in)
