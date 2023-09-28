FROM ay2324s1-course-assessment-g23-base_api:latest

WORKDIR /

COPY ./utils /utils
COPY main.py main.py

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]