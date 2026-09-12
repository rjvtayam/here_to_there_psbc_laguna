from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ReactionToggle(BaseModel):
    emoji: str


class ReactionResponse(BaseModel):
    id: UUID
    announcement_id: UUID
    user_id: UUID
    emoji: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReactionSummary(BaseModel):
    emoji: str
    count: int
    users: list[str]
    user_reacted: bool
