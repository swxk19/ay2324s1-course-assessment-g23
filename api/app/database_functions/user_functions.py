import database as db
import traceback
import hashlib
from fastapi import HTTPException

def _username_exists(username):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s)", params=(username,))
    return cur[0]

def _email_exists(email):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s)", params=(email,))
    return cur[0]

def _uid_exists(uid):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE user_id = %s)", params=(uid,))
    return cur[0]

def _check_args_create_user(user_id, username, email, password):
    if user_id is None:
        raise HTTPException(status_code=422, detail='Missing user id')
    if username is None:
        raise HTTPException(status_code=422, detail='Missing username')
    if email is None:
        raise HTTPException(status_code=422, detail='Missing email')
    if password is None:
        raise HTTPException(status_code=422, detail='Missing password')
    if _uid_exists(user_id):
        raise HTTPException(status_code=500, detail='Internal server error (uid already exists)')
    if _username_exists(username):
        raise HTTPException(status_code=409, detail='Username already exists')
    if _email_exists(email):
        raise HTTPException(status_code=409, detail='Email already exists')

def create_user(user_id, username, email, password):

    _check_args_create_user(user_id, username, email, password)

    hashed_password = hashlib.md5(password.encode()).hexdigest()

    db.execute_sql_write("INSERT INTO users (user_id, username, email, password) VALUES (%s, %s, %s, %s)",
                         params=(user_id, username, email, hashed_password))
    return {'message': f'User({user_id}) successfully created'}


def get_user(user_id):
    if user_id != "all" and not _uid_exists(user_id):
        raise HTTPException(status_code=404, detail='User does not exist')

    FIELD_NAMES = ['user_id', 'username', 'email', 'password']
    if user_id == "all":
                rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM users")
                users = [dict(zip(FIELD_NAMES, row)) for row in rows]
                return users
    return db.execute_sql_read_fetchone(f"SELECT {', '.join(FIELD_NAMES)} FROM users WHERE user_id = %s",
                                        params=(user_id,))

def _check_args_update_user_info(user_id, username, email):
    if not _uid_exists(user_id):
        raise HTTPException(status_code=404, detail="User does not exist")
    if username is not None and _username_exists(username):
            raise HTTPException(status_code=409, detail='Username already exists')
    if email is not None and _email_exists(email):
            raise HTTPException(status_code=409, detail='Email already exists')

def update_user_info(user_id, username, password, email):

    _check_args_update_user_info(user_id, username, email)

    values = []
    set_clauses = []
    message = []

    if username is not None:
        values.append(username)
        set_clauses.append("username = %s")
        message.append(f"username = {username}")

    if password is not None:
        new_password = hashlib.md5(password.encode()).hexdigest()
        values.append(new_password)
        set_clauses.append("password = %s")

    if email is not None:
        values.append(email)
        set_clauses.append("email = %s")
        message.append(f"email = {email}")

    set_clause = ", ".join(set_clauses)
    if not set_clause:
        raise HTTPException(status_code=204, detail="No information was provided for updating")

    values.append(user_id)

    db.execute_sql_write(f"""UPDATE users
                        SET {set_clause}
                        WHERE user_id = %s""",
                        params=tuple(values))
    message = ", ".join(message)
    return {'message': f'Successfully updated {message}'}

def delete_user(user_id):
    if user_id != "all" and not _uid_exists(user_id):
        raise HTTPException(status_code=404, detail="User does not exist")

    if user_id == "all":
        db.execute_sql_write("DELETE FROM users")
        return {'message': 'All users deleted'}
    else:
        db.execute_sql_write("DELETE FROM users WHERE user_id = %s", params=(user_id,))
        return {'message': f'User id {user_id} deleted'}