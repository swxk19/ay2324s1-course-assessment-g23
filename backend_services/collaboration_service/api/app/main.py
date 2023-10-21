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

clients = []
document = ""
@app.websocket("/ws/collab")
async def websocket_endpoint(websocket: WebSocket):
    global clients
    global document

    await websocket.accept()

    clients.append(websocket)

    # send current room document to newly connected client
    await websocket.send_json({"event": "open", "data": document })

    try:
        while True:
            # Wait for incoming messages from the client
            data = await websocket.receive_json()

            # Check the event type
            event = data.get("event")
            if event == "send-changes":
                payload = data.get("data")
                delta = payload.get("delta")
                document = payload.get("fullDoc")
                for client in clients:
                    if client != websocket:
                        await client.send_json({"event": "receive-changes", "data": delta})


    except WebSocketDisconnect:
        clients.remove(websocket)
