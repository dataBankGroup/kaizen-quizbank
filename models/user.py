from .shared import db, ma
from sqlalchemy import Column, Integer, String, ForeignKey
from models.department import Department
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    password = Column(String(80), nullable=False)
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    department = db.relationship(Department.__name__, backref='users', lazy='subquery')
    authorships = db.relationship('CourseAuthorship', back_populates='author', passive_deletes=True, lazy='subquery', cascade='all,delete-orphan,delete')

    def __init__(self, first_name, last_name, email, password, department_id=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.department_id = department_id

    def __repr__(self):
        return '<User %r>' % self.name

    @property
    def name(self):
        return f'{self.first_name} {self.last_name}'

    @staticmethod
    def get_schema():
        return UserSchema()


class UserSchema(ma.Schema):
    class Meta:

        fields = ('id', 'first_name', 'last_name',
                  'email', 'department')
    department = ma.Nested(Department.get_schema())
