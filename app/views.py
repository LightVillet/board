from flask import render_template, request, redirect, url_for, session, jsonify
from app import app
from .models import Board
from app import db


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
            db.session.add(board)
            db.session.commit()
        print(_board.name)
        return render_template("board.html", board_name=board_name)


@app.route('/board/<board_name>/update')
def board_update(board_name):
    if request.method == 'GET':
        return jsonify([{'id': 1, 'x': 100, 'y': 20}])
