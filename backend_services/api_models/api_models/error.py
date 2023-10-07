from pydantic import BaseModel


class ServiceError(BaseModel):
    status_code: int
    message: str
