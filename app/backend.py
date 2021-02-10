from flask import session
from .models import Board, Field
from app import db


def get_board():
    boards_list = Board.query.all()
    current_board = None
    for b in boards_list:
        if b.name == session['board_name']:
            current_board = b

    return current_board


def create_field(x, y, height, width, data, field_type):
    current_board = get_board()

    new_field = Field(type=field_type, x=x, y=y, data=data, width=width, height=height, board_id=current_board.id)
    db.session.add(new_field)
    db.session.commit()

    return new_field.id
