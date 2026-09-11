import uuid
from datetime import datetime
from sqlalchemy import Column, Text, DateTime, Uuid
from app.db.session import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    subject = Column(Text, nullable=True, default="Portfolio Inquiry")
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
