import unittest
import requests

user_id = "all"
# user_id="121d480c-de96-4f72-abca-0a31586ccb28"
response = requests.get(f"http://localhost:8000/users_all")
print(response.content)