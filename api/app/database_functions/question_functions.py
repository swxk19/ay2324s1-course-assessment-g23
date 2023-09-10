import database as db
import traceback
from fastapi import HTTPException

def _is_valid_complexity(complexity):
    valid_complexities =['Easy', 'Medium', 'Hard']
    return complexity in valid_complexities

def _qid_exists(qid):
    conn = db.connect()
    with conn, conn.cursor() as cur:
        cur.execute("SELECT EXISTS (SELECT 1 FROM users WHERE question_id = %s)", (qid,))
        return cur.fetchone()[0]

def _title_exists(title):
    conn = db.connect()
    with conn, conn.cursor() as cur:
        cur.execute("SELECT EXISTS (SELECT 1 FROM users WHERE title = %s)", (title,))
        return cur.fetchone()[0]

def create_question(question_id, title, description, category, complexity):
    if _qid_exists(question_id):
        raise HTTPException(status_code=500, detail='Internal server error (qid already exists')
    if _title_exists(title):
        raise HTTPException(status_code=409, detail='Username already exists')
    try:
        conn = db.connect()
        with conn, conn.cursor() as cur:
            cur.execute("INSERT INTO questions (question_id, title, description, category, complexity) VALUES (%s, %s, %s, %s, %s)", (question_id, title, description, category, complexity))
            conn.commit()
            return {'message': f'Question({question_id}) successfully created'}
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail='Internal server error')

def get_question(question_id):
    result = None
    try:
        conn = db.connect()
        FIELD_NAMES = ['question_id', 'title', 'description', 'category', 'complexity']

        with conn, conn.cursor() as cur:
            if question_id == "all":
                cur.execute(f"SELECT {', '.join(FIELD_NAMES)} FROM questions")
                rows = cur.fetchall()
                questions = [dict(zip(FIELD_NAMES, row)) for row in rows]
                return questions

            cur.execute(f"SELECT {', '.join(FIELD_NAMES)} FROM questions WHERE question_id = %s", (question_id,))
            result = cur.fetchone()
    except Exception:
        traceback.print_exc()
    if result is None:
        raise HTTPException(status_code=404, detail="Question not found")
    question = dict(zip(FIELD_NAMES, result))
    return question

def update_question_info(question_id, title, description, category, complexity):
    if not _qid_exists(question_id):
        raise HTTPException(status_code=404, detail="Question does not exist")

    values = []
    set_clauses = []

    if title is not None:
        if _title_exists(title):
            raise HTTPException(status_code=409, detail="Title already exists")
        values.append(title)
        set_clauses.append("title = %s")

    if description is not None:
        values.append(description)
        set_clauses.append("description = %s")

    if category is not None:
        values.append(category)
        set_clauses.append("category = %s")

    if complexity is not None:
        if not _is_valid_complexity(complexity):
            raise HTTPException(status_code=422, detail="Invalid value for complexity. Complexity must only be Easy, Medium, or Hard")
        values.append(complexity)
        set_clauses.append("complexity = %s")

    set_clause = ", ".join(set_clauses)
    if not set_clause:
        raise HTTPException(status_code=204, detail="No information was provided for updating")

    values.append(question_id)

    try:
        conn = db.connect()
        with conn, conn.cursor() as cur:
            cur.execute(f"""UPDATE questions
                        SET {set_clause}
                        WHERE question_id = %s""",
                        tuple(values))
            return {'message': f'Successfully updated {set_clause}'}
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

def delete_question(question_id):
    try:
        conn = db.connect()
        with conn, conn.cursor() as cur:
            if question_id == "all":
                cur.execute("DELETE FROM questions")
            else:
                cur.execute("DELETE FROM questions WHERE question_id = %s", (question_id,))
            conn.commit()
            return True
    except Exception:
        traceback.print_exc()
        return False