from flask import render_template, request, redirect, url_for, session
from app import app


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
    return board_name
