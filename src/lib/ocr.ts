export type OcrResult = {
  rawText: string;
  storeName?: string;
  receiptDate?: string;
  amount?: number;
  taxAmount?: number;
  documentNumber?: string;
  category?: string;
  confidence: number;
};

export async function extractReceiptData(imageBuffer: Buffer): Promise<OcrResult> {
  const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (!base64) throw new Error("GOOGLE_SERVICE_ACCOUNT_BASE64 not set");

  const credentials = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));

  // Get access token via JWT
  const accessToken = await getAccessToken(credentials);

  // Call Vision API via REST
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBuffer.toString("base64") },
            features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Vision API error: ${err}`);
  }

  const data = await response.json();
  const annotation = data.responses?.[0]?.fullTextAnnotation;
  const rawText: string = annotation?.text || "";
  const confidence: number = annotation?.pages?.[0]?.confidence ?? 0.8;

  return {
    rawText,
    confidence: Math.round(confidence * 100),
    storeName: extractStoreName(rawText),
    receiptDate: extractDate(rawText),
    amount: extractAmount(rawText),
    taxAmount: extractTaxAmount(rawText),
    documentNumber: extractDocumentNumber(rawText),
    category: guessCategory(rawText),
  };
}

async function getAccessToken(credentials: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/cloud-vision",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Sign using Web Crypto API (available in Edge/Node)
  const pemKey = credentials.private_key;
  const keyData = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = Buffer.from(keyData, "base64");

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    Buffer.from(signingInput)
  );

  const jwt = `${signingInput}.${Buffer.from(signature).toString("base64url")}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

function extractStoreName(text: string): string | undefined {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 6)) {
    if (/^\d+$/.test(line)) continue;
    if (/^(วันที่|date|tax|เลขที่|receipt|tel|โทร|ref|from|ไป|จาก)/i.test(line)) continue;
    if (line.length > 2 && line.length < 60) return line;
  }
  return undefined;
}

function extractDate(text: string): string | undefined {
  // Thai bank slip: "11 มิ.ย. 2569 - 19:29" or "11/06/2569"
  const thaiMonths: Record<string, string> = {
    "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
    "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
    "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12",
  };

  // Pattern: "11 มิ.ย. 2569"
  const thaiMatch = text.match(
    /(\d{1,2})\s+(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s+(\d{4})/
  );
  if (thaiMatch) {
    let year = parseInt(thaiMatch[3]);
    if (year > 2400) year -= 543;
    return `${year}-${thaiMonths[thaiMatch[2]]}-${thaiMatch[1].padStart(2, "0")}`;
  }

  // Pattern: dd/mm/yyyy
  const slashMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (slashMatch) {
    let year = parseInt(slashMatch[3]);
    if (year > 2400) year -= 543;
    if (year < 100) year += 2000;
    return `${year}-${slashMatch[2].padStart(2, "0")}-${slashMatch[1].padStart(2, "0")}`;
  }

  return undefined;
}

function extractAmount(text: string): number | undefined {
  // Bank slip: "จำนวนเงิน 188.00" or "100.00"
  const patterns = [
    /(?:จำนวนเงิน|amount|ยอดรวม|รวม|total)[^\d]*(\d[\d,]+\.?\d{0,2})/i,
    /(\d[\d,]+\.\d{2})\s*(?:บาท|thb|฿)/i,
    /(?:บาท|thb|฿)\s*(\d[\d,]+\.?\d{0,2})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(num) && num > 0) return num;
    }
  }

  const allAmounts = [...text.matchAll(/(\d[\d,]*\.\d{2})/g)]
    .map((m) => parseFloat(m[1].replace(/,/g, "")))
    .filter((n) => n > 0 && n < 10_000_000);

  return allAmounts.length > 0 ? Math.max(...allAmounts) : undefined;
}

function extractTaxAmount(text: string): number | undefined {
  const match = text.match(/(?:ภาษี|vat|tax)[^\d]*(\d[\d,]+\.?\d{0,2})/i);
  if (match) {
    const num = parseFloat(match[1].replace(/,/g, ""));
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

function extractDocumentNumber(text: string): string | undefined {
  // Bank slip reference numbers
  const patterns = [
    /(?:รหัสอ้างอิง|ref|อ้างอิง|เลขที่|no\.|receipt#)[:\s#]*([A-Z0-9]{6,})/i,
    /(?:transaction|trans)[:\s#]*([A-Z0-9]{6,})/i,
    /([A-Z]{2,}[-\/]?\d{6,})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1].length >= 6) return match[1];
  }
  return undefined;
}

function guessCategory(text: string): string {
  const lower = text.toLowerCase();
  const categories: [string[], string][] = [
    [["restaurant", "ร้านอาหาร", "food", "อาหาร", "coffee", "กาแฟ", "food patio", "ร้าน"], "อาหารและเครื่องดื่ม"],
    [["hotel", "โรงแรม", "resort", "ที่พัก"], "ที่พัก"],
    [["taxi", "grab", "bolt", "แกร็บ", "น้ำมัน", "fuel", "parking", "ปั๊ม"], "เดินทาง"],
    [["สำนักงาน", "office", "stationery", "เครื่องเขียน", "print"], "สำนักงาน"],
    [["โทรศัพท์", "internet", "true", "ais", "dtac"], "สื่อสาร"],
    [["hospital", "โรงพยาบาล", "clinic", "คลินิก", "pharmacy", "ยา"], "สุขภาพ"],
    [["lazada", "shopee", "amazon", "shop", "mall"], "ช้อปปิ้ง"],
    [["โอนเงิน", "transfer", "scb", "kbank", "ktb", "bbl", "ttb", "gsb", "baac"], "โอนเงิน/ชำระเงิน"],
  ];

  for (const [keywords, category] of categories) {
    if (keywords.some((k) => lower.includes(k))) return category;
  }
  return "อื่นๆ";
}
