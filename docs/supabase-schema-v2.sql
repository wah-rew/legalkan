-- ============================================================
-- LegalKan — Supabase Database Schema v2
-- ============================================================
-- Future-proof schema for:
--   Phase 1: Legal document generation platform
--   Phase 2: UMKM financial statement standardization
--   Phase 3: Credit scoring B2B data product
--
-- MIGRATION SAFETY: All CREATE TABLE uses IF NOT EXISTS.
-- All ALTER TABLE uses ADD COLUMN IF NOT EXISTS.
-- Safe to run on existing production databases.
--
-- Run order: top to bottom (respects FK dependencies)
-- ============================================================


-- ============================================================
-- PHASE 1 — CORE SCHEMA
-- ============================================================

-- ------------------------------------------------------------
-- Users table (NEW — replaces anonymous customer fields)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,    -- denormalized counter
  total_spent INTEGER DEFAULT 0      -- in IDR
);

-- ------------------------------------------------------------
-- Orders table (EXISTING — extended with new columns)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,     -- e.g. KI-202604-1337
  contract_type TEXT NOT NULL,
  contract_title TEXT,
  amount INTEGER NOT NULL,           -- in IDR
  status TEXT DEFAULT 'pending',     -- pending | paid | delivered | failed

  -- Customer info (legacy — prefer user_id for new records)
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  -- Contract parties
  pihak_pertama TEXT,
  pihak_kedua TEXT,

  -- Delivery
  wa_sent_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,

  -- Full form data
  contract_data JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- New columns added to orders (Phase 1 extension)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS business_profile_id UUID, -- FK added after business_profiles created
  ADD COLUMN IF NOT EXISTS bundle_type TEXT DEFAULT 'single',
  -- single | kur_bundle | financial_report
  ADD COLUMN IF NOT EXISTS documents_generated JSONB,
  -- e.g. ["jual-beli", "hutang-piutang", "freelancer"]
  ADD COLUMN IF NOT EXISTS consent_data_usage BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ;

-- ------------------------------------------------------------
-- Feedback table (EXISTING — unchanged)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(order_id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Contacts table (EXISTING — unchanged)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  contact TEXT,                      -- email or WA number
  intent TEXT,
  order_id TEXT,
  message TEXT,
  status TEXT DEFAULT 'open',        -- open | in_progress | resolved
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- PHASE 2 — UMKM BUSINESS PROFILES & FINANCIAL STATEMENTS
-- ============================================================

-- ------------------------------------------------------------
-- Business profiles (collected during KUR wizard)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),

  -- Identity
  business_name TEXT,
  owner_name TEXT,
  owner_nik TEXT,                    -- AES-256 ENCRYPTED — never store plaintext
  business_type TEXT,
  -- PT | CV | UD | Perorangan | Koperasi
  business_sector TEXT,
  -- perdagangan | jasa | pertanian | manufaktur | kuliner |
  -- konstruksi | transportasi | kesehatan | pendidikan | lainnya
  business_address TEXT,
  city TEXT,
  province TEXT,

  -- Scale indicators
  years_operating NUMERIC,
  employee_count INTEGER,
  monthly_revenue_range TEXT,
  -- <5jt | 5-20jt | 20-50jt | >50jt
  has_nib BOOLEAN,
  has_collateral BOOLEAN,

  -- Business structure
  has_employees BOOLEAN,
  has_partners BOOLEAN,
  partner_count INTEGER,
  has_external_debt BOOLEAN,
  previous_kur BOOLEAN,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  data_quality_score INTEGER         -- 0-100 completeness score (computed on write)
);

-- Now we can add the FK from orders to business_profiles
ALTER TABLE orders
  ADD CONSTRAINT IF NOT EXISTS fk_orders_business_profile
  FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id);

