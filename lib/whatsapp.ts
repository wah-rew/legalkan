/**
 * WhatsApp Service - Singleton Client using whatsapp-web.js
 * Uses LocalAuth to persist session between restarts.
 *
 * Usage:
 *   import { getWhatsAppClient, sendPDF } from '@/lib/whatsapp';
 */

import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
// qrcode-terminal has no types; use require
// eslint-disable-next-line @typescript-eslint/no-require-imports
const qrcode = require("qrcode-terminal");

// -------------------------------------------------------------------
// State shared across hot reloads in Next.js dev mode
// -------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __waClient: Client | undefined;
  // eslint-disable-next-line no-var
  var __waStatus: "initializing" | "qr" | "ready" | "disconnected";
  // eslint-disable-next-line no-var
  var __waQR: string | undefined;
}

if (!global.__waStatus) {
  global.__waStatus = "initializing";
}

// -------------------------------------------------------------------
// Initialize client (only once per process)
// -------------------------------------------------------------------
function initClient(): Client {
  if (global.__waClient) return global.__waClient;

  console.log("[WhatsApp] Initializing client...");

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: "./.wwebjs_auth",
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    },
  });

  client.on("qr", (qr: string) => {
    console.log("\n[WhatsApp] Scan QR code below to connect:\n");
    qrcode.generate(qr, { small: true });
    global.__waStatus = "qr";
    global.__waQR = qr;
  });

  client.on("ready", () => {
    console.log("[WhatsApp] ✅ Client is ready!");
    global.__waStatus = "ready";
    global.__waQR = undefined;
  });

  client.on("authenticated", () => {
    console.log("[WhatsApp] Authenticated successfully.");
  });

  client.on("auth_failure", (msg: string) => {
    console.error("[WhatsApp] Auth failure:", msg);
    global.__waStatus = "disconnected";
  });

  client.on("disconnected", (reason: string) => {
    console.warn("[WhatsApp] Disconnected:", reason);
    global.__waStatus = "disconnected";
    global.__waClient = undefined;
    // Re-initialize after a short delay
    setTimeout(() => initClient(), 5000);
  });

  client.initialize().catch((err: Error) => {
    console.error("[WhatsApp] Initialization error:", err);
    global.__waStatus = "disconnected";
  });

  global.__waClient = client;
  return client;
}

// Auto-initialize when this module is first imported (server-side only)
if (typeof window === "undefined") {
  initClient();
}

// -------------------------------------------------------------------
// Phone number normalization
// Indonesian: 08xx → 628xx, +628xx → 628xx, 628xx → 628xx
// -------------------------------------------------------------------
export function normalizePhoneNumber(phone: string): string {
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");

  if (cleaned.startsWith("+62")) {
    cleaned = cleaned.slice(1); // +628xx → 628xx
  } else if (cleaned.startsWith("08")) {
    cleaned = "62" + cleaned.slice(1); // 08xx → 628xx
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned; // 8xx → 628xx
  }
  // Already 628xx — leave as-is

  return cleaned + "@c.us"; // WhatsApp chat ID format
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

export function getWhatsAppStatus(): {
  status: "initializing" | "qr" | "ready" | "disconnected";
  qr?: string;
} {
  return {
    status: global.__waStatus ?? "disconnected",
    qr: global.__waQR,
  };
}

export function getWhatsAppClient(): Client | undefined {
  return global.__waClient;
}

/**
 * Send a PDF buffer as a WhatsApp document.
 *
 * @param phoneNumber - Indonesian format (08xxx) or international (628xxx)
 * @param pdfBuffer   - PDF file as Buffer
 * @param filename    - e.g. "Kontrak-Sewa.pdf"
 * @param caption     - Message caption below the document
 * @returns true on success, false if WA not connected
 */
export async function sendPDF(
  phoneNumber: string,
  pdfBuffer: Buffer,
  filename: string,
  caption: string
): Promise<boolean> {
  if (global.__waStatus !== "ready" || !global.__waClient) {
    console.warn("[WhatsApp] Not ready — skipping PDF send.");
    return false;
  }

  try {
    const chatId = normalizePhoneNumber(phoneNumber);
    const media = new MessageMedia(
      "application/pdf",
      pdfBuffer.toString("base64"),
      filename
    );

    await global.__waClient.sendMessage(chatId, media, { caption });
    console.log(`[WhatsApp] ✅ PDF sent to ${chatId}`);
    return true;
  } catch (err) {
    console.error("[WhatsApp] Failed to send PDF:", err);
    return false;
  }
}
