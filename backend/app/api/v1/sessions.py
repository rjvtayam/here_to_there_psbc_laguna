from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.schemas.session import SessionCreate, SessionResponse
from app.services.session_service import SessionService
from app.services.cache import invalidate, get_session_cache
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(data: SessionCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = SessionService(db)
    session = service.create_session(data.title, user.id)
    invalidate(get_session_cache(), "session")
    return session


@router.get("/", response_model=List[SessionResponse])
def list_sessions(db: Session = Depends(get_db), _=Depends(get_current_user)):
    service = SessionService(db)
    return service.get_all_sessions()


@router.get("/active", response_model=SessionResponse)
def get_active_session(db: Session = Depends(get_db), _=Depends(get_current_user)):
    service = SessionService(db)
    session = service.get_active_session()
    if not session:
        raise HTTPException(status_code=404, detail="No active session")
    return session


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    service = SessionService(db)
    session = service.get_session_by_id(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.post("/{session_id}/join")
def join_session(session_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = SessionService(db)
    try:
        service.join_session(session_id, user.id)
        invalidate(get_session_cache(), "session")
        return {"message": "Joined session"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{session_id}/leave")
def leave_session(session_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = SessionService(db)
    service.leave_session(session_id, user.id)
    invalidate(get_session_cache(), "session")
    return {"message": "Left session"}


@router.put("/{session_id}/end", response_model=SessionResponse)
def end_session(session_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    service = SessionService(db)
    try:
        result = service.end_session(session_id)
        invalidate(get_session_cache(), "session")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
