import uuid
import requests
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .utils import requestModels as rm
from .controllers import questions_controller as qc


API_GATEWAY_URL = "http://localhost:8000"

USER_PERMISSION = 0
MAINTAINER_PERMISSION = 1
# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def check_session(request: Request, permssion_required):
    def map_role_permission(role):
        if role == "user":
            return USER_PERMISSION
        elif role == "maintainer":
            return MAINTAINER_PERMISSION
        return -1

    session_id = request.cookies.get('session_id')

    url = f'{API_GATEWAY_URL}/sessions'
    headers = { session_id: session_id }
    response = requests.get(url, headers=headers)


    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        permission_level = map_role_permission(response.json()["role"])

        if permission_level < permssion_required:
            raise HTTPException(status_code=401, detail="Unauthorized access")

@app.post("/questions", status_code=200)
async def create_question(r: rm.CreateQuestion, request: Request):
    await check_session(request, MAINTAINER_PERMISSION)

    question_id = str(uuid.uuid4())
    return qc.create_question(question_id, r.title, r.description, r.category, r.complexity, r.session_id)

@app.get("/questions/{question_id}", status_code=200)
async def get_question(question_id: str, r: rm.GetQuestion, request: Request):
    await check_session(request, USER_PERMISSION)

    return qc.get_question(question_id, r.session_id)

@app.put("/questions", status_code=200)
async def update_question_info(r: rm.UpdateQuestionInfo, request: Request):
    await check_session(request, MAINTAINER_PERMISSION)

    return qc.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity, r.session_id)

@app.delete("/questions/{question_id}", status_code=200)
async def delete_question(question_id: str, r: rm.DeleteQuestion, request: Request):
    await check_session(request, MAINTAINER_PERMISSION)

    return qc.delete_question(question_id, r.session_id)