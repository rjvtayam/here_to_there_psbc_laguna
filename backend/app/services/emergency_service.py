from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.emergency import Emergency
from app.models.audit_log import AuditLog


class EmergencyService:
    def __init__(self, db: Session):
        self.db = db

    def trigger_emergency(self, user_id: UUID, message: Optional[str] = None) -> Emergency:
        emergency = Emergency(
            triggered_by=user_id,
            message=message,
            is_active=True,
        )
        self.db.add(emergency)

        audit = AuditLog(
            user_id=user_id,
            action="emergency_trigger",
            details={"message": message},
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(emergency)
        return emergency

    def resolve_emergency(self, emergency_id: UUID) -> Emergency:
        emergency = self.db.query(Emergency).filter(Emergency.id == emergency_id).first()
        if not emergency:
            raise ValueError("Emergency not found")

        emergency.is_active = False
        emergency.resolved_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(emergency)
        return emergency

    def get_active_emergency(self) -> Optional[Emergency]:
        return self.db.query(Emergency).filter(Emergency.is_active == True).first()
