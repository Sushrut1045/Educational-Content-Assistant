import requests
res = requests.post('http://localhost:8000/quiz', json={'text': 'Test quiz', 'num_questions': 2})
print(res.status_code, res.text)
