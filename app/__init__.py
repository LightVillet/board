from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from threading import Lock


app = Flask(__name__)
app.config.from_object('config')

async_mode = None
socketio = SocketIO(app, async_mode=async_mode)

thread = None
thread_lock = Lock()

db = SQLAlchemy(app)
migrate = Migrate(app, db)


from app import views
