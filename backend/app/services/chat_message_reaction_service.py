from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from app.models.chat_message_reaction import ChatMessageReaction
from app.models.user import User
from app.schemas.chat_message_reaction import ChatReactionSummary


class ChatMessageReactionService:
    def __init__(self, db: Session):
        self.db = db

    def toggle_reaction(self, message_id: UUID, user_id: UUID, emoji: str) -> dict:
        existing = self.db.query(ChatMessageReaction).filter(
            ChatMessageReaction.message_id == message_id,
            ChatMessageReaction.user_id == user_id,
            ChatMessageReaction.emoji == emoji,
        ).first()

        if existing:
            self.db.delete(existing)
            self.db.commit()
            return {"action": "removed", "emoji": emoji}
        else:
            reaction = ChatMessageReaction(
                message_id=message_id,
                user_id=user_id,
                emoji=emoji,
            )
            self.db.add(reaction)
            self.db.commit()
            return {"action": "added", "emoji": emoji}

    def get_reactions(self, message_id: UUID, current_user_id: UUID) -> list[ChatReactionSummary]:
        rows = (
            self.db.query(
                ChatMessageReaction.emoji,
                func.count(ChatMessageReaction.id).label("count"),
            )
            .filter(ChatMessageReaction.message_id == message_id)
            .group_by(ChatMessageReaction.emoji)
            .all()
        )

        results = []
        for emoji, count in rows:
            users_query = (
                self.db.query(User.full_name)
                .join(ChatMessageReaction, ChatMessageReaction.user_id == User.id)
                .filter(
                    ChatMessageReaction.message_id == message_id,
                    ChatMessageReaction.emoji == emoji,
                )
                .all()
            )
            user_names = [u.full_name for u in users_query]

            user_reacted = self.db.query(ChatMessageReaction).filter(
                ChatMessageReaction.message_id == message_id,
                ChatMessageReaction.user_id == current_user_id,
                ChatMessageReaction.emoji == emoji,
            ).first() is not None

            results.append(ChatReactionSummary(
                emoji=emoji,
                count=count,
                users=user_names,
                user_reacted=user_reacted,
            ))

        return results

    def get_reactions_batch(self, message_ids: list[UUID], current_user_id: UUID) -> dict[str, list[ChatReactionSummary]]:
        if not message_ids:
            return {}

        rows = (
            self.db.query(
                ChatMessageReaction.message_id,
                ChatMessageReaction.emoji,
                func.count(ChatMessageReaction.id).label("count"),
            )
            .filter(ChatMessageReaction.message_id.in_(message_ids))
            .group_by(ChatMessageReaction.message_id, ChatMessageReaction.emoji)
            .all()
        )

        result_map: dict[str, list[ChatReactionSummary]] = {}
        for msg_id, emoji, count in rows:
            msg_id_str = str(msg_id)
            if msg_id_str not in result_map:
                result_map[msg_id_str] = []

            users_query = (
                self.db.query(User.full_name)
                .join(ChatMessageReaction, ChatMessageReaction.user_id == User.id)
                .filter(
                    ChatMessageReaction.message_id == msg_id,
                    ChatMessageReaction.emoji == emoji,
                )
                .all()
            )
            user_names = [u.full_name for u in users_query]

            user_reacted = self.db.query(ChatMessageReaction).filter(
                ChatMessageReaction.message_id == msg_id,
                ChatMessageReaction.user_id == current_user_id,
                ChatMessageReaction.emoji == emoji,
            ).first() is not None

            result_map[msg_id_str].append(ChatReactionSummary(
                emoji=emoji,
                count=count,
                users=user_names,
                user_reacted=user_reacted,
            ))

        return result_map
