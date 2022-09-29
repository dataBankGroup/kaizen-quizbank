import re
from flask import request, jsonify
from flask_login import login_required, login_user, current_user, logout_user
from routes.crud_bp import CrudBp
from models.user import User
from models.shared import db, bcrypt, login_manager


class UserBp(CrudBp):
    def __init__(self, name, import_name, url_prefix=None, **kwargs):
        super().__init__(name, import_name, User, url_prefix, **kwargs)
        self.add_url_rule('/login', view_func=self.login, methods=['POST'])
        self.add_url_rule('/logout', view_func=self.logout, methods=['POST'])
        self.add_url_rule('/current', view_func=self.current_user, methods=['GET'])
    
    def validate_email(self, email):
        return re.match(r'^[a-zA-Z0-9_.+-]+@tip.edu.ph$', email)

    def create_item(self):
        data = request.get_json()
        # Check if the email given is a valid format using regex
        if not self.validate_email(data['email']):
            return jsonify({"message": "Invalid email"}), 400
        
        # Check if the email is already in use
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already in use"}), 400
        
        # Hash password
        if 'password' not in data:
            return jsonify({"message": "Password not provided"}), 400
        data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        # TODO: Validate data
        user = User(**data)
        db.session.add(user)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}), 400
        return jsonify(User.get_schema().dump(user))
    
    def login(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "Incorrect email/password"}), 400
        if not self.verify_password(user, data['password']):
            return jsonify({"message": "Incorrect email/password"}), 400
        login_user(user)
        return jsonify(User.get_schema().dump(user))
    
    @login_required
    def logout(self):
        logout_user()
        return jsonify({"message": "Logged out"})

    def current_user(self):
        if current_user.is_authenticated:
            user = User.query.get(current_user.get_id())
            return jsonify(User.get_schema().dump(user))
        return jsonify({"message": "Not logged in"}), 401
    
    @login_manager.user_loader
    def user_loader(user_id):
        user = User.query.get(int(user_id))
        return user    

    def verify_password(self, user, password):
        return bcrypt.check_password_hash(user.password, password)
