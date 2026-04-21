# LegalKan — Database Schema v2
## Future-Proof Design for Legal Docs → Financial Standardization → Credit Scoring

**Version:** 2.0  
**Date:** April 2026  
**Status:** Design (ready for implementation)  
**Author:** AI Architecture Review

---

## Table of Contents

1. [Overview & Design Philosophy](#1-overview--design-philosophy)
2. [Phase Breakdown](#2-phase-breakdown)
3. [Core Schema — Phase 1 (Extended)](#3-core-schema--phase-1-extended)
4. [Business Profile Schema — Phase 2](#4-business-profile-schema--phase-2)
5. [Credit Scoring Schema — Phase 3](#5-credit-scoring-schema--phase-3)
6. [Consent & Privacy Infrastructure](#6-consent--privacy-infrastructure)
7. [Indexes & Performance](#7-indexes--performance)
8. [Row Level Security (RLS) Policies](#8-row-level-security-rls-policies)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Revenue Projections](#10-revenue-projections)
11. [Data Moat Thesis](#11-data-moat-thesis)
12. [Privacy & Compliance](#12-privacy--compliance)
13. [Migration Notes](#13-migration-notes)

---

## 1. Overview & Design Philosophy

LegalKan is evolving from a single-product transactional platform into a **financial data infrastructure layer for Indonesian UMKMs**. The database schema must support this without requiring painful migrations mid-flight.

### Core Design Principles

| Principle | Rationale |
|---|---|
| **Additive-first** | Add columns/tables rather than modify existing ones — zero downtime migrations |
| **JSONB for flexibility** | Where structure is still evolving (score factors, doc lists), use JSONB |
| **Consent-first** | Every data product feature gates behind an explicit, versioned user consent |
| **Encryption at rest for PII** | NIK, sensitive financials encrypted before storage |
| **Separation of concerns** | Raw user inputs vs. AI-standardized outputs are separate columns |
| **B2B-ready from day one** | Audit logs, partner registry, and access control built before Phase 3 arrives |

### Entity Relationship Overview

```
users
  └── orders (Phase 1)
  └── user_consents
  └── business_profiles (Phase 2)
        ├── financial_statements
        └── credit_profiles (Phase 3)
              └── b2b_api_access
                    └── b2b_partners
```

---

## 2. Phase Breakdown

### Phase 1 — Legal Document Platform (Now)
- Users pay per document generation (Rp 29–79K)
- Documents: perjanjian jual-beli, hutang-piutang, freelancer, sewa, dll
- **New:** KUR bundle offering (5 docs in one wizard)
- **New:** Collect business profile during KUR wizard flow
- **New:** Consent checkbox for data usage (opt-in)

### Phase 2 — Financial Statement Module (+3 months)
- UMKM inputs simple monthly financials (revenue, COGS, expenses, assets)
- AI standardizes into bankable format (laporan keuangan standar)
- Output: PDF downloadable + stored in Supabase storage
- Pricing: Rp 99–199K per report
- **Data collection builds the moat**

### Phase 3 — Credit Scoring B2B (+6–12 months)
- Aggregate legal docs + financial statements → credit profile
- Score exported via B2B API to: BPR, P2P lenders, bank KUR desks
- Pricing: Rp 50–200K per credit query
- Compliance: OJK POJK 77/2016, UU PDP 27/2022

---

## 3. Core Schema — Phase 1 (Extended)

### 3.1 Users Table (NEW)

Currently the platform has no persistent user identity — everything lives in the `orders` table as raw text. This table creates a first-party user identity layer.

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,    -- denormalized for quick dashboards
  total_spent INTEGER DEFAULT 0      -- in IDR
);
```

**Notes:**
- `phone` is the primary identifier for WA-first flows — normalize to E.164 format (`+628xxx`)
- `total_orders` and `total_spent` are denormalized counters — update via trigger on order completion
- Link existing orders to users via a backfill job matching `customer_email` / `customer_phone`

### 3.2 Orders Table (Extended)

Extends the existing schema with Phase 2/3 linkage fields.

```sql
-- New columns added to existing orders table (run as ALTER TABLE in migration)
ALTER TABLE orders
  ADD COLUMN user_id UUID REFERENCES users(id),
  ADD COLUMN business_profile_id UUID REFERENCES business_profiles(id),
  ADD COLUMN bundle_type TEXT DEFAULT 'single',
    -- single | kur_bundle | financial_report
  ADD COLUMN documents_generated JSONB,
    -- e.g. ["jual-beli", "hutang-piutang", "freelancer"]
  ADD COLUMN consent_data_usage BOOLEAN DEFAULT FALSE,
  ADD COLUMN consent_timestamp TIMESTAMPTZ;
```

**`bundle_type` values:**
- `single` — one document, standard pricing
- `kur_bundle` — 5-document KUR package (bundled price)
- `financial_report` — Phase 2 financial statement product

**`documents_generated` example:**
```json
["perjanjian_jual_beli", "surat_hutang", "perjanjian_sewa"]
```

### 3.3 Feedback Table (unchanged)

```sql
-- Existing — no changes needed
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(order_id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4 Contacts Table (unchanged)

```sql
-- Existing — no changes needed
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  contact TEXT,
  intent TEXT,
  order_id TEXT,
  message TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Business Profile Schema — Phase 2

### 4.1 Business Profiles

The central entity for Phase 2. Collected during the KUR wizard flow — user fills this in once and it persists across multiple orders and financial statements.

```sql
CREATE TABLE business_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),

  -- Identity
  business_name TEXT,
  owner_name TEXT,
  owner_nik TEXT,             -- ENCRYPTED AT REST (see compliance section)
  business_type TEXT,         -- PT | CV | UD | Perorangan | Koperasi
  business_sector TEXT,       -- perdagangan | jasa | pertanian | manufaktur | dll
  business_address TEXT,
  city TEXT,
  province TEXT,

  -- Scale indicators
  years_operating NUMERIC,
  employee_count INTEGER,
  monthly_revenue_range TEXT, -- <5jt | 5-20jt | 20-50jt | >50jt
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
  data_quality_score INTEGER  -- 0-100 completeness score (calculated on write)
);
```

**`data_quality_score` calculation logic:**
Score 10 points per completed required field. Fields: business_name, owner_name, owner_nik, business_type, business_sector, city, province, years_operating, has_nib, previous_kur = 100 points max.

**`business_sector` enum values:**
`perdagangan`, `jasa`, `pertanian`, `manufaktur`, `kuliner`, `konstruksi`, `transportasi`, `kesehatan`, `pendidikan`, `lainnya`

### 4.2 Financial Statements

Monthly/quarterly financial inputs from the UMKM owner. AI processes these into standardized laporan keuangan.

```sql
CREATE TABLE financial_statements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id),
  period_month INTEGER CHECK (period_month BETWEEN 1 AND 12),
  period_year INTEGER CHECK (period_year >= 2020),
  statement_type TEXT DEFAULT 'monthly', -- monthly | quarterly | annual

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
  total_assets BIGINT,       -- user-provided (or sum of above if null)
  total_debt BIGINT,
  owner_equity BIGINT,       -- ideally: total_assets - total_debt

  -- AI Standardization output
  standardized_pdf_url TEXT,      -- Supabase storage path
  standardization_notes TEXT,     -- AI commentary on data quality/anomalies
  ai_adjusted_revenue BIGINT,     -- if AI detects likely underreporting
  consistency_flags JSONB,        -- e.g. {"equity_mismatch": true, "revenue_spike": false}

  -- Verification chain
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by TEXT,               -- 'ai' | 'manual' | 'accountant'
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate submissions
  UNIQUE (business_profile_id, period_month, period_year, statement_type)
);
```

**Design notes:**
- `gross_profit` and `net_profit` are computed columns — never editable directly
- `ai_adjusted_revenue` allows the AI to flag a corrected estimate without overwriting user input (audit trail)
- `consistency_flags` JSONB is for internal quality scoring, not exposed to users
- The UNIQUE constraint prevents duplicate period submissions — use `ON CONFLICT DO UPDATE` for amendments

---

## 5. Credit Scoring Schema — Phase 3

### 5.1 Credit Profiles

Aggregated scoring artifact, generated from all available data for a business profile.

```sql
CREATE TABLE credit_profiles (
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
  recommended_loan_range_min BIGINT,  -- in IDR
  recommended_loan_range_max BIGINT,  -- in IDR

  -- Score breakdown (for explainability)
  score_factors JSONB,
  -- Example:
  -- {
  --   "positive": ["has_nib", "3_months_consistent_revenue", "has_collateral"],
  --   "negative": ["no_bank_account", "high_debt_ratio"],
  --   "neutral": ["first_time_kur"]
  -- }

  -- B2B sharing controls
  is_shareable BOOLEAN DEFAULT FALSE,   -- user explicitly consented to B2B sharing
  shared_with JSONB DEFAULT '[]',       -- array of partner_ids that accessed
  last_accessed_by TEXT,                -- partner_id
  last_accessed_at TIMESTAMPTZ,

  -- Lifecycle
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,              -- typically NOW() + 6 months
  invalidated_at TIMESTAMPTZ,          -- set when new financial data arrives
  invalidation_reason TEXT             -- 'new_financial_data' | 'user_request' | 'expired'
);
```

**Score methodology (v1):**

| Component | Weight | Inputs |
|---|---|---|
| Document Completeness | 25% | Count of docs generated, has_nib, business_type |
| Financial Health | 50% | Profit margin, debt ratio, revenue consistency (3+ months) |
| Business Stability | 25% | years_operating, employee_count, previous_kur |

**Risk category thresholds:**
- `LOW`: score ≥ 70
- `MEDIUM`: score 45–69
- `HIGH`: score < 45

### 5.2 B2B API Access Log

Immutable audit log — every partner query is recorded. Used for billing and compliance.

```sql
CREATE TABLE b2b_api_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES b2b_partners(id),
  credit_profile_id UUID REFERENCES credit_profiles(id),
  access_type TEXT CHECK (access_type IN ('score_only', 'full_profile', 'documents')),
  -- score_only: returns overall_credit_score + risk_category only
  -- full_profile: returns all scores + score_factors + recommended_loan_range
  -- documents: includes download links for legal docs and financial statements
  price_charged INTEGER,  -- in IDR (snapshot at time of access)
  request_ip TEXT,
  response_status TEXT DEFAULT 'success', -- success | error | denied
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Billing model:**

| Access Type | Price (Rp) |
|---|---|
| `score_only` | 50,000 |
| `full_profile` | 100,000 |
| `documents` | 200,000 |

### 5.3 B2B Partners Registry

```sql
CREATE TABLE b2b_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_type TEXT CHECK (partner_type IN ('bank', 'BPR', 'P2P', 'multifinance', 'koperasi')),
  contact_email TEXT,
  contact_name TEXT,

  -- Auth
  api_key_hash TEXT NOT NULL,   -- bcrypt hash of actual API key
  api_key_prefix TEXT,          -- first 8 chars for identification (e.g. "lk_live_")

  -- Pricing
  pricing_tier TEXT DEFAULT 'per_query', -- per_query | monthly_flat | revenue_share
  price_per_query INTEGER,              -- override per-partner if needed
  monthly_flat_fee INTEGER,             -- for monthly_flat tier
  revenue_share_pct NUMERIC(5,2),      -- e.g. 15.00 for 15%

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_sandbox BOOLEAN DEFAULT FALSE,     -- for testing partners
  onboarded_at TIMESTAMPTZ DEFAULT NOW(),
  last_query_at TIMESTAMPTZ,
  total_queries INTEGER DEFAULT 0,      -- denormalized counter
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Consent & Privacy Infrastructure

### 6.1 User Consents

Every data product feature requires explicit, versioned consent. This table is the source of truth — not a checkbox on a form.

```sql
CREATE TABLE user_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  consent_type TEXT NOT NULL,
  -- 'data_usage'     → anonymized data used to improve AI
  -- 'credit_scoring' → allow generation of credit profile
  -- 'b2b_sharing'    → allow B2B partners to query credit profile
  -- 'marketing'      → receive promotional WA/email
  is_granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  consent_version TEXT NOT NULL,  -- e.g. "v1.2" (must match published T&C version)
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Consent check pattern (application layer):**

```typescript
// Before generating credit profile
const consent = await supabase
  .from('user_consents')
  .select('is_granted, revoked_at')
  .eq('user_id', userId)
  .eq('consent_type', 'credit_scoring')
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

if (!consent.is_granted || consent.revoked_at) {
  throw new Error('CONSENT_REQUIRED');
}
```

### 6.2 Consent Flow Design

```
Order Completion Flow (Phase 1):
  → "Saya setuju data saya digunakan secara anonim untuk penelitian UMKM"
  → consent_type: 'data_usage'

KUR Bundle Flow (Phase 2 onboarding):
  → "Saya setuju laporan keuangan saya disimpan dan distandarisasi oleh AI"
  → consent_type: 'credit_scoring'

Credit Profile Activation (Phase 3):
  → "Saya setuju profil kredit saya dapat diakses oleh mitra lembaga keuangan"
  → consent_type: 'b2b_sharing'
  → Show list of partner types (not individual names initially)
```

---

## 7. Indexes & Performance

```sql
-- users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- orders (existing + new)
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_business_profile_id ON orders(business_profile_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_bundle_type ON orders(bundle_type);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- business_profiles
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_city ON business_profiles(city);
CREATE INDEX idx_business_profiles_province ON business_profiles(province);
CREATE INDEX idx_business_profiles_sector ON business_profiles(business_sector);
CREATE INDEX idx_business_profiles_quality ON business_profiles(data_quality_score DESC);

-- financial_statements
CREATE INDEX idx_financial_statements_profile ON financial_statements(business_profile_id);
CREATE INDEX idx_financial_statements_period ON financial_statements(period_year DESC, period_month DESC);
CREATE INDEX idx_financial_statements_verified ON financial_statements(is_verified);

-- credit_profiles
CREATE INDEX idx_credit_profiles_profile ON credit_profiles(business_profile_id);
CREATE INDEX idx_credit_profiles_score ON credit_profiles(overall_credit_score DESC);
CREATE INDEX idx_credit_profiles_risk ON credit_profiles(risk_category);
CREATE INDEX idx_credit_profiles_shareable ON credit_profiles(is_shareable) WHERE is_shareable = TRUE;
CREATE INDEX idx_credit_profiles_valid ON credit_profiles(valid_until) WHERE invalidated_at IS NULL;

-- b2b_api_access
CREATE INDEX idx_b2b_access_partner ON b2b_api_access(partner_id);
CREATE INDEX idx_b2b_access_profile ON b2b_api_access(credit_profile_id);
CREATE INDEX idx_b2b_access_at ON b2b_api_access(accessed_at DESC);
-- For billing queries
CREATE INDEX idx_b2b_access_partner_month ON b2b_api_access(partner_id, accessed_at DESC);

-- user_consents
CREATE INDEX idx_consents_user ON user_consents(user_id);
CREATE INDEX idx_consents_type ON user_consents(consent_type);
CREATE INDEX idx_consents_user_type ON user_consents(user_id, consent_type, created_at DESC);
```

---

## 8. Row Level Security (RLS) Policies

Supabase RLS — users can only see their own data. B2B partners access through a backend API (service role) that enforces consent checks at application level.

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_api_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- users: can only read/update own row
CREATE POLICY "users_own_read" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_own_update" ON users
  FOR UPDATE USING (auth.uid() = id);

-- orders: can only read own orders (matched by user_id or email)
CREATE POLICY "orders_own_read" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    customer_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- business_profiles: user owns their profiles
CREATE POLICY "business_profiles_own" ON business_profiles
  FOR ALL USING (user_id = auth.uid());

-- financial_statements: accessible via business_profile ownership
CREATE POLICY "financial_statements_own" ON financial_statements
  FOR ALL USING (
    business_profile_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- credit_profiles: read-only for users (write via service role only)
CREATE POLICY "credit_profiles_own_read" ON credit_profiles
  FOR SELECT USING (
    business_profile_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- user_consents: full control over own consents
CREATE POLICY "consents_own" ON user_consents
  FOR ALL USING (user_id = auth.uid());

-- b2b tables: service role only (no user-facing RLS needed)
-- b2b_api_access, b2b_partners: only accessible via backend service key

-- feedback: insert + read own
CREATE POLICY "feedback_own" ON feedback
  FOR SELECT USING (
    order_id IN (
      SELECT order_id FROM orders WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "feedback_insert" ON feedback
  FOR INSERT WITH CHECK (TRUE); -- anyone with an order_id can submit
```

---

## 9. Implementation Roadmap

### Month 1 — Foundation (Phase 1 Extended)

**Week 1–2: Schema migration**
- [ ] Run `supabase-schema-v2.sql` in production
- [ ] Add `users` table — no breaking changes
- [ ] Add new columns to `orders` via ALTER TABLE
- [ ] Backfill `user_id` from `customer_email` matching
- [ ] Enable RLS on all tables

**Week 3–4: KUR wizard + consent**
- [ ] Add consent checkbox to checkout flow: "Izinkan data saya digunakan secara anonim"
- [ ] Write `consent_type: 'data_usage'` on order complete
- [ ] Add `bundle_type` to payment flow
- [ ] Build KUR bundle UI (5-doc wizard) that populates `business_profiles`
- [ ] Track `documents_generated` array on each order

**Goal:** 500+ business profiles collected, 80%+ consent rate

---

### Month 2 — Financial Module (Phase 2)

**Week 5–6: Input forms**
- [ ] Build monthly financial input form (simplified, UMKM-friendly)
- [ ] Input: revenue, expenses, stock, debt
- [ ] Save to `financial_statements` table
- [ ] Calculate and display `gross_profit`, `net_profit` live in UI

**Week 7–8: AI standardization**
- [ ] Integrate GPT-4o for financial statement standardization
- [ ] Generate standardized PDF using PDFKit/html2pdf
- [ ] Upload to Supabase storage, save URL to `standardized_pdf_url`
- [ ] Add `consistency_flags` for data quality signals
- [ ] Add `consent_type: 'credit_scoring'` consent gate in UI

**Pricing:** Rp 99,000 (1 month) / Rp 249,000 (3 months)

**Goal:** 100+ financial statements, first look at data patterns

---

### Month 3 — Credit Scoring Pilot (Phase 3)

**Week 9–10: Score engine**
- [ ] Build score calculation service
- [ ] Weighted inputs: documents (25%) + financials (50%) + stability (25%)
- [ ] Generate `credit_profiles` for businesses with ≥3 months of data
- [ ] Display credit score to user in dashboard

**Week 11–12: B2B pilot**
- [ ] Approach Lendana, 1–2 BPR partners for pilot
- [ ] Build simple B2B API: `GET /api/v1/credit/{business_id}`
- [ ] Implement API key auth, rate limiting, `b2b_api_access` logging
- [ ] Onboard first partner to `b2b_partners` table
- [ ] Add `consent_type: 'b2b_sharing'` explicit consent screen

**Goal:** First paid B2B query, validate Rp 50–200K pricing

---

## 10. Revenue Projections

### Phase 1 (Now — Month 1)

| Product | Price | Volume Target | Monthly Revenue |
|---|---|---|---|
| Single document | Rp 29,000–79,000 | 300 orders/month | Rp 15–25 juta |
| KUR Bundle (5 docs) | Rp 149,000 | 50 orders/month | Rp 7.5 juta |
| **Phase 1 Total** | | | **Rp 22–32 juta/month** |

### Phase 2 (+3 months)

| Product | Price | Volume Target | Monthly Revenue |
|---|---|---|---|
| Financial report (1 month) | Rp 99,000 | 150 reports/month | Rp 14.8 juta |
| Financial report (3 months) | Rp 249,000 | 50 packages/month | Rp 12.5 juta |
| **Phase 2 Incremental** | | | **+Rp 27 juta/month** |

### Phase 3 (+6 months)

| Product | Price per query | Queries/month | Monthly Revenue |
|---|---|---|---|
| Score only | Rp 50,000 | 500 | Rp 25 juta |
| Full profile | Rp 100,000 | 200 | Rp 20 juta |
| Documents package | Rp 200,000 | 100 | Rp 20 juta |
| **Phase 3 Incremental** | | | **+Rp 65 juta/month** |

### Combined at Month 12

**Projected MRR: Rp 100–120 juta/month** (~$6–7K USD)
- With 3–5 active B2B partners: path to Rp 300–500 juta/month at scale

---

## 11. Data Moat Thesis

### Why This Data Is Valuable and Hard to Replicate

**1. Verified UMKM financial data is almost non-existent**
Most Indonesian UMKMs have zero formal financial records. Banks currently rely on in-person survey visits (cost: Rp 500K–2 juta per UMKM). LegalKan collects this data digitally at near-zero marginal cost.

**2. Legal document history as a proxy for business legitimacy**
A business that has generated a perjanjian jual-beli, surat hutang, and perjanjian sewa over 6 months has demonstrated real commercial activity — without requiring formal accounting. This is a novel credit signal.

**3. Time series creates defensibility**
One month of financials is a snapshot. 12 months is a trend. The longer a business uses LegalKan, the richer and more defensible the data becomes. Early users will have profiles competitors can't replicate.

**4. The business profile as a network effect**
As more lenders query LegalKan scores, more UMKMs will want a LegalKan profile to access credit. This creates a flywheel: more UMKMs → better data → more lenders → more UMKMs.

**5. Cost advantage**
Acquiring a credit bureau file from SLIK/BI costs money and often returns empty for UMKM. LegalKan's first-party data collected at the point of document generation is effectively free to acquire — the user pays us to generate it.

**6. Regulatory moat (eventually)**
OJK registration as a fintech data provider creates a regulatory barrier that prevents cheap replication by generic players.

---

## 12. Privacy & Compliance

### 12.1 UU PDP No. 27/2022 Requirements

Indonesia's Personal Data Protection Law (effective 2024) imposes strict obligations:

| Requirement | Implementation |
|---|---|
| **Lawful basis for processing** | Explicit consent (`user_consents` table) required before any sensitive data use |
| **Data minimization** | Only collect what's needed per phase — NIK only collected when required for KUR |
| **Purpose limitation** | Separate consent types per use case (`data_usage`, `credit_scoring`, `b2b_sharing`) |
| **Retention limits** | Set `valid_until` on credit profiles (6 months); add data deletion API |
| **Right to deletion** | Implement DELETE endpoint that wipes `business_profiles`, `financial_statements`, `credit_profiles` |
| **Right to access** | User dashboard showing all stored data — queryable via `user_id` |
| **Breach notification** | 14-day notification requirement — implement monitoring + incident runbook |
| **Data controller registration** | Register with Kominfo as data controller (Phase 2 launch) |

### 12.2 NIK Encryption

NIK (Nomor Induk Kependudukan) is classified as sensitive personal data under UU PDP.

**Implementation:**
```typescript
// Encrypt NIK before storing
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = process.env.NIK_ENCRYPTION_KEY; // 32 bytes, stored in Vault
const IV_LENGTH = 16;

export function encryptNIK(nik: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(nik), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptNIK(encryptedNIK: string): string {
  const [ivHex, encryptedHex] = encryptedNIK.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}
```

**Key management:** Store `NIK_ENCRYPTION_KEY` in Supabase Vault (not in code or `.env` files).

### 12.3 OJK Considerations for Phase 3

When selling credit data B2B to regulated lenders:

| Consideration | Action Required |
|---|---|
| **POJK 77/2016** (P2P regulation) | If LegalKan acts as data provider to P2P, may require OJK registration as PJKK (Penyelenggara Jasa Keuangan Khusus) |
| **SLIK integration** | Consider future integration with OJK SLIK to cross-reference — requires formal agreement |
| **Credit bureau status** | If scoring is primary product, registration as lembaga pengelola informasi perkreditan may be required |
| **B2B partner vetting** | Only share data with OJK-registered financial institutions — verify via `b2b_partners.partner_type` |

**Recommended approach:** In Phase 3 pilot, position LegalKan as a "data aggregation and presentation service" rather than a "credit bureau" — consult with fintech lawyer before launch.

### 12.4 Consent UX Requirements

Per UU PDP, consent must be:
- **Explicit** — not buried in T&C, must be a separate action
- **Specific** — separate consent per use case
- **Informed** — user must understand what they're consenting to in plain Bahasa Indonesia
- **Revocable** — user must be able to revoke at any time via the app

**Minimum consent copy (Bahasa Indonesia):**

```
Data Usage:
"Saya setuju data transaksi saya digunakan secara anonim untuk 
meningkatkan layanan AI LegalKan. Data pribadi saya tidak 
akan dijual kepada pihak ketiga."

Credit Scoring:
"Saya setuju LegalKan membuat profil kredit berdasarkan 
dokumen dan laporan keuangan saya. Saya dapat melihat dan 
menghapus profil ini kapan saja."

B2B Sharing:
"Saya setuju profil kredit saya dapat diakses oleh mitra 
lembaga keuangan pilihan LegalKan untuk keperluan pengajuan 
kredit. Saya berhak mencabut izin ini kapan saja."
```

---

## 13. Migration Notes

### Running on Existing Production Database

The full schema in `supabase-schema-v2.sql` is designed to be **additive** — it will not drop any existing tables or columns.

**Safe migration order:**
1. Run `CREATE TABLE IF NOT EXISTS` for all new tables
2. Run `ALTER TABLE orders ADD COLUMN IF NOT EXISTS` for new columns
3. Create indexes (use `CREATE INDEX IF NOT EXISTS`)
4. Enable RLS (safe on existing tables)
5. Create RLS policies (use `CREATE POLICY IF NOT EXISTS`)

**Backfill strategy for existing orders:**
```sql
-- Create user records from existing order data
INSERT INTO users (email, phone, name, created_at)
SELECT DISTINCT 
  customer_email, 
  customer_phone, 
  customer_name,
  MIN(created_at)
FROM orders 
WHERE customer_email IS NOT NULL
GROUP BY customer_email, customer_phone, customer_name
ON CONFLICT (email) DO NOTHING;

-- Link existing orders to newly created users
UPDATE orders o
SET user_id = u.id
FROM users u
WHERE o.customer_email = u.email
  AND o.user_id IS NULL;
```

### Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | April 2026 | Initial schema (orders, feedback, contacts) |
| 2.0 | April 2026 | Added users, business_profiles, financial_statements, credit_profiles, b2b tables, consent infrastructure |

---

*Document maintained by LegalKan engineering. Update schema version in this doc whenever `supabase-schema-v2.sql` changes.*
