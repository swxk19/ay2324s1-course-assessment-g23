from typing import Literal
import uuid
from datetime import datetime, timedelta

from user_database import USER_DATABASE as db

def is_valid_login(username: str, hashed_password: str) -> tuple[str, str] | Literal[False]:
    result = db.execute_sql_read_fetchone("SELECT user_id, role FROM users where username = %s AND password = %s",
                                        params=(username, hashed_password))
    if result is None:
        return False
    user_id, role = result
    return user_id, role

def store_refresh_token(refresh_token: str) -> None:
    db.execute_sql_write("INSERT INTO refresh_tokens VALUES (%s)", params=(refresh_token,))

def delete_session(session_id: str) -> Literal[True]:
    db.execute_sql_write("DELETE FROM sessions WHERE session_id = %s", params=(session_id,))
    return True

def is_logged_in(session_id: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT COUNT(*) FROM sessions WHERE session_id = %s", params=(session_id,))
    assert cur is not None
    return cur[0] > 0
