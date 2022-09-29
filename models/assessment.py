from .shared import db, ma
from sqlalchemy import Column, Integer, String, ForeignKey
from .assessment_topics import AssessmentTopic


class Assessment(db.Model):
    __tablename__ = 'assessments'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    name = Column(String(128), nullable=False)
    assessment_topics = db.relationship('AssessmentTopic', back_populates='assessment',  lazy='subquery')

    def __init__(self, name, user_id):
        self.name = name
        self.user_id = user_id

    def __repr__(self):
        return '<Assessment %r>' % self.name

    @staticmethod
    def get_schema():
        return AssessmentSchema()


class AssessmentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'user_id', 'name', 'assessment_topics')

    assessment_topics = ma.Nested(AssessmentTopic.get_schema(), many=True)
