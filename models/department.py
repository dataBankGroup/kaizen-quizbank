from models.shared import db, ma
from sqlalchemy import Column, Integer, String


class Department(db.Model):
    __tablename__ = 'departments'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Department %r>' % self.name
    
    @staticmethod
    def get_schema():
        return DepartmentSchema()

class DepartmentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name')
