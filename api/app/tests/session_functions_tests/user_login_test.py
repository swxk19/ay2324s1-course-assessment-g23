import unittest
import requests

username = "testuser2"
password = "testpassword"

json_data = {
    'username': f'{username}',
    'password': f'{password}'
}

response = requests.post(f"http://localhost:8000/sessions", json=json_data)
print(response.content)