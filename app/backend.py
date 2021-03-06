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


def create_field(x, y, height, width, data, field_type, field_name):
    current_board = get_board()
    new_field = Field(type=field_type,
                      x=x,
                      y=y,
                      name=field_name,
                      data=data,
                      width=width,
                      height=height,
                      board_id=current_board.id)
    field_list = list(filter(lambda f: f.board_id == new_field.board_id and f.id != new_field.id,
                             Field.query.all()))
    field_list_z = [f.z_index for f in field_list]
    if field_list_z:
        new_field.z_index = max(field_list_z) + 1
    else:
        new_field.z_index = 1
    db.session.add(new_field)
    db.session.commit()

    return new_field
