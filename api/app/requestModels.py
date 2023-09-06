from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    username: str
    password: str
    email: str

class GetUser(BaseModel):
    user_id: str

class DeleteUser(BaseModel):
    user_id: str

class UpdateUserInfo(BaseModel):
    user_id: str
    username: str
    password: str
    email: str

class CreateQuestion(BaseModel):
    title: str
    description: str
    category: str
    complexity: str

class GetQuestion(BaseModel):
    question_id: str

class UpdateQuestionInfo(BaseModel):
    question_id: str
    title: str
    description: str
    category: str
    complexity: str

class DeleteQuestion(BaseModel):
    question_id: str