import database as db
from fastapi import HTTPException

def username_exists(username):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s)", params=(username,))
    return cur[0]

def email_exists(email):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s)", params=(email,))
    return cur[0]

def uid_exists(uid):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE user_id = %s)", params=(uid,))
    return cur[0]

def check_duplicate_username(uid, username):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s AND user_id != %s)",
                                       params=(username, uid,))
    return cur[0]

def check_duplicate_email(uid, email):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s AND user_id != %s)",
                                       params=(email, uid,))
    return cur[0]

def is_maintainer(user_id):
    return db.execute_sql_read_fetchone("SELECT role FROM sessions WHERE session_id = %s", params=(user_id,))[0] == "maintainer"

def is_account_owner(user_id, session_id):
    result = db.execute_sql_read_fetchone("SELECT user_id FROM sessions WHERE session_id = %s", params=(session_id,))
    if result is None:
        # Handle the case where the session_id does not exist in the table.
        return False
    return result[0] == user_id
