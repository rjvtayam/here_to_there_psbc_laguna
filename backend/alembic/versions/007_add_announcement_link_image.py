"""add link and image_url to announcements

Revision ID: 007
Revises: 006
Create Date: 2026-09-11
"""
from alembic import op
import sqlalchemy as sa

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("announcements", sa.Column("link", sa.Text, nullable=True))
    op.add_column("announcements", sa.Column("image_url", sa.Text, nullable=True))


def downgrade() -> None:
    op.drop_column("announcements", "image_url")
    op.drop_column("announcements", "link")
