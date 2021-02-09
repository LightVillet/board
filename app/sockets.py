from flask import session
from .models import Board, TextField
from app import db, socketio
from flask_socketio import emit, join_room


@socketio.event
def connect():
    join_room(session['board_name'])


@socketio.event
def update(message):
    action = message['action']
    data = message['data']
    x = data['x']
    y = data['y']

    boards_list = Board.query.all()
    current_board = None
    for b in boards_list:
        if b.name == session['board_name']:
            current_board = b

    if action == 'create':
        text_fields_list = list(filter(lambda tf: tf.board_id == current_board.id, TextField.query.all()))
        text_fields_ids = [t.id for t in text_fields_list]
        if text_fields_ids:
            new_id = max(text_fields_ids) + 1
        else:
            new_id = 1
        new_text_field = TextField(id=new_id, x=x, y=y, board_id=current_board.id)
        db.session.add(new_text_field)
        db.session.commit()

        message['data']['id'] = new_id
    elif action == 'move':
        text_field_id = data['id']
        current_text_field = TextField.query.get(text_field_id)
        current_text_field.x = x
        current_text_field.y = y
        db.session.commit()

        emit('update', message, to=session['board_name'])