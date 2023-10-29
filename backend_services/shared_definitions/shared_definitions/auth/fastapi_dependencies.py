from http import HTTPStatus

import jwt
from fastapi import Cookie, HTTPException

from .core import TokenData, decode_token


def decode_access_token_data(access_token: str | None = Cookie(None)) -> TokenData:
    """FastAPI dependency for decoding the JWT `access_token` cookie send by user requests.

    Raises `HTTPException(status_code=HTTPStatus.UNAUTHORIZED)` on:
    - missing `access_token` cookie
    - expired `access_token`
    - unable to decoded `access_token`

    Args:
        access_token (str | None, optional): `access_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=HTTPStatus.UNAUTHORIZED` if \
            `access_token` cookie is missing, expired, or unable to be decoded.

    Returns:
        TokenData: The data contained in the JWT `access_token` cookie.

    Examples:
        ```py
        from fastapi import Depends

        # Get decoded `access_token` data.
        @app.get("/users")
        async def get_users(access_token_data: TokenData = Depends(decode_access_token)):
        ```
    """
    if access_token is None:
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)

    try:
        token_data = decode_token(access_token)
    except jwt.PyJWTError:
        # Return 401 if there's any decoding errors,
        # INCLUDING if token has expired.
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)

    if token_data.token_type != "access_token":
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)

    return token_data


def decode_refresh_token_data(refresh_token: str | None = Cookie(None)) -> TokenData:
    """FastAPI dependency for decoding the JWT `refresh_token` cookie send by user requests.

    Raises `HTTPException(status_code=HTTPStatus.UNAUTHORIZED)` on:
    - missing `refresh_token` cookie
    - expired `refresh_token`
    - unable to decoded `refresh_token`

    Args:
        refresh_token (str | None, optional): `refresh_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=HTTPStatus.UNAUTHORIZED` if \
            `refresh_token` cookie is missing, expired, or unable to be decoded.

    Returns:
        TokenData: The data contained in the JWT `refresh_token` cookie.

    Examples:
        ```py
        from fastapi import Depends

        # Get decoded `refresh_token` data.
        @app.get("/users")
        async def get_users(refresh_token_data: TokenData = Depends(decode_refresh_token)):
        ```
    """
    if refresh_token is None:
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)

    try:
        token_data = decode_token(refresh_token)
    except jwt.PyJWTError:
        # Return 401 if there's any decoding errors,
        # INCLUDING if token has expired.
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)

    if token_data.token_type != "refresh_token":
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)

    return token_data
