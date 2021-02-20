#!/usr/bin/sh

rm -r migrations
rm app.db
if [ -d "./venv" ]
then
    venv/bin/flask db init
    venv/bin/flask db migrate
    venv/bin/flask db upgrade
else
    flask db init
    flask db migrate
    flask db upgrade
fi
