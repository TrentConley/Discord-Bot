import os

# main.py

from embedder import get_embedding
from database import collection

def embed_document(text):
    embedding = get_embedding(text)

    # Sample document
    document = {
        "text": text,
        "embedding": embedding,
        # ... any other fields you wish to include
    }

    # Insert into MongoDB
    collection.insert_one(document)

# Get a list of all text files in the 'documents' directory
document_dir = 'documents'
text_files = [f for f in os.listdir(document_dir) if f.endswith('.txt')]

# Read and embed each text file
for text_file in text_files:
    with open(os.path.join(document_dir, text_file), 'r') as file:
        text = file.read()
        embed_document(text)