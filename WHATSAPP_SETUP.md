# WhatsApp Setup Guide — LegalKan

LegalKan uses **whatsapp-web.js** to automatically send PDF contracts to buyers
via WhatsApp after payment confirmation.

---

## First-Time Setup (Scan QR)

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Watch the terminal** — you'll see a QR code printed in ASCII art:
   ```
   [WhatsApp] Initializing client...
   [WhatsApp] Scan QR code below to connect:

   ▄▄▄▄▄▄▄  ▄▄  ▄▄▄▄▄▄▄
   █ ▄▄▄ █ ▀██▀ █ ▄▄▄ █
   ...
   ```

3. **On your phone:**
   - Open **WhatsApp**
   - Tap ⋮ (three dots) → **Linked Devices**
   - Tap **Link a Device**
   - Scan the QR code on your screen

4. **Success:** The terminal shows:
   ```
   [WhatsApp] Authenticated successfully.
   [WhatsApp] ✅ Client is ready!
   ```

5. **Check status** at: [http://localhost:3000/admin/wa-status](http://localhost:3000/admin/wa-status)

---

## Session Persistence

- The session is saved to `.wwebjs_auth/` in the project root.
- **After the first scan, you will NOT need to scan again** on subsequent restarts.
- Add `.wwebjs_auth/` to `.gitignore` (already done) — never commit session data.

---

## Keeping the Session Alive

| Scenario | What happens |
|----------|-------------|
| Server restarts | ✅ Auto-reconnects using saved session |
| Phone is offline briefly | ✅ Reconnects when phone comes back online |
| Phone logged out manually | ❌ Need to scan QR again |
| Phone WhatsApp reinstalled | ❌ Need to scan QR again |
| Inactivity for weeks | ⚠️ May disconnect — check status page |

**Tip for production:** Use PM2 with `--restart-delay` so the server auto-restarts
and WhatsApp reconnects on crashes.

```bash
pm2 start npm --name "kontrak-in" -- start
pm2 save
pm2 startup
```

---

## Admin Status Page

Visit `/admin/wa-status` to see the current connection status:

- ✅ **Ready** — WhatsApp is connected, PDFs will be sent automatically
- 📱 **QR pending** — Scan the QR in the terminal
- ⏳ **Initializing** — Wait a moment for puppeteer to start
- ❌ **Disconnected** — Check terminal logs, may need to re-scan QR

---

## Troubleshooting

### QR code not appearing
- Wait 30–60 seconds for Puppeteer/Chromium to initialize
- Make sure Chrome/Chromium is accessible on the server
- On Linux VPS, install Chromium: `sudo apt install chromium-browser`

### "Puppeteer not found" error
```bash
npm install puppeteer
# or let whatsapp-web.js use its bundled version (default)
```

### Session not saving
- Check that the server has write permission to the project directory
- Ensure `.wwebjs_auth/` directory can be created

### Messages not sending
1. Check `/admin/wa-status` — status must be **Ready**
2. Check phone number format: `08xxxxxxxxxx` or `628xxxxxxxxxx`
3. Check terminal logs for errors
4. The recipient must have an active WhatsApp account

### "Invalid session" on restart
Delete the saved session and re-scan:
```bash
rm -rf .wwebjs_auth/
npm run dev  # scan QR again
```

---

## ⚠️ WhatsApp Terms of Service & Volume Limits

> **Important:** whatsapp-web.js uses WhatsApp Web automation, which is **unofficial**.

### What this means for you:

| | Status |
|---|---|
| Personal use / low volume | ✅ Generally fine |
| Business use (< 100 msgs/day) | ⚠️ Use carefully, avoid spam |
| Bulk sending / marketing | ❌ Violates WhatsApp ToS |
| Account ban risk | Low for transactional messages |

### Best practices:
- Only send messages to users who **explicitly provided their number**
- Keep it transactional (contract delivery, not marketing)
- Do NOT send to numbers that haven't used the service
- Maintain a normal send rate — no blasting to lists

### For higher volume:
Consider upgrading to the **official WhatsApp Business API** (via Twilio, 360dialog, etc.)
which is fully compliant and supports higher throughput.

---

## Environment Variables

No new environment variables are required for WhatsApp. The service uses LocalAuth
(session stored on disk, not in env).

Optional — add to `.env.local` if you want to control WA behavior:
```env
# Optional: disable WA send in dev mode
# DISABLE_WHATSAPP=true
```

---

## How It Works (Technical)

1. **Startup:** `lib/whatsapp.ts` initializes a singleton `Client` using
   `whatsapp-web.js` + `LocalAuth`. This runs once per Node.js process.

2. **Hot reload (dev):** Uses `global.__waClient` to avoid re-initializing
   on Next.js hot reloads.

3. **Payment webhook:** `app/api/webhook/route.ts` calls `sendPDF()` after
   Xendit confirms payment. If WhatsApp is not connected, it gracefully falls
   back (logs a warning, user can still download from the success page).

4. **Phone normalization:** `08xx` → `628xx`, `+628xx` → `628xx` (Indonesian format).

5. **Session storage:** `.wwebjs_auth/session-default/` contains the auth session.
