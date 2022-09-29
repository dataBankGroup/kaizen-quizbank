from models.course_authorship import CourseAuthorship
from models.user import User
from .shared import db, ma
from sqlalchemy import Column, Integer, String, and_
from .topic import Topic
from marshmallow import fields


class Course(db.Model):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True)
    code = Column(String(15), nullable=False, unique=True)
    title = Column(String(50), nullable=False)
    description = Column(String(512), nullable=False)
    # Add condition to check if the course_authorship is primary author
    authorships = db.relationship(
        "CourseAuthorship", back_populates="course", passive_deletes=True, lazy='dynamic',
        cascade='all,delete-orphan,delete')
    topics = db.relationship(
        'Topic', back_populates='course', passive_deletes=True, lazy='subquery', cascade='all,delete-orphan,delete')

    def __init__(self, code, title, description):
        self.code = code
        self.title = title
        self.description = description

    def __repr__(self):
        return '<Course %r>' % self.title

    @staticmethod
    def get_schema():
        return CourseSchema()


class CourseSchema(ma.Schema):
    class Meta:
        fields = ('id', 'code', 'title', 'description',
                  'topics', 'primary_author', 'co_authors')

    authorships = ma.Nested(CourseAuthorship.get_schema(), many=True)
    topics = ma.Nested(Topic.get_schema(), many=True)

    primary_author = fields.Method('get_primary_author')
    co_authors = fields.Method('get_coauthors')

    def get_primary_author(self, course):
        for authorship in course.authorships:
            if authorship.is_primary_author:
                return User.get_schema().dump(authorship.author)

    def get_coauthors(self, course):
        coauthors = course.authorships.filter(
            CourseAuthorship.is_primary_author == False)
        coauthors = [User.get_schema().dump(coauthor.author)
                     for coauthor in coauthors]
        return User.get_schema().dump(coauthors, many=True)
