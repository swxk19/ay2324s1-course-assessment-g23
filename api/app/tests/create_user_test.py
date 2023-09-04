import unittest
import requests

data = {
            "username": "testuser110",
            "email": "test100@example.com",
            "password": "testpassword"
        }

response = requests.post("http://localhost:8000/users", json=data)
print(response.content)

