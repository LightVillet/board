#!/usr/bin/sh

rm -r migrations
rm app.db
venv/bin/flask db init
venv/bin/flask db migrate
venv/bin/flask db upgrade
