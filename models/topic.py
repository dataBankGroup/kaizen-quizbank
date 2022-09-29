from .question import Question
from .shared import db, ma
from sqlalchemy import Column, Integer, String, ForeignKey


class Topic(db.Model):
    __tablename__ = 'topics'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'))
    course = db.relationship('Course', back_populates='topics')
    questions = db.relationship('Question', back_populates='topic', passive_deletes=True, lazy='subquery', cascade='all,delete-orphan,delete')

    def __init__(self, name, course_id):
        self.name = name
        self.course_id = course_id

    def __repr__(self):
        return '<Topic %r>' % self.name

    @staticmethod
    def get_schema():
        return TopicSchema()


class TopicSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'course_id', 'questions')

    questions = ma.Nested(Question.get_schema(), many=True)
