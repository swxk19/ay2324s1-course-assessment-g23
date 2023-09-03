import psycopg2
import os

conn = psycopg2.connect(
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT"),
    database=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password= os.getenv("POSTGRES_PASSWORD"))

def create_user(user_id, username, email, password):
    with conn.cursor() as cur:
        cur.execute("INSERT INTO users (user_id, username, email, password) VALUES (%s, %s, %s, %s)", (user_id, username, email, password))
        conn.commit()

def get_user(user_id):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        return cur.fetchone()