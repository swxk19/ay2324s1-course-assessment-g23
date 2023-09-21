import unittest
import requests

data = {
            "title": "testquestion1",
            "description": "tasaugndgadngdgaonidganaidgni adfafdadgajbagdog",
            "category": "category 123",
            "complexity": "Easy"
        }

response = requests.post("http://localhost:8000/questions", json=data)
print(response.content)