-- ------------------------------------------------------------
-- Financial statements (monthly/quarterly inputs + AI output)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS financial_statements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id),
  period_month INTEGER CHECK (period_month BETWEEN 1 AND 12),
  period_year INTEGER CHECK (period_year >= 2020),
  statement_type TEXT DEFAULT 'monthly',
  -- monthly | quarterly | annual

  -- Income Statement (raw user inputs, in IDR)
  gross_revenue BIGINT,
  cost_of_goods BIGINT,
  gross_profit BIGINT GENERATED ALWAYS AS (gross_revenue - cost_of_goods) STORED,
  operating_expenses BIGINT,
  net_profit BIGINT GENERATED ALWAYS AS (
    gross_revenue - cost_of_goods - operating_expenses
  ) STORED,

  -- Balance Sheet (simplified for UMKM)
  cash_and_bank BIGINT,
  inventory_value BIGINT,
  receivables BIGINT,
  fixed_assets BIGINT,
  total_assets BIGINT,               -- user-provided or sum of above
  total_debt BIGINT,
  owner_equity BIGINT,               -- ideally: total_assets - total_debt

  -- AI Standardization output
  standardized_pdf_url TEXT,         -- Supabase storage path
  standardization_notes TEXT,        -- AI commentary on data quality
  ai_adjusted_revenue BIGINT,        -- AI estimate if underreporting detected
  consistency_flags JSONB,           -- {"equity_mismatch": true, "revenue_spike": false}

  -- Verification chain
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by TEXT,                  -- 'ai' | 'manual' | 'accountant'
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate period submissions
  UNIQUE (business_profile_id, period_month, period_year, statement_type)
);


-- ============================================================
-- PHASE 3 — CREDIT SCORING & B2B DATA PRODUCT
-- ============================================================

-- ------------------------------------------------------------
-- B2B partner registry (needed before credit_profiles for FK)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS b2b_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_type TEXT CHECK (partner_type IN ('bank', 'BPR', 'P2P', 'multifinance', 'koperasi')),
  contact_email TEXT,
  contact_name TEXT,

  -- Authentication
  api_key_hash TEXT NOT NULL,        -- bcrypt hash of actual API key
  api_key_prefix TEXT,               -- first 8 chars for identification

  -- Pricing model
  pricing_tier TEXT DEFAULT 'per_query',
  -- per_query | monthly_flat | revenue_share
  price_per_query INTEGER,           -- in IDR, per-partner override
  monthly_flat_fee INTEGER,          -- for monthly_flat tier
  revenue_share_pct NUMERIC(5,2),   -- e.g. 15.00 = 15%

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_sandbox BOOLEAN DEFAULT FALSE,  -- testing partners
  onboarded_at TIMESTAMPTZ DEFAULT NOW(),
  last_query_at TIMESTAMPTZ,
  total_queries INTEGER DEFAULT 0,   -- denormalized

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Credit profiles (aggregated scoring artifact)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credit_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id),

  -- Component scores (0-100 each)
  document_completeness_score INTEGER CHECK (document_completeness_score BETWEEN 0 AND 100),
  financial_health_score INTEGER CHECK (financial_health_score BETWEEN 0 AND 100),
  business_stability_score INTEGER CHECK (business_stability_score BETWEEN 0 AND 100),
  overall_credit_score INTEGER CHECK (overall_credit_score BETWEEN 0 AND 100),

  -- Score composition weights (stored for auditability)
  score_weights JSONB DEFAULT '{"document": 0.25, "financial": 0.50, "stability": 0.25}',

  -- Risk classification
  risk_category TEXT CHECK (risk_category IN ('LOW', 'MEDIUM', 'HIGH')),
  recommended_loan_range_min BIGINT, -- in IDR
  recommended_loan_range_max BIGINT, -- in IDR

  -- Score breakdown (for explainability / OJK compliance)
  score_factors JSONB,
  -- {
  --   "positive": ["has_nib", "3_months_consistent_revenue", "has_collateral"],
  --   "negative": ["no_bank_account", "high_debt_ratio"],
  --   "neutral": ["first_time_kur"]
  -- }

  -- B2B sharing controls (consent must be checked at app layer)
  is_shareable BOOLEAN DEFAULT FALSE,
  shared_with JSONB DEFAULT '[]',    -- array of partner_ids that accessed
  last_accessed_by TEXT,             -- partner_id (denormalized for quick lookup)
  last_accessed_at TIMESTAMPTZ,

  -- Lifecycle
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,           -- typically NOW() + 6 months
  invalidated_at TIMESTAMPTZ,        -- set when new data arrives
  invalidation_reason TEXT
  -- 'new_financial_data' | 'user_request' | 'expired'
);

