from pydantic import BaseModel

class CreateQuestion(BaseModel):
    title: str
    description: str
    category: str
    complexity: str


class UpdateQuestionInfo(BaseModel):
    question_id: str
    title: str
    description: str
    category: str
    complexity: str
