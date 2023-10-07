from dataclasses import dataclass
from typing import Literal, TypeAlias

from fastapi import WebSocket
from pydantic import BaseModel

Complexity: TypeAlias = Literal["easy", "medium", "hard"]


class MatchRequest(BaseModel):
    """Payload received from frontend."""

    user_id: str
    complexity: Complexity
    action: Literal["queue", "cancel"]


class MatchResponse(BaseModel):
    """Payload sent to frontend."""

    is_matched: bool
    user_id: str | None


# Using normal dataclass instead of Pydantic because `WebSocket` and
# `asyncio.Task` aren't compatible with Pydantic.
@dataclass
class UserWebSocket:
    """Representation of a user (with their corresponding websocket)."""

    user_id: str
    websocket: WebSocket


class UserWebSocketQueue:
    """Queue for `UserWebSocket`."""

    def __init__(self) -> None:
        self._queue: list[UserWebSocket] = []

    def is_empty(self) -> bool:
        return len(self._queue) == 0

    def push(self, x: UserWebSocket) -> None:
        self._queue.append(x)

    def pop(self) -> UserWebSocket:
        return self._queue.pop(0)

    def remove_by_websocket(self, websocket: WebSocket) -> None:
        for i, x in enumerate(self._queue):
            if x.websocket == websocket:
                del self._queue[i]
                break

    def __len__(self) -> int:
        return len(self._queue)

    def __str__(self) -> str:
        return str(self._queue)
