from flask import session
from .models import Board, TextField
from app import db


def get_board():
    boards_list = Board.query.all()
    current_board = None
    for b in boards_list:
        if b.name == session['board_name']:
            current_board = b
    return current_board


def create_text_field(x, y):
    current_board = get_board()
    text_fields_list = list(filter(lambda tf: tf.board_id == current_board.id, TextField.query.all()))
    text_fields_ids = [t.id for t in text_fields_list]
    if text_fields_ids:
        new_id = max(text_fields_ids) + 1
    else:
        new_id = 1
    new_text_field = TextField(id=new_id, x=x, y=y, board_id=current_board.id)
    db.session.add(new_text_field)
    db.session.commit()
    return new_id


def get_text_field(text_field_id):
    current_board = get_board()
    text_field = list(filter(lambda tf: tf.board_id == current_board.id and tf.id == text_field_id,
                             TextField.query.all()))[0]
    return text_field