-- ------------------------------------------------------------
-- B2B API access log (immutable billing + audit trail)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS b2b_api_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES b2b_partners(id),
  credit_profile_id UUID REFERENCES credit_profiles(id),
  access_type TEXT CHECK (access_type IN ('score_only', 'full_profile', 'documents')),
  -- score_only:    overall_credit_score + risk_category
  -- full_profile:  all scores + score_factors + loan range
  -- documents:     includes legal doc + financial statement download links
  price_charged INTEGER,             -- in IDR (snapshot at time of access)
  request_ip TEXT,
  response_status TEXT DEFAULT 'success',
  -- success | error | denied (consent not granted)
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- CONSENT & PRIVACY INFRASTRUCTURE
-- ============================================================

-- ------------------------------------------------------------
-- User consents (source of truth for all data product features)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  consent_type TEXT NOT NULL,
  -- 'data_usage'     → anonymized data used to improve AI
  -- 'credit_scoring' → allow credit profile generation
  -- 'b2b_sharing'    → allow B2B partners to query credit profile
  -- 'marketing'      → receive promotional WA/email communications
  is_granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  consent_version TEXT NOT NULL,     -- must match published T&C version e.g. "v1.2"
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply to orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Apply to business_profiles
DROP TRIGGER IF EXISTS update_business_profiles_updated_at ON business_profiles;
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Auto-update user stats on order completion
CREATE OR REPLACE FUNCTION update_user_stats_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- When order status changes to 'paid'
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    IF NEW.user_id IS NOT NULL THEN
      UPDATE users
      SET
        total_orders = total_orders + 1,
        total_spent = total_spent + NEW.amount,
        last_active_at = NOW()
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_user_stats_trigger ON orders;
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_user_stats_on_order();

-- Auto-set valid_until on credit_profiles (6 months from generation)
CREATE OR REPLACE FUNCTION set_credit_profile_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.valid_until IS NULL THEN
    NEW.valid_until = NEW.generated_at + INTERVAL '6 months';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS set_credit_profile_expiry_trigger ON credit_profiles;
CREATE TRIGGER set_credit_profile_expiry_trigger
  BEFORE INSERT ON credit_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE set_credit_profile_expiry();


-- ============================================================
-- INDEXES
-- ============================================================

