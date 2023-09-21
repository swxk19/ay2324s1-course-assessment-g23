import unittest
import requests

data = {
            "username": "testuser111012",
            "email": "test1010112@example.com",
            "password": "testpassword"
        }

response = requests.post("http://localhost:8000/users", json=data)
print(response.content)

