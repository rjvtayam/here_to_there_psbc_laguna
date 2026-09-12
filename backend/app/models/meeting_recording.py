import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class MeetingRecording(Base):
    __tablename__ = "meeting_recordings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    filename = Column(String(500), nullable=False)
    original_filename = Column(String(500), nullable=True)
    file_size = Column(BigInteger, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="completed")
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    room_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    creator = relationship("User", backref="recordings")
