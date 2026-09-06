import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Emergency(Base):
    __tablename__ = "emergencies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    triggered_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    message = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    triggerer = relationship("User", foreign_keys=[triggered_by])
