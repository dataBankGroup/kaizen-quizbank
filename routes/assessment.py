from flask import request, jsonify
from flask_login import login_required, current_user
from models.assessment import Assessment
from models.assessment_topics import AssessmentTopic
from .crud_bp import CrudBp
from models.shared import db


class AssessmentBp(CrudBp):
    def __init__(self, name, import_name, url_prefix=None, **kwargs):
        super().__init__(name, import_name, Assessment, url_prefix, **kwargs)

    @login_required
    def create_item(self):

        data = request.get_json()
        topics = data.pop("topics")
        assessment = Assessment(**data)
        db.session.add(assessment)

        try:
            db.session.commit()
            for topic in topics:
                assessment_topic = AssessmentTopic(assessment.id, topic["id"])
                db.session.add(assessment_topic)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400
        return jsonify(Assessment.get_schema().dump(assessment))

    @staticmethod
    def is_assessment_author(assessment):
        return current_user.id == assessment.user_id

    @login_required
    def get_item(self, id):
        item = self.model.query.get(id)

        if item:
            if self.is_assessment_author(item):
                return jsonify(self.schema.dump(item))
            else:
                return jsonify({"message": f"Forbidden"}), 403

        model_name = self.model.__name__
        return jsonify({"message": f"{model_name} not found"}), 404
