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


@app.route('/board/<board_name>')
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

    if not _board:
        _board = Board(name=board_name)
        db.session.add(_board)
        db.session.commit()

    return render_template("board.html", board_name=board_name, async_mode=socketio.async_mode)