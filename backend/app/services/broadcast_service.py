from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.session import VideoSession
from app.models.audit_log import AuditLog
from app.models.emergency import Emergency
from app.utils.security import decode_token
from typing import Optional
from datetime import datetime
import uuid


class BroadcastService:
    def __init__(self):
        self.active_rooms: dict = {}
        self.connected_users: dict = {}

    async def authenticate_user(self, token: str) -> Optional[User]:
        payload = decode_token(token)
        if not payload:
            return None

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == payload["sub"]).first()
            return user
        finally:
            db.close()

    async def get_or_create_session(self, room_id: str) -> VideoSession:
        db = SessionLocal()
        try:
            session = db.query(VideoSession).filter(
                VideoSession.id == room_id,
                VideoSession.status == "active",
            ).first()

            if not session:
                session = VideoSession(
                    id=uuid.UUID(room_id) if len(room_id) == 36 else uuid.uuid4(),
                    title=f"Room {room_id}",
                    status="active",
                )
                db.add(session)
                db.commit()
                db.refresh(session)

            return session
        finally:
            db.close()

    async def get_room_users(self, room_id: str) -> list:
        return list(self.active_rooms.get(room_id, {}).values())

    async def log_emergency(self, user: User, data: dict):
        db = SessionLocal()
        try:
            emergency = Emergency(
                triggered_by=user.id,
                message=data.get("message", "Emergency triggered"),
            )
            db.add(emergency)

            audit = AuditLog(
                user_id=user.id,
                action="emergency_trigger",
                details={"message": data.get("message")},
            )
            db.add(audit)
            db.commit()
        finally:
            db.close()
