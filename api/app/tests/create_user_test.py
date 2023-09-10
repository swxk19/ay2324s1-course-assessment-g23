import unittest
import requests

data = {
            "username": "testuser1101",
            "email": "test1010@example.com",
            "password": "testpassword"
        }

response = requests.post("http://localhost:8000/users", json=data)
print(response.content)

