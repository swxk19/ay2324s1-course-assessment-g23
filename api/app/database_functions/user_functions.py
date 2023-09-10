import database as db
import traceback
import hashlib
from fastapi import HTTPException

def _username_exists(username):
    conn = db.connect()
    with conn, conn.cursor() as cur:
        cur.execute("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s)", (username,))
        return cur.fetchone()[0]

def _email_exists(email):
    conn = db.connect()
    with conn, conn.cursor() as cur:
        cur.execute("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s)", (email,))
        return cur.fetchone()[0]

def create_user(user_id, username, email, password):
    if _username_exists(username):
        raise HTTPException(status_code=409, detail='Username already exists')
    if _email_exists(email):
        raise HTTPException(status_code=409, detail='Email already exists')

    new_password = hashlib.md5(password.encode()).hexdigest()

    try:
        conn = db.connect()
        with conn, conn.cursor() as cur:
            cur.execute("INSERT INTO users (user_id, username, email, password) VALUES (%s, %s, %s, %s)", (user_id, username, email, new_password))
            conn.commit()
            return {'message': 'User successfully created'}
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail='Internal server error')

def get_user(user_id):
    try:
        conn = db.connect()
        FIELD_NAMES = ['user_id', 'username', 'email', 'password']

        with conn, conn.cursor() as cur:
            if user_id == "all":
                cur.execute(f"SELECT {', '.join(FIELD_NAMES)} FROM users")
                rows = cur.fetchall()
                users = [dict(zip(FIELD_NAMES, row)) for row in rows]
                return users

            cur.execute(f"SELECT {', '.join(FIELD_NAMES)} FROM users WHERE user_id = %s", (user_id,))
            row = cur.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="User not found")
            user = dict(zip(FIELD_NAMES, row))
            return user
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

def update_user_info(user_id, username, password, email):
    values = []
    set_clauses = []

    if username is not None:
        values.append(username)
        set_clauses.append("username = %s")

    if password is not None:
        new_password = hashlib.md5(password.encode()).hexdigest()
        values.append(new_password)
        set_clauses.append("password = %s")

    if email is not None:
        values.append(email)
        set_clauses.append("email = %s")

    set_clause = ", ".join(set_clauses)
    if not set_clause:
        return False

    values.append(user_id)

    try:
        conn = db.connect()
        with conn, conn.cursor() as cur:
            cur.execute(f"""UPDATE users
                        SET {set_clause}
                        WHERE user_id = %s""",
                        tuple(values))
            return True
    except Exception:
        traceback.print_exc()
        return False

def delete_user(user_id):
    try:
        conn = db.connect()
        with conn, conn.cursor() as cur:
            cur.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
            conn.commit()
            return True
    except Exception:
        traceback.print_exc()
        return False