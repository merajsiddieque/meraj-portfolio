from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_assistant import ask_ai_assistant

router = APIRouter(prefix="/chat", tags=["AI Portfolio Assistant"])

@router.post("", response_model=ChatResponse)
async def chat_with_portfolio_assistant(chat_request: ChatRequest):
    try:
        response = await ask_ai_assistant(
            query=chat_request.message,
            history=chat_request.history
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred in Ask Meraj AI Assistant: {str(e)}"
        )
