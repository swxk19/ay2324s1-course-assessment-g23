import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from shared_definitions.api_models.questions import CreateQuestionRequest, CreateQuestionResponse, DeleteQuestionResponse, GetQuestionResponse, UpdateQuestionRequest, UpdateQuestionResponse
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

@app.post("/questions")
async def create_question(r: CreateQuestionRequest) -> CreateQuestionResponse:
    question_id = str(uuid.uuid4())
    return qc.create_question(question_id, r.title, r.description, r.category, r.complexity)

@app.get("/questions/{question_id}")
async def get_question(question_id: str) -> GetQuestionResponse:
    return qc.get_question(question_id)

@app.get("/questions_all")
async def get_all_questions() -> list[GetQuestionResponse]:
    return qc.get_all_questions()


@app.put("/questions")
async def update_question_info(r: UpdateQuestionRequest) -> UpdateQuestionResponse:
    return qc.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity)

@app.delete("/questions/{question_id}")
async def delete_question(question_id: str) -> DeleteQuestionResponse:
    return qc.delete_question(question_id)