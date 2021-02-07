from app import db

class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return '<Board {}>'.format(self.id)
