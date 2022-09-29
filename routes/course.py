from flask import request, jsonify
from flask_login import current_user, login_required
from routes.crud_bp import CrudBp
from models.course import Course
from models.shared import db
from models.course_authorship import CourseAuthorship

class CourseBp(CrudBp):
    def __init__(self, name, import_name, url_prefix=None, **kwargs):
        super().__init__(name, import_name, Course, url_prefix, **kwargs)
        self.add_url_rule('/all', view_func=self.all_courses)

    @login_required
    def index(self):
        # Only return courses authored by the current user
        query = Course.query.where(Course.authorships.any(
            CourseAuthorship.author_id == current_user.id))
        # Iterate through request parameters in URL
        for attr, value in request.args.items():
            # Apply filter if the model's schema has the attribute
            if attr in self.schema.fields:
                if attr.startswith('is_') or attr.endswith('_id') or attr == 'id':
                    query = query.filter(getattr(self.model, attr) == value)
                else:
                    query = query.filter(
                        getattr(self.model, attr).ilike(f'%{value}%'))
        courses = query.all()
        return jsonify(Course.get_schema().dump(courses, many=True))
    
    @login_required
    def all_courses(self):
        return super().index()

    @login_required
    def create_item(self):
        data = request.get_json()
        # TODO: Validate data
        course = Course(**data)
        db.session.add(course)
        try:
            db.session.commit()
            authorship = CourseAuthorship(course.id, current_user.id, True)
            db.session.add(authorship)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400
        return jsonify(Course.get_schema().dump(course))

    @login_required
    def update_item(self, id):
        item = self.model.query.get(id)
        if (not item):
            return jsonify({"message": "Course not found"}), 404

        # First check if the user is an author of the course
        authorship = CourseAuthorship.query.filter_by(
            course_id=item.id, author_id=current_user.id).first()
        if (not authorship):
            return jsonify({"message": "You are not an author of this course"}), 403

        data = request.get_json()

        # Partial update excluding more complex fields
        for attr, value in data.items():
            if attr in self.schema.fields and attr not in ("authors"):
                setattr(item, attr, value)

        # Check if the user is trying to edit the authors list
        if authorship.is_primary_author and 'authors' in data:
            authors = CourseAuthorship.query.filter_by(
                course_id=int(item.id)).all()
            # Remove all existing authorships
            for author in authors:
                db.session.delete(author)

            # Add new authorships
            for author in data['authors']:
                if 'id' not in author or 'is_primary_author' not in author:
                    return jsonify({"message": "Invalid author data"}), 400
                course_authorship = CourseAuthorship(
                    course_id=item.id, author_id=int(author['id']), is_primary_author=author['is_primary_author'])
                db.session.add(course_authorship)
        # Confirm the edits only if the user is the primary author
        elif 'authors' in data:
            return jsonify({"message": "Only the primary author may change the authorship of this course."}), 403

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400

        return jsonify(Course.get_schema().dump(item))

    @login_required
    def delete_item(self, id):
        try:
            item = self.model.query.get(id)
            if (not item):
                return jsonify({"message": "Course not found"}), 404

            # Check if the user is an author of the course
            authorship = CourseAuthorship.query.filter_by(
                course_id=item.id, author_id=current_user.id).first()
            if not authorship or not authorship.is_primary_author:
                return jsonify({"message": "You are not the primary author of this course"}), 403

            db.session.delete(item)
            db.session.commit()
            return jsonify({"message": "Course deleted"}), 200
        except Exception as e:
            db.session.rollback()
            # Return exception message
            return jsonify({"message": str(e)}), 500
