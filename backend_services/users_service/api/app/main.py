from controllers import sessions_controller as sc
from controllers import users_controller as uc
from fastapi import Cookie, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from shared_definitions.api_models.users import (
    CreateUserRequest,
    CreateUserResponse,
    DeleteUserResponse,
    GetUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    UpdateUserRoleRequest,
    UpdateUserRoleResponse,
    UserLoginRequest,
)
from shared_definitions.auth.core import TokenData
from shared_definitions.auth.fastapi_dependencies import (
    decode_access_token_data,
    decode_refresh_token_data,
    require_logged_in,
    require_maintainer_role,
    require_same_user_or_maintainer_role,
)

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.post("/users")
async def create_user(r: CreateUserRequest) -> CreateUserResponse:
    return uc.create_user(r.username, r.email, r.password)


@app.get("/user_me", dependencies=[Depends(require_logged_in)])
async def get_current_user(
    access_token_data: TokenData = Depends(decode_access_token_data),
) -> GetUserResponse:
    return uc.get_current_user(access_token_data)


@app.get("/users/{user_id}", dependencies=[Depends(require_logged_in)])
async def get_user(user_id: str) -> GetUserResponse:
    return uc.get_user(user_id)


@app.get("/users_all", dependencies=[Depends(require_maintainer_role)])
async def get_all_users() -> list[GetUserResponse]:
    return uc.get_all_users()


@app.delete("/users/{user_id}", dependencies=[Depends(require_same_user_or_maintainer_role)])
async def delete_user(user_id: str) -> DeleteUserResponse:
    return uc.delete_user(user_id)


@app.put("/users/{user_id}", dependencies=[Depends(require_same_user_or_maintainer_role)])
async def update_user_info(user_id: str, r: UpdateUserRequest) -> UpdateUserResponse:
    return uc.update_user_info(user_id, r.username, r.password, r.email)


@app.put("/users_role/{user_id}", dependencies=[Depends(require_maintainer_role)])
async def update_user_role(user_id: str, r: UpdateUserRoleRequest) -> UpdateUserRoleResponse:
    return uc.update_user_role(user_id, r.role)


@app.post("/token")
async def user_login(r: UserLoginRequest) -> JSONResponse:
    return sc.user_login(r.username, r.password)


@app.delete("/token")
async def user_logout(refresh_token: str | None = Cookie(None)) -> Response:
    return sc.user_logout(refresh_token)


@app.get("/refresh", dependencies=[Depends(require_logged_in)])
async def refresh_access_token(
    refresh_token_data: TokenData = Depends(decode_refresh_token_data),
) -> Response:
    return sc.get_new_access_token(refresh_token_data)
