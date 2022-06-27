import os
from flask import send_from_directory
from website import create_app
from flask_socketio import SocketIO


app = create_app()
socketio = SocketIO(app)


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico")


if __name__ == '__main__':
    socketio.run(app, debug=True)
