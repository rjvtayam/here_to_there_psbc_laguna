from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.schemas.announcement import AnnouncementCreate, AnnouncementResponse
from app.services.announcement_service import AnnouncementService
from app.api.deps import get_current_user, require_admin

router = APIRouter()


@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(data: AnnouncementCreate, db: Session = Depends(get_db), user=Depends(require_admin)):
    service = AnnouncementService(db)
    return service.create_announcement(data, user.id)


@router.get("/", response_model=List[AnnouncementResponse])
def list_announcements(
    campus: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    service = AnnouncementService(db)
    return service.get_active_announcements(campus)


@router.get("/{announcement_id}", response_model=AnnouncementResponse)
def get_announcement(announcement_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    service = AnnouncementService(db)
    announcement = service.get_announcement_by_id(announcement_id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement


@router.put("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(announcement_id: UUID, updates: dict, db: Session = Depends(get_db), _=Depends(require_admin)):
    service = AnnouncementService(db)
    try:
        return service.update_announcement(announcement_id, updates)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{announcement_id}")
def deactivate_announcement(announcement_id: UUID, db: Session = Depends(get_db), _=Depends(require_admin)):
    service = AnnouncementService(db)
    try:
        service.deactivate_announcement(announcement_id)
        return {"message": "Announcement deactivated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
