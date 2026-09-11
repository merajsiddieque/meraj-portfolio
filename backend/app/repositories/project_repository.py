from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.project import Project

class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, limit: int = 100, featured_only: bool = False) -> List[Project]:
        query = self.db.query(Project)
        if featured_only:
            query = query.filter(Project.featured == True)
        return query.order_by(Project.created_at.desc()).limit(limit).all()

    def get_by_id(self, project_id) -> Optional[Project]:
        return self.db.query(Project).filter(Project.id == project_id).first()

    def get_by_slug(self, slug: str) -> Optional[Project]:
        return self.db.query(Project).filter(Project.slug == slug).first()

    def create(self, project: Project) -> Project:
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project
