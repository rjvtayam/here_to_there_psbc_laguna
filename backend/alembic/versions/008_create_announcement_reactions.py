"""create announcement_reactions table

Revision ID: 008
Revises: 007
Create Date: 2026-09-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "announcement_reactions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("announcement_id", UUID(as_uuid=True), sa.ForeignKey("announcements.id"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("emoji", sa.String(10), nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.UniqueConstraint("announcement_id", "user_id", "emoji", name="uq_announcement_user_emoji"),
    )
    op.create_index("ix_reaction_announcement", "announcement_reactions", ["announcement_id"])


def downgrade() -> None:
    op.drop_index("ix_reaction_announcement", table_name="announcement_reactions")
    op.drop_table("announcement_reactions")
