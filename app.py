from flask import Flask, render_template, send_from_directory
from flask_migrate import Migrate
from flask_reggie import Reggie
from models.shared import db, ma, bcrypt, login_manager
from routes.api import api
import dotenv
import os

app = Flask(__name__, template_folder='./client/build', static_folder='./client/build/static')

# Configuring the application from .env file
dotenv_path = os.path.join(os.getcwd(), '.env')
dotenv.load_dotenv(dotenv_path)

# setting database
DB_URI = os.getenv("DATABASE_URL")
if DB_URI and DB_URI.startswith("postgres://"):
    DB_URI = DB_URI.replace("postgres://", "postgresql://")
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['UPLOAD_FOLDER'] = "uploads"

# Initializing the database and migrations
db.init_app(app)
migrate = Migrate(app, db)

# Regex converter
Reggie(app)

# Initializing marshmallow
ma.init_app(app)
bcrypt.init_app(app)
login_manager.init_app(app)

# Make folder for temp question pdf folder
if not os.path.exists('./temp'):
    os.makedirs('./temp')           

if not os.path.exists('./uploads'):
    os.makedirs('./uploads')     

# Register blueprints
app.register_blueprint(api, url_prefix='/api/v1')

@app.route('/images/<path:path>')
def send_image(path):
    return send_from_directory(os.path.abspath(os.getcwd()), path)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    return render_template("index.html")

@app.route("/<regex('([a-zA-Z\_]+\/)*[a-zA-Z]+\.[a-zA-Z]+'):file>")
def serve_static(file):
    print(f"Looking for {file}")
    return send_from_directory(app.template_folder, file)

if __name__ == '__main__':
    app.run()


