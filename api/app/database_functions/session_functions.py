import hashlib
from fastapi import HTTPException

from .utils import users_util
from .utils import sessions_util
import database as db

def user_login(username: str, password: str):
    hashed_password = hashlib.md5(password.encode()).hexdigest()
    user_id = sessions_util.is_valid_login(username, hashed_password) # returns False if invalid login

    if user_id:
        session_id = sessions_util.create_session(user_id, "placeholder-role")
        return {
                'session_id': f'{session_id}',
                'role': 'placeholder',
                'message': f'User {username} successfully logged in'
            }
    else:
        if users_util.username_exists(username):
            raise HTTPException(status_code=401, detail="Invalid password")
        raise HTTPException(status_code=401, detail="Account does not exist")

def get_session(session_id):
    FIELD_NAMES = ['session_id', 'user_id', 'role', 'creation_time', 'expiration_time']

    if session_id == "all":
        rows = db.execute_sql_read_fetchall(f"SELECT * FROM sessions")
        sessions = [dict(zip(FIELD_NAMES, row)) for row in rows]
        return sessions

    result = db.execute_sql_read_fetchone('SELECT * FROM sessions WHERE session_id = %s',
                                 params=(session_id,))


    if result != None and not sessions_util.is_expired_session(result):
        return { 'role': result[2] }
    else:
        raise HTTPException(status_code=401, detail="Unauthorized session")


