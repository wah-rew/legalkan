import { NextResponse } from "next/server";
import { getWhatsAppStatus } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
// Disable edge runtime — whatsapp-web.js needs Node.js
export const runtime = "nodejs";

/**
 * GET /api/wa-qr
 * Returns the current WhatsApp connection status and QR code (if pending).
 */
export async function GET() {
  const { status, qr } = getWhatsAppStatus();
  return NextResponse.json({ status, qr });
}
