import uuid
from datetime import datetime
from sqlalchemy import Column, Text, DateTime, Uuid, String
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.session import Base

class BlogPost(Base):
    __tablename__ = "blog"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    slug = Column(Text, unique=True, nullable=True)
    content = Column(Text, nullable=False)
    tags = Column(ARRAY(String), nullable=True)
    published_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    @property
    def created_at(self):
        return self.published_at

    @property
    def excerpt(self):
        return self.content[:140] if self.content else ""

    @property
    def read_time(self):
        return "5 min read"

    @property
    def published(self):
        return True
