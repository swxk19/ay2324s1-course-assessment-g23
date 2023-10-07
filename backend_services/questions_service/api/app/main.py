import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api_models import questions as rm
from controllers import questions_controller as qc

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

@app.post("/questions", status_code=200)
async def create_question(r: rm.CreateQuestion):
    question_id = str(uuid.uuid4())
    return qc.create_question(question_id, r.title, r.description, r.category, r.complexity)

@app.get("/questions/{question_id}", status_code=200)
async def get_question(question_id: str):
    return qc.get_question(question_id)

@app.get("/questions_all", status_code=200)
async def get_question():
    return qc.get_all_questions()


@app.put("/questions", status_code=200)
async def update_question_info(r: rm.UpdateQuestionInfo):
    return qc.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity, r.session_id)

@app.delete("/questions/{question_id}", status_code=200)
async def delete_question(question_id: str):
    return qc.delete_question(question_id)