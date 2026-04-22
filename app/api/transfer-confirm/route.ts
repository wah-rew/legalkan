import { NextRequest, NextResponse } from "next/server";
import { PaymentData } from "@/types";
import { supabase } from "@/lib/supabase";
import { transferStore } from "@/lib/transfer-store";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body: { orderId: string; paymentData: PaymentData } = await req.json();
    const { orderId, paymentData } = body;

    if (!orderId || !paymentData) {
      return NextResponse.json({ error: "orderId dan paymentData wajib diisi" }, { status: 400 });
    }

    // Generate secure one-time confirmation token (32-char hex)
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const contractData = paymentData.contractData as unknown as Record<string, unknown>;
    const contractType = (contractData?.contractType as string) || "unknown";
    const userEmail = contractData?.emailPembeli as string || "";
    const userPhone = contractData?.nomorWhatsapp as string || "";
    const userName = contractData?.namaPihakKedua as string || "";
    const uniqueCode = paymentData.uniqueCode ?? 0;
    const totalWithCode = paymentData.totalWithCode ?? paymentData.amount;

    // Persist order to Supabase (upsert)
    if (supabase) {
      try {
        await supabase.from("orders").upsert({
          order_id: orderId,
          contract_type: contractType,
          amount: totalWithCode,
          status: "pending_verification",
          customer_email: userEmail,
          customer_phone: userPhone,
          customer_name: userName,
          contract_data: {
            ...paymentData.contractData,
            uniqueCode,
            totalWithCode,
            confirmationToken,
            tokenExpiresAt,
            baseAmount: paymentData.amount,
          },
        }, { onConflict: "order_id" });
      } catch (dbErr) {
        console.error("[transfer-confirm] Supabase upsert error (non-fatal):", dbErr);
      }
    } else {
      // Fallback: store in memory (dev only)
      transferStore.set(orderId, {
        paymentData,
        confirmationToken,
        tokenExpiresAt,
        contractType,
      });
    }

    // Send notification email to owner
    const ownerEmail = process.env.OWNER_EMAIL || "finance@karyaselaksamakna.com";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.legal-kan.com";
    const confirmUrl = `${baseUrl}/api/confirm-payment?token=${confirmationToken}&orderId=${orderId}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "placeholder" && !resendKey.includes("placeholder")) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "LegalKan <noreply@legal-kan.com>",
          to: ownerEmail,
          subject: `💰 Transfer masuk — ${orderId} perlu dikonfirmasi`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #F8F9FF; padding: 32px;">
              <div style="text-align:center; margin-bottom: 24px;">
                <span style="font-size: 2rem; font-weight: 800; color: #FF4D6D;">Legal</span>
                <span style="font-size: 2rem; font-weight: 800; color: #0D1B3E;">Kan</span>
              </div>
              <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(13,27,62,0.07);">
                <h2 style="color: #0D1B3E; font-size: 1.4rem; margin-bottom: 8px;">💰 Ada Transfer Masuk!</h2>
                <p style="color: #6B7FA8; margin-bottom: 20px;">Transfer berikut perlu dikonfirmasi:</p>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr style="border-bottom: 1px solid #F0F2FA;">
                    <td style="padding: 10px 0; color: #9BA3C4; font-size: 0.85rem; width: 40%;">Order ID</td>
                    <td style="padding: 10px 0; color: #0D1B3E; font-weight: 600; font-family: monospace;">${orderId}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2FA;">
                    <td style="padding: 10px 0; color: #9BA3C4; font-size: 0.85rem;">Kontrak</td>
                    <td style="padding: 10px 0; color: #0D1B3E; font-weight: 600;">${contractType}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2FA;">
                    <td style="padding: 10px 0; color: #9BA3C4; font-size: 0.85rem;">Nominal</td>
                    <td style="padding: 10px 0; color: #FF4D6D; font-weight: 700; font-size: 1.1rem;">
                      Rp ${totalWithCode.toLocaleString("id-ID")}
                      <span style="color: #9BA3C4; font-size: 0.8rem; font-weight: 400;"> (kode unik: ${uniqueCode})</span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2FA;">
                    <td style="padding: 10px 0; color: #9BA3C4; font-size: 0.85rem;">Email user</td>
                    <td style="padding: 10px 0; color: #0D1B3E; font-weight: 600;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9BA3C4; font-size: 0.85rem;">WA user</td>
                    <td style="padding: 10px 0; color: #0D1B3E; font-weight: 600;">${userPhone || "-"}</td>
                  </tr>
                </table>

                <p style="color: #6B7FA8; font-size: 0.85rem; margin-bottom: 20px;">
                  Cek mutasi rekening, pastikan transfer sebesar <strong>Rp ${totalWithCode.toLocaleString("id-ID")}</strong> sudah masuk, lalu klik tombol di bawah untuk konfirmasi:
                </p>

                <a href="${confirmUrl}"
                   style="display: block; text-align: center; background: #06D6A0; color: white; padding: 16px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1rem; margin-bottom: 12px;">
                  ✅ KONFIRMASI PEMBAYARAN →
                </a>

                <p style="text-align: center; font-size: 0.75rem; color: #B8BDD6;">
                  Link berlaku 48 jam. Hanya gunakan satu kali.
                </p>
              </div>
              <p style="text-align: center; margin-top: 20px; font-size: 11px; color: #B8BDD6;">
                📜 LegalKan — Legal-kan sekarang.
              </p>
            </div>
          `,
        });

        console.log(`[transfer-confirm] Owner notification sent to ${ownerEmail} for order ${orderId}`);
      } catch (emailError) {
        console.error("[transfer-confirm] Email error (non-fatal):", emailError);
      }
    } else {
      console.log(`[transfer-confirm] No Resend key — skipping owner email. Confirm URL: ${confirmUrl}`);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Notifikasi transfer diterima! Tim kami akan memverifikasi dalam 1×24 jam.",
    });
  } catch (error) {
    console.error("[transfer-confirm] Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses konfirmasi. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
