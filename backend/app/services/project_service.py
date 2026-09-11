from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectResponse, ProjectCreate
from app.models.project import Project

class ProjectService:
    def __init__(self, db: Session):
        self.repository = ProjectRepository(db)

    def list_projects(self, limit: int = 100, featured_only: bool = False) -> List[ProjectResponse]:
        projects = self.repository.get_all(limit=limit, featured_only=featured_only)
        return [ProjectResponse.model_validate(p) for p in projects]

    def get_project_by_slug(self, slug: str) -> Optional[ProjectResponse]:
        proj = self.repository.get_by_slug(slug)
        if not proj:
            return None
        return ProjectResponse.model_validate(proj)

    def create_project(self, project_in: ProjectCreate) -> ProjectResponse:
        data = project_in.model_dump()
        # If tech_stack is list, convert to string for DB
        if isinstance(data.get("tech_stack"), list):
            data["tech_stack"] = ",".join(data["tech_stack"])
        proj = Project(**data)
        created = self.repository.create(proj)
        return ProjectResponse.model_validate(created)
