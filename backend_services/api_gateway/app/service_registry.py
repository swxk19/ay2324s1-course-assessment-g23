from utils.addresses import (
    API_PORT,
    COLLABORATION_SERVICE_HOST,
    COMMUNICATION_SERVICE_HOST,
    USERS_SERVICE_HOST,
    QUESTIONS_SERVICE_HOST,
    MATCHING_SERVICE_HOST,
)


class ServiceRegistry:
    def __init__(self) -> None:
        self._prefix_to_address_map: dict[str, str] = {}

    def register_service(self, path_prefix: str, service_address: str) -> None:
        if path_prefix in self._prefix_to_address_map:
            raise Exception(
                f'Prefix "{path_prefix}" is already registered to the address "{self._prefix_to_address_map[path_prefix]}".'
            )
        self._prefix_to_address_map[path_prefix] = service_address

    def get_service_address(self, path_prefix: str) -> str:
        if path_prefix not in self._prefix_to_address_map:
            raise Exception(f'No service registered with the prefix "{path_prefix}".')
        return self._prefix_to_address_map[path_prefix]


service_registry = ServiceRegistry()
service_registry.register_service("users", USERS_SERVICE_HOST + ":" + API_PORT)
service_registry.register_service("questions", QUESTIONS_SERVICE_HOST + ":" + API_PORT)
# Matching uses a different port
service_registry.register_service("matching", MATCHING_SERVICE_HOST + ":8003")
service_registry.register_service("collaboration", COLLABORATION_SERVICE_HOST + ":" + API_PORT)
service_registry.register_service("communication", COMMUNICATION_SERVICE_HOST + ":" + API_PORT)
