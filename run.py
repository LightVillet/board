#!venv/bin/python
from app import socketio, app

if __name__ == "__main__":
    while True:
        try:
            socketio.run(app, debug=True, host='0.0.0.0', port='80')
        except Exception as e:
            print(str(e))
