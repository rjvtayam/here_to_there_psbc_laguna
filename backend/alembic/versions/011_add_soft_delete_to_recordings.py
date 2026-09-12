"""Add deleted_at to meeting_recordings for soft delete

Revision ID: 011
Revises: 010
Create Date: 2026-09-12
"""
from alembic import op
import sqlalchemy as sa

revision = '011'
down_revision = '010'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('meeting_recordings', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))
    op.create_index('ix_meeting_recordings_deleted_at', 'meeting_recordings', ['deleted_at'])


def downgrade():
    op.drop_index('ix_meeting_recordings_deleted_at')
    op.drop_column('meeting_recordings', 'deleted_at')
