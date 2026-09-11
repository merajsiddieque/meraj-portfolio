from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.blog import BlogPost

class BlogRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, limit: int = 50, published_only: bool = True) -> List[BlogPost]:
        query = self.db.query(BlogPost)
        if published_only:
            query = query.filter(BlogPost.published == True)
        return query.order_by(BlogPost.created_at.desc()).limit(limit).all()

    def get_by_id(self, post_id: int) -> Optional[BlogPost]:
        return self.db.query(BlogPost).filter(BlogPost.id == post_id).first()

    def get_by_slug(self, slug: str) -> Optional[BlogPost]:
        return self.db.query(BlogPost).filter(BlogPost.slug == slug).first()

    def create(self, post: BlogPost) -> BlogPost:
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        return post
