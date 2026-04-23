import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface LeadBody {
  orderId: string;
  namaUsaha: string;
  jenisUsaha: string;
  kotaUsaha: string;
  omzetPerBulan: string;
  jumlahKaryawan: string;
  punyaNIB: boolean;
  namaOwner: string;
  kontakEmail?: string;
  kontakTelepon?: string;
  leadSource: "kur_wizard_lendana";
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadBody = await req.json();

    const {
      orderId,
      namaUsaha,
      jenisUsaha,
      kotaUsaha,
      omzetPerBulan,
      jumlahKaryawan,
      punyaNIB,
      namaOwner,
      kontakEmail,
      kontakTelepon,
      leadSource,
      timestamp,
    } = body;

    if (!namaUsaha || !namaOwner) {
      return NextResponse.json({ error: "Data lead tidak lengkap" }, { status: 400 });
    }

    console.log("📥 [Lead Received]", { namaUsaha, kotaUsaha, namaOwner, leadSource });

    // 1. Save to Supabase leads table
    if (supabase) {
      try {
        const { error: dbError } = await supabase.from("leads").insert({
          order_id: orderId || null,
          nama_usaha: namaUsaha,
          jenis_usaha: jenisUsaha,
          kota_usaha: kotaUsaha,
          omzet_per_bulan: omzetPerBulan,
          jumlah_karyawan: jumlahKaryawan,
          punya_nib: punyaNIB,
          nama_owner: namaOwner,
          kontak_email: kontakEmail || null,
          kontak_telepon: kontakTelepon || null,
          lead_source: leadSource || "kur_wizard_lendana",
          status: "new",
          created_at: timestamp || new Date().toISOString(),
        });
        if (dbError) {
          console.error("[leads] Supabase insert error:", dbError);
        }
      } catch (dbErr) {
        console.error("[leads] Supabase error (non-fatal):", dbErr);
      }
    } else {
      console.warn("[leads] Supabase not configured — lead not persisted to DB");
    }

    // 2. Send email notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "placeholder") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        const omzetLabel: Record<string, string> = {
          "<5jt": "< Rp 5 juta",
          "5-20jt": "Rp 5–20 juta",
          "20-50jt": "Rp 20–50 juta",
          ">50jt": "> Rp 50 juta",
        };
        const karyawanLabel: Record<string, string> = {
          "0": "Tidak ada (solo)",
          "1-5": "1–5 orang",
          "6-20": "6–20 orang",
          ">20": "> 20 orang",
        };

        await resend.emails.send({
          from: "SuratSewa <noreply@suratsewa.com>",
          to: ["wahyu@karyaselaksamakna.com"],
          subject: `🏦 Lead KUR Baru: ${namaUsaha} (${kotaUsaha})`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #0D1B3E; margin-bottom: 4px;">Lead KUR Baru 🏦</h2>
              <p style="color: #6B7FA8; margin-top: 0;">Dari wizard KUR SuratSewa — tertarik dibantu proses pengajuan</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
                <tr style="background: #F8F9FF;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E; width: 40%;">Nama Usaha</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${namaUsaha}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Jenis Usaha</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${jenisUsaha || "-"}</td>
                </tr>
                <tr style="background: #F8F9FF;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Kota</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${kotaUsaha}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Omzet / Bulan</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${omzetLabel[omzetPerBulan] || omzetPerBulan}</td>
                </tr>
                <tr style="background: #F8F9FF;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Jumlah Karyawan</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${karyawanLabel[jumlahKaryawan] || jumlahKaryawan}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Punya NIB</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${punyaNIB ? "✅ Ya" : "❌ Belum"}</td>
                </tr>
                <tr style="background: #F8F9FF;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Nama Pemilik</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${namaOwner}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Email</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${kontakEmail ? `<a href="mailto:${kontakEmail}">${kontakEmail}</a>` : "-"}</td>
                </tr>
                <tr style="background: #F8F9FF;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">WhatsApp</td>
                  <td style="padding: 12px 16px; color: #3D4F7C;">${kontakTelepon ? `<a href="https://wa.me/${kontakTelepon.replace(/\D/g, "")}">${kontakTelepon}</a>` : "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #0D1B3E;">Order ID</td>
                  <td style="padding: 12px 16px; color: #9BA3C4; font-family: monospace;">${orderId || "-"}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding: 16px; background: rgba(155,138,251,0.08); border-radius: 12px; border: 1px solid rgba(155,138,251,0.3);">
                <p style="margin: 0; font-size: 13px; color: #4B3FAF; font-weight: 600;">
                  📋 Pantau semua lead di: <a href="https://suratsewa.com/admin/leads" style="color: #FF4D6D;">suratsewa.com/admin/leads</a>
                </p>
              </div>

              <p style="margin-top: 24px; font-size: 12px; color: #9BA3C4;">
                Dikirim otomatis dari SuratSewa KUR Wizard · ${new Date(timestamp).toLocaleString("id-ID")}
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("[leads] Email notification error (non-fatal):", emailErr);
      }
    } else {
      console.warn("[leads] Resend not configured — email notification skipped");
    }

    return NextResponse.json({ success: true, message: "Lead berhasil disimpan" });
  } catch (error) {
    console.error("[leads] Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan lead. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

// GET /api/leads — list leads (for admin dashboard)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!supabase) {
      return NextResponse.json({ leads: [], total: 0, isDemo: true });
    }

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ leads: data || [], total: data?.length || 0 });
  } catch (error) {
    console.error("[leads] GET error:", error);
    return NextResponse.json({ error: "Gagal memuat leads" }, { status: 500 });
  }
}

// PATCH /api/leads — update lead status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id dan status wajib diisi" }, { status: 400 });
    }

    const validStatuses = ["new", "contacted", "qualified", "converted", "lost"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi" }, { status: 503 });
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "contacted") updateData.contacted_at = new Date().toISOString();
    if (status === "converted") updateData.converted_at = new Date().toISOString();

    const { error } = await supabase.from("leads").update(updateData).eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[leads] PATCH error:", error);
    return NextResponse.json({ error: "Gagal mengupdate lead" }, { status: 500 });
  }
}
