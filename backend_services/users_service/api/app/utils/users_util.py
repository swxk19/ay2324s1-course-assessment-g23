from fastapi import HTTPException

from user_database import USER_DATABASE as db

def username_exists(username: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s)", params=(username,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def email_exists(email: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s)", params=(email,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def uid_exists(uid: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE user_id = %s)", params=(uid,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def check_duplicate_username(uid: str, username: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s AND user_id != %s)",
                                       params=(username, uid,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def check_duplicate_email(uid: str, email: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s AND user_id != %s)",
                                       params=(email, uid,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def is_maintainer(user_id: str) -> bool:
    try:
        cur = db.execute_sql_read_fetchone("SELECT role FROM sessions WHERE session_id = %s", params=(user_id,))
        assert cur is not None
        return cur[0] == "maintainer"
    except IndexError:
        raise HTTPException(status_code=409, detail='User not in session')

def is_account_owner(user_id, session_id):
    try:
        cur = db.execute_sql_read_fetchone("SELECT user_id FROM sessions WHERE session_id = %s", params=(session_id,))
        assert cur is not None
        return cur[0] == user_id
    except IndexError:
        raise HTTPException(status_code=409, detail='User not in session')
