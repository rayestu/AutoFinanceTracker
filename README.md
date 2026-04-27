# Financial Ledger Automation

An automated tool to parse bank transaction notifications from Gmail and WhatsApp exports into a Google Spreadsheet using Anthropic's Claude 4.5.

## Features

- **Gmail Integration**: Scans your inbox for transaction alerts from BCA and Mandiri.
- **WhatsApp ZIP Processing**: Automatically unzips and parses WhatsApp chat exports from Bank Mandiri.
- **AI-Powered Extraction**: Uses Claude 4.5 Haiku to intelligently extract transaction details from messy or HTML-heavy text.
- **Deduplication**: Uses MD5 fingerprinting to ensure transactions are never logged twice, even if you re-upload a full chat history.
- **Flexible Date Filter**: Control the logging start date for all sources via a single configuration variable.

## Setup Instructions

### 1. Google Sheet Setup
Create a Google Sheet with the following columns:
1. **Date** (YYYY-MM-DD)
2. **Amount** (Integer)
3. **Merchant**
4. **Source** (e.g., BCA, Mandiri -WA)
5. **Status** (e.g., Logged)
6. **Unique ID** (Column F)

### 2. Google Apps Script Setup
1. Open your Google Sheet and go to **Extensions > Apps Script**.
2. Paste the content of `Code.gs`.
3. In the left sidebar, click the **+** next to **Services** and add the **Drive API**.

### 3. Configuration
Update the constants at the top of `Code.gs`:
- `ANTHROPIC_API_KEY`: Your Anthropic API key.
- `SPREADSHEET_ID`: The ID of your Google Sheet.
- `WA_FOLDER_ID`: The ID of the Drive folder for your WhatsApp ZIP exports.
- `START_DATE`: Set your desired start date (format: `YYYY-MM-DD`).

### 4. Usage
- **Emails**: Run `runGmailProcessor`. Ensure emails are labeled `transaction-notices`.
- **WhatsApp**: Upload your WhatsApp export (ZIP) to the Drive folder and run `runWhatsAppZipProcessor`.

## Security Note
This script is for personal use. Never share your API key or Spreadsheet ID publicly. Always sanitize your code before uploading to a public repository like GitHub.