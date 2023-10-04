import hashlib
from fastapi import HTTPException
from user_database import USER_DATABASE as db
from utils import users_util, sessions_util

def user_login(username: str, password: str):
    hashed_password = hashlib.md5(password.encode()).hexdigest()

    login_result = sessions_util.is_valid_login(username, hashed_password) # returns False if invalid login

    if login_result:
        user_id, role = login_result
        session_id = sessions_util.create_session(user_id, role)
        return {
            'status_code': 200,
            'session_id': session_id,
            'message': f'User {username} successfully logged in'
        }
    else:
        if users_util.username_exists(username):
            return {'status_code': 401,
            'message': 'Invalid password'
            }
        return {'status_code': 401,
            'message': 'Account does not exist'
            }


def get_all_sessions():
    FIELD_NAMES = ['session_id', 'user_id', 'role', 'creation_time', 'expiration_time']

    rows = db.execute_sql_read_fetchall(f"SELECT * FROM sessions")
    sessions = [dict(zip(FIELD_NAMES, row)) for row in rows]
    return sessions

def get_session(session_id):
    FIELD_NAMES = ['session_id', 'user_id', 'role', 'creation_time', 'expiration_time']

    result = db.execute_sql_read_fetchone('SELECT * FROM sessions WHERE session_id = %s',
                                 params=(session_id,))

    if result and not sessions_util.is_expired_session(result):
        response = dict(zip(FIELD_NAMES, result))
        response['status_code'] = 200
    else:
        return {'status_code': 401,
            'message': 'Unauthorized session'
            }

def user_logout(session_id):
    try:
        sessions_util.delete_session(session_id)
        return {
            'message': f'Session {session_id} successfully deleted'
        }
    except Exception as e:
        return {'status_code': 401,
            'message': f"Unable to logout user: {e}"
            }
