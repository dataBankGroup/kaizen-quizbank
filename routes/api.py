from flask import Blueprint
from models import department, answer, course_authorship, topic, assessment_topics
from .assessment import AssessmentBp
from .question import QuestionBp
from .topic import TopicBp
from .crud_bp import CrudBp
from .course import CourseBp
from .user import UserBp


api = Blueprint('api', __name__)

department_bp = CrudBp("departments", __name__, department.Department)
user_bp = UserBp("users", __name__)
question_bp = QuestionBp("questions", __name__)
answer_bp = CrudBp("answers", __name__, answer.Answer)
course_bp = CourseBp("courses", __name__)
course_authorship_bp = CrudBp("course_authorship", __name__,
                              course_authorship.CourseAuthorship)
topic_bp = TopicBp("topics", __name__)

assessment_bp = AssessmentBp("assessments", __name__)

assessment_topics_bp = CrudBp("assessment_topics", __name__,
                              assessment_topics.AssessmentTopic)

api.register_blueprint(assessment_bp, url_prefix='/assessments')

api.register_blueprint(department_bp, url_prefix='/departments')
api.register_blueprint(user_bp, url_prefix='/users')

# The routes below require author checking
api.register_blueprint(question_bp, url_prefix='/questions')
api.register_blueprint(topic_bp, url_prefix="/topics")
api.register_blueprint(course_bp, url_prefix='/courses')

# The routes below are only for debugging purposes
# they do not require author checking
# TODO: Remove the answers blueprint; answers can be updated through the question blueprint
api.register_blueprint(answer_bp, url_prefix='/answers')
# TODO: Remove the course_authorship blueprint; course_authorship should only be 
# updated through the courses blueprint
api.register_blueprint(course_authorship_bp, url_prefix='/course_authorship')