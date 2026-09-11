from datetime import datetime
from typing import Optional, Union
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

class MessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, example="Alex Johnson")
    email: EmailStr = Field(..., example="alex@techrecruiter.com")
    subject: Optional[str] = Field(default="Portfolio Inquiry", max_length=255, example="Excited about your AI Engineering profile")
    message: str = Field(..., min_length=5, max_length=5000, example="Hi Meraj, we are building autonomous agent systems and would love to chat.")

class MessageResponse(BaseModel):
    id: Union[str, UUID, int]
    name: str
    email: str
    subject: Optional[str] = "Portfolio Inquiry"
    message: str
    is_read: Optional[bool] = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ContactStatusResponse(BaseModel):
    success: bool
    message: str
    contact_id: Optional[Union[str, int]] = None
