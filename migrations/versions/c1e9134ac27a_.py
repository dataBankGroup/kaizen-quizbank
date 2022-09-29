"""empty message

Revision ID: c1e9134ac27a
Revises: 331e94b3aa1a
Create Date: 2022-08-17 16:01:27.724777

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c1e9134ac27a'
down_revision = '331e94b3aa1a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('questions', sa.Column('difficulty', sa.String(length=1000), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('questions', 'difficulty')
    # ### end Alembic commands ###