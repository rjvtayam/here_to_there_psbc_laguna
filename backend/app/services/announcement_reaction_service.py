from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from app.models.announcement_reaction import AnnouncementReaction
from app.models.user import User
from app.schemas.announcement_reaction import ReactionSummary


class AnnouncementReactionService:
    def __init__(self, db: Session):
        self.db = db

    def toggle_reaction(self, announcement_id: UUID, user_id: UUID, emoji: str) -> dict:
        existing = self.db.query(AnnouncementReaction).filter(
            AnnouncementReaction.announcement_id == announcement_id,
            AnnouncementReaction.user_id == user_id,
            AnnouncementReaction.emoji == emoji,
        ).first()

        if existing:
            self.db.delete(existing)
            self.db.commit()
            return {"action": "removed", "emoji": emoji}
        else:
            reaction = AnnouncementReaction(
                announcement_id=announcement_id,
                user_id=user_id,
                emoji=emoji,
            )
            self.db.add(reaction)
            self.db.commit()
            return {"action": "added", "emoji": emoji}

    def get_reactions(self, announcement_id: UUID, current_user_id: UUID) -> list[ReactionSummary]:
        rows = (
            self.db.query(
                AnnouncementReaction.emoji,
                func.count(AnnouncementReaction.id).label("count"),
            )
            .filter(AnnouncementReaction.announcement_id == announcement_id)
            .group_by(AnnouncementReaction.emoji)
            .all()
        )

        results = []
        for emoji, count in rows:
            users_query = (
                self.db.query(User.full_name)
                .join(AnnouncementReaction, AnnouncementReaction.user_id == User.id)
                .filter(
                    AnnouncementReaction.announcement_id == announcement_id,
                    AnnouncementReaction.emoji == emoji,
                )
                .all()
            )
            user_names = [u.full_name for u in users_query]

            user_reacted = self.db.query(AnnouncementReaction).filter(
                AnnouncementReaction.announcement_id == announcement_id,
                AnnouncementReaction.user_id == current_user_id,
                AnnouncementReaction.emoji == emoji,
            ).first() is not None

            results.append(ReactionSummary(
                emoji=emoji,
                count=count,
                users=user_names,
                user_reacted=user_reacted,
            ))

        return results

    def remove_all_for_announcement(self, announcement_id: UUID):
        self.db.query(AnnouncementReaction).filter(
            AnnouncementReaction.announcement_id == announcement_id
        ).delete()
        self.db.commit()
