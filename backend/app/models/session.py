import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class VideoSession(Base):
    __tablename__ = "video_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    initiated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(String(50), default="active")
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    initiator = relationship("User", foreign_keys=[initiated_by])
    participants = relationship("SessionParticipant", back_populates="session")


class SessionParticipant(Base):
    __tablename__ = "session_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("video_sessions.id", ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)
    role_in_session = Column(String(50), default="participant")

    session = relationship("VideoSession", back_populates="participants")
    user = relationship("User", back_populates="sessions")
