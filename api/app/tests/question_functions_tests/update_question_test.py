import requests

data = {
            "id": "62b76ec0-1e61-492b-b7e4-6fea239154f0",
            "title": "testquestion1",
            "description": "tasaugndgadngdgaonidganaidgni adfafdadgajbagdog",
            "category": "category 123",
            "complexity": "Easy"
        }

response = requests.put("http://localhost:8000/users", json=data)
print(response.content)

