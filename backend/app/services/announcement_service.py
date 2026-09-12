from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate


class AnnouncementService:
    def __init__(self, db: Session):
        self.db = db

    def create_announcement(self, data: AnnouncementCreate, created_by: UUID) -> Announcement:
        announcement = Announcement(
            title=data.title,
            content=data.content,
            link=data.link,
            image_url=data.image_url,
            type=data.type,
            target_campus=data.target_campus,
            created_by=created_by,
            display_until=data.display_until,
        )
        self.db.add(announcement)
        self.db.commit()
        self.db.refresh(announcement)
        return announcement

    def get_active_announcements(self, campus: Optional[str] = None) -> List[Announcement]:
        query = self.db.query(Announcement).filter(
            Announcement.is_active == True,
        )

        if campus and campus != "control_room":
            query = query.filter(
                (Announcement.target_campus == campus) | (Announcement.target_campus == "both")
            )

        return query.order_by(Announcement.created_at.desc()).all()

    def get_announcement_by_id(self, announcement_id: UUID) -> Optional[Announcement]:
        return self.db.query(Announcement).filter(Announcement.id == announcement_id).first()

    def update_announcement(self, announcement_id: UUID, updates: dict) -> Announcement:
        announcement = self.get_announcement_by_id(announcement_id)
        if not announcement:
            raise ValueError("Announcement not found")

        for key, value in updates.items():
            if hasattr(announcement, key):
                setattr(announcement, key, value)

        self.db.commit()
        self.db.refresh(announcement)
        return announcement

    def deactivate_announcement(self, announcement_id: UUID) -> bool:
        announcement = self.get_announcement_by_id(announcement_id)
        if not announcement:
            raise ValueError("Announcement not found")

        announcement.is_active = False
        self.db.commit()
        return True
