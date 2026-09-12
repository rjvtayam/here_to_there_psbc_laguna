"""Add meeting_recordings table

Revision ID: 010
Revises: 009
Create Date: 2026-09-12
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = '010'
down_revision = '009'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'meeting_recordings',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('filename', sa.String(500), nullable=False),
        sa.Column('original_filename', sa.String(500), nullable=True),
        sa.Column('file_size', sa.BigInteger(), nullable=True),
        sa.Column('duration_seconds', sa.Integer(), nullable=True),
        sa.Column('mime_type', sa.String(100), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='completed'),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('room_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
    )
    op.create_index('ix_meeting_recordings_created_by', 'meeting_recordings', ['created_by'])
    op.create_index('ix_meeting_recordings_created_at', 'meeting_recordings', ['created_at'])
    op.create_index('ix_meeting_recordings_room_id', 'meeting_recordings', ['room_id'])


def downgrade():
    op.drop_index('ix_meeting_recordings_room_id')
    op.drop_index('ix_meeting_recordings_created_at')
    op.drop_index('ix_meeting_recordings_created_by')
    op.drop_table('meeting_recordings')
