import hashlib

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse, Response
from utils import sessions_util, users_util

from shared_definitions.api_models.users import UserLoginResponse
from shared_definitions.auth.core import (
    TokenData,
    create_access_token,
    create_refresh_token,
)


def user_login(username: str, password: str) -> JSONResponse:
    hashed_password = hashlib.md5(password.encode()).hexdigest()

    login_result = sessions_util.is_valid_login(
        username, hashed_password
    )  # returns False if invalid login

    if login_result:
        user_id, role = login_result
        access_token = create_access_token(user_id, role)
        refresh_token = create_refresh_token(user_id, role)
        sessions_util.store_refresh_token(refresh_token)

        response_payload = UserLoginResponse(message=f"User {username} successfully logged in")
        response = JSONResponse(content=response_payload.model_dump(mode="json"))
        response.set_cookie(key="refresh_token", value=refresh_token)
        response.set_cookie(key="access_token", value=access_token)
        return response
    else:
        if users_util.username_exists(username):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account does not exist")


def user_logout(refresh_token: str | None) -> Response:
    try:
        if refresh_token is not None:
            sessions_util.delete_refresh_token(refresh_token)
    finally:
        # Return `401 No Content` regardless of deletion outcome.
        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        return response


def get_new_access_token(refresh_token_data: TokenData) -> Response:
    access_token = create_access_token(refresh_token_data.user_id, refresh_token_data.role)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.set_cookie(key="access_token", value=access_token)
    return response
