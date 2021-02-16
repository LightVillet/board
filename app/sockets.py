from flask import session, abort
from .models import Field
from app import db, socketio
from flask_socketio import emit, join_room
from .backend import get_board, create_field


@socketio.event
def connect():
    join_room(session['board_name'])

    current_board = get_board()

    fields_list = list(filter(lambda tf: tf.board_id == current_board.id, Field.query.all()))
    data = []
    for field in fields_list:
        data.append({
            'id': field.id,
            'x': field.x,
            'y': field.y,
            'data': field.data,
            'width': field.width,
            'height': field.height,
            'type': field.type
        })

    emit('init', data)


@socketio.event
def create(data):
    x = data['x']
    y = data['y']
    width = data['width']
    height = data['height']
    field_data = data.get('data', '')
    field_type = data['type']

    new_field = create_field(x, y, width, height, field_data, field_type)
    data['id'] = new_field.id
    data['z'] = new_field.z_index

    emit('create', data, to=session['board_name'])


@socketio.event
def move(data):
    x = data['x']
    y = data['y']
    field_id = int(data['id'])

    current_field = Field.query.get_or_404(field_id)
    current_field.x = x
    current_field.y = y
    field_list = list(filter(lambda f: f.board_id == current_field.board_id and f.id != current_field.id,
                             Field.query.all()))
    field_list_z = [f.z_index for f in field_list]
    current_field.z_index = max(field_list_z) + 1
    db.session.commit()

    data['z'] = current_field
    emit('move', data, to=session['board_name'])


@socketio.event
def delete(data):
    field_id = int(data['id'])
    current_board = get_board()

    current_field = Field.query.get_or_404(field_id)
    if current_field.board_id != current_board.id:
        abort(404)
    db.session.delete(current_field)
    db.session.commit()

    emit('delete', data, to=session['board_name'])


@socketio.event
def save(data):
    field_id = data['id']
    field_data = data.get('data', None)
    width = data.get('width', None)
    height = data.get('height', None)

    current_field = Field.query.get_or_404(field_id)
    if data:
        current_field.data = field_data
    if width:
        current_field.width = width
    if height:
        current_field.height = height
    db.session.commit()

    emit('save', data, to=session['board_name'])
