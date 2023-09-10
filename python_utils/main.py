from embedder import get_embedding
from database import collection

# Example usage
text = "This is a sample sentence for the crypto protocol."
embedding = get_embedding(text)

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