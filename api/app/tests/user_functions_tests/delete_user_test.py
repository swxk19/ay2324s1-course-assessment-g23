import unittest
import requests

# id = "all"
id="26167260-569e-45b4-93af-c61642ba3b6f"
response = requests.delete(f"http://localhost:8000/users/{id}")
print(response.content)

