from flask import render_template, request, redirect, url_for, session
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


@app.route('/board/<board_name>', methods=['GET', 'PUT'])
def board(board_name):
    boards = Board.query.all()
    board = None
    for b in boards:
        if b.name == board_name:
            board = b
    if request.method == 'PUT':
        if not board:
            return 'error'
        return "test"
    elif request.method == 'GET':
        if not board:
            board = Board(name=board_name)
            db.session.add(board)
            db.session.commit()
        print(board.name)
        return render_template("board.html")
