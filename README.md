# LegalKan 📜

> **Legal-kan sekarang.** Dokumen legal dalam 5 menit.

Platform pembuatan dokumen legal berbasis AI untuk pasar Indonesia. Pengguna mengisi formulir, AI men-generate kontrak legal, bayar via Xendit Virtual Account, dan dapat PDF langsung.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API Routes |
| PDF | Printable HTML (puppeteer-ready) |
| Payment | Xendit Virtual Account |
| Email | Resend |
| AI (optional) | OpenAI GPT-4 |

---

## Quick Start

```bash
# 1. Clone / enter the project
cd projects/suratsewa

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your real keys (see below)

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/buat` | 3-step form to fill contract details |
| `/preview` | AI-generated contract preview + bank selection |
| `/bayar` | Virtual Account payment page with countdown |
| `/sukses` | Success page with download + next steps |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/generate` | POST | Generate contract from form data |
| `/api/payment` | POST | Create Xendit VA (or mock) |
| `/api/confirm` | POST | Confirm payment + send email |
| `/api/pdf` | POST | Return printable contract HTML |
| `/api/webhook` | POST | Xendit payment webhook receiver |

---

## Going Live — What You Need

### 1. Xendit (Payment)
1. Daftar di [dashboard.xendit.co](https://dashboard.xendit.co)
2. Masuk ke **Settings → Developers → API Keys**
3. Salin **Secret Key** (dimulai dengan `xnd_production_...`)
4. Tambahkan ke `.env.local`:
   ```
   XENDIT_SECRET_KEY=xnd_production_xxxxxxxxxxxxxx
   ```
5. Set webhook URL di Xendit dashboard:
   - URL: `https://legal-kan.com/api/webhook`
   - Events: `Virtual Account Payment`
6. Salin **Callback Verification Token** → `XENDIT_CALLBACK_TOKEN`

### 2. Resend (Email)
1. Daftar di [resend.com](https://resend.com)
2. Verifikasi domain `legal-kan.com` (tambah DNS records)
3. Buat API Key → tambahkan ke `RESEND_API_KEY`
4. Set `EMAIL_FROM=noreply@legal-kan.com`

### 3. OpenAI (AI Contract Enhancement) — Optional
1. Daftar di [platform.openai.com](https://platform.openai.com)
2. Buat API Key → tambahkan ke `OPENAI_API_KEY`
3. Edit `/app/api/generate/route.ts` untuk aktifkan prompt AI

### 4. Deploy ke Vercel
```bash
npm i -g vercel
vercel deploy
# Set environment variables di Vercel dashboard
```

---

## MVP vs Production

| Feature | MVP (Sekarang) | Production |
|---|---|---|
| Contract generation | ✅ Template-based | + AI enhancement |
| Payment | ✅ Mock VA (demo) | ✅ Real Xendit VA |
| Email | ✅ Placeholder | ✅ Resend |
| PDF | ✅ Printable HTML | + Puppeteer PDF |
| Database | ❌ sessionStorage | + PostgreSQL/Supabase |
| Auth | ❌ Tidak perlu | Optional |
| Materai digital | ❌ | + Peruri e-Meterai API |

---

## Next Steps to Production

1. **Database** — simpan order & kontrak di PostgreSQL (Supabase gratis)
2. **Webhook** — aktifkan auto-confirm payment via Xendit webhook (jangan manual)
3. **Puppeteer** — convert HTML ke PDF sesungguhnya (bukan print browser)
4. **e-Meterai** — integrasi [Peruri e-Meterai API](https://ematerai.peruri.co.id) agar 100% paperless
5. **Analytics** — tambahkan Posthog untuk funnel tracking
6. **Admin panel** — dashboard untuk lihat semua orders

---

## Brand

```
Name:     LegalKan
Domain:   legal-kan.com
Tagline:  Legal-kan sekarang.
Sub:      Dokumen legal dalam 5 menit.

Colors:
  Primary:    #FF4D6D (coral)
  Secondary:  #0D1B3E (navy)
  Accent:     #FFD166 (amber)
  Background: #F8F9FF
  Success:    #06D6A0

Fonts:
  Heading: Plus Jakarta Sans (800)
  Body:    Inter (400/500)
```

---

## Project Structure

```
suratsewa/
├── app/
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Nav + footer
│   ├── globals.css       # Brand styles
│   ├── buat/page.tsx     # Form (3 steps)
│   ├── preview/page.tsx  # Contract preview
│   ├── bayar/page.tsx    # VA payment
│   ├── sukses/page.tsx   # Success + download
│   └── api/
│       ├── generate/     # Contract generation
│       ├── payment/      # Xendit VA creation
│       ├── confirm/      # Payment confirm + email
│       ├── pdf/          # PDF/HTML export
│       └── webhook/      # Xendit webhook
├── lib/
│   └── contract-template.ts  # Full Indonesian contract template
├── types/
│   └── index.ts          # TypeScript types
├── .env.example          # Environment template
└── README.md
```

---

Built with ❤️ for the Indonesian property market.
