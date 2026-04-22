import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, kontakEmail, intent, orderId, pesan } = body;

    if (!nama || !kontakEmail || !intent || !pesan) {
      return NextResponse.json(
        { error: "Semua field wajib wajib diisi" },
        { status: 400 }
      );
    }

    // Send email notification via Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'LegalKan <onboarding@resend.dev>',
        to: 'wahyu@karyaselaksamakna.com',
        subject: `📬 Pesan baru dari ${nama} — ${intent}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0D1B3E;">Pesan Baru — LegalKan</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Nama</td><td style="padding:8px;">${nama}</td></tr>
              <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Kontak</td><td style="padding:8px;">${kontakEmail}</td></tr>
              <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Topik</td><td style="padding:8px;">${intent}</td></tr>
              ${orderId ? `<tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Order ID</td><td style="padding:8px;">${orderId}</td></tr>` : ''}
              <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Pesan</td><td style="padding:8px;">${pesan}</td></tr>
            </table>
            <p style="color:#999; font-size:12px; margin-top:24px;">Dikirim dari form Hubungi Kami — legal-kan.com</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[contact] Email notification error (non-fatal):', emailErr);
    }

    // Log submission to console
    console.log("📬 [Contact Form Submission]", {
      timestamp: new Date().toISOString(),
      nama,
      kontakEmail,
      intent,
      orderId: orderId || null,
      pesan,
    });

    // Save to Supabase if configured
    if (supabase) {
      try {
        await supabase.from('contacts').insert({
          name: nama,
          contact: kontakEmail,
          intent,
          order_id: orderId || null,
          message: pesan,
          status: 'open',
        });
      } catch (dbErr) {
        console.error('[contact] Supabase insert error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Pesan berhasil diterima" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
