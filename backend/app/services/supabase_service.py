import logging
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

async def sync_contact_to_supabase(name: str, email: str, subject: str, message: str) -> bool:
    """
    Directly persists the contact inquiry to the Supabase PostgreSQL 'messages' table
    via the Supabase PostgREST API using the credentials in backend/.env.
    """
    supabase_url = settings.SUPABASE_URL.strip().rstrip("/")
    api_key = (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY or settings.SUPABASE_ANON_KEY).strip()

    if not supabase_url or not api_key:
        logger.debug("Supabase URL or Key not set in backend/.env; skipping cloud PostgREST sync.")
        return False

    endpoint = f"{supabase_url}/rest/v1/messages"
    headers = {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    payload = {
        "name": name,
        "email": email,
        "subject": subject or "Portfolio Inquiry",
        "message": message,
    }

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            res = await client.post(endpoint, json=payload, headers=headers)
            if res.status_code in (200, 201):
                logger.info(f"Contact message successfully synced to Supabase messages table for {email}.")
                return True
            else:
                logger.warning(
                    f"Supabase REST API returned {res.status_code}: {res.text}. "
                    "Ensure table 'messages' exists in your Supabase project."
                )
                return False
    except Exception as e:
        logger.error(f"Error syncing contact message to Supabase: {e}")
        return False
