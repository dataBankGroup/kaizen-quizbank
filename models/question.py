from models.answer import Answer
from .shared import db, ma
from sqlalchemy import Column, Integer, String, ForeignKey, Float

class Question(db.Model):
	__tablename__ = 'questions'
	id = Column(Integer, primary_key=True)
	question_text = Column(String(500), nullable=False)
	question_type = Column(String(50), nullable=False)
	topic_id = Column(Integer, ForeignKey('topics.id', ondelete='CASCADE'))
	author_id = Column(Integer)
	image = db.Column(String(1000))
	score = db.Column(Float(50))
	difficulty = db.Column(String(1000))
	topic = db.relationship('Topic', back_populates='questions', )
	answers = db.relationship('Answer', back_populates='question', passive_deletes=True, lazy='subquery', cascade='all,delete-orphan,delete')
	

	def __init__(self, question_text, question_type, topic_id, image, difficulty, score):
		
		self.question_text = question_text
		self.question_type = question_type
		self.topic_id = topic_id
		self.image = image
		self.difficulty = difficulty
		self.score = score
	
	def __repr__(self):
		return '<Question %r>' % self.question_text
	
	@staticmethod
	def get_schema():
		return QuestionSchema()
class QuestionSchema(ma.Schema):
	class Meta:
		fields = ('id', 'question_text', 'question_type', 'topic_id', 'answers', 'author_id', 'image', 'difficulty', 'score')
	answers = ma.Nested(Answer.get_schema(), many=True)