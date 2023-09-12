import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from fastapi import HTTPException

import requestModels as rm
import database as db
from database_functions import user_functions as uf, question_functions as qf, session_functions as sf
from database_functions.utils.sessions_util import Session
# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_sessions = [] # list of Session objects (see session_util.py for Session class)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_tasks())

@app.post("/users", status_code=200)
async def create_user(r: rm.CreateUser):
    user_id = str(uuid.uuid4())
    return uf.create_user(user_id, r.username, r.email, r.password)


@app.get("/users/{user_id}", status_code=200)
async def get_user(user_id: str):
    return uf.get_user(user_id)

@app.delete("/users/{user_id}", status_code=200)
async def delete_user(user_id: str):
    return uf.delete_user(user_id)

@app.put("/users", status_code=200)
async def update_user_info(r: rm.UpdateUserInfo):
    return uf.update_user_info(r.user_id, r.username, r.password, r.email)

@app.post("/questions", status_code=200)
async def create_question(r: rm.CreateQuestion):
    question_id = str(uuid.uuid4())
    return qf.create_question(question_id, r.title, r.description, r.category, r.complexity)

@app.get("/questions/{question_id}", status_code=200)
async def get_question(question_id: str):
    return qf.get_question(question_id)

@app.put("/questions", status_code=200)
async def update_question_info(r: rm.UpdateQuestionInfo):
    return qf.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity)

@app.delete("/questions/{question_id}", status_code=200)
async def delete_question(question_id: str):
    return qf.delete_question(question_id)

@app.post("/sessions",  status_code=200)
async def user_login(r: rm.UserLogin):
    session_id, user_id = sf.user_login(r.username, r.password)
    active_sessions.append(Session(session_id, user_id, 'placeholder-role'))

    return {
                'session_id': f'{session_id}',
                'role': 'placeholder',
                'message': f'User {r.username} successfully logged in'
            }

@app.get("/sessions/{session_id}",  status_code=200)
async def get_session(session_id: str):
    requested_session = None
    for session in active_sessions:
        if session.is_session(session_id):
            requested_session = session
    if requested_session:
        return { 'role': requested_session.role }
    else:
        raise HTTPException(status_code=401, detail='Unauthorized session')

# Initialised once on fastAPI startup
async def background_tasks():
    manage_sessions()

async def manage_sessions():
    global active_sessions

    while True:
        for session in active_sessions:
            if session.is_expired():
                sf.remove_session(session)
        await asyncio.sleep(60)  # Sleep for 60 seconds (adjust as needed)