from dataclasses import dataclass, field

from fastapi import WebSocket


@dataclass
class Room:
    """Represents a room, containing the websockets of all clients in the room,
    and the current full document string.
    """

    clients: list[WebSocket] = field(default_factory=list)
    full_document: str = ""
