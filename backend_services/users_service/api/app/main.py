import uuid
from fastapi import Cookie, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api_models.users import CreateUserRequest, CreateUserResponse, DeleteUserResponse, GetSessionResponse, GetUserResponse, UpdateUserRequest, UpdateUserResponse, UpdateUserRoleRequest, UpdateUserRoleResponse, UserLoginRequest, UserLoginResponse, UserLogoutResponse
from controllers import users_controller as uc, sessions_controller as sc

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.post("/users")
async def create_user(r: CreateUserRequest) -> CreateUserResponse:
    user_id = str(uuid.uuid4())
    return uc.create_user(user_id, r.username, r.email, r.password)

@app.get("/users/{user_id}")
async def get_user(user_id: str) -> GetUserResponse:
    return uc.get_user(user_id)

@app.get("/users_all")
async def get_all_users() -> list[GetUserResponse]:
    return uc.get_all_users()

@app.delete("/users_all")
async def delete_all_users() -> DeleteUserResponse:
    return uc.delete_all_users()

@app.delete("/users/{user_id}")
async def delete_user(user_id: str) -> DeleteUserResponse:
    return uc.delete_user(user_id)

@app.put("/users/{user_id}")
async def update_user_info(user_id: str, r: UpdateUserRequest) -> UpdateUserResponse:
    return uc.update_user_info(user_id, r.username, r.password, r.email)

@app.put("/users_role/{user_id}")
async def update_user_role(user_id: str, r: UpdateUserRoleRequest) -> UpdateUserRoleResponse:
    return uc.update_user_role(user_id, r.role)

@app.post("/sessions")
async def user_login(r: UserLoginRequest) -> UserLoginResponse:
    return sc.user_login(r.username, r.password)

@app.get("/sessions_all")
async def get_all_sessions() -> list[GetSessionResponse]:
    return sc.get_all_sessions()

@app.get("/sessions")
async def get_session(session_id: str | None = Cookie(None)) -> GetSessionResponse:
    return sc.get_session(session_id)

@app.delete("/sessions/{session_id}")
async def user_logout(session_id: str) -> UserLogoutResponse:
    return sc.user_logout(session_id)
