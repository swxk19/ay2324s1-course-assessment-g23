import psycopg2
import os
import traceback

def connect():
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