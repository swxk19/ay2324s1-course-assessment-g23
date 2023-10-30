from typing import Literal

from user_database import USER_DATABASE as db


def is_valid_login(username: str, hashed_password: str) -> tuple[str, str] | Literal[False]:
    result = db.execute_sql_read_fetchone(
        "SELECT user_id, role FROM users where username = %s AND password = %s",
        params=(username, hashed_password),
    )
    if result is None:
        return False
    user_id, role = result
    return user_id, role


def store_refresh_token(refresh_token: str) -> None:
    db.execute_sql_write("INSERT INTO refresh_tokens VALUES (%s)", params=(refresh_token,))


def delete_refresh_token(refresh_token: str) -> None:
    db.execute_sql_write("DELETE FROM refresh_tokens WHERE token = %s", params=(refresh_token,))
