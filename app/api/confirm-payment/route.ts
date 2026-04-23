import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateContractHTML } from "@/lib/contract-template";
import { ContractData } from "@/types";
import { transferStore } from "@/lib/transfer-store";

function htmlPage(title: string, emoji: string, heading: string, body: string, color = "#06D6A0"): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — LegalKan</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8F9FF; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: white; border-radius: 20px; padding: 40px 32px; max-width: 480px; width: 100%; box-shadow: 0 4px 24px rgba(13,27,62,0.08); text-align: center; }
    .emoji { font-size: 3rem; margin-bottom: 16px; }
    h1 { color: #0D1B3E; font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; }
    p { color: #6B7FA8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 8px; }
    .brand { margin-top: 32px; font-size: 0.8rem; color: #B8BDD6; }
    .brand strong { color: ${color}; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${emoji}</div>
    <h1>${heading}</h1>
    ${body}
    <p class="brand">📜 <strong>LegalKan</strong> — Legal-kan sekarang.</p>
  </div>
</body>
</html>`,
    {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const orderId = searchParams.get("orderId");

  if (!token || !orderId) {
    return htmlPage(
      "Link Tidak Valid",
      "❌",
      "Link tidak valid",
      "<p>Parameter token atau orderId tidak ditemukan. Pastikan kamu membuka link yang benar dari email.</p>",
      "#FF4D6D"
    );
  }

  let contractDataRaw: Record<string, unknown> | null = null;
  let storedToken: string | null = null;
  let tokenExpiresAt: string | null = null;
  let tokenFoundInPaymentTokens = false;

  // Try payment_tokens table first (primary persistent store)
  if (supabase) {
    try {
      const { data: tokenRecord, error: tokenError } = await supabase
        .from("payment_tokens")
        .select("*")
        .eq("token", token)
        .eq("order_id", orderId)
        .single();

      if (!tokenError && tokenRecord) {
        // Check if already confirmed
        if (tokenRecord.status === "confirmed") {
          return htmlPage(
            "Sudah Dikonfirmasi",
            "✅",
            "Pembayaran sudah dikonfirmasi",
            "<p>Order ini sudah pernah dikonfirmasi sebelumnya. Dokumen sudah dikirim ke user.</p>"
          );
        }
        contractDataRaw = tokenRecord.contract_data as Record<string, unknown>;
        storedToken = tokenRecord.token as string;
        tokenExpiresAt = tokenRecord.expires_at as string;
        tokenFoundInPaymentTokens = true;
        console.log(`[confirm-payment] Token found in payment_tokens for order ${orderId}`);
      } else {
        // Legacy fallback: check orders table (for orders created before payment_tokens existed)
        console.log(`[confirm-payment] Token not in payment_tokens, trying orders table for ${orderId}`);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("order_id", orderId)
          .single();

        if (error || !data) {
          console.error("[confirm-payment] Supabase orders lookup error:", error);
        } else {
          contractDataRaw = data.contract_data as Record<string, unknown>;
          storedToken = contractDataRaw?.confirmationToken as string | null;
          tokenExpiresAt = contractDataRaw?.tokenExpiresAt as string | null;

          // Check if already used
          if (data.status === "paid" || data.status === "delivered") {
            return htmlPage(
              "Sudah Dikonfirmasi",
              "✅",
              "Pembayaran sudah dikonfirmasi",
              "<p>Order ini sudah pernah dikonfirmasi sebelumnya. Dokumen sudah dikirim ke user.</p>"
            );
          }
        }
      }
    } catch (dbErr) {
      console.error("[confirm-payment] Supabase error:", dbErr);
    }
  }

  // Fallback to in-memory store (dev/no-Supabase mode)
  if (!storedToken) {
    const memEntry = transferStore.get(orderId);
    if (memEntry) {
      contractDataRaw = {
        ...memEntry.paymentData.contractData as unknown as Record<string, unknown>,
        uniqueCode: memEntry.paymentData.uniqueCode,
        totalWithCode: memEntry.paymentData.totalWithCode,
        confirmationToken: memEntry.confirmationToken,
        tokenExpiresAt: memEntry.tokenExpiresAt,
      };
      storedToken = memEntry.confirmationToken;
      tokenExpiresAt = memEntry.tokenExpiresAt;
    }
  }

  if (!storedToken || !contractDataRaw) {
    return htmlPage(
      "Order Tidak Ditemukan",
      "🔍",
      "Order tidak ditemukan",
      `<p>Order <strong>${orderId}</strong> tidak ditemukan. Link mungkin sudah kadaluarsa atau tidak valid.</p>`,
      "#FF4D6D"
    );
  }

  // Verify token
  if (storedToken !== token) {
    return htmlPage(
      "Token Tidak Valid",
      "🚫",
      "Token tidak valid",
      "<p>Link konfirmasi tidak valid atau sudah digunakan. Hubungi admin jika ini kesalahan.</p>",
      "#FF4D6D"
    );
  }

  // Check token expiry
  if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
    return htmlPage(
      "Link Kadaluarsa",
      "⏰",
      "Link konfirmasi kadaluarsa",
      "<p>Link ini sudah kadaluarsa (berlaku 48 jam). Minta user untuk mengulang proses transfer.</p>",
      "#FFD166"
    );
  }

  // ── TOKEN VALID — Process payment confirmation ──
  const contractData = contractDataRaw as unknown as ContractData & Record<string, unknown>;

  // Mark token as confirmed and update order status
  if (supabase) {
    // Mark token as confirmed in payment_tokens (primary)
    if (tokenFoundInPaymentTokens) {
      try {
        await supabase
          .from("payment_tokens")
          .update({ status: "confirmed" })
          .eq("token", token);
        console.log(`[confirm-payment] Token marked confirmed in payment_tokens for order ${orderId}`);
      } catch (dbErr) {
        console.error("[confirm-payment] payment_tokens update error (non-fatal):", dbErr);
      }
    }

    // Update orders table status (and nullify legacy embedded token)
    try {
      await supabase
        .from("orders")
        .update({
          status: "paid",
          contract_data: {
            ...contractDataRaw,
            confirmationToken: null, // invalidate any legacy embedded token
            confirmedAt: new Date().toISOString(),
          },
        })
        .eq("order_id", orderId);
    } catch (dbErr) {
      console.error("[confirm-payment] Supabase orders update error (non-fatal):", dbErr);
    }
  }

  // Remove from memory store (one-time use)
  transferStore.delete(orderId);

  // Generate contract HTML
  let contractHTML = "";
  try {
    contractHTML = generateContractHTML(contractData);
  } catch (genErr) {
    console.error("[confirm-payment] Contract generation error (non-fatal):", genErr);
  }

  // Save contractHTML to Supabase so /unduh page can retrieve it
  if (supabase && contractHTML) {
    try {
      await supabase
        .from("orders")
        .update({
          status: "paid",
          contract_data: { ...contractDataRaw, contractHTML, confirmedAt: new Date().toISOString() },
        })
        .eq("order_id", orderId);
    } catch (dbErr) {
      console.error("[confirm-payment] Save contractHTML error (non-fatal):", dbErr);
    }
  }

  const userEmail = contractData.emailPembeli || (contractDataRaw.customer_email as string) || "";
  // userPhone kept for future WA re-activation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userPhone = contractData.nomorWhatsapp || (contractDataRaw.customer_phone as string) || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.legal-kan.com";

  // Send email to user
  const resendKey = process.env.RESEND_API_KEY;
  let emailSent = false;
  if (resendKey && resendKey !== "placeholder" && !resendKey.includes("placeholder") && userEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: process.env.EMAIL_FROM || "LegalKan <noreply@legal-kan.com>",
        to: userEmail,
        subject: `🎉 Kontrakmu sudah jadi! — ${contractData.nomorKontrak || orderId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #F8F9FF; padding: 32px;">
            <div style="text-align:center; margin-bottom: 24px;">
              <span style="font-size: 2rem; font-weight: 800; color: #FF4D6D;">Legal</span>
              <span style="font-size: 2rem; font-weight: 800; color: #0D1B3E;">Kan</span>
            </div>
            <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(13,27,62,0.07);">
              <h2 style="color: #0D1B3E; font-size: 1.4rem; margin-bottom: 8px;">🎉 Pembayaranmu terkonfirmasi!</h2>
              <p style="color: #6B7FA8; margin-bottom: 20px;">
                Hei ${contractData.namaPihakKedua || "kamu"}, pembayaranmu sudah kami verifikasi dan dokumen kontrakmu sudah siap!
              </p>
              <div style="background: #F8F9FF; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 4px 0; font-size: 0.85rem; color: #9BA3C4;">Nomor Kontrak</p>
                <p style="margin: 0; font-weight: 700; color: #0D1B3E;">${contractData.nomorKontrak || orderId}</p>
              </div>
              <p style="color: #3D4F7C; margin-bottom: 24px; font-size: 0.9rem;">
                Klik tombol di bawah untuk mengunduh kontrakmu. Tanda tangani dua rangkap, tempelkan materai, dan kontrakmu resmi berlaku!
              </p>
              <a href="${baseUrl}/unduh?orderId=${orderId}"
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

      emailSent = true;
      console.log(`[confirm-payment] Email sent to user ${userEmail} for order ${orderId}`);
    } catch (emailError) {
      console.error("[confirm-payment] User email error (non-fatal):", emailError);
    }
  }

  // Update Supabase to delivered
  if (supabase && emailSent) {
    try {
      await supabase
        .from("orders")
        .update({ status: "delivered", email_sent_at: new Date().toISOString() })
        .eq("order_id", orderId);
    } catch (dbErr) {
      console.error("[confirm-payment] Supabase delivered update error (non-fatal):", dbErr);
    }
  }

  // WhatsApp sending disabled — email only
  // (WA code kept below for future re-activation)
  // if (userPhone) {
  //   try {
  //     const waModule = await import("@/lib/whatsapp");
  //     const { sendPDF, getWhatsAppClient } = waModule;
  //     const client = getWhatsAppClient();
  //     if (client && contractHTML) {
  //       const pdfRes = await fetch(`${baseUrl}/api/pdf`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ html: contractHTML }),
  //       });
  //       if (pdfRes.ok) {
  //         const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
  //         const filename = `kontrak-${(contractData.nomorKontrak || orderId).replace(/[^a-zA-Z0-9-]/g, "_")}.pdf`;
  //         await sendPDF(userPhone, pdfBuffer, filename,
  //           `🎉 Hei! Pembayaranmu sudah terkonfirmasi.\n\nBerikut dokumen kontrakmu dari LegalKan. Tanda tangani dua rangkap bersama pihak lain ya!\n\n📜 LegalKan — Legal-kan sekarang.`
  //         );
  //       }
  //     }
  //   } catch (waError) {
  //     console.error("[confirm-payment] WhatsApp error (non-fatal):", waError);
  //   }
  // }

  return htmlPage(
    "Pembayaran Dikonfirmasi",
    "✅",
    "Pembayaran dikonfirmasi!",
    `<p>Dokumen sudah dikirim ke user melalui email.</p>
     <p style="margin-top: 8px; font-size: 0.8rem; color: #B8BDD6;">Order: ${orderId}</p>`
  );
}
