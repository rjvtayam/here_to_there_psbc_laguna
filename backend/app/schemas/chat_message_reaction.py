from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ChatReactionToggle(BaseModel):
    emoji: str


class ChatReactionSummary(BaseModel):
    emoji: str
    count: int
    users: list[str]
    user_reacted: bool
