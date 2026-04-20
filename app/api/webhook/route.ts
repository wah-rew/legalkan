import { NextRequest, NextResponse } from "next/server";
import { sendPDF } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

/**
 * Xendit VA Payment Webhook
 * Configure this URL in Xendit Dashboard → Settings → Webhooks
 * URL: https://yourdomain.com/api/webhook
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Verify Xendit callback token
    const callbackToken = req.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;

    if (expectedToken && expectedToken !== "placeholder" && callbackToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Xendit webhook received:", JSON.stringify(body, null, 2));

    // Handle VA payment notification
    if (body.event === "payment.received" || body.status === "PAID") {
      const externalId = body.external_id; // This is our orderId
      const paidAmount = body.amount;

      console.log(`Payment received for order ${externalId}: Rp ${paidAmount}`);

      // Update order status to paid in Supabase
      if (supabase) {
        try {
          await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('order_id', externalId);
        } catch (dbErr) {
          console.error('[webhook] Supabase update error (non-fatal):', dbErr);
        }
      }

      // -------------------------------------------------------
      // WhatsApp PDF delivery
      // -------------------------------------------------------
      // In a real implementation, look up contractData and nomorWhatsapp
      // from your database using externalId. Here we check if they were
      // passed in the webhook metadata or stored alongside the order.
      const nomorWhatsapp: string | undefined =
        body.metadata?.nomorWhatsapp || body.nomorWhatsapp;

      if (nomorWhatsapp) {
        try {
          // Generate PDF — in production this would look up the real contract
          // and call your PDF generation API internally.
          // For now, we create a minimal placeholder and log the intent.
          const pdfBuffer = await fetchPdfFromApi(req, body);

          if (pdfBuffer) {
            const filename = `Kontrak-Sewa-${externalId}.pdf`;
            const caption =
              "Halo! Berikut dokumen legal Anda dari LegalKan 📄✅ Terima kasih sudah menggunakan layanan kami!";

            const sent = await sendPDF(nomorWhatsapp, pdfBuffer, filename, caption);
            if (sent) {
              console.log(`[Webhook] ✅ WhatsApp PDF sent to ${nomorWhatsapp}`);
              // Update WA delivery timestamp in Supabase
              if (supabase) {
                try {
                  await supabase
                    .from('orders')
                    .update({
                      status: 'delivered',
                      wa_sent_at: new Date().toISOString(),
                    })
                    .eq('order_id', externalId);
                } catch (dbErr) {
                  console.error('[webhook] Supabase wa_sent_at update error (non-fatal):', dbErr);
                }
              }
            } else {
              console.warn(
                "[Webhook] ⚠️ WhatsApp not connected — PDF not sent via WA. Falling back to download only."
              );
            }
          }
        } catch (waErr) {
          // Non-fatal: log and continue. User can still download from sukses page.
          console.error("[Webhook] WhatsApp send error (non-fatal):", waErr);
        }
      } else {
        console.log("[Webhook] No nomorWhatsapp in payload — skipping WA delivery.");
      }

      return NextResponse.json({ success: true, message: "Payment processed" });
    }

    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/**
 * Fetch PDF from internal /api/pdf endpoint.
 * Returns Buffer or null if not possible.
 */
async function fetchPdfFromApi(
  req: NextRequest,
  body: Record<string, unknown>
): Promise<Buffer | null> {
  try {
    // The contractData should be stored in your DB and retrieved by externalId.
    // If passed in the webhook metadata, use it directly.
    const meta = (body.metadata ?? {}) as Record<string, unknown>;
    const contractData = meta.contractData ?? body.contractData;
    if (!contractData) return null;

    // Build the internal URL using the incoming request host
    const host = req.headers.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const pdfRes = await fetch(`${protocol}://${host}/api/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractData }),
    });

    if (!pdfRes.ok) return null;
    const arrayBuffer = await pdfRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}
