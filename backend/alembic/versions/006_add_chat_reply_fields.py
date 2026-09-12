"""add reply fields to chat_messages

Revision ID: 006
Revises: 005
Create Date: 2026-09-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("chat_messages", sa.Column("reply_to_id", UUID(as_uuid=True), nullable=True))
    op.add_column("chat_messages", sa.Column("reply_to_user", sa.String(255), nullable=True))
    op.add_column("chat_messages", sa.Column("reply_to_message", sa.Text, nullable=True))


def downgrade() -> None:
    op.drop_column("chat_messages", "reply_to_message")
    op.drop_column("chat_messages", "reply_to_user")
    op.drop_column("chat_messages", "reply_to_id")
