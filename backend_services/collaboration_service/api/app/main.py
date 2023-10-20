from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware


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

# clients = []
# @app.websocket("/ws2/editor")
# async def collab_editor(websocket: WebSocket):
#     await websocket.accept()
#     clients.append(websocket)

#     try:
#         while True:
#             data = await websocket.receive_text()
#             delta = data[len("send-changes:"):]

#             for client in clients:
#                 await client.send_text("")
#     except WebSocketDisconnect:
#         clients.remove(websocket)

@app.websocket("/ws/collab")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Send an "open" event to the client
    await websocket.send_json({"event": "open"})
