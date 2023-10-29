import hashlib
from shared_definitions.api_models.users import GetSessionResponse, UserLoginResponse, UserLogoutResponse
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from user_database import USER_DATABASE as db
from utils import users_util, sessions_util
from datetime import datetime

def user_login(username: str, password: str) -> JSONResponse:
    hashed_password = hashlib.md5(password.encode()).hexdigest()

    login_result = sessions_util.is_valid_login(username, hashed_password) # returns False if invalid login

    if login_result:
        user_id, role = login_result
        session_id = sessions_util.create_session(user_id, role)
        response_payload = UserLoginResponse(message=f'User {username} successfully logged in')
        response = JSONResponse(content=response_payload.model_dump(mode="json"))
        response.set_cookie(key='session_id', value=session_id)
        return response
    else:
        if users_util.username_exists(username):
            raise HTTPException(status_code=401, detail='Invalid password')
        raise HTTPException(status_code=401, detail='Account does not exist')


def user_logout(session_id: str | None) -> JSONResponse:
    if session_id is None:
        raise HTTPException(status_code=400, detail='No session ID given')
    try:
        sessions_util.delete_session(session_id)
        response_payload = UserLogoutResponse(message=f'Session {session_id} successfully deleted')
        response = JSONResponse(content=response_payload.model_dump(mode="json"))
        response.delete_cookie('session_id')
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Unable to logout user: {e}')

