import hashlib
from fastapi import HTTPException

import database as db
from utils import users_util

def create_user(user_id, username, email, password):
    if users_util.uid_exists(user_id):
        raise HTTPException(status_code=500, detail='Internal server error (uid already exists)')
    if users_util.username_exists(username):
        raise HTTPException(status_code=409, detail='Username already exists')
    if users_util.email_exists(email):
        raise HTTPException(status_code=409, detail='Email already exists')

    hashed_password = hashlib.md5(password.encode()).hexdigest()

    db.execute_sql_write("INSERT INTO users (user_id, username, email, password) VALUES (%s, %s, %s, %s)",
                         params=(user_id, username, email, hashed_password))
    return {'message': f'User({user_id}) successfully created'}


def get_user(user_id):
    if user_id != "all" and not users_util.uid_exists(user_id):
        raise HTTPException(status_code=404, detail='User does not exist')

    FIELD_NAMES = ['user_id', 'username', 'email', 'password']
    if user_id == "all":
                rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM users")
                users = [dict(zip(FIELD_NAMES, row)) for row in rows]
                return users
    return db.execute_sql_read_fetchone(f"SELECT {', '.join(FIELD_NAMES)} FROM users WHERE user_id = %s",
                                        params=(user_id,))

def update_user_info(user_id, username, password, email):
    if not users_util.uid_exists(user_id):
        raise HTTPException(status_code=404, detail="User does not exist")
    if users_util.check_duplicate_username(user_id, username):
            raise HTTPException(status_code=409, detail='Username already exists')
    if users_util.check_duplicate_email(user_id, email):
            raise HTTPException(status_code=409, detail='Email already exists')

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
    if user_id != "all" and not users_util.uid_exists(user_id):
        raise HTTPException(status_code=404, detail="User does not exist")

    if user_id == "all":
        db.execute_sql_write("DELETE FROM users")
        return {'message': 'All users deleted'}
    else:
        db.execute_sql_write("DELETE FROM users WHERE user_id = %s", params=(user_id,))
        return {'message': f'User id {user_id} deleted'}