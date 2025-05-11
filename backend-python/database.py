import os
from databases import Database

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://jop:16753@localhost:5432/practica_db')

database = Database(DATABASE_URL)
