from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class RecordingUploadResponse(BaseModel):
    id: UUID
    title: str
    filename: str
    file_size: Optional[int] = None
    duration_seconds: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RecordingOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    filename: str
    original_filename: Optional[str] = None
    file_size: Optional[int] = None
    duration_seconds: Optional[int] = None
    mime_type: Optional[str] = None
    status: str
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_by: UUID
    creator_name: Optional[str] = None
    room_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RecordingListResponse(BaseModel):
    recordings: list[RecordingOut]
    total: int
    page: int
    page_size: int
    total_pages: int
