# Financial Ledger Automation

An automated tool to parse bank transaction notifications from Gmail and WhatsApp exports into a Google Spreadsheet using Anthropic's Claude 4.5.

## Features

- **Gmail Integration**: Scans your inbox for transaction alerts from BCA and Mandiri.
- **WhatsApp ZIP Processing**: Automatically unzips and parses WhatsApp chat exports from Bank Mandiri.
- **AI-Powered Extraction**: Uses Claude 4.5 Haiku to intelligently extract date, amount, and merchant name even from messy or HTML-heavy emails.
- **Deduplication**: Uses MD5 fingerprinting to ensure transactions are never logged twice, even if you re-upload the entire chat history.
- **April 2026 Filter**: Specifically configured to start processing records from April 2026 onwards for WhatsApp imports.

## Setup Instructions

### 1. Google Sheet Setup
Create a Google Sheet with the following columns:
1. **Date** (YYYY-MM-DD)
2. **Amount** (Integer)
3. **Merchant**
4. **Source** (e.g., BCA, Mandiri -WA)
5. **Status** (e.g., Logged)
6. **Unique ID** (Crucial for deduplication)

### 2. Google Apps Script Setup
1. Open your Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Delete any existing code and paste the content of `Code.gs`.
4. In the left sidebar, click the **+** next to **Services** and add the **Drive API**.

### 3. Configuration
Update the following constants in the script:
- `ANTHROPIC_API_KEY`: Your API key from the Anthropic Console.
- `SPREADSHEET_ID`: The ID of your Google Sheet (found in the URL).
- `WA_FOLDER_ID`: The ID of the Google Drive folder where you will upload your WhatsApp ZIP exports.

### 4. Gmail Labeling
Ensure your transaction emails are labeled with `transaction-notices` (or update the `GMAIL_QUERY` in the script to match your setup).

## Usage

- **Gmail Processing**: Select `runGmailProcessor` from the toolbar and click **Run**.
- **WhatsApp Processing**: Upload your WhatsApp export (ZIP) to the designated Drive folder. Select `runWhatsAppZipProcessor` and click **Run**.

## Security Note
This script is for personal use. Never share your `ANTHROPIC_API_KEY` or `SPREADSHEET_ID` publicly. Ensure this code is sanitized before uploading to GitHub.
