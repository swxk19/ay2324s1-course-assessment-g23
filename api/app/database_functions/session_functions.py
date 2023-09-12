import uuid
import hashlib
from datetime import datetime, timedelta
from fastapi import HTTPException

from .utils import users_util
from .utils import sessions_util
import database as db

class SessionToken:
    def __init__(self, user_id):
        self.token_id=str(uuid.uuid4)
        self.user_id = user_id
        self.creation_time = datetime.now()
        self.expiration_time = self.creation_time + timedelta(minutes=15)

    def is_expired(self):
        return datetime.now > self.expiration_time

def user_login(username: str, password: str):
    hashed_password = hashlib.md5(password.encode()).hexdigest()
    user_id = sessions_util.is_valid_login(username, hashed_password) # returns False if invalid login

    if user_id:
        session_id = sessions_util.create_session(user_id, hashed_password)
        return {'session_id': f'{session_id}',
                'role': 'placeholder',
                'message': f'User {username} successfully logged in'}
    else:
        if users_util.username_exists(username):
            raise HTTPException(status_code=401, detail="Invalid password")
        raise HTTPException(status_code=401, detail="Account does not exist")


