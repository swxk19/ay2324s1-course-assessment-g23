from fastapi import FastAPI, HTTPException, Request
import requests
import httpx

HOST_URL = "http://localhost"
USERS_API_PORT = 8001
SESSIONS_API_PORT = 8001
QUESTIONS_API_PORT = 8002


# Permission values of higher value is a superset of any permission with lower value
# i.e Maintainer can do anything that a user can do
PUBLIC_PERMISSION = 0
USER_PERMISSION = 1 # means ANY user that is logged in
MAINTAINER_PERMISSION = 2

app = FastAPI()

PERMISSIONS_TABLE = {
    "users": {
        "POST": PUBLIC_PERMISSION,
        "GET": USER_PERMISSION,
        "DELETE": USER_PERMISSION,
        "PUT": USER_PERMISSION
        },
    "sessions": {
        "POST": PUBLIC_PERMISSION,
        "GET": USER_PERMISSION,
        "DELETE": USER_PERMISSION,
        },
    "questions": {
        "POST": MAINTAINER_PERMISSION,
        "GET": USER_PERMISSION,
        "DELETE": MAINTAINER_PERMISSION,
        "PUT": MAINTAINER_PERMISSION
        }
}

async def check_permission(request: Request, permission_required):
    def map_role_permission(role):
        if role == "user":
            return USER_PERMISSION
        elif role == "maintainer":
            return MAINTAINER_PERMISSION
        return -1

    if permission_required == PUBLIC_PERMISSION:
        return

    session_id = request.cookies.get('session_id')

    headers = { session_id: session_id }
    url = f"{HOST_URL}/{USERS_API_PORT}/sessions"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        permission_level = map_role_permission(response.json()["role"])

        if permission_level < permission_required:
            raise HTTPException(status_code=401, detail="Unauthorized access")

async def route_request(method: str, path: str, request: Request):
    # Determine the microservice URL based on the path
    service = None
    if path.startswith("/users"):
        service = "users"
        microservice_url = f"{HOST_URL}:{USERS_API_PORT}"
    elif path.startswith("/questions"):
        service = "questions"
        microservice_url = f"{HOST_URL}:{QUESTIONS_API_PORT}"
    elif path.startswith("/sessions"):
        service = "sessions"
        microservice_url = f"{HOST_URL}:{USERS_API_PORT}"
    else:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    permission_required = PERMISSIONS_TABLE[service][method]
    check_permission(request, permission_required)

    # Forward the request to the microservice
    async with httpx.AsyncClient() as client:
        if method == "GET":
            response = await client.get(f"{microservice_url}{path}")
        elif method == "POST":
            response = await client.post(f"{microservice_url}{path}", data=await request.body())
        elif method == "PUT":
            response = await client.post(f"{microservice_url}{path}", data=await request.body())
        elif method == "DELETE":
             response = await client.delete(f"{microservice_url}{path}", data=await request.body())

        response.raise_for_status()
        return response.text

@app.route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def handle_request(path: str, request: Request):
    method = request.method
    return await route_request(method, path, request)