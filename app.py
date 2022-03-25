# cursor = db.cursor()
# cursor.execute("SELECT * from users")
# data = cursor.fetchone()
# cursor.close()
import os
from flask import (
    Flask,
    render_template,
    send_from_directory,
    request,
    redirect,
    url_for,
)
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "admin"
app.config["MYSQL_DATABASE_DB"] = "db"
app.config["MYSQL_DATABASE_HOST"] = "localhost"
mysql.init_app(app)
db = mysql.connect()


@app.route("/")
def home():
    return "home"  # ! fix this


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
    cursor.close()
    if not data:
        return render_template(
            "login.html", isMsg=True, msg="Email or password is incorrect"
        )
    if data[-1] != password:
        return render_template(
            "login.html", isMsg=True, msg="Email or password is incorrect"
        )

    return f"{email} and {password}"


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


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico")


app.run(debug=True)
