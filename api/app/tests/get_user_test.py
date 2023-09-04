import unittest
import requests

data = {
    "user_id": "d5fbb2d6-954f-4381-b795-f093cffed175"
}

response = requests.get("http://localhost:8000/users", json=data)
print(response.content)

