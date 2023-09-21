from fastapi import FastAPI, HTTPException
import httpx

HOST_URL = "http://localhost"
USERS_API_PORT = 8001
QUESTIONS_API_PORT = 8002

app = FastAPI()

# Define routes in the API Gateway
@app.get("/users")
async def route_to_users():
    # Forward the request to Service 1
    async with httpx.AsyncClient() as client:
        response = await client.get(f'{HOST_URL}:{USERS_API_PORT}')
        response.raise_for_status()
        return response.text

@app.get("/sessions")
async def route_to_sessions():
    return route_to_users()

@app.get("/questions")
async def route_to_service2():
    # Forward the request to Service 2
    async with httpx.AsyncClient() as client:
        response = await client.get(f'{HOST_URL}:{QUESTIONS_API_PORT}')
        response.raise_for_status()
        return response.text