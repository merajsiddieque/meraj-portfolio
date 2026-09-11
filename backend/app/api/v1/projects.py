from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectResponse, ProjectCreate

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured_only: bool = Query(False, description="Filter only featured projects"),
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if featured_only:
        query = query.filter(Project.featured.is_(True))
    
    projects = query.order_by(Project.created_at.desc()).all()
    
    # Format response
    results = []
    for p in projects:
        if isinstance(p.tech_stack, list):
            stack_list = p.tech_stack
        elif isinstance(p.tech_stack, str):
            stack_list = [t.strip() for t in p.tech_stack.split(",") if t.strip()]
        else:
            stack_list = []
            
        results.append(
            ProjectResponse(
                id=str(p.id),
                title=p.title,
                slug=p.slug or "",
                tagline=p.tagline,
                description=p.description,
                category="AI & GenAI",
                tech_stack=stack_list,
                github_url=p.github_url,
                live_url=p.live_url or p.demo_url,
                featured=bool(p.featured),
                stars=42,
                order=1,
                created_at=p.created_at
            )
        )
    return results

@router.get("/{slug}", response_model=ProjectResponse)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Project with slug '{slug}' not found")
    
    stack_list = [t.strip() for t in p.tech_stack.split(",") if t.strip()] if p.tech_stack else []
    return ProjectResponse(
        id=p.id,
        title=p.title,
        slug=p.slug,
        tagline=p.tagline,
        description=p.description,
        long_description=p.long_description,
        category=p.category,
        tech_stack=stack_list,
        github_url=p.github_url,
        live_url=p.live_url,
        demo_video=p.demo_video,
        image_url=p.image_url,
        featured=p.featured,
        stars=p.stars,
        order=p.order,
        created_at=p.created_at
    )

@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A project with this slug already exists")
    
    stack_str = ",".join(project_in.tech_stack)
    new_project = Project(
        title=project_in.title,
        slug=project_in.slug,
        tagline=project_in.tagline,
        description=project_in.description,
        long_description=project_in.long_description,
        category=project_in.category,
        tech_stack=stack_str,
        github_url=project_in.github_url,
        live_url=project_in.live_url,
        demo_video=project_in.demo_video,
        image_url=project_in.image_url,
        featured=project_in.featured,
        stars=project_in.stars,
        order=project_in.order
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return ProjectResponse(
        id=new_project.id,
        title=new_project.title,
        slug=new_project.slug,
        tagline=new_project.tagline,
        description=new_project.description,
        long_description=new_project.long_description,
        category=new_project.category,
        tech_stack=project_in.tech_stack,
        github_url=new_project.github_url,
        live_url=new_project.live_url,
        demo_video=new_project.demo_video,
        image_url=new_project.image_url,
        featured=new_project.featured,
        stars=new_project.stars,
        order=new_project.order,
        created_at=new_project.created_at
    )
