from app import db


class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)

    def __repr__(self):
        return '<Board {}>'.format(self.name)


class Field(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    data = db.Column(db.String)

    board_id = db.Column(db.Integer, db.ForeignKey('board.id'))

    def __repr__(self):
        return '<TextField {}-{}>'.format(self.board_id, self.id)
