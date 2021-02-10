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


def create_field(x, y):
    current_board = get_board()
    fields_list = Field.query.all()
    fields_ids = [t.id for t in fields_list]
    if fields_ids:
        new_id = max(fields_ids) + 1
    else:
        new_id = 1
    new_field = Field(id=new_id, x=x, y=y, board_id=current_board.id)
    db.session.add(new_field)
    db.session.commit()
    return new_id
