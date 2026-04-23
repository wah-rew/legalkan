import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateContractHTML } from "@/lib/contract-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body: { orderId?: string; adminToken?: string } = await req.json();
    const { orderId, adminToken } = body;

    // 1. Validate admin token
    const expectedToken = process.env.ADMIN_SECRET || "legalkan-admin-2026";
    if (!adminToken || adminToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // 2. Fetch order from Supabase
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (fetchError || !order) {
      console.error("[admin/resend] Order not found:", fetchError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const contractDataRaw = order.contract_data as Record<string, unknown>;
    const customerEmail =
      (order.customer_email as string) ||
      (contractDataRaw?.emailPembeli as string) ||
      null;

    if (!customerEmail) {
      return NextResponse.json({ error: "No customer email on order" }, { status: 400 });
    }

    // 3. Generate contractHTML from contract_data
    let contractHTML = contractDataRaw?.contractHTML as string | undefined;
    try {
      // Re-generate to ensure freshness
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contractHTML = generateContractHTML(contractDataRaw as any);
    } catch (genErr) {
      console.error("[admin/resend] generateContractHTML error (non-fatal):", genErr);
      // Fall back to stored HTML if generation fails
    }

    // 4. Update Supabase: save contractHTML + set status to "paid"
    try {
      await supabase
        .from("orders")
        .update({
          status: "paid",
          contract_data: { ...contractDataRaw, contractHTML },
        })
        .eq("order_id", orderId);
    } catch (dbErr) {
      console.error("[admin/resend] Supabase update error (non-fatal):", dbErr);
    }

    // 5. Send email with download link
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.legal-kan.com";
    const downloadUrl = `${baseUrl}/unduh?orderId=${orderId}`;

    const contractLabel =
      (contractDataRaw?.nomorKontrak as string) || orderId;
    const recipientName =
      (contractDataRaw?.namaPihakKedua as string) || "kamu";

    const resendKey = process.env.RESEND_API_KEY;
    let emailSent = false;

    if (resendKey && resendKey !== "placeholder" && !resendKey.includes("placeholder")) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "LegalKan <noreply@legal-kan.com>",
          to: customerEmail,
          subject: `🎉 Kontrakmu sudah jadi! — ${contractLabel}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #F8F9FF; padding: 32px;">
              <div style="text-align:center; margin-bottom: 24px;">
                <span style="font-size: 2rem; font-weight: 800; color: #FF4D6D;">Legal</span>
                <span style="font-size: 2rem; font-weight: 800; color: #0D1B3E;">Kan</span>
              </div>
              <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(13,27,62,0.07);">
                <h2 style="color: #0D1B3E; font-size: 1.4rem; margin-bottom: 8px;">🎉 Kontrakmu sudah jadi!</h2>
                <p style="color: #6B7FA8; margin-bottom: 20px;">
                  Hei ${recipientName}, pembayaranmu sudah dikonfirmasi dan dokumen kontrakmu siap!
                </p>
                <div style="background: #F8F9FF; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                  <p style="margin: 4px 0; font-size: 0.85rem; color: #9BA3C4;">Nomor Order</p>
                  <p style="margin: 0; font-weight: 700; color: #0D1B3E;">${contractLabel}</p>
                </div>
                <p style="color: #3D4F7C; margin-bottom: 24px; font-size: 0.9rem;">
                  Klik tombol di bawah untuk mengunduh kontrakmu. Tanda tangani dua rangkap bersama pihak lain,
                  tempelkan materai, dan kontrakmu resmi berlaku!
                </p>
                <a href="${downloadUrl}"
                   style="display: inline-block; background: #FF4D6D; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1rem;">
                  ⬇️ Download Kontrak
                </a>
                <p style="color: #9BA3C4; margin-top: 24px; font-size: 0.8rem;">
                  Jika tombol tidak bisa diklik, salin link ini ke browser:<br/>
                  <a href="${downloadUrl}" style="color: #FF4D6D;">${downloadUrl}</a>
                </p>
              </div>
              <p style="text-align: center; margin-top: 20px; font-size: 11px; color: #B8BDD6;">
                📜 LegalKan — Legal-kan sekarang.
              </p>
            </div>
          `,
        });

        emailSent = true;
        console.log(`[admin/resend] ✅ Email sent to ${customerEmail} for order ${orderId}`);

        // 6. Update status to delivered after successful email
        try {
          await supabase
            .from("orders")
            .update({ status: "delivered", email_sent_at: new Date().toISOString() })
            .eq("order_id", orderId);
        } catch (dbErr) {
          console.error("[admin/resend] Supabase delivered update error (non-fatal):", dbErr);
        }
      } catch (emailError) {
        console.error("[admin/resend] Email send error:", emailError);
        return NextResponse.json(
          { error: "Failed to send email", details: String(emailError) },
          { status: 500 }
        );
      }
    } else {
      console.warn("[admin/resend] RESEND_API_KEY not configured — email not sent");
    }

    return NextResponse.json({ success: true, emailSent, orderId, to: customerEmail });
  } catch (error) {
    console.error("[admin/resend] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
