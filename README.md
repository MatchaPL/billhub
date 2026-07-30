# BillHUB — AI Expense Auditor on LINE

Turn a photo of a receipt into structured, audited accounting data — entirely inside LINE.
Snap a receipt in the chat, and BillHUB reads it, categorizes it, and flags anything suspicious.

Built as an end-to-end **LINE chatbot + LIFF** product on **Next.js 16 / React 19**, deployed on Vercel.

## Features

- **Receipt → structured data** — send a receipt photo in LINE; an OCR pipeline on **Google Cloud Vision** with a custom **Thai receipt parser** extracts store, amount, VAT, and date (Buddhist-era aware) and auto-categorizes the expense.
- **Expense-audit engine** — duplicate detection plus a **0–100 risk score** with human-readable flag reasons, so anomalies surface automatically instead of being buried in a spreadsheet.
- **Secure webhook** — inbound LINE events are verified with **HMAC-SHA256** signature validation; Google APIs are called with signed service tokens (**JWT RS256**) minted at the edge via the Web Crypto API.
- **LIFF registration flow** — in-LINE onboarding that links a LINE user to their account.
- **3D animated landing page** — marketing site built with **Three.js / React Three Fiber**, backed by **Supabase Postgres** with row-level security.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Messaging | LINE Messaging API, LIFF |
| OCR / Vision | Google Cloud Vision, custom Thai receipt parser |
| Data | Supabase (PostgreSQL) with RLS |
| 3D / UI | Three.js, React Three Fiber, Tailwind CSS |
| Deploy | Vercel (serverless API routes) |

## Project Structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ webhook/route.ts   # LINE webhook — HMAC verify + OCR + audit
│  │  └─ register/route.ts  # LIFF registration endpoint
│  ├─ liff/register/        # in-LINE onboarding page
│  └─ page.tsx              # 3D landing page
├─ components/              # landing sections + Scene3D (R3F)
└─ lib/
   ├─ ocr.ts                # Google Vision + Thai parser + JWT RS256 signing
   └─ supabase.ts           # Supabase client
```

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local` with (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
LINE_CHANNEL_SECRET=...
LINE_CHANNEL_ACCESS_TOKEN=...
GOOGLE_SERVICE_ACCOUNT_BASE64=...   # base64 of the GCP service-account JSON
```

Database schema lives in [`supabase-schema.sql`](supabase-schema.sql).

---
*Founder & full-stack developer · 2026*
