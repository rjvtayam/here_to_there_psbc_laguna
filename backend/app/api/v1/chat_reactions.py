from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.schemas.chat_message_reaction import ChatReactionToggle, ChatReactionSummary
from app.services.chat_message_reaction_service import ChatMessageReactionService
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/{message_id}/reactions", response_model=dict)
def toggle_reaction(message_id: UUID, data: ChatReactionToggle, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = ChatMessageReactionService(db)
    return service.toggle_reaction(message_id, user.id, data.emoji)


@router.get("/{message_id}/reactions", response_model=List[ChatReactionSummary])
def get_reactions(message_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = ChatMessageReactionService(db)
    return service.get_reactions(message_id, user.id)


@router.post("/reactions/batch", response_model=dict)
def get_reactions_batch(message_ids: List[UUID], db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = ChatMessageReactionService(db)
    return service.get_reactions_batch(message_ids, user.id)
