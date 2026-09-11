from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.blog_repository import BlogRepository
from app.schemas.blog import BlogResponse, BlogCreate
from app.models.blog import BlogPost

class BlogService:
    def __init__(self, db: Session):
        self.repository = BlogRepository(db)

    def list_blog_posts(self, limit: int = 50, published_only: bool = True) -> List[BlogResponse]:
        posts = self.repository.get_all(limit=limit, published_only=published_only)
        return [BlogResponse.model_validate(p) for p in posts]

    def get_blog_by_slug(self, slug: str) -> Optional[BlogResponse]:
        post = self.repository.get_by_slug(slug)
        if not post:
            return None
        return BlogResponse.model_validate(post)

    def create_blog_post(self, post_in: BlogCreate) -> BlogResponse:
        data = post_in.model_dump()
        if isinstance(data.get("tags"), list):
            data["tags"] = ",".join(data["tags"])
        post = BlogPost(**data)
        created = self.repository.create(post)
        return BlogResponse.model_validate(created)
