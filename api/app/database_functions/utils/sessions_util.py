import uuid

import database as db

def is_valid_login(username, hashed_password):
    user_id = db.execute_sql_read_fetchone("SELECT user_id FROM users where username = %s AND password = %s",
                                        params=(username, hashed_password))
    return user_id[0] if user_id else False

def create_session(user_id, role):
    session_id = str(uuid.uuid4())
    db.execute_sql_write("INSERT INTO sessions (session_id, user_id, role) VALUES (%s, %s, %s)",
                         params=(session_id, user_id, role))
    return session_id
