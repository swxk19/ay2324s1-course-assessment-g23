import asyncio
import json
import re
from typing import Any, cast

import fastapi
import httpx
import websockets.client
import websockets.exceptions
from fastapi import Cookie, FastAPI, HTTPException, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, StreamingResponse
from fastapi.websockets import WebSocketState
from service_registry import (
    COLLABORATION_SERVICE_HOST,
    COMMUNICATION_SERVICE_HOST,
    MATCHING_SERVICE_HOST,
    service_registry,
)
from websockets.protocol import State

from shared_definitions.api_models.users import UserLoginResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


async def forward_communication(ws_a: WebSocket, ws_b: websockets.client.WebSocketClientProtocol):
    """Handles communication from frontend -> microservice."""
    while True:
        data = await ws_a.receive_text()
        await ws_b.send(data)


async def reverse_communication(ws_a: WebSocket, ws_b: websockets.client.WebSocketClientProtocol):
    """Handles communication from microservice -> frontend."""
    while True:
        data = await ws_b.recv()
        assert isinstance(data, str)
        await ws_a.send_text(data)


@app.websocket("/ws/{route:path}")
async def websocket_endpoint(ws_a: WebSocket, route: str):
    matching_api_url = f"ws://{MATCHING_SERVICE_HOST}:8003/ws/matching"
    collaboration_api_url = f"ws://{COLLABORATION_SERVICE_HOST}:8000/ws/collab"
    communication_api_url = f"ws://{COMMUNICATION_SERVICE_HOST}:8000/ws/communication"

    match route.split("/"):
        case ["matching"]:
            requested_service = matching_api_url
        case ["collab", room_id]:
            requested_service = collaboration_api_url + f"/{room_id}"
        case ["communication", room_id, user_id]:
            requested_service = communication_api_url + f"/{room_id}" + f"/{user_id}"
        case _:
            # If route doesn't match any service above, exit.
            return

    await ws_a.accept()
    async with websockets.client.connect(requested_service) as ws_b_client:
        try:
            fwd_task = asyncio.create_task(forward_communication(ws_a, ws_b_client))
            rev_task = asyncio.create_task(reverse_communication(ws_a, ws_b_client))
            await asyncio.gather(fwd_task, rev_task)

        # Ignore any "connection closed" errors. They're expected because any
        # of the websockets methods might fail when the websocket closes.
        except fastapi.websockets.WebSocketDisconnect:
            pass
        except websockets.exceptions.ConnectionClosedOK:
            pass

        finally:
            # If any websockets aren't closed, close them.
            # `ws_a` and `ws_b_client` are from different packages, so they use
            # different websocket-states.
            if ws_a.client_state != WebSocketState.DISCONNECTED:  # FastAPI's websocket.
                await ws_a.close()
            if ws_b_client.state != State.CLOSED:  # websockets's websocket
                await ws_b_client.close()


@app.api_route("/{service_prefix}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def route_to_service(service_prefix: str, path: str, request: Request):
    global service_registry
    try:
        service_address = service_registry.get_service_address(service_prefix)
    except:
        return PlainTextResponse(content="Endpoint not found", status_code=404)

    # Forward the request to the microservice
    async with httpx.AsyncClient() as client:
        res = await client.request(
            method=request.method,
            url=f"http://{service_address}/{path}",
            headers=request.headers,
            cookies=request.cookies,
            data=await request.body(),  # type: ignore
        )

        return httpx_response_to_fastapi(res)


def httpx_response_to_fastapi(httpx_res: httpx.Response) -> StreamingResponse:
    headers = dict(httpx_res.headers)
    if "set-cookie" not in headers:
        return StreamingResponse(
            content=httpx_res.iter_bytes(),
            headers=headers,
            status_code=httpx_res.status_code,
        )

    # Fixes malformed "folded" set-cookie header.
    malformed_set_cookie = headers["set-cookie"]
    del headers["set-cookie"]
    cookie_regex = r'(\w+)=("[^"]*"|[^;,]+)(?:;\s*expires=(\w{3},\s[\w\s:]+GMT))?(?:;\s*Max-Age=([^;]+))?(?:;\s*Path=([^;]+))?(?:;\s*SameSite=([^;,]+))?'
    cookies = re.findall(cookie_regex, malformed_set_cookie)
    parsed_cookies = [
        {
            "key": cookie[0],
            "value": str(cookie[1]).replace('"', ""),
            "expires": cookie[2],
            "max_age": cookie[3],
            "path": cookie[4],
            "samesite": cookie[5],
        }
        for cookie in cookies
    ]
    response = StreamingResponse(
        content=httpx_res.iter_bytes(),
        headers=headers,
        status_code=httpx_res.status_code,
    )
    for cookie in parsed_cookies:
        response.set_cookie(**cookie)
    return response
