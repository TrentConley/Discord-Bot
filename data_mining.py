from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Initialize the Google Docs API client
credentials = Credentials.from_service_account_file('discord-bot-400700-9b6026dc91e1.json', scopes=['https://www.googleapis.com/auth/documents.readonly'])
docs_service = build('docs', 'v1', credentials=credentials)

# Initialize the Google Sheets API client
sheets_service = build('sheets', 'v4', credentials=credentials)

# Fetch the Google Doc
document_id = 'your_google_doc_id_here'
document = docs_service.documents().get(documentId=document_id).execute()

# Extract hyperlinks
hyperlinks = []
for element in document['body']['content']:
    # Your code here to extract hyperlinks from the element

# Create a new Google Sheet
sheet = sheets_service.spreadsheets().create().execute()
sheet_id = sheet['spreadsheetId']

# Insert hyperlinks into the Google Sheet
# Your code here to insert the hyperlinks into the sheet