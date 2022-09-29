import os
from flask_login import current_user, login_required
from flask import request, jsonify, send_from_directory
from models.answer import Answer
from models.course_authorship import CourseAuthorship
from routes.crud_bp import CrudBp
from models.question import Question
from models.topic import Topic
from models.shared import db
from utils.pdf import PDF
import pandas as pd
import json
from werkzeug.utils import secure_filename


class QuestionBp(CrudBp):
    def __init__(self, name, import_name, url_prefix=None, **kwargs):
        super().__init__(name, import_name, Question, url_prefix, **kwargs)
        self.add_url_rule('/create_file', 'create_file',
                          self.create_files, methods=['POST'])
        self.add_url_rule('/download/<string:file_name>',
                          'download_file', self.download_file, methods=['GET'])

    # Returns 1 if the the current user is an author, 2 if the user is also the primary author
    # and 0 if the user is not an author
    def is_course_author(self, topic_id):
        # Check for authorship by going through the question's topic
        topic = Topic.query.get(topic_id)
        authorship = topic.course.authorships.filter(
            CourseAuthorship.author_id == current_user.id).first()
        return (authorship is not None) + authorship.is_primary_author

    @login_required
    def create_item(self):
     
        data = request.get_json()

        # TODO: Validate data
        if 'topic_id' not in data:
            return jsonify({'message': 'Missing topic ID'}), 400

        if not self.is_course_author(data['topic_id']):
            return jsonify({'message': 'You are not an author of the course this topic is in.'}), 403

        if 'answers' in data:
            answers = data.pop('answers')
        else:
            return jsonify({"message": "No answers provided"}), 400
    
        question = Question(**data)
        question.author_id = current_user.id
        db.session.add(question)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400

        for answer in answers:
            answer['question_id'] = question.id
            answer = Answer(**answer)
            db.session.add(answer)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400

        return jsonify(Question.get_schema().dump(question))

    @login_required
    def update_item(self, id):
        item = self.model.query.get(id)
        if not item:
            return jsonify({"message": "Question not found"}), 404

        data = request.get_json()

        authorship_check = self.is_course_author(item.topic_id)
        if not authorship_check:
            return jsonify({'message': 'You are not an author of the course this topic is in.'}), 403
        elif authorship_check == 1 and current_user.id != item.author_id:
            return jsonify({'message': 'You are not the primary author of the course or this question.'}), 403

        # Partial update excluding more complex fields
        for attr, value in data.items():
            if attr in self.schema.fields and attr not in ("answers", "id"):
                setattr(item, attr, value)
                
        if 'answers' in data:
            # Delete answers that were not included in the answers array
            current_answer_list_ids = [answer['id']
                                       for answer in data['answers'] if 'id' in answer]
            for answer in item.answers:
                if answer.id not in current_answer_list_ids:
                    db.session.delete(answer)

            for answer_input in data['answers']:
                # Existing answers already have an ID included in the dict
                if 'id' in answer_input:
                    answer = Answer.query.get(answer_input['id'])
                    if (answer):
                        # Partial update
                        answer_schema = Answer.get_schema()
                        for attr, value in answer_input.items():
                            if attr in answer_schema.fields:
                                setattr(answer, attr, answer_input[attr])
                    else:
                        return jsonify({"message": f"Answer {answer_input['id']} not found"}), 404
                else:
                    answer = Answer(**answer_input, question_id=item.id)
                    db.session.add(answer)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()

        return jsonify(Question.get_schema().dump(item))

    @login_required
    def delete_item(self, id):
        item = self.model.query.get(id)
        topic = item.topic
        authorship_check = self.is_course_author(topic.id)
        if not authorship_check:
            return jsonify({'message': 'You are not an author of the course this topic is in.'}), 403
        elif authorship_check == 1 and current_user.id != item.author_id:
            return jsonify({'message': 'You are not the primary author of the course or this question.'}), 403
        return super().delete_item(id)

    '''
    Question {
        question_text: string;
        question_type: string;
        topic_id: string;
        answers: Answer[];
        author_id: string;
    }
    Answer {
        answer_text: string;
        is_correct: boolean;
        question_id: string;
        point: number;
    }
    '''

    @login_required
    def questions_to_pdf(self, questions, file_name, assessment_title, teacher_copy=False):

        SIDE_MARGIN = 20
        TOP_MARGIN = 18
        pdf = PDF("P", "mm", "A4", (SIDE_MARGIN, TOP_MARGIN, SIDE_MARGIN))

        pdf.add_page()
        pdf.set_font("Arial", size=11)
        pdf.print_questions(questions, teacher_copy)

        pdf.output(f"temp/{current_user.id}/{file_name}.pdf", "F")
        

    @login_required
    def question_to_csv(self, questions, file_name, assessment_title):

        csv_question = {
            "No.": [],
            "Question Text": [],
            "Question Type": [],
            "Correct Answer": [],
            "Incorrect Answer": [],
            "Score": [],
        }
        counter = 0
        for question in questions:
            counter += 1
            csv_question["Question Text"].append(question["question_text"])
            csv_question["Question Type"].append(" ".join(question["question_type"].split("_")).title())
            csv_question["No."].append(counter)
            csv_question["Score"].append(question['score'])
            for answer in question["answers"]:
                if answer["is_correct"]:
                    csv_question["Correct Answer"].append(answer["answer_text"])
                else:
                    csv_question["Incorrect Answer"].append(answer["answer_text"])

            if len(csv_question["Correct Answer"]) > len(csv_question["Incorrect Answer"]):
                key_with_highest_length = "Correct Answer"
            else:
                key_with_highest_length = "Incorrect Answer"

            for key, value in csv_question.items():
                n = len(csv_question[key_with_highest_length]) - len(value)
                for i in range(n):
                    csv_question[key].append(None)
        df = pd.DataFrame(csv_question)
        df.to_csv(f"temp/{current_user.id}/{file_name}.csv", index=False)

    @login_required
    def create_files(self):
        # Generate random string to make file name unique
        questions = request.get_json()['questions']
        # Generate random string
        question_type = request.get_json()['type']
        assessment_title = request.get_json()['assessment_name']
        directory = f"temp/{current_user.id}/"
        os.makedirs(directory, exist_ok=True)
        if question_type == "student":
            file_name = "assessment_student_copy"
            self.questions_to_pdf(
                questions, file_name, assessment_title, teacher_copy=False)
        elif question_type == "teacher":
            file_name = "assessment_teacher_copy"
            self.questions_to_pdf(
                questions, file_name, assessment_title, teacher_copy=True)
        else:
            file_name = "assessment"
            self.question_to_csv(questions, file_name, assessment_title)

        extension = "csv" if question_type == "csv" else "pdf"

        return jsonify({
            "message": "Assessment has been created",
            "filename": f"{file_name}.{extension}",
        })

    @login_required
    def download_file(self, file_name):
        return send_from_directory(f"temp/{current_user.id}/", file_name, as_attachment=True,
                                   attachment_filename=file_name)
