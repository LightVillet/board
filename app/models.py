from app import db


class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)

    def __repr__(self):
        return '<Board {}>'.format(self.name)


class TextField(db.Model):
    field_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.Integer)
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    board_id = db.Column(db.Integer, db.ForeignKey('board.id'))

    def __repr__(self):
        return '<TextField {}-{}>'.format(self.field_id, self.id)
