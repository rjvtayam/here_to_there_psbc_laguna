"""initial migration

Revision ID: 001
Revises:
Create Date: 2026-07-01
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, server_default='teacher'),
        sa.Column('campus', sa.String(50), nullable=False),
        sa.Column('is_active', sa.Boolean, server_default='true'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('idx_users_campus', 'users', ['campus'])
    op.create_index('idx_users_role', 'users', ['role'])

    op.create_table(
        'video_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('initiated_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('status', sa.String(50), server_default='active'),
        sa.Column('started_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('ended_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('idx_sessions_status', 'video_sessions', ['status'])

    op.create_table(
        'session_participants',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('video_sessions.id', ondelete='CASCADE')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('joined_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('left_at', sa.DateTime, nullable=True),
        sa.Column('role_in_session', sa.String(50), server_default='participant'),
    )
    op.create_index('idx_participants_session', 'session_participants', ['session_id'])

    op.create_table(
        'announcements',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('type', sa.String(50), nullable=False, server_default='bulletin'),
        sa.Column('target_campus', sa.String(50), nullable=False, server_default='both'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('is_active', sa.Boolean, server_default='true'),
        sa.Column('display_until', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('idx_announcements_active', 'announcements', ['is_active', 'target_campus'])

    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('details', postgresql.JSONB, nullable=True),
        sa.Column('ip_address', postgresql.INET, nullable=True),
        sa.Column('timestamp', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('idx_audit_user', 'audit_logs', ['user_id'])
    op.create_index('idx_audit_timestamp', 'audit_logs', [sa.text('timestamp DESC')])

    op.create_table(
        'emergencies',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('triggered_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('message', sa.Text, nullable=True),
        sa.Column('is_active', sa.Boolean, server_default='true'),
        sa.Column('resolved_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('emergencies')
    op.drop_table('audit_logs')
    op.drop_table('announcements')
    op.drop_table('session_participants')
    op.drop_table('video_sessions')
    op.drop_table('users')
