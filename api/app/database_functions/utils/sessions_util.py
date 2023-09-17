import uuid
from datetime import datetime, timedelta

import database as db

def is_valid_login(username, hashed_password):
    user_id, role = db.execute_sql_read_fetchone("SELECT user_id, role FROM users where username = %s AND password = %s",
                                        params=(username, hashed_password))
    # TODO: also return the role
    # return user_id[0] if user_id else False
    if user_id:
        return user_id, role
    else:
        return False

def is_expired_session(session: tuple):
    current_time = datetime.now()
    return str(current_time) > session[4]

def create_session(user_id, role):
    session_id = str(uuid.uuid4())
    creation_time = datetime.now()
    expiration_time = creation_time + timedelta(minutes=15)

    db.execute_sql_write("INSERT INTO sessions (session_id, user_id, role, creation_time, expiration_time) VALUES (%s, %s, %s, %s, %s)",
                         params=(session_id, user_id, role, str(creation_time), str(expiration_time)))
    return session_id

def is_logged_in(session_id):
    return db.execute_sql_read_fetchone("SELECT COUNT(*) FROM sessions WHERE session_id = %s", params=(session_id,))[0] > 0
