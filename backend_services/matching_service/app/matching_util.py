from fastapi import WebSocket
from asyncio import Event
from typing import Dict


class User:
    def __init__(self, user_id, complexity):
        self.user_id = user_id
        self.complexity = complexity


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
