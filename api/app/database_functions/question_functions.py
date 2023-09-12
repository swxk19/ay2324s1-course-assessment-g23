import database as db
import traceback
from fastapi import HTTPException

def _is_valid_complexity(complexity):
    valid_complexities =['Easy', 'Medium', 'Hard']
    return complexity in valid_complexities

def _qid_exists(qid):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM questions WHERE question_id = %s)",
                                       params=(qid,))
    return cur[0]

def _title_exists(title):
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM questions WHERE title = %s)",
                                       params=(title,))
    return cur[0]

def _create_question_check_args(question_id, title, description, category, complexity):

    if not _is_valid_complexity(complexity):
        raise HTTPException(status_code=422, detail="Invalid value for complexity. Complexity must only be Easy, Medium, or Hard")
    if _qid_exists(question_id):
        raise HTTPException(status_code=500, detail='Internal server error (qid already exists)')
    if _title_exists(title):
        raise HTTPException(status_code=409, detail='Title already exists')


def create_question(question_id, title, description, category, complexity):

    _create_question_check_args(question_id, title, description, category, complexity)

    db.execute_sql_write("INSERT INTO questions (question_id, title, description, category, complexity) VALUES (%s, %s, %s, %s, %s)",
                         params=(question_id, title, description, category, complexity))
    return {'message': f'Question({question_id}) successfully created'}

def get_question(question_id):
    if question_id != "all" and not _qid_exists(question_id):
        raise HTTPException(status_code=404, detail='Question id does not exist')

    FIELD_NAMES = ['question_id', 'title', 'description', 'category', 'complexity']
    if question_id == "all":
        rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM questions")
        questions = [dict(zip(FIELD_NAMES, row)) for row in rows]
        return questions
    return db.execute_sql_read_fetchone(f"SELECT {', '.join(FIELD_NAMES)} FROM questions WHERE question_id = %s",
                                        params=(question_id,))

def _check_args_update_question_info(question_id, title, complexity):
    if not _qid_exists(question_id):
        raise HTTPException(status_code=404, detail="Question does not exist")
    if title is not None and _title_exists(title):
            raise HTTPException(status_code=409, detail="Title already exists")
    if complexity is not None and not _is_valid_complexity(complexity):
            raise HTTPException(status_code=422, detail="Invalid value for complexity. Complexity must only be Easy, Medium, or Hard")

def update_question_info(question_id, title, description, category, complexity):

    _check_args_update_question_info(question_id, title, complexity)

    values = []
    set_clauses = []
    message = []

    if title is not None:
        values.append(title)
        set_clauses.append("title = %s")
        message.append(f"title = {title}")

    if description is not None:
        values.append(description)
        set_clauses.append("description = %s")
        message.append(f"description = {description}")

    if category is not None:
        values.append(category)
        set_clauses.append("category = %s")
        message.append(f"category = {category}")

    if complexity is not None:
        values.append(complexity)
        set_clauses.append("complexity = %s")
        message.append(f"complexity = {complexity}")

    set_clause = ", ".join(set_clauses)
    if not set_clause:
        raise HTTPException(status_code=204, detail="No information was provided for updating")

    values.append(question_id)

    db.execute_sql_write(f"""UPDATE questions
                        SET {set_clause}
                        WHERE question_id = %s""",
                        tuple(values))
    message = ", ".join(message)
    return {'message': f'Successfully updated {message}'}

def delete_question(question_id):
    if question_id != "all" and not _qid_exists(question_id):
        raise HTTPException(status_code=404, detail="Question does not exist")

    if question_id == "all":
        db.execute_sql_write("DELETE FROM questions")
        return {'message': 'All questions deleted'}
    else:
        db.execute_sql_write("DELETE FROM questions WHERE question_id = %s", params=(question_id,))
        return {'message': f"Question({question_id}) deleted"}