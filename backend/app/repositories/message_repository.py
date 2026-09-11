from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.message import Message

class MessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, email: str, message: str, subject: Optional[str] = None) -> Message:
        msg = Message(
            name=name,
            email=email,
            message=message,
            subject=subject or "Portfolio Inquiry"
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    def get_all(self, limit: int = 100) -> List[Message]:
        return self.db.query(Message).order_by(Message.created_at.desc()).limit(limit).all()

    def get_by_id(self, message_id: int) -> Optional[Message]:
        return self.db.query(Message).filter(Message.id == message_id).first()
