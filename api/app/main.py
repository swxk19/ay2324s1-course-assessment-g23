import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import requestModels as rm
import database as db

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users", status_code=200)
async def create_user(r: rm.CreateUser):
    user_id = str(uuid.uuid4())
    if (db.create_user(user_id, r.username, r.email, r.password)):
        return {"user_id": user_id}
    else:
        return {"message": "Invalid creation"} # placeholder message. Better to specify invalid fields

@app.get("/users", status_code=200)
async def get_user(r: rm.GetUser):
    return db.get_user(r.user_id)

@app.delete("/users", status_code=200)
async def delete_user(r: rm.DeleteUser):
    return db.delete_user(r.user_id)

@app.put("/users", status_code=200)
async def update_user_info(r: rm.UpdateUserInfo):
    if (db.update_user_info(r.user_id, r.username, r.password, r.email)):
        return {"message": "Updated Successfully"}
    else:
        return {"message": "Invalid update"} # placeholder message. Better to specify why invalid

@app.post("/questions", status_code=200)
async def create_question(r: rm.CreateQuestion):
    question_id = str(uuid.uuid4())
    if (db.create_question(question_id, r.title, r.description, r.category, r.complexity)):
        return {"question_id": question_id}
    else:
        return {"message": "Invalid creation"}

@app.get("/questions/{question_id}", status_code=200)
async def get_question(question_id: str):
    return db.get_question(question_id)

@app.put("/questions", status_code=200)
async def update_question_info(r: rm.UpdateQuestionInfo):
    if (db.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity)):
        return {"message": "Updated Successfully"}
    else:
        return {"message": "Invalid update"} # placeholder message. Better to specify why invalid
    
@app.delete("/questions/{question_id}", status_code=200)
async def delete_question(question_id: str):
    return db.delete_question(question_id)
