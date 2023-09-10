from pymongo import MongoClient
from config import mongodb_password

# Connect to MongoDB Atlas
client = MongoClient(f'mongodb+srv://trentconley:{mongodb_password}@cluster0.aaepbj6.mongodb.net/?retryWrites=true&w=majority')
db = client['crypto_protocol_db']
collection = db['documentation_pages']