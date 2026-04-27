// ==========================================
// 1. CONFIGURATION
// ==========================================
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY'; 
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Ledger';

// Gmail Search Query (Default to April 2026 onwards)
const GMAIL_QUERY = 'label:transaction-notices after:2026/03/31';

// Drive Folder ID for WhatsApp ZIP exports
const WA_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';

// ==========================================
// 2. GMAIL ENGINE (BCA/Mandiri Alerts)
// ==========================================
function runGmailProcessor() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const processedIds = getExistingIds(sheet);
  const threads = GmailApp.search(GMAIL_QUERY, 0, 50);

  console.log(`🔍 Gmail: Found ${threads.length} threads.`);

  threads.forEach(thread => {
    thread.getMessages().forEach(msg => {
      const messageId = msg.getId();
      if (processedIds.has(messageId)) return;

      // Fallback to HTML if plain body is empty (common in BCA CC alerts)
      let body = msg.getPlainBody();
      if (!body || body.trim().length < 10) {
        console.log("⚠️ Plain body empty. Extracting from HTML for: " + msg.getSubject());
        body = cleanHtml(msg.getBody());
      }

      const data = parseWithClaude(body);
      if (validateData(data)) {
        // Pass "Gmail" so the helper uses the AI-detected Source (BCA or Mandiri)
        logToSheet(sheet, data, messageId, "Gmail");
        processedIds.add(messageId);
        Utilities.sleep(1500); 
      }
    });
  });
}

// ==========================================
// 3. WHATSAPP ENGINE (Mandiri ZIP)
// ==========================================
function runWhatsAppZipProcessor() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const processedIds = getExistingIds(sheet);
  
  const folder = DriveApp.getFolderById(WA_FOLDER_ID);
  const zips = folder.getFilesByType(MimeType.ZIP);

  if (!zips.hasNext()) {
    console.log("❌ No ZIP files found in the folder.");
    return;
  }

  const zipFile = zips.next();
  const unzipped = Utilities.unzip(zipFile.getBlob());
  let chatText = "";

  for (const file of unzipped) {
    if (file.getContentType() === MimeType.PLAIN_TEXT) {
      chatText = file.getDataAsString();
      break;
    }
  }

  if (!chatText) return;

  // Filter for transactions starting from April 2026
  const lines = chatText.split('\n').filter(line => {
    const isTransaction = line.includes("Terima kasih untuk transaksi") && 
                          !line.includes("pembatalan") && 
                          !line.includes("gagal");
    if (!isTransaction) return false;

    const dateMatch = line.match(/\[(\d{2})\/(\d{2})\/(\d{2})/);
    if (dateMatch) {
      const month = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);
      return (year === 26 && month >= 4) || (year > 26);
    }
    return false;
  });

  console.log(`🔍 WhatsApp: Processing ${lines.length} lines from April onwards.`);

  lines.forEach(line => {
    const fingerprint = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, line));
    if (processedIds.has(fingerprint)) return;

    const data = parseWithClaude(line);
    if (validateData(data)) {
      // Label source as Mandiri -WA
      logToSheet(sheet, data, fingerprint, "Mandiri -WA");
      processedIds.add(fingerprint);
      Utilities.sleep(1500);
    }
  });

  zipFile.setName("PROCESSED_" + zipFile.getName());
}

// ==========================================
// 4. CORE AI PARSER (Claude 4.5)
// ==========================================
function parseWithClaude(text) {
  const url = 'https://api.anthropic.com/v1/messages';
  const prompt = `Extract into JSON: "date" (YYYY-MM-DD), "amount" (Integer), "merchant" (Value after 'di' or 'Merchant / ATM'), "source" (BCA or Mandiri). Text: ${text}`;

  const options = {
    method: "post",
    headers: { "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    payload: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      system: "Output ONLY raw JSON."
    }),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    if (result.content) {
      const match = result.content[0].text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    }
  } catch (e) { console.error(e); }
  return null;
}

// ==========================================
// 5. HELPERS
// ==========================================
function getExistingIds(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return new Set();
  return new Set(sheet.getRange(2, 6, lastRow - 1, 1).getValues().map(r => r[0].toString()));
}

function validateData(data) {
  if (!data) return false;
  return (data.Date || data.date) && (data.Amount || data.amount);
}

function logToSheet(sheet, data, id, typeLabel) {
  const date = data.Date || data.date;
  const amount = data.Amount || data.amount;
  const merchant = data.Merchant || data.merchant;
  
  // Logic: Use "Mandiri -WA" for WA, otherwise use AI-detected source
  const source = typeLabel === "Mandiri -WA" ? typeLabel : (data.Source || data.source || typeLabel);

  sheet.appendRow([date, amount, merchant, source, "Logged", id]);
  console.log(`✅ Logged: ${merchant} [${source}]`);
}

function cleanHtml(html) {
  return html.replace(/<style([\s\S]*?)<\/style>/gi, '')
             .replace(/<script([\s\S]*?)<\/script>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/&nbsp;/g, ' ')
             .replace(/\s+/g, ' ');
}
