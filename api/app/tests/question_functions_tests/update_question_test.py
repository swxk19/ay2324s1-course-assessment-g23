import requests

data = {
            "question_id": "b3c0912f-7f9d-4044-a72b-426fa3cfceda",
            "title": "111",
            "description": "t1ni adfafdadgajbagdog",
            "category": "category 123",
            "complexity": "Easy"
        }

response = requests.put("http://localhost:8000/questions", json=data)
print(response.content)

