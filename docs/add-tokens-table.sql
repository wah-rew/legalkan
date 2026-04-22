-- Migration: Add payment_tokens table for persistent token storage
-- Run this SQL in your Supabase SQL editor
-- Fixes: confirmation tokens lost on serverless function restart

CREATE TABLE IF NOT EXISTS payment_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE,
  contract_type TEXT,
  contract_data JSONB,
  status TEXT DEFAULT 'pending', -- pending | confirmed | expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours'
);

CREATE INDEX IF NOT EXISTS idx_payment_tokens_order_id ON payment_tokens(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_tokens_token ON payment_tokens(token);

-- Allow server inserts
CREATE POLICY "payment_tokens_insert" ON payment_tokens FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "payment_tokens_select" ON payment_tokens FOR SELECT USING (TRUE);
CREATE POLICY "payment_tokens_update" ON payment_tokens FOR UPDATE USING (TRUE);

ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;
