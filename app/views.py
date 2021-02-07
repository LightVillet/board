from flask import render_template, request, redirect, url_for, session
from app import app


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        name = request.form['name']
        session['board_name'] = name
        return redirect(url_for('board', name=name))
    else:
        return render_template("index.html")


@app.route('/board')
def board(name):
    return name
