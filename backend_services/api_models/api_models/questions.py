from pydantic import BaseModel


class CreateQuestionRequest(BaseModel):
    title: str
    description: str
    category: str
    complexity: str


class CreateQuestionResponse(BaseModel):
    message: str


class GetQuestionResponse(CreateQuestionRequest):
    question_id: str


class UpdateQuestionRequest(BaseModel):
    question_id: str
    title: str
    description: str
    category: str
    complexity: str


class UpdateQuestionResponse(BaseModel):
    message: str


class DeleteQuestionResponse(BaseModel):
    message: str
