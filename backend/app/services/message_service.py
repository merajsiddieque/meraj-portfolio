import logging
from typing import List
from sqlalchemy.orm import Session
from app.repositories.message_repository import MessageRepository
from app.schemas.message import MessageCreate, ContactStatusResponse, MessageResponse

logger = logging.getLogger(__name__)

class MessageService:
    def __init__(self, db: Session):
        self.repository = MessageRepository(db)

    def save_message(self, message_in: MessageCreate) -> ContactStatusResponse:
        try:
            saved = self.repository.create(
                name=message_in.name,
                email=message_in.email,
                message=message_in.message,
                subject=message_in.subject
            )
            logger.info(f"Contact inquiry saved successfully from {message_in.email} (ID: {saved.id})")
            return ContactStatusResponse(
                success=True,
                message=f"Thank you {message_in.name}! Your message has been received. Meraj will get back to you shortly.",
                contact_id=saved.id
            )
        except Exception as e:
            logger.error(f"Error saving contact message: {e}")
            raise e

    def list_messages(self, limit: int = 100) -> List[MessageResponse]:
        messages = self.repository.get_all(limit=limit)
        return [MessageResponse.model_validate(m) for m in messages]
