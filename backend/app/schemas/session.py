from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class SessionCreate(BaseModel):
    title: str


class SessionResponse(BaseModel):
    id: UUID
    title: str
    initiated_by: UUID
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SessionDetailResponse(SessionResponse):
    participants: List[dict] = []
