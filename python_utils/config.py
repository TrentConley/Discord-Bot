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