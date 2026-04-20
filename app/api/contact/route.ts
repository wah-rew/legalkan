import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
