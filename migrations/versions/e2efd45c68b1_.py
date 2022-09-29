"""empty message

Revision ID: e2efd45c68b1
Revises: c1e9134ac27a
Create Date: 2022-08-17 20:27:41.903090

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2efd45c68b1'
down_revision = 'c1e9134ac27a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('questions', sa.Column('score', sa.Float(precision=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('questions', 'score')
    # ### end Alembic commands ###
