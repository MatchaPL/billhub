-- BillHUB Database Schema
-- Run this in Supabase SQL Editor (supabase.com > SQL Editor > New Query)

-- Users table (LINE users)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  line_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  picture_url TEXT,
  registered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tax_id TEXT,
  address TEXT,
  email TEXT,
  google_sheets_id TEXT,
  google_drive_folder_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Receipts table
CREATE TABLE receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  image_url TEXT,
  store_name TEXT,
  receipt_date DATE,
  category TEXT,
  amount DECIMAL(12,2),
  tax_amount DECIMAL(12,2),
  document_number TEXT,
  ocr_raw_text TEXT,
  ocr_confidence DECIMAL(5,2),
  is_duplicate BOOLEAN DEFAULT false,
  duplicate_of UUID REFERENCES receipts(id),
  risk_score INTEGER,
  risk_flags TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'exported')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_users_line_id ON users(line_user_id);
CREATE INDEX idx_receipts_user ON receipts(user_id);
CREATE INDEX idx_receipts_business ON receipts(business_id);
CREATE INDEX idx_receipts_status ON receipts(status);
CREATE INDEX idx_receipts_duplicate ON receipts(is_duplicate);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Policies (allow service role full access)
CREATE POLICY "Service role full access" ON users FOR ALL USING (true);
CREATE POLICY "Service role full access" ON businesses FOR ALL USING (true);
CREATE POLICY "Service role full access" ON receipts FOR ALL USING (true);
