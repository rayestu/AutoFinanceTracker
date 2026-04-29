# 🚀 Auto-Ledger for Google Sheets

Auto-Ledger is a privacy-first, automated expense tracking tool built entirely inside Google Sheets. It uses Anthropic's Claude AI to read your bank notification emails and WhatsApp expense chats, extracts the financial data, and logs it directly into your spreadsheet. 

Because it runs entirely on Google Apps Script within your own Google Account, **your data and API keys never leave your control.**

## ✨ Features
* **✉️ Gmail Sync:** Automatically scans your inbox for transaction alerts based on a custom search query. *Currently supports emails from:*
  * Livin' by Mandiri
  * myBCA
  * Kartu Kredit BCA
* **💬 WhatsApp Sync:** Parses exported WhatsApp chats (via ZIP files in Google Drive) to log official bank alerts and manual expense entries.
* **🧠 AI-Powered Parsing:** Uses Claude (Haiku) to intelligently extract the Date, Amount, Merchant, and Source without relying on rigid, easily-broken text formulas.
* **🛡️ Privacy First:** API keys are stored securely in your personal Google account's hidden `PropertiesService`, not in spreadsheet cells.
* **🪞 Smart Deduplication:** Prevents duplicate entries by hashing chat lines and tracking Gmail message IDs.

---

## 🛠️ Prerequisites
Before using this tool, you will need:
1. A **Google Account**.
2. An **Anthropic API Key**. You can get one by signing up at the [Anthropic Console](https://console.anthropic.com/). You will only be charged a fraction of a cent per transaction logged.
3. A **Google Drive Folder** specifically dedicated to dropping your WhatsApp `.zip` chat exports.

---

## 📦 Installation & Setup

### 1. Copy the Template
Click here to make your own private copy of the Auto-Ledger:
👉 **[Get the Auto-Ledger Template](https://rayestu.com/AutoFinanceTracker)**

*(Make sure you are logged into your Google account, then click **Make a copy** when prompted).*

### 2. Configure Your Settings
1. Open your newly copied Google Sheet.
2. Refresh the page. After a few seconds, a custom menu called **🚀 Sync Ledger** will appear at the top of the screen (next to "Help").
3. Click **🚀 Sync Ledger > ⚙️ Settings**.
4. A sidebar will open on the right. Fill in your details:
   * **Anthropic API Key:** Paste your `sk-ant-...` key here.
   * **WhatsApp Folder ID:** Go to the folder you created in Google Drive. Look at the URL in your browser and copy *only* the string of random letters and numbers at the very end. Paste that here.
   * **Start Date:** The script will ignore any emails or chats from before this date.
   * **Gmail Search Query:** Define which emails the script should read. (e.g., `label:transaction-notices` or `from:no-reply@bankmandiri.co.id`).
5. Click **Save Settings**.

> **⚠️ The "Scary" Google Warning:**
> The very first time you run a sync or open settings, Google will ask for authorization and warn you that *"Google hasn't verified this app."* This is completely normal because you now own the code! 
> * Click **Continue** -> Choose your email -> Click **Advanced** -> Click **Go to Ledger (unsafe)** -> Click **Allow**.

---

## 🔄 How to Use

### Syncing Emails
Simply click **🚀 Sync Ledger > Sync Gmail Alerts**. 
The script will search your inbox using your defined query, process any new emails using Claude, log them into your sheet, and tag them to prevent future duplicates.

### Syncing WhatsApp Chats
1. On your phone, export your WhatsApp chat (**Without Media**).
2. Upload the resulting `.zip` file into the Google Drive folder you linked in your settings.
3. In your spreadsheet, click **🚀 Sync Ledger > Sync WhatsApp ZIPs**.
4. The script will unzip the file, read the contents, log new transactions, and rename the ZIP file in your Drive to start with `PROCESSED_` so it doesn't read it again.

*(Note: Manual WhatsApp entries must include a date, merchant, and amount separated by a dash. Example: `27 April 2026 - Lunch Warteg - 20000`)*.

---

## 🚑 Troubleshooting

**Error: `Service error: Drive` or `DriveDetails` when syncing WhatsApp.**
* **The Fix:** Ensure you pasted only the Folder ID, not the entire URL, in the Settings sidebar. If it's still breaking, open **Extensions > Apps Script**, click the **+** next to **Services** on the left menu, select **Drive API**, and click Add.

**Error: `SyntaxError: Unexpected end of input`**
* **The Fix:** This means a piece of the code was accidentally deleted. Make sure you haven't altered the `Code.gs` file unless you know what you are doing!

**Transactions aren't showing up!**
* **The Fix:** Check your **Start Date** in the settings. The script ignores anything older than that date. Also, check your **Gmail Search Query** to ensure it exactly matches how your bank emails are labeled or received.

---

## ✉️ Support & Feedback
Built to make personal finance a little less painful. 

If you run into any bugs, have feature requests, or just want to say hi, feel free to reach out to me at [mail@rayestu.com](mailto:mail@rayestu.com).