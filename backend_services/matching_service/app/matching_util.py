from asyncio import Event


websocket_connections = {}


def add_event(user_id, event: Event):
    websocket_connections[user_id] = event
    return


def set_message_received(user_id):
    event = websocket_connections.get(user_id)
    if event:
        event.set()
    if websocket_connections.get(user_id) is not None:
        websocket_connections.pop(user_id)
