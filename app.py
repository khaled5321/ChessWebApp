# cursor = db.cursor()
# cursor.execute("SELECT * from users")
# data = cursor.fetchone()
# cursor.close()
import os
import random
from flask import (
    Flask,
    render_template,
    send_from_directory,
    request,
    redirect,
    url_for,
    session,
)
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "admin"
app.config["MYSQL_DATABASE_DB"] = "db"
app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.secret_key = "random string"
mysql.init_app(app)
db = mysql.connect()

time_minutes = {"1": 1, "2": 5, "3": 10, "4": 15, "5": 30}
time_seconds = {"1": 3, "2": 5, "3": 10, "4": 15, "5": 20}
sides = ["white", "black"]


@app.route("/")
def home():
    return render_template("home.html")


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


@app.route("/login", methods=["GET"])
def login():
    return render_template("login.html", correct=False)


@app.route("/login", methods=["POST"])
def handle_login():
    cursor = db.cursor()
    email = request.form.get("email")
    password = request.form.get("pass")
    cursor.execute(f'SELECT * from login_cred WHERE email="{email}"')
    data = cursor.fetchone()
    if not data:
        cursor.close()
        return render_template(
            "login.html", isMsg=True, msg="Email or password is incorrect"
        )
    if data[-1] != password:
        cursor.close()
        return render_template(
            "login.html", isMsg=True, msg="Email or password is incorrect"
        )

    cursor.execute(f'SELECT username from users WHERE user_id="{data[1]}"')
    username = cursor.fetchone()[0]
    session["username"] = username
    cursor.close()

    return redirect(url_for(".home"))


@app.route("/register", methods=["GET"])
def register():
    return render_template("register.html", isMsg=False, msg="")


@app.route("/register", methods=["POST"])
def handle_register():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("pass")
    confirmpass = request.form.get("confirmpass")
    if password != confirmpass:
        return render_template(
            "register.html", isMsg=True, msg="Passwords don't match!"
        )

    cursor = db.cursor()
    cursor.execute(f'SELECT * from users WHERE username="{username}"')
    data_username = cursor.fetchone()
    cursor.execute(f'SELECT * from login_cred WHERE email="{email}"')
    data_email = cursor.fetchone()

    if data_username:
        cursor.close()
        return render_template(
            "register.html", isMsg=True, msg="Username already exists!"
        )

    if data_email:
        cursor.close()
        return render_template(
            "register.html", isMsg=True, msg="Email is already in use!"
        )

    cursor.execute(
        f'INSERT INTO users (username, games_played) VALUES ("{username}", 0)'
    )
    cursor.execute("SELECT MAX(user_ID) FROM users")
    last_id = cursor.fetchone()
    cursor.execute(
        f'INSERT INTO login_cred (user_ID, email, passwd) VALUES ({last_id[0]}, "{email}", "{password}")'
    )
    cursor.close()
    db.commit()

    return render_template(
        "login.html", isMsg=True, msg="Account created successfully! Login below."
    )


@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for(".home"))


@app.route("/profile")
def profile():
    return "profile"


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico")


if __name__ == "__main__":
    app.run(debug=True)
