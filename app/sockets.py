from flask import session, abort
from .models import Board, TextField
from app import db, socketio
from flask_socketio import emit, join_room
from .backend import get_board, create_field


@socketio.event
def connect():
    join_room(session['board_name'])

    current_board = get_board()

    fields_list = list(filter(lambda tf: tf.board_id == current_board.id, TextField.query.all()))
    data = []
    for field in fields_list:
        data.append({
            'id': field.id,
            'x': field.x,
            'y': field.y,
            'text': field.text,
            'width': field.width,
            'height': field.height,
        })

    emit('init', data)


@socketio.event
def create(data):
    x = data['x']
    y = data['y']
    width = data['width']
    height = data['height']

    new_id = create_field(x, y)
    data['id'] = new_id

    emit('create', data, to=session['board_name'])


@socketio.event
def move(data):
    x = data['x']
    y = data['y']
    field_id = int(data['id'])

    current_field = TextField.query.get_or_404(field_id)
    current_field.x = x
    current_field.y = y
    db.session.commit()

    emit('move', data, to=session['board_name'])


@socketio.event
def delete(data):
    field_id = int(data['id'])
    current_board = get_board()
    current_field = TextField.query.get_or_404(field_id)
    if current_field.board_id == current_board.id:
        abort(404)
    db.session.delete(current_field)
    db.session.commit()

    emit('delete', data, to=session['board_name'])


@socketio.event
def save(data):
    field_id = int(data['id'])
    text = data['text']
    width = data['width']
    height = data['height']

    current_field = TextField.query.get_or_404(field_id)
    current_field.text = text
    current_field.width = width
    current_field.height = height
    db.session.commit()

    emit('save', data, to=session['board_name'])
