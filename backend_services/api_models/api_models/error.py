from pydantic import BaseModel


class ServiceError(BaseModel):
    status_code: int
    message: str

    @staticmethod
    def is_service_error(json: dict) -> bool:
        return "status_code" in json
