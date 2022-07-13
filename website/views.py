import os
import random
from flask import Blueprint, render_template, request, send_from_directory

views = Blueprint('views', __name__)

time_minutes = {"1": 1, "2": 5, "3": 10, "4": 15, "5": 30}
time_seconds = {"1": 3, "2": 5, "3": 10, "4": 15, "5": 20}
sides = ["white", "black"]

@views.route("/")
def home():
    return render_template("home.html")


@views.route("/play/online", methods=["POST"])
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


@views.route("/play/offline", methods=["POST"])
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


@views.route("/play/stockfish", methods=["POST"])
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


@views.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(views.root_path, "static"), "favicon.ico")