-- users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- orders
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_business_profile_id ON orders(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_bundle_type ON orders(bundle_type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- business_profiles
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_city ON business_profiles(city);
CREATE INDEX IF NOT EXISTS idx_business_profiles_province ON business_profiles(province);
CREATE INDEX IF NOT EXISTS idx_business_profiles_sector ON business_profiles(business_sector);
CREATE INDEX IF NOT EXISTS idx_business_profiles_quality ON business_profiles(data_quality_score DESC);

-- financial_statements
CREATE INDEX IF NOT EXISTS idx_financial_statements_profile ON financial_statements(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_financial_statements_period ON financial_statements(period_year DESC, period_month DESC);
CREATE INDEX IF NOT EXISTS idx_financial_statements_verified ON financial_statements(is_verified);

-- credit_profiles
CREATE INDEX IF NOT EXISTS idx_credit_profiles_profile ON credit_profiles(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_credit_profiles_score ON credit_profiles(overall_credit_score DESC);
CREATE INDEX IF NOT EXISTS idx_credit_profiles_risk ON credit_profiles(risk_category);
CREATE INDEX IF NOT EXISTS idx_credit_profiles_shareable ON credit_profiles(is_shareable)
  WHERE is_shareable = TRUE;
CREATE INDEX IF NOT EXISTS idx_credit_profiles_valid ON credit_profiles(valid_until)
  WHERE invalidated_at IS NULL;

-- b2b_api_access
CREATE INDEX IF NOT EXISTS idx_b2b_access_partner ON b2b_api_access(partner_id);
CREATE INDEX IF NOT EXISTS idx_b2b_access_profile ON b2b_api_access(credit_profile_id);
CREATE INDEX IF NOT EXISTS idx_b2b_access_at ON b2b_api_access(accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_b2b_access_billing ON b2b_api_access(partner_id, accessed_at DESC);

-- user_consents
CREATE INDEX IF NOT EXISTS idx_consents_user ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_type ON user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_consents_user_type ON user_consents(user_id, consent_type, created_at DESC);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_api_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_partners ENABLE ROW LEVEL SECURITY;

-- users: own row only
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_own_read') THEN
    CREATE POLICY "users_own_read" ON users FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_own_update') THEN
    CREATE POLICY "users_own_update" ON users FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- orders: own orders (by user_id or matching email)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'orders_own_read') THEN
    CREATE POLICY "orders_own_read" ON orders
      FOR SELECT USING (
        auth.uid() = user_id OR
        customer_email = (SELECT email FROM users WHERE id = auth.uid())
      );
  END IF;
END $$;

-- business_profiles: user owns their profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_profiles' AND policyname = 'business_profiles_own') THEN
    CREATE POLICY "business_profiles_own" ON business_profiles
      FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- financial_statements: accessible through business_profile ownership
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_statements' AND policyname = 'financial_statements_own') THEN
    CREATE POLICY "financial_statements_own" ON financial_statements
      FOR ALL USING (
        business_profile_id IN (
          SELECT id FROM business_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- credit_profiles: read-only for users (write via service role only)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_profiles' AND policyname = 'credit_profiles_own_read') THEN
    CREATE POLICY "credit_profiles_own_read" ON credit_profiles
      FOR SELECT USING (
        business_profile_id IN (
          SELECT id FROM business_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- user_consents: full control over own consents
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_consents' AND policyname = 'consents_own') THEN
    CREATE POLICY "consents_own" ON user_consents
      FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- feedback: read own, insert open
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'feedback_own_read') THEN
    CREATE POLICY "feedback_own_read" ON feedback
      FOR SELECT USING (
        order_id IN (
          SELECT order_id FROM orders WHERE user_id = auth.uid()
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'feedback_insert') THEN
    CREATE POLICY "feedback_insert" ON feedback
      FOR INSERT WITH CHECK (TRUE);
  END IF;
END $$;

-- b2b tables: service role only (backend API, no user-facing access)
-- No user-facing policies needed — accessed exclusively via service key


-- ============================================================
-- BACKFILL: Link existing orders to users
-- ============================================================
-- Run this AFTER deploying the schema to link historical data.
-- Uncomment and run manually after confirming users table is populated.

-- -- Step 1: Create user records from existing order data
-- INSERT INTO users (email, phone, name, created_at)
-- SELECT DISTINCT
--   customer_email,
--   customer_phone,
--   customer_name,
--   MIN(created_at)
-- FROM orders
-- WHERE customer_email IS NOT NULL
-- GROUP BY customer_email, customer_phone, customer_name
-- ON CONFLICT (email) DO NOTHING;
--
-- -- Step 2: Link orders to users
-- UPDATE orders o
-- SET user_id = u.id
-- FROM users u
-- WHERE o.customer_email = u.email
--   AND o.user_id IS NULL;


-- ============================================================
-- SCHEMA VERSION
-- ============================================================
-- Version: 2.0
-- Date: April 2026
-- Phases: 1 (core + extended), 2 (business profiles + financials),
--         3 (credit scoring + B2B)
-- ============================================================
