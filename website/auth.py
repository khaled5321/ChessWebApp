from flask import Blueprint, redirect, render_template, request, session, url_for

auth = Blueprint('auth', __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html", correct=False)  # ? ??

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("pass")
        # !database query here


@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html", isMsg=False, msg="")

    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("pass")
        confirmpass = request.form.get("confirmpass")

        if password != confirmpass:
            return render_template(
                "register.html", isMsg=True, msg="Passwords don't match!"
            )
        # ! database query here


@auth.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("/")) # ! check this!

# def handle_login():
#     cursor = db.cursor()
#     email = request.form.get("email")
#     password = request.form.get("pass")
#     cursor.execute(f'SELECT * from login_cred WHERE email="{email}"')
#     data = cursor.fetchone()
#     if not data:
#         cursor.close()
#         return render_template(
#             "login.html", isMsg=True, msg="Email or password is incorrect"
#         )
#     if data[-1] != password:
#         cursor.close()
#         return render_template(
#             "login.html", isMsg=True, msg="Email or password is incorrect"
#         )

#     cursor.execute(f'SELECT username from users WHERE user_id="{data[1]}"')
#     username = cursor.fetchone()[0]
#     session["username"] = username
#     cursor.close()

#     return redirect(url_for(".home"))


# @app.route("/register", methods=["POST"])
# def handle_register():
#     username = request.form.get("username")
#     email = request.form.get("email")
#     password = request.form.get("pass")
#     confirmpass = request.form.get("confirmpass")
#     if password != confirmpass:
#         return render_template(
#             "register.html", isMsg=True, msg="Passwords don't match!"
#         )

#     cursor = db.cursor()
#     cursor.execute(f'SELECT * from users WHERE username="{username}"')
#     data_username = cursor.fetchone()
#     cursor.execute(f'SELECT * from login_cred WHERE email="{email}"')
#     data_email = cursor.fetchone()

#     if data_username:
#         cursor.close()
#         return render_template(
#             "register.html", isMsg=True, msg="Username already exists!"
#         )

#     if data_email:
#         cursor.close()
#         return render_template(
#             "register.html", isMsg=True, msg="Email is already in use!"
#         )

#     cursor.execute(
#         f'INSERT INTO users (username, games_played) VALUES ("{username}", 0)'
#     )
#     cursor.execute("SELECT MAX(user_ID) FROM users")
#     last_id = cursor.fetchone()
#     cursor.execute(
#         f'INSERT INTO login_cred (user_ID, email, passwd) VALUES ({last_id[0]}, "{email}", "{password}")'
#     )
#     cursor.close()
#     db.commit()

#     return render_template(
#         "login.html", isMsg=True, msg="Account created successfully! Login below."
#     )
