"""add chat_messages table

Revision ID: 005
Revises: 004
Create Date: 2026-09-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "005"
down_revision = "004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "chat_messages",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("campus", sa.String(50), nullable=False),
        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("target", sa.String(20), nullable=False),
        sa.Column("campus_scope", sa.String(50), nullable=True),
        sa.Column("room_id", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index("ix_chat_messages_user_id", "chat_messages", ["user_id"])
    op.create_index("ix_chat_messages_campus", "chat_messages", ["campus"])
    op.create_index("ix_chat_messages_target", "chat_messages", ["target"])
    op.create_index("ix_chat_messages_campus_scope", "chat_messages", ["campus_scope"])
    op.create_index("ix_chat_messages_room_id", "chat_messages", ["room_id"])
    op.create_index("ix_chat_messages_created_at", "chat_messages", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_chat_messages_created_at", table_name="chat_messages")
    op.drop_index("ix_chat_messages_room_id", table_name="chat_messages")
    op.drop_index("ix_chat_messages_campus_scope", table_name="chat_messages")
    op.drop_index("ix_chat_messages_target", table_name="chat_messages")
    op.drop_index("ix_chat_messages_campus", table_name="chat_messages")
    op.drop_index("ix_chat_messages_user_id", table_name="chat_messages")
    op.drop_table("chat_messages")
