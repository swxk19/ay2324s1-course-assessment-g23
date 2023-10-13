from typing import Any, cast
from fastapi import Cookie, FastAPI, HTTPException, Request, WebSocket
from fastapi.responses import JSONResponse
import httpx
import json
from fastapi.middleware.cors import CORSMiddleware
from api_models.error import ServiceError
from api_models.users import UserLoginResponse
from utils.api_permissions import Method
import websockets
from utils.api_gateway_util import has_permission, map_path_microservice_url, connect_matching_service_websocket
from utils.addresses import MATCHING_SERVICE_HOST

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Receive message from client
        message = await websocket.receive_text()
        request =  json.loads(message)
        service = request["service"]
        body = request["message"]
        # Send message to microservice
        if service == "matching-service":
            # await connect_matching_service_websocket(websocket, message)
            websocket_url = "ws://" + MATCHING_SERVICE_HOST + ":8003/ws/matching"
            async with websockets.connect(websocket_url) as matching_service_websocket:
                await matching_service_websocket.send_text(json.dumps(request))
                response = await matching_service_websocket.receive_text()
                message = json.loads(response)
                await websocket.send_text(json.dumps(message))
                websocket.close()
        else:
            raise HTTPException(status_code=400, detail=f"Invalid service requested: {service}")

    except HTTPException as http_exc:
        await websocket.send_text(http_exc.detail)
    except websockets.exceptions.ConnectionClosedError as conn_closed_exc:
        # Handle WebSocket connection closed errors
        print(f"WebSocket connection closed: {conn_closed_exc}")
    except Exception as e:
        # Log any other exceptions for debugging
        print(f"An error occurred: {e}")

async def route_request(
    method: Method,
    path: str,
    service: str,
    microservice_url: str,
    session_id: str | None,
    data: Any
) -> httpx.Response:
    # Forward the request to the microservice
    async with httpx.AsyncClient() as client:
        match method:
            case "GET":
                if service == "sessions":
                    path += f"/{session_id}"
                return await client.get(f"{microservice_url}{path}")
            case "POST":
                return await client.post(f"{microservice_url}{path}", data=data)
            case "PUT":
                return await client.put(f"{microservice_url}{path}", data=data)
            case "DELETE":
                if service == "sessions":
                    path += f"/{session_id}"
                return await client.delete(f"{microservice_url}{path}")

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def handle_request(request: Request, session_id: str | None = Cookie(None)) -> JSONResponse:
    path = request.url.path
    method = cast(Method, request.method)

    # Determine the microservice URL based on the path
    service, microservice_url = map_path_microservice_url(path)
    if service is None:
        return JSONResponse(status_code=404, content="Endpoint not found")

    if not await has_permission(session_id, path, method):
        return JSONResponse(status_code=401, content="Unauthorized access")

    data = await request.body()
    res = await route_request(method, path, service, microservice_url, session_id, data)

    if res.status_code != 200:
        return JSONResponse(status_code=res.status_code, content=res.content)

    res_json: dict = res.json()
    output = JSONResponse(content=res_json)
    if ServiceError.is_service_error(res_json):
        service_error = ServiceError(**res_json)
        raise HTTPException(status_code=service_error.status_code, detail=service_error.message)

    if path == "/sessions" and method == "POST":
        login_json = UserLoginResponse(**res_json)
        output.set_cookie(key='session_id', value=login_json.session_id)
    elif path == "/sessions" and method == "DELETE":
        output.delete_cookie('session_id')

    return output
