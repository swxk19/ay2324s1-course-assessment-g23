from api_models.questions import CreateQuestionResponse, DeleteQuestionResponse, GetQuestionResponse, UpdateQuestionResponse
from fastapi import HTTPException
from questions_database import QUESTIONS_DATABASE as db
from utils import questions_util

def create_question(question_id: str, title: str, description: str, category: str, complexity: str) -> CreateQuestionResponse:
    if not questions_util.is_valid_complexity(complexity):
        raise HTTPException(status_code=422, detail="Invalid value for complexity. Complexity must only be Easy, Medium, or Hard")
    if questions_util.qid_exists(question_id):
        raise HTTPException(status_code=500, detail='Internal server error (qid already exists)')
    if questions_util.title_exists(title):
        raise HTTPException(status_code=409, detail='Title already exists')

    db.execute_sql_write("INSERT INTO questions (question_id, title, description, category, complexity) VALUES (%s, %s, %s, %s, %s)",
                         params=(question_id, title, description, category, complexity))
    return CreateQuestionResponse(message=f'Question({question_id}) successfully created')

def get_all_questions() -> list[GetQuestionResponse]:
    FIELD_NAMES = ['question_id', 'title', 'description', 'category', 'complexity']

    rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM questions")
    questions = [dict(zip(FIELD_NAMES, row)) for row in rows]
    return [GetQuestionResponse(**q) for q in questions] # type: ignore

def get_question(question_id: str) -> GetQuestionResponse:
    if not questions_util.qid_exists(question_id):
        raise HTTPException(status_code=404, detail='Question id does not exist')

    FIELD_NAMES = ['question_id', 'title', 'description', 'category', 'complexity']

    row = db.execute_sql_read_fetchone(f"SELECT {', '.join(FIELD_NAMES)} FROM questions WHERE question_id = %s",
                                    params=(question_id,))
    assert row is not None
    question = dict(zip(FIELD_NAMES, row))
    return GetQuestionResponse(**question) # type: ignore

def update_question_info(question_id: str, title: str, description: str, category: str, complexity: str) -> UpdateQuestionResponse:
    if not questions_util.qid_exists(question_id):
        raise HTTPException(status_code=404, detail="Question does not exist")
    if questions_util.check_duplicate_title(question_id, title):
        raise HTTPException(status_code=409, detail="Title already exists")
    if not questions_util.is_valid_complexity(complexity):
        raise HTTPException(status_code=422, detail="Invalid value for complexity. Complexity must only be Easy, Medium, or Hard")

    db.execute_sql_write("""UPDATE questions
                        SET title = %s, description = %s, category = %s, complexity = %s
                        WHERE question_id = %s""",
                        params=(title, description, category, complexity, question_id))
    return UpdateQuestionResponse(message='Successfully updated')

def delete_all_questions() -> DeleteQuestionResponse:
    db.execute_sql_write("DELETE FROM questions")
    return DeleteQuestionResponse(message='All questions deleted')

def delete_question(question_id: str) -> DeleteQuestionResponse:
    if not questions_util.qid_exists(question_id):
        raise HTTPException(status_code=404, detail="Question does not exist")

    db.execute_sql_write("DELETE FROM questions WHERE question_id = %s", params=(question_id,))
    return DeleteQuestionResponse(message=f"Question({question_id}) deleted")