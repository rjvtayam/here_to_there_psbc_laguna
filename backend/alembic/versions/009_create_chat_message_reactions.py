"""create chat_message_reactions table

Revision ID: 009
Revises: 008
Create Date: 2026-09-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "009"
down_revision = "008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "chat_message_reactions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("message_id", UUID(as_uuid=True), sa.ForeignKey("chat_messages.id"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("emoji", sa.String(10), nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.UniqueConstraint("message_id", "user_id", "emoji", name="uq_chat_message_user_emoji"),
    )
    op.create_index("ix_chat_reaction_message", "chat_message_reactions", ["message_id"])


def downgrade() -> None:
    op.drop_index("ix_chat_reaction_message", table_name="chat_message_reactions")
    op.drop_table("chat_message_reactions")
