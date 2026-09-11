from typing import List, Optional
from pydantic import BaseModel, Field, model_validator

class ChatMessage(BaseModel):
    role: str = Field(..., example="user")  # "user" or "assistant"
    content: str = Field(..., example="What are Meraj's core skills?")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, example="Tell me about Meraj's experience with LangGraph and RAG.")
    history: Optional[List[ChatMessage]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    response: Optional[str] = None
    suggested_prompts: List[str] = Field(default_factory=list)
    mode: str = "gemini_agent"  # "gemini_agent" or "heuristic_agent"

    @model_validator(mode="after")
    def sync_reply_and_response(self):
        if not self.response:
            self.response = self.reply
        if not self.reply:
            self.reply = self.response
        return self
