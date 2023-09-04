import unittest
import requests

data = {
            "user_id": "d5fbb2d6-954f-4381-b795-f093cffed175",
            "username": "testuser1101",
            "password": "testpassword",
            "email": "test100@example.com"
        }

response = requests.put("http://localhost:8000/users", json=data)
print(response.content)

