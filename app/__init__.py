from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO


app = Flask(__name__)
app.config.from_object('config')

async_mode = None
socketio = SocketIO(app, async_mode=async_mode)

db = SQLAlchemy(app)
migrate = Migrate(app, db)


from app import views
from app import sockets
