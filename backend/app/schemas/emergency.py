from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class EmergencyTrigger(BaseModel):
    message: Optional[str] = None


class EmergencyResponse(BaseModel):
    id: UUID
    triggered_by: UUID
    message: Optional[str]
    is_active: bool
    resolved_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
