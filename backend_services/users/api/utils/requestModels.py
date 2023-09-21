from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    username: str
    password: str
    email: str

class GetUser(BaseModel):
    session_id: str

class UpdateUserInfo(BaseModel):
    user_id: str
    username: str
    password: str
    email: str
    role: str
    session_id: str

# class UpdateUserRole(BaseModel):
#     role: str
#     session_id: str

class DeleteUser(BaseModel):
    session_id: str

class CreateQuestion(BaseModel):
    title: str
    description: str
    category: str
    complexity: str
    session_id: str
    
class GetQuestion(BaseModel):
    session_id: str

class UpdateQuestionInfo(BaseModel):
    question_id: str
    title: str
    description: str
    category: str
    complexity: str
    session_id: str

class DeleteQuestion(BaseModel):
    session_id: str

class UserLogin(BaseModel):
    username: str
    password: str