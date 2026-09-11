from typing import List, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class BlogBase(BaseModel):
    title: str = Field(..., example="Architecting Autonomous Multi-Agent Workflows")
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: str
    tags: Union[List[str], str] = Field(default_factory=list)
    read_time: Optional[str] = "5 min read"
    published: bool = True

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v):
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v or []

class BlogCreate(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: Union[str, int]
    created_at: Optional[datetime] = None

    @field_validator("id", mode="before")
    @classmethod
    def parse_id(cls, v):
        return str(v)

    class Config:
        from_attributes = True
