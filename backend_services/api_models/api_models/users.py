from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    username: str
    password: str
    email: str


class UpdateUserRequest(BaseModel):
    user_id: str
    username: str
    password: str
    email: str
    role: str


class UserLoginRequest(BaseModel):
    username: str
    password: str


class UpdateUserRoleRequest(BaseModel):
    role: str
