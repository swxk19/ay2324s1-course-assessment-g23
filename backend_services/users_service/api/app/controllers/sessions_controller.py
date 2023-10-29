import hashlib
from shared_definitions.api_models.users import GetSessionResponse, UserLoginResponse, UserLogoutResponse
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from user_database import USER_DATABASE as db
from utils import users_util, sessions_util
from datetime import datetime
from shared_definitions.auth.core import create_access_token, create_refresh_token

def user_login(username: str, password: str) -> JSONResponse:
    hashed_password = hashlib.md5(password.encode()).hexdigest()

    login_result = sessions_util.is_valid_login(username, hashed_password) # returns False if invalid login

    if login_result:
        user_id, role = login_result
        access_token = create_access_token(user_id, role)
        refresh_token = create_refresh_token(user_id, role)
        sessions_util.store_refresh_token(refresh_token)

        response_payload = UserLoginResponse(message=f'User {username} successfully logged in')
        response = JSONResponse(content=response_payload.model_dump(mode="json"))
        response.set_cookie(key='refresh_token', value=refresh_token)
        response.set_cookie(key='access_token', value=access_token)
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

