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

db.commit()
db.close()


def addUser(username, password, raceCompleted, coins):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    c.execute("INSERT INTO logins VALUES(?, ?, ?, ?)", (username, password, raceCompleted, coins))
    db.commit()
    db.close()
