import openai

from dotenv import load_dotenv
from pathlib import Path
import os

# Construct the path to the .env file
env_path = Path('..') / '.env'

# Load the environment variables
load_dotenv(dotenv_path=env_path)

# Access the MongoDBPassword
mongodb_password = os.getenv("MongoDBPassword")

# Access the OpenAI API Key
openai_api_key = os.getenv("OpenAPIKey")

# Set the OpenAI API key in the package configuration
openai.api_key = openai_api_key

def get_embedding(text):
    response = openai.Embedding.create(
      model="text-embedding-ada-002",
      input=text
    )
    embedding = response['data'][0]['embedding']
    return embedding

# Example usage
text = "This is a sample sentence for the crypto protocol."
embedding = get_embedding(text)


from pymongo import MongoClient

# Connect to MongoDB Atlas
client = MongoClient(f'mongodb+srv://trentconley:{mongodb_password}@cluster0.aaepbj6.mongodb.net/?retryWrites=true&w=majority')
db = client['crypto_protocol_db']
collection = db['documentation_pages']

# Sample document
document = {
  "page_number": 1,
  "section": "Introduction",
  "text": text,
  "embedding": embedding,
  # ... any other fields you wish to include
}

# Insert into MongoDB
collection.insert_one(document)
