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
    db.create_user(user_id, r.username, r.email, r.password)
    return {"user_id": user_id}

@app.get("/users", status_code=200)
async def get_user(r: rm.GetUser):
    return db.get_user(r.user_id)