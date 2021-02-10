from flask import session, abort
from .models import Field
from app import db, socketio
from flask_socketio import emit, join_room
from .backend import get_board, create_text_field


@socketio.event
def connect():
    join_room(session['board_name'])

    current_board = get_board()

    text_fields_list = list(filter(lambda tf: tf.board_id == current_board.id, Field.query.all()))
    data = []
    for tex_field in text_fields_list:
        data.append({
            'id': tex_field.id,
            'x': tex_field.x,
            'y': tex_field.y,
            'text': tex_field.text
        })

    emit('init', data)


@socketio.event
def create(data):
    x = data['x']
    y = data['y']

    new_id = create_text_field(x, y)
    data['id'] = new_id

    emit('create', data, to=session['board_name'])


@socketio.event
def move(data):
    x = data['x']
    y = data['y']
    text_field_id = int(data['id'])

    current_text_field = Field.query.get_or_404(text_field_id)
    current_text_field.x = x
    current_text_field.y = y
    db.session.commit()

    emit('move', data, to=session['board_name'])


@socketio.event
def delete(data):
    text_field_id = int(data['id'])
    current_board = get_board()
    current_text_field = Field.query.get_or_404(text_field_id)
    if current_text_field.board_id == current_board.id:
        abort(404)
    db.session.delete(current_text_field)
    db.session.commit()

    emit('delete', data, to=session['board_name'])


@socketio.event
def edit(data):
    text_field_id = int(data['id'])
    text = data['text']

    current_text_field = Field.query.get_or_404(text_field_id)
    current_text_field.text = text
    db.session.commit()

    emit('edit', data, to=session['board_name'])
