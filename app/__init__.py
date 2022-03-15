from os import urandom
from flask import Flask, render_template, request, session, redirect
import sqlite3, os.path
import json
import urllib
import random

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
    c.execute("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, numRaces TEXT, numCoinsTEXT, UNIQUE(username))")
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
        c.execute("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, numRaces TEXT, numCoinsTEXT, UNIQUE(username))")
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
        c.execute("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, numRaces TEXT, numCoins TEXT, UNIQUE(username))")
        c.execute("SELECT username FROM users WHERE username=?", (username,))

        if (c.fetchone() == None): #user doesn't exist; continue with registration
            #default number of races and coins = 0
            c.execute("INSERT INTO users(username, password, numRaces, numCoins) VALUES(?, ?, 0, 0)", (username, password))


        else: #error: username already taken
            return render_template("register.html", error="Username taken already")
        db.commit()
        db.close()
        return redirect("/login")
    else:
        return render_template("register.html") # , test='&quot'
@app.route("/game", methods=['GET', 'POST'])
def game():
    return render_template("game.html", name="PLEAERIUAFHLEIURHF", skin="https://i.pinimg.com/originals/f5/43/45/f543457069261f595ed8b896746099fb.jpg")

if __name__ == "__main__":
    app.debug = True
    app.run()
