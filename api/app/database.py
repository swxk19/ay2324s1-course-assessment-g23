import psycopg2
import os
import traceback

def _connect():
    try:
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT"),
            database=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password= os.getenv("POSTGRES_PASSWORD"))
        return conn
    except Exception:
        traceback.print_exc()

# command = "CREATE TABLE IF NOT EXISTS users(user_id VARCHAR(255) PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL);"

def create_user(user_id, username, email, password):
    try:
        conn = _connect()
        with conn, conn.cursor() as cur:
            cur.execute("INSERT INTO users (user_id, username, email, password) VALUES (%s, %s, %s, %s)", (user_id, username, email, password))
            conn.commit()
    except Exception:
        traceback.print_exc()

def get_user(user_id):
    try:
        conn = _connect()
        with conn, conn.cursor() as cur:
            if user_id == "all":
                cur.execute("SELECT * FROM users")
                return cur.fetchall()
            else:
                cur.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
                return cur.fetchone()
    except Exception:
        traceback.print_exc()

def del_user(user_id):
    try:
        conn = _connect()
        with conn, conn.cursor() as cur:
            cur.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
            conn.commit()
            return True
    except Exception:
        traceback.print_exc()
        return False