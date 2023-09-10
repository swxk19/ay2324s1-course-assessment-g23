import unittest
import requests

# id = "all"
id="62b76ec0-1e61-492b-b7e4-6fea239154f0"
response = requests.delete(f"http://localhost:8000/questions/{id}")
print(response.content)

