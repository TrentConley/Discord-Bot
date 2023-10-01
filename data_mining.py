from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.service_account import Credentials
# Initialize the Google Docs API client
credentials = Credentials.from_service_account_file(
    'discord-bot-400700-9b6026dc91e1.json', 
    scopes=[
        'https://www.googleapis.com/auth/documents.readonly', 
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'  # Add this line
    ]
)
docs_service = build('docs', 'v1', credentials=credentials)

drive_service = build('drive', 'v3', credentials=credentials)

# Initialize the Google Sheets API client
sheets_service = build('sheets', 'v4', credentials=credentials)

# Fetch the Google Doc
document_id = '1dGQwMCnn52BGhc_QRQnJSW04E_llFp0cM0xLGaokWXA'
document = docs_service.documents().get(documentId=document_id).execute()

# Extract hyperlinks
hyperlinks = []
for element in document['body']['content']:
    if 'paragraph' in element:
        for paragraphElement in element['paragraph']['elements']:
            if 'textRun' in paragraphElement:
                textRun = paragraphElement['textRun']
                if 'link' in textRun['textStyle']:
                    hyperlink = textRun['textStyle']['link']['url']
                    hyperlinks.append(hyperlink)

print(hyperlinks)
# Create a new Google Sheet
sheet = sheets_service.spreadsheets().create().execute()
sheet_id = sheet['spreadsheetId']

# Insert hyperlinks into the Google Sheet
# Your code here to insert the hyperlinks into the sheet
# Prepare the data to be inserted
data = [
    {
        'range': 'Sheet1!A1:A{}'.format(len(hyperlinks)),
        'values': [[link] for link in hyperlinks]
    }
]

# Create the batchUpdate request
body = {
    'valueInputOption': 'RAW',
    'data': data
}

# Call the Sheets API
sheets_service.spreadsheets().values().batchUpdate(
    spreadsheetId=sheet_id,
    body=body
).execute()

def share_with_email(service, file_id, email):
    def callback(request_id, response, exception):
        if exception:
            # Handle error
            print(exception)
        else:
            print(f'Permission Id: {response.get("id")}')

    batch = service.new_batch_http_request(callback=callback)
    user_permission = {
        'type': 'user',
        'role': 'writer',
        'emailAddress': email
    }
    batch.add(service.permissions().create(
        fileId=file_id,
        body=user_permission,
        fields='id',
    ))
    batch.execute()

share_with_email(drive_service, sheet_id, 'trentconley@gmail.com')