from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    user_id: str
    username: str
    password: str
    email: str

class GetUser(BaseModel):
    user_id: str