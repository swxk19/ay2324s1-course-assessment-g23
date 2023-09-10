import unittest
import requests

data = {
            "id": "121d480c-de96-4f72-abca-0a31586ccb28",
            "username": "testuser1102",
            "password": "testpassword",
            "email": "test10102@example.com"
        }

response = requests.put("http://localhost:8000/users", json=data)
print(response.content)

