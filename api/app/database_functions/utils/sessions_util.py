import uuid
from datetime import datetime, timedelta

import database as db

class Session:
    def __init__(self, session_id, user_id, role):
        self.session_id = session_id
        self.user_id = user_id
        self.role = role
        self.creation_time = datetime.now()
        self.expiration_time = self.creation_time + timedelta(minutes=15)

    def is_expired(self):
        return datetime.now > self.expiration_time

    def is_session(self, session_id):
        return self.session_id == session_id

def is_valid_login(username, hashed_password):
    user_id = db.execute_sql_read_fetchone("SELECT user_id FROM users where username = %s AND password = %s",
                                        params=(username, hashed_password))
    # TODO: also return the role
    return user_id[0] if user_id else False

def create_session(user_id, role):
    session_id = str(uuid.uuid4())
    db.execute_sql_write("INSERT INTO sessions (session_id, user_id, role) VALUES (%s, %s, %s)",
                         params=(session_id, user_id, role))
    return session_id
