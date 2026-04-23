-- Migration: Add leads table for KUR referral lead capture
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT,

  -- Business info
  nama_usaha TEXT,
  jenis_usaha TEXT,
  kota_usaha TEXT,
  omzet_per_bulan TEXT,
  jumlah_karyawan TEXT,
  punya_nib BOOLEAN,

  -- Contact
  nama_owner TEXT,
  kontak_email TEXT,
  kontak_telepon TEXT,

  -- Lead metadata
  lead_source TEXT DEFAULT 'kur_wizard_lendana',
  status TEXT DEFAULT 'new', -- new | contacted | qualified | converted | lost
  partner_assigned TEXT,     -- 'lendana' | 'bri' | etc
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_order ON leads(order_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "leads_select_admin" ON leads FOR SELECT USING (TRUE);
CREATE POLICY "leads_update_admin" ON leads FOR UPDATE USING (TRUE);
