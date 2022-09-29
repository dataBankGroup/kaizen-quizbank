from .shared import db, ma
from sqlalchemy import Column, Integer, ForeignKey
from models.topic import Topic

class AssessmentTopic(db.Model):
    __tablename__ = 'assessment_topics'
    id = Column(Integer, primary_key=True)
    assessment_id = Column(Integer, ForeignKey('assessments.id', ondelete='CASCADE'))
    topic_id = Column(Integer, ForeignKey('topics.id'))
    topic = db.relationship("Topic", backref="topic",)
    assessment = db.relationship("Assessment", back_populates="assessment_topics", lazy='subquery')

    def __init__(self, assessment_id, topic_id):
        self.assessment_id = assessment_id
        self.topic_id = topic_id

    def __repr__(self):
        return '<AssessmentTopic %r>' % self.question_id

    @staticmethod
    def get_schema():
        return AssessmentQuestionSchema()

class AssessmentQuestionSchema(ma.Schema):
    class Meta:
        fields = ('id',  'topic')

    topic = ma.Nested(Topic.get_schema(), many=False)
