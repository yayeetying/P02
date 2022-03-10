import sqlite3

DB_FILE="users.db"

db = sqlite3.connect(DB_FILE)
c = db.cursor()

command = '''CREATE TABLE IF NOT EXISTS users(
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    raceCompleted INTEGER,
    coins INTEGER)'''
c.execute(command)

command2 = '''CREATE TABLE IF NOT EXISTS ducks(
    username TEXT NOT NULL,
    duckName TEXT NOT NULL,
    runLvl INTEGER,
    swimLvl INTEGER,
    flyLvl INTEGER,
    stamina INTEGER,
    cosmetics TEXT NOT NULL)'''
c.execute(command2)

db.commit()
db.close()


def addUser(username, password):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("INSERT INTO users VALUES(?, ?, ?, ?)", (username, password, 0, 0))
    db.commit()
    db.close()

def makeLoginsDict():
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("SELECT * FROM logins")
    logininfo = c.fetchall()

    loginsinfo = {} # create a dictionary for all the login information

    for login in logininfo:
        loginsinfo[login[0]] = login[1]

    return loginsinfo
    db.commit()
    db.close()

def checkUser(username):
    loginsinfo = makeLoginsDict()
    return username in loginsinfo.keys()

def checkUserPass(username, password):
    loginsinfo = makeLoginsDict()
    return (username in loginsinfo.keys()) and (loginsinfo[username] == password)


def addDuck(username, duckName, runLvl, swimLvl, flyLvl, stamina, cosmetics):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("INSERT INTO ducks VALUES(?, ?, ?, ?, ?, ? ,?)", (username, duckName, 0, 0, 0, 0, cosmetics))
    db.commit()
    db.close()

def getDuck(username):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("SELECT")
