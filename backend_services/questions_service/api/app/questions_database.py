from database_model import Database
import os

HOST = os.getenv('POSTGRES_HOST')
PORT = os.getenv('POSTGRES_PORT')
DATABASE = os.getenv('POSTGRES_DB')
USER = os.getenv('POSTGRES_USER')
PASSWORD = os.getenv('POSTGRES_PASSWORD')

QUESTIONS_DATABASE = Database(HOST, PORT, DATABASE, USER, PASSWORD)
