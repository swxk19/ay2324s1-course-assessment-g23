import psycopg2
import os
import traceback
from fastapi import HTTPException

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

def execute_sql_write(sql_command: str, params: tuple=None):
    conn = connect()
    try:
        with conn, conn.cursor() as cur:
            if params:
                cur.execute(sql_command, params)
            else:
                cur.execute(sql_command)

            conn.commit()

    except psycopg2.DatabaseError as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def execute_sql_read_fetchone(sql_command: str, params: tuple=None):
    conn = connect()
    try:
        with conn, conn.cursor() as cur:
            if params:
                cur.execute(sql_command, params)
            else:
                cur.execute(sql_command)
            return cur.fetchone()

    except psycopg2.DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def execute_sql_read_fetchall(sql_command: str, params: tuple=None):
    conn = connect()
    try:
        with conn, conn.cursor() as cur:
            if params:
                cur.execute(sql_command, params)
            else:
                cur.execute(sql_command)
            return cur.fetchall()

    except psycopg2.DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))