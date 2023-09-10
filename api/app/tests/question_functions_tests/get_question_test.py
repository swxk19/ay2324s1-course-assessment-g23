import unittest
import requests

id = "all"
# user_id="121d480c-de96-4f72-abca-0a31586ccb28"
response = requests.get(f"http://localhost:8000/questions/{id}")
print(response.content)

