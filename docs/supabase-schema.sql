-- ============================================================
-- Kontrak.in — Supabase Database Schema
-- ============================================================
-- Run this in the Supabase SQL editor to set up your database.

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL, -- e.g. KI-202604-1337
  contract_type TEXT NOT NULL,
  contract_title TEXT,
  amount INTEGER NOT NULL, -- in IDR
  status TEXT DEFAULT 'pending', -- pending | paid | delivered | failed

  -- Customer info
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  -- Contract parties
  pihak_pertama TEXT,
  pihak_kedua TEXT,

  -- Delivery
  wa_sent_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,

  -- Metadata
  contract_data JSONB, -- full form data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(order_id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  contact TEXT, -- email or WA
  intent TEXT,
  order_id TEXT,
  message TEXT,
  status TEXT DEFAULT 'open', -- open | in_progress | resolved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Auto-update updated_at on orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
