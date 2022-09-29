from .shared import db, ma
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean


class Answer(db.Model):
    __tablename__ = 'answers'
    id = Column(Integer, primary_key=True)
    answer_text = Column(String(500), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id', ondelete='CASCADE'))
    question = db.relationship('Question', back_populates='answers')

    def __init__(self, answer_text, is_correct, question_id):
        self.answer_text = answer_text
        self.is_correct = is_correct
        self.question_id = question_id

    def __repr__(self):
        return '<Answer %r>' % self.answer_text

    @staticmethod
    def get_schema():
        return AnswerSchema()


class AnswerSchema(ma.Schema):
    class Meta:
        fields = ('id', 'answer_text', 'is_correct', 'question_id')
