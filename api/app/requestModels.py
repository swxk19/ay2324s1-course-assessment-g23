from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    username: str
    password: str
    email: str

class UpdateUserInfo(BaseModel):
    id: str
    username: str
    password: str
    email: str

class CreateQuestion(BaseModel):
    title: str
    description: str
    category: str
    complexity: str

class UpdateQuestionInfo(BaseModel):
    id: str
    title: str
    description: str
    category: str
    complexity: str
