import uuid
from datetime import datetime
from sqlalchemy import Column, Text, Boolean, DateTime, Uuid, String
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.session import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    slug = Column(Text, unique=True, nullable=True)
    description = Column(Text, nullable=False)
    github_url = Column(Text, nullable=True)
    demo_url = Column(Text, nullable=True)
    tech_stack = Column(ARRAY(String), nullable=True)
    featured = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    @property
    def live_url(self):
        return self.demo_url

    @property
    def tagline(self):
        return self.description[:120] if self.description else ""

    @property
    def category(self):
        return "AI & GenAI"

    @property
    def stars(self):
        return 42

    @property
    def order(self):
        return 1
