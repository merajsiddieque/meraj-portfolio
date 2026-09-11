import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, ContactStatusResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["Contact"])

def notify_new_message(name: str, email: str, subject: str):
    # Background task hook (e.g. forward to Slack, Discord webhook, or SendGrid)
    logger.info(f"New contact inquiry received from {name} <{email}>: {subject}")

@router.post("", response_model=ContactStatusResponse, status_code=201)
async def submit_contact(
    contact_in: MessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        new_msg = Message(
            name=contact_in.name,
            email=contact_in.email,
            subject=contact_in.subject or "Portfolio Inquiry",
            message=contact_in.message
        )
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)
        
        # Trigger async notification
        background_tasks.add_task(
            notify_new_message,
            contact_in.name,
            contact_in.email,
            contact_in.subject or "Portfolio Inquiry"
        )
        
        return ContactStatusResponse(
            success=True,
            message="Thank you! Your message has been received.",
            contact_id=str(new_msg.id)
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving contact message via ORM: {e}")
        
        # Resilient fallback: Try PostgREST API
        try:
            from app.services.supabase_service import sync_contact_to_supabase
            synced = await sync_contact_to_supabase(
                contact_in.name,
                contact_in.email,
                contact_in.subject or "Portfolio Inquiry",
                contact_in.message
            )
            if synced:
                return ContactStatusResponse(
                    success=True,
                    message="Thank you! Your message has been received."
                )
        except Exception as sync_err:
            logger.error(f"PostgREST fallback sync also failed: {sync_err}")

        raise HTTPException(
            status_code=500,
            detail="Failed to submit contact message. Please try again or reach out via LinkedIn."
        )
