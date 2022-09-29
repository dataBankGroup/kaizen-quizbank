from .shared import db, ma
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean


class CourseAuthorship(db.Model):
    __tablename__ = 'course_authorship'
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'))
    author_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    is_primary_author = Column(Boolean, nullable=False)
    course = db.relationship('Course', back_populates='authorships')
    author = db.relationship('User', back_populates='authorships')

    def __init__(self, course_id, author_id, is_primary_author):
        self.course_id = course_id
        self.author_id = author_id
        self.is_primary_author = is_primary_author

    def __repr__(self):
        return f'<CourseAuthorship User {self.author_id} Course {self.course_id}>'

    @staticmethod
    def get_schema():
        return CourseAuthorshipSchema()


class CourseAuthorshipSchema(ma.Schema):
    class Meta:
        fields = ('id', 'course_id', 'author_id', 'is_primary_author')
