"""add 2fa fields to users

Revision ID: 003
Revises: 002
Create Date: 2026-09-02
"""
from alembic import op
import sqlalchemy as sa

revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('two_factor_secret', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('two_factor_enabled', sa.Boolean(), server_default='false'))


def downgrade() -> None:
    op.drop_column('users', 'two_factor_enabled')
    op.drop_column('users', 'two_factor_secret')
