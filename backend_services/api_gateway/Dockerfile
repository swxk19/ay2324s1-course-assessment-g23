FROM base_api

WORKDIR /

COPY ./utils /utils
COPY main.py main.py

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]