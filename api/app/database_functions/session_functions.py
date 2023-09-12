import hashlib
from fastapi import HTTPException

from .utils import users_util
from .utils import sessions_util
import database as db

def user_login(username: str, password: str):
    hashed_password = hashlib.md5(password.encode()).hexdigest()
    user_id = sessions_util.is_valid_login(username, hashed_password) # returns False if invalid login

    if user_id:
        session_id = sessions_util.create_session(user_id, hashed_password)
        return (session_id, user_id) # TODO: to also return role
    else:
        if users_util.username_exists(username):
            raise HTTPException(status_code=401, detail="Invalid password")
        raise HTTPException(status_code=401, detail="Account does not exist")


