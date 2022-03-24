from os import urandom
from flask import Flask, render_template, request, session, redirect
import sqlite3, os.path
import json
import urllib
import random
import db

app = Flask(__name__)
app.secret_key = urandom(32)

def islogged():
    return 'username' in session.keys()

@app.route("/", methods=['GET', 'POST'])
def home():
    return render_template('home.html')

@app.route("/logout",  methods=['GET', 'POST'])
def logout():
    # try except is for when user is not logged in and does /logout anyways and a KeyError occurs
    try:
        session.pop('username')
        session.pop('password')
    except KeyError:
        return redirect("/")
    return redirect("/")

#login takes the user object and sets cookies
@app.route("/login",  methods=['GET', 'POST'])
def login():
    # stops a loggedin user when they try to log in
    if islogged():
        return render_template('loggedlock.html')
    #create users table so user can login
    db = sqlite3.connect("users.db")
    c = db.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, numRaces INT, numCoins INT, UNIQUE(username))")
    db.commit()
    db.close()
    return render_template('login.html')

# authentication of login; verifies login information
@app.route("/auth", methods=['GET', 'POST'])
def auth():
    if (request.method == 'POST'):

        username = request.form.get("username")
        password = request.form.get("password")

        #error handling for empty username
        if username == '':
            return render_template("login.html", error="Empty username, who are you?")

        db = sqlite3.connect('users.db')
        c = db.cursor()
        #in case users goes straight to /register w/o running /login code
        c.execute("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, numRaces INT, numCoins INT, UNIQUE(username))")
        c.execute("SELECT username FROM users WHERE username=? ", (username,)) #SYNTAX: ADD , after to refer to entire username, otherwise SQL will count each char as a binding... -_-
        # username inputted by user is not found in database
        if c.fetchone() == None:
            return render_template("login.html", error="Wrong username, double check spelling or register")
        # username is found
        else:
            c.execute("SELECT password FROM users WHERE username=? ", (username,))
            # password associated with username in database does not match password inputted

            #c.fetchone() returns a tuple with the password
            #first convert the tuple into the password string only, then compare
            if ( ''.join(c.fetchone()) ) != password:
                return render_template("login.html", error="Wrong password")
            # password is correct
            else:
                session['username'] = username
                session['password'] = password
                print(session['username'])
        db.close()
        return redirect('/')

    #get method
    else:
        return redirect('/login')


@app.route("/register", methods=['GET', 'POST'])
def register():
    if (request.method == 'POST'):
        username = request.form.get("username")
        password = request.form.get("password")
        reenterpasswd = request.form.get("reenterpasswd")

        #error handling
        if username == '':
            return render_template("register.html", error="Empty username, who are you?")
        elif password == '':
            return render_template("register.html", error="Empty password, you'll get hacked y'know :)")
        elif password != reenterpasswd:
            return render_template("register.html", error="Passwords don't match")
        #username can have leading numbers and special chars in them

        db = sqlite3.connect('users.db')
        c = db.cursor()
        c.execute("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, numRaces INT, numCoins INT, UNIQUE(username))")
        c.execute("SELECT username FROM users WHERE username=?", (username,))

        if (c.fetchone() == None): #user doesn't exist; continue with registration
            #default number of races and coins = 0
            c.execute("INSERT INTO users(username, password, numRaces, numCoins) VALUES(?, ?, 0, 0)", (username, password))
            c.execute("INSERT INTO ducks VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (username, request.form.get("duckname"), 0, 0, 0, 50, 0, 0, 0, ""))


        else: #error: username already taken
            return render_template("register.html", error="Username taken already")
        db.commit()
        db.close()
        return redirect("/login")
    else:
        return render_template("register.html") # , test='&quot'
@app.route("/game", methods=['GET', 'POST'])
def game():
    print(request.method)
    #if (islogged()): #and there is a duck skin associated
        #return render_template("game.html", name="Button", skin="https://ucarecdn.com/2535651a-50f7-490d-899d-3376864a5eaa/duckgreen.png")

    stats = request.get_json()
    print(stats)
    return render_template("game.html", name="Button", skin="https://ucarecdn.com/2535651a-50f7-490d-899d-3376864a5eaa/duckgreen.png")
    #https://ucarecdn.com/2535651a-50f7-490d-899d-3376864a5eaa/duckgreen.png
    #https://ucarecdn.com/cabfb785-569c-44ea-8f2f-88fd17ef8555/duckwhite.png
    #https://ucarecdn.com/5db28345-9deb-4530-a434-732b59f6f54f/duckgray.png
@app.route("/profile", methods=['GET', 'POST'])
def profile():
    return render_template("profile.html")
@app.route("/save", methods=['POST'])
def save():
    if (session.get("username") != None):
        duck = json.loads(request.form.get('duck'))
        db = sqlite3.connect("users.db")
        c = db.cursor()
        c.execute("UPDATE ducks SET runLvl=?, swimLvl=?, flyLvl=?, stamina=?, runProg=?, swimProg=?, flyProg=? WHERE username=?", (duck[0], duck[1], duck[2], duck[3], duck[4], duck[5], duck[6], session.get("username")))
        user = request.form.get("user")
        c.execute("UPDATE users SET numCoins=?", (user,))
        db.commit()
        db.close()
    return "success"
@app.route("/load", methods=['GET'])
def load():
    if (request.headers.get("X-Requested-With") == "XMLHttpRequest"):
        if (session.get("username") != None):
            dbs = sqlite3.connect("users.db")
            c = dbs.cursor()
            c.execute("SELECT * FROM ducks WHERE username=?", (session.get("username"),))
            duck = c.fetchall()[0]
            c.execute("SELECT numRaces, numCoins FROM users WHERE username=?", (session.get("username"),))
            user = c.fetchall()[0]
            return json.dumps((duck, user))
        else:
            return "no user"
    else:
        return redirect("/")



if __name__ == "__main__":
    app.debug = True
    app.run()
