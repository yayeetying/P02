import sqlite3

DB_FILE="users.db"

db = sqlite3.connect(DB_FILE)
c = db.cursor()

command = '''CREATE TABLE IF NOT EXISTS users(
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    numRaces INTEGER,
    numCoins INTEGER)'''
c.execute(command)

command2 = '''CREATE TABLE IF NOT EXISTS ducks(
    username TEXT NOT NULL,
    duckName TEXT NOT NULL,
    runLvl INTEGER,
    swimLvl INTEGER,
    flyLvl INTEGER,
    stamina INTEGER,
    runProg INTEGER,
    swimProg INTEGER,
    flyProg INTEGER,
    run1 INTEGER,
    run2 INTEGER,
    run3 INTEGER,
    swim1 INTEGER,
    swim2 INTEGER,
    swim3 INTEGER,
    fly1 INTEGER,
    fly2 INTEGER,
    fly3 INTEGER,
    cosmetics TEXT NOT NULL)'''
c.execute(command2)

command3 = '''CREATE TABLE IF NOT EXISTS cosmeticsList(
    username TEXT NOT NULL,
    cosmetics LIST)'''
c.execute(command3)

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
    loginsinfo = mak
    eLoginsDict()
    return username in loginsinfo.keys()

def checkUserPass(username, password):
    loginsinfo = makeLoginsDict()
    return (username in loginsinfo.keys()) and (loginsinfo[username] == password)


def addDuck(username, duckName, runLvl, swimLvl, flyLvl, stamina):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("INSERT INTO ducks VALUES(?, ?, ?, ?, ?, ?, ?)", (username, duckName, runLvl, swimLvl, flyLvl, stamina, ""))
    db.commit()
    db.close()

def getDuck(username):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("SELECT duckName, runLvl, swimLvl, flyLvl, stamina, cosmetics FROM ducks WHERE username = " + username)
    duckInfo = c.fetchall()
    return duckInfo
    db.commit()
    db.close()

def updateDuck(username, oldDuckName, newDuckName, runLvl, swimLvl, flyLvl, stamina, cosmetics):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("UPDATE ducks SET duckName = (?), runLvl = (?), swimLvl = (?), flyLvl = (?), stamina = (?), cosmetics = (?) WHERE username = (?) AND duckName = (?)", (newDuckName, runLvl, swimLvl, flyLvl, stamina, cosmetics, username, oldDuckName))
    db.commit()
    db.close()

def addCosmetics(username, cosmetics):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("SELECT cosmetics FROM cosmeticsList WHERE username = " + username)
    store = list(c.fetchall())
    store.append(cosmetics)
    c.execute("UPDATE cosmeticsList SET cosmetics = (?)", (store))
    db.commit()
    db.close()

def getCosmetics(username):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("SELECT cosmetics FROM cosmeticsList WHERE username = " + username)
    store = list(c.fetchall())
    return store
    db.commit()
    db.close()
