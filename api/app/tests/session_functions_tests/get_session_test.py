import unittest
import requests

session_id="8ba56bd2-9cc4-4918-80f5-79f186a9cb5d"
response = requests.get(f"http://localhost:8000/sessions/{session_id}")
print(response.content)