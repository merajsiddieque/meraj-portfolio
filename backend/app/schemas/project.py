from typing import List, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class ProjectBase(BaseModel):
    title: str = Field(..., example="Agentic Code Reviewer")
    slug: Optional[str] = Field(default=None, example="agentic-code-reviewer")
    tagline: Optional[str] = Field(default="", example="Autonomous multi-agent code analysis")
    description: str
    long_description: Optional[str] = None
    category: Optional[str] = Field(default="AI & ML")
    tech_stack: Union[List[str], str] = Field(default_factory=list)
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    demo_video: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = True
    stars: int = 0
    order: int = 0

    @field_validator("tech_stack", mode="before")
    @classmethod
    def parse_tech_stack(cls, v):
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v or []

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: Union[str, int]
    created_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def parse_id(cls, v):
        return str(v)

    class Config:
        from_attributes = True
