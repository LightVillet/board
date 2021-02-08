from flask import render_template, request, redirect, url_for, session, jsonify, json
from app import app
from .models import Board, TextField
from app import db, socketio
from flask_socketio import send


@socketio.event
def handle_message(data):
    print('received message: ' + data)
    send('2')


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        board_name = request.form['board_name']
        session['board_name'] = board_name
        return redirect(url_for('board', board_name=board_name))
    else:
        return render_template("index.html")


@app.route('/board/<board_name>', methods=['GET'])
def board(board_name):
    if 'board_name' not in session:
        return 'error session'
    if session['board_name'] != board_name:
        return 'error name'

    boards = Board.query.all()
    _board = None
    for b in boards:
        if b.name == board_name:
            _board = b

    if request.method == 'PUT':
        if not _board:
            return 'error'
        return "success"
    elif request.method == 'GET':
        if not _board:
            _board = Board(name=board_name)
            db.session.add(_board)
            db.session.commit()
        return render_template("board.html", board_name=board_name)


@app.route('/board/<board_name>/update', methods=['POST', 'GET', 'PUT'])
def board_update(board_name):
    if 'board_name' not in session:
        return 'error session'
    if session['board_name'] != board_name:
        return 'error name'

    boards = Board.query.all()
    _board = None
    for b in boards:
        if b.name == board_name:
            _board = b
    if not _board:
        return 'error'

    if request.method == 'GET':
        text_fields = TextField.query.all()
        _tf = list(filter(lambda tf: tf.board_id == _board.id, text_fields))
        result = []
        for t in _tf:
            result.append({'id': t.id, 'x': t.x, 'y': t.y})
        return jsonify(result)
    elif request.method == 'POST':
        data = json.loads(request.data)
        x = data['x']
        y = data['y']

        list_t = list(filter(lambda tf: tf.board_id == _board.id, TextField.query.all()))
        list_id = [t.id for t in list_t]
        if list_id:
            id_t = max(list_id) + 1
        else:
            id_t = 1
        tf_ = TextField(id=id_t, x=x, y=y, board_id=_board.id)
        db.session.add(tf_)
        db.session.commit()
        return jsonify({'id': tf_.id})
    elif request.method == 'PUT':
        data = json.loads(request.data)
        x = data['x']
        y = data['y']
        id = data['id']
        text_fields = TextField.query.all()
        print(id, _board.id)
        # print(text_fields)
        tf = list(filter(lambda t: t.board_id == _board.id and t.id == id, text_fields))[0]
        tf.x = x
        tf.y = y
        db.session.commit()
        return 'test'
