import random
from flask import (
    Flask,
    render_template,
    request,
)
from flaskext.mysql import MySQL
from flask_socketio import SocketIO, send

app = Flask(__name__)
mysql = MySQL()
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "admin"
app.config["MYSQL_DATABASE_DB"] = "db"
app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.secret_key = "random string"
mysql.init_app(app)
socketio = SocketIO(app)
db = mysql.connect()

time_minutes = {"1": 1, "2": 5, "3": 10, "4": 15, "5": 30}
time_seconds = {"1": 3, "2": 5, "3": 10, "4": 15, "5": 20}
sides = ["white", "black"]


@app.route("/play/online", methods=["POST"])
def play_online():
    time_control = request.form.get("time_control")
    minutes = time_minutes[request.form.get("minutes")]
    seconds = time_seconds[request.form.get("seconds")]
    turn = request.form.get("side")

    if time_control == "unlimited":
        minutes = None
        seconds = None

    if turn == "random":
        turn = random.choice(sides)

    data = {
        "timecontrol": time_control,
        "minutes": minutes,
        "seconds": seconds,
        "turn": turn,
        "mode": "online",
    }

    return render_template("play.html", data=data)


@app.route("/play/offline", methods=["POST"])
def play_offline():
    time_control = request.form.get("time_control")
    minutes = time_minutes[request.form.get("minutes")]
    seconds = time_seconds[request.form.get("seconds")]
    if time_control == "unlimited":
        minutes = None
        seconds = None

    data = {
        "timecontrol": time_control,
        "minutes": minutes,
        "seconds": seconds,
        "turn": "",
        "mode": "offline",
    }

    return render_template("play.html", data=data)


@app.route("/play/stockfish", methods=["POST"])
def play_stockfish():
    turn = request.form.get("side")
    if turn == "random":
        turn = random.choice(sides)

    data = {
        "timecontrol": "",
        "minutes": "",
        "seconds": "",
        "turn": turn,
        "mode": "stockfish",
    }
    return render_template("play.html", data=data)


@socketio.on('message')
def handle_message(data):
    print(data)
    send(data)
