import { NextRequest, NextResponse } from "next/server";
import { PaymentData } from "@/types";
import { generateContractHTML } from "@/lib/contract-template";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body: { paymentData: PaymentData } = await req.json();
    const { paymentData } = body;

    if (!paymentData) {
      return NextResponse.json({ error: "Data pembayaran tidak valid" }, { status: 400 });
    }

    // In production: verify payment with Xendit before proceeding
    // For MVP, we trust the user's confirmation (mock flow)

    // Update order status to paid in Supabase
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('order_id', paymentData.orderId);
      } catch (dbErr) {
        console.error('[confirm] Supabase update error (non-fatal):', dbErr);
      }
    }

    // Generate the contract HTML
    const contractHTML = generateContractHTML(paymentData.contractData);

    // Send email with PDF (placeholder - needs real Resend key)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "placeholder") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@legal-kan.com",
          to: paymentData.contractData.emailPembeli,
          subject: `Kontrakmu sudah jadi! — ${paymentData.contractData.nomorKontrak}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #F8F9FF; padding: 32px;">
              <div style="text-align:center; margin-bottom: 24px;">
                <span style="font-size: 2rem; font-weight: 800; color: #FF4D6D;">Legal</span>
                <span style="font-size: 2rem; font-weight: 800; color: #0D1B3E;">Kan</span>
              </div>
              <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(13,27,62,0.07);">
                <h2 style="color: #0D1B3E; font-size: 1.4rem; margin-bottom: 8px;">🎉 Kontrakmu sudah jadi!</h2>
                <p style="color: #6B7FA8; margin-bottom: 20px;">Hei ${paymentData.contractData.namaPihakKedua}, pembayaranmu sudah terkonfirmasi.</p>
                <div style="background: #F8F9FF; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                  <p style="margin: 4px 0; font-size: 0.85rem; color: #9BA3C4;">Nomor Kontrak</p>
                  <p style="margin: 0; font-weight: 700; color: #0D1B3E;">${paymentData.contractData.nomorKontrak}</p>
                </div>
                <p style="color: #3D4F7C; margin-bottom: 24px; font-size: 0.9rem;">
                  Klik tombol di bawah untuk mengunduh kontrakmu. Tanda tangani dua rangkap bersama landlord, tempelkan materai, dan kontrakmu resmi berlaku!
                </p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/sukses?orderId=${paymentData.orderId}"
                   style="display: inline-block; background: #FF4D6D; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700;">
                  ⬇️ Download Kontrak
                </a>
              </div>
              <p style="text-align: center; margin-top: 20px; font-size: 11px; color: #B8BDD6;">
                📜 LegalKan — Legal-kan sekarang.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Email error (non-fatal):", emailError);
        // Don't fail the whole request if email fails
      }
    }

    // Update order status to delivered in Supabase
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'delivered', email_sent_at: new Date().toISOString() })
          .eq('order_id', paymentData.orderId);
      } catch (dbErr) {
        console.error('[confirm] Supabase delivered update error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: paymentData.orderId,
      contractHTML,
      contractData: paymentData.contractData,
    });
  } catch (error) {
    console.error("Confirm error:", error);
    return NextResponse.json(
      { error: "Gagal mengkonfirmasi pembayaran. Silakan hubungi support." },
      { status: 500 }
    );
  }
}
