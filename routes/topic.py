from flask import request, jsonify
from flask_login import current_user, login_required
from models.topic import Topic
from models.course import Course
from models.course_authorship import CourseAuthorship
from .crud_bp import CrudBp


class TopicBp(CrudBp):
	def __init__(self, name, import_name, url_prefix=None, **kwargs):
		super().__init__(name, import_name, Topic, url_prefix, **kwargs)

	def is_course_author(self, course_id):
		# Check for authorship by going through the question's topic
		course = Course.query.get(course_id)
		auth_count = course.authorships.filter(
			CourseAuthorship.author_id == current_user.id).count()
		return auth_count != 0

	@login_required
	def create_item(self):
		data = request.get_json()

		if 'course_id' not in data:
			return jsonify({'message': 'Missing course ID'}), 400

		# Only authors of the course can create topics within them
		if not self.is_course_author(data['course_id']):
			return jsonify({'message': 'You are not an author of the course.'}), 403
		return super().create_item()

	@login_required
	def update_item(self, id):
		item = self.model.query.get(id)

		if not self.is_course_author(item.course_id):
			return jsonify({'message': 'You are not an author of the course.'}), 403
		return super().update_item(id)

	@login_required
	def delete_item(self, id):
		item = self.model.query.get(id)

		if not self.is_course_author(item.course_id):
			return jsonify({'message': 'You are not an author of the course.'}), 403
		return super().delete_item(id)
