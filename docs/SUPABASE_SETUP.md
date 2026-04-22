# Supabase Setup Guide — LegalKan

This guide walks you through connecting LegalKan to Supabase for persistent order storage,
feedback tracking, contact logging, and the admin dashboard.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in / create an account.
2. Click **New project**.
3. Choose an organization, give the project a name (e.g. `legalkan-prod`), set a strong database password, and choose a region close to your users (e.g. Singapore).
4. Wait ~2 minutes for the project to be provisioned.

---

## 2. Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `docs/supabase-schema-v2.sql` in this repo and **copy the entire contents**.
4. Paste it into the SQL Editor.
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).

The schema is idempotent (`IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS`) — safe to run multiple times or on an existing database.

**Tables created:**
| Table | Purpose |
|---|---|
| `orders` | Every contract order (core) |
| `users` | Registered users (future auth) |
| `feedback` | Post-delivery ratings & comments |
| `contacts` | Contact form submissions |
| `business_profiles` | UMKM business data (Phase 2) |
| `financial_statements` | Monthly financial inputs (Phase 2) |
| `credit_profiles` | Credit scoring output (Phase 3) |
| `b2b_partners` | B2B API partner registry (Phase 3) |
| `b2b_api_access` | Immutable API access log (Phase 3) |
| `user_consents` | GDPR-style consent tracking |

---

## 3. Get Your API Keys

1. In your Supabase project, go to **Settings → API** (left sidebar).
2. Copy the following values:
   - **Project URL** — looks like `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **anon / public key** — a long JWT string under "Project API keys"

---

## 4. Set Environment Variables

### For local development

Create or edit `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Vercel deployment

1. Go to your Vercel project → **Settings → Environment Variables**.
2. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure they are enabled for **Production**, **Preview**, and **Development** environments.
4. Redeploy for the variables to take effect.

> **Note:** The `NEXT_PUBLIC_` prefix is required — these are used in the browser (admin dashboard) and on the server (API routes). The anon key is safe to expose publicly; it is restricted by Row Level Security policies.

---

## 5. Row Level Security (RLS)

RLS is **already enabled** by the schema migration on all tables. The policies are:

| Table | Policy |
|---|---|
| `users` | Users can only read/update their own row |
| `orders` | Users can only read orders linked to their `user_id` or matching email |
| `business_profiles` | Users can only CRUD their own profiles |
| `financial_statements` | Accessible only through owned business profiles |
| `credit_profiles` | Read-only for the owning user; write via service role only |
| `user_consents` | Users have full control over their own consents |
| `feedback` | Anyone can insert; users can only read their own feedback |
| `b2b_partners` / `b2b_api_access` | Service role only (no user-facing policies) |

**For API routes (server-side):** The anon key respects RLS. Since our API routes
run on the server and use the anon key, all unauthenticated writes to `orders`,
`feedback`, and `contacts` will be rejected by default RLS policies.

To allow server-side writes without authentication, run this in the SQL Editor:

```sql
-- Allow server-side inserts to orders (unauthenticated, via API routes)
CREATE POLICY "orders_insert_open" ON orders
  FOR INSERT WITH CHECK (TRUE);

-- Allow server-side updates to orders (unauthenticated, for payment confirmation)
CREATE POLICY "orders_update_open" ON orders
  FOR UPDATE USING (TRUE);

-- Allow server-side inserts to feedback
CREATE POLICY "feedback_insert_open" ON feedback
  FOR INSERT WITH CHECK (TRUE);

-- Allow server-side inserts to contacts
CREATE POLICY "contacts_insert_open" ON contacts
  FOR INSERT WITH CHECK (TRUE);
```

> **Alternative (more secure):** Use a `SUPABASE_SERVICE_ROLE_KEY` (found in Settings → API → Service role key) in a server-only env var (no `NEXT_PUBLIC_` prefix) and create a separate service-role client for write operations. This avoids opening public insert policies.

---

## 6. Verify the Connection

After setting env vars and redeploying:

1. Visit `/admin/dashboard` — if Supabase is connected, the "Demo Data" badge will disappear and you'll see real data (or an empty state).
2. Generate a test contract at `/` — the order should appear in the Supabase `orders` table.
3. Check the Supabase **Table Editor** to confirm rows are being inserted.

---

## 7. Troubleshooting

| Symptom | Fix |
|---|---|
| Dashboard still shows demo data | Check that env vars are set and the app was redeployed |
| `invalid URL` error in logs | `NEXT_PUBLIC_SUPABASE_URL` is missing or malformed |
| RLS violation errors | Add the open insert/update policies from step 5 |
| `relation "orders" does not exist` | Schema migration hasn't been run yet — complete step 2 |
| Duplicate key on order_id | This is expected on re-submission; the `transfer-confirm` route uses `upsert` |

---

## Schema Version

Current schema: **v2.0** (April 2026)
File: `docs/supabase-schema-v2.sql`
