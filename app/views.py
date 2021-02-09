from flask import render_template, request, redirect, url_for, session
from app import app
from .models import Board
from app import db, socketio


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