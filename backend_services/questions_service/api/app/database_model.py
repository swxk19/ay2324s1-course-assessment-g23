import psycopg2
import os
import traceback
from fastapi import HTTPException


class Database:
    def __init__(self, host, port, database, user, password):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password

    def _connect(self):
        try:
            conn = psycopg2.connect(
                host = self.host,
                port = self.port,
                database = self.database,
                user = self.user,
                password = self.password)
            return conn
        except Exception:
            traceback.print_exc()

    def execute_sql_write(self, sql_command: str, params: tuple=None):
        conn = self._connect()
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

    def execute_sql_read_fetchone(self, sql_command: str, params: tuple=None):
        conn = self._connect()
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

    def execute_sql_read_fetchall(self, sql_command: str, params: tuple=None):
        conn = self._connect()
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