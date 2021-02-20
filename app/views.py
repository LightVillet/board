from flask import render_template, request, redirect, url_for, session, json, send_file
from app import app
from .models import Board, Field
from app import db, socketio
import logging
from .backend import create_field
import io
import base64


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        board_name = request.form['board_name']
        session['board_name'] = board_name
        return redirect(url_for('board', board_name=board_name))
    else:
        return render_template("index.html")


@app.route('/board/<board_name>')
def board(board_name):
    boards = Board.query.all()
    _board = None
    for b in boards:
        if b.name == board_name:
            _board = b

    if not _board:
        _board = Board(name=board_name)
        db.session.add(_board)
        db.session.commit()

    return render_template("board.html", board_name=board_name, async_mode=socketio.async_mode)


@app.route('/upload', methods=['POST'])
def upload():
    boards = Board.query.all()
    _board = None
    for b in boards:
        if b.name == session['board_name']:
            _board = b

    data = json.loads(request.data)

    x = data['x']
    y = data['y']
    width = data['width']
    height = data['height']
    field_data = data.get('data', '')
    field_type = data['type']
    if field_type == 'file':
        field_type = field_data.split('data')[1].split(';base64,')[0]
    field_data = field_data.split('base64,')[1]
    field_name = data['name']

    new_field = create_field(x, y, height, width, field_data, field_type, field_name)
    data['id'] = new_field.id
    data['z'] = new_field.z_index

    socketio.emit('create', data, to=session['board_name'])
    return ""


@app.route('/download/<field_id>', methods=['GET'])
def download(field_id):
    boards = Board.query.all()
    _board = None
    for b in boards:
        if b.name == session['board_name']:
            _board = b

    field = Field.query.get(field_id)
    data = field.data
    data = base64.b64decode(data)
    print(field.name)
    return send_file(
        io.BytesIO(data),
        attachment_filename=field.name,
        mimetype=field.type
    )
