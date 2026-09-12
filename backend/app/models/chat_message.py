import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    campus = Column(String(50), nullable=False, index=True)
    role = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    target = Column(String(20), nullable=False, index=True)
    campus_scope = Column(String(50), nullable=True, index=True)
    room_id = Column(String(100), nullable=False, index=True)
    reply_to_id = Column(UUID(as_uuid=True), nullable=True)
    reply_to_user = Column(String(255), nullable=True)
    reply_to_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
