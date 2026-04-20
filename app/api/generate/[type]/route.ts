import { NextRequest, NextResponse } from "next/server";
import { generateContractNumber } from "@/lib/contracts/helpers";
import { supabase } from "@/lib/supabase";
import { generateHutangPiutangHTML, HutangPiutangData } from "@/lib/contracts/hutang-piutang";
import { generateFreelancerHTML, FreelancerData } from "@/lib/contracts/freelancer";
import { generateKonsinyasiHTML, KonsinyasiData } from "@/lib/contracts/konsinyasi";
import { generateBagiHasilHTML, BagiHasilData } from "@/lib/contracts/bagi-hasil";
import { generateSewaKendaraanHTML, SewaKendaraanData } from "@/lib/contracts/sewa-kendaraan";
import { generateJualBeliHTML, JualBeliData } from "@/lib/contracts/jual-beli";
import { generateEventOrganizerHTML, EventOrganizerData } from "@/lib/contracts/event-organizer";

const CONTRACT_META: Record<string, { title: string; summaryLabel: string }> = {
  "hutang-piutang": { title: "Perjanjian Hutang Piutang", summaryLabel: "Penerima Pinjaman" },
  "freelancer": { title: "Kontrak Jasa Freelancer", summaryLabel: "Freelancer" },
  "konsinyasi": { title: "Perjanjian Titip Jual (Konsinyasi)", summaryLabel: "Konsinyee" },
  "bagi-hasil": { title: "Perjanjian Bagi Hasil Usaha", summaryLabel: "Mitra Usaha" },
  "sewa-kendaraan": { title: "Perjanjian Sewa Kendaraan", summaryLabel: "Penyewa" },
  "jual-beli": { title: "Surat Perjanjian Jual Beli", summaryLabel: "Pembeli" },
  "event-organizer": { title: "Kontrak Event Organizer / Fotografer", summaryLabel: "Vendor" },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const body = await req.json();
    const { type } = params;

    if (!CONTRACT_META[type]) {
      return NextResponse.json({ error: `Tipe kontrak '${type}' tidak dikenali` }, { status: 400 });
    }

    const meta = CONTRACT_META[type];
    const nomorKontrak = generateContractNumber();
    const tanggalPembuatan = new Date().toISOString().split("T")[0];

    const baseData = {
      ...body,
      nomorKontrak,
      tanggalPembuatan,
      contractType: type,
      contractTitle: meta.title,
    };

    let contractHTML: string;

    switch (type) {
      case "hutang-piutang":
        contractHTML = generateHutangPiutangHTML(baseData as HutangPiutangData);
        break;
      case "freelancer":
        contractHTML = generateFreelancerHTML(baseData as FreelancerData);
        break;
      case "konsinyasi":
        contractHTML = generateKonsinyasiHTML(baseData as KonsinyasiData);
        break;
      case "bagi-hasil":
        contractHTML = generateBagiHasilHTML(baseData as BagiHasilData);
        break;
      case "sewa-kendaraan":
        contractHTML = generateSewaKendaraanHTML(baseData as SewaKendaraanData);
        break;
      case "jual-beli":
        contractHTML = generateJualBeliHTML(baseData as JualBeliData);
        break;
      case "event-organizer":
        contractHTML = generateEventOrganizerHTML(baseData as EventOrganizerData);
        break;
      default:
        return NextResponse.json({ error: "Tipe kontrak tidak valid" }, { status: 400 });
    }

    // Save order to Supabase (graceful fallback if not configured)
    if (supabase) {
      try {
        await supabase.from('orders').insert({
          order_id: baseData.nomorKontrak,
          contract_type: type,
          contract_title: meta.title,
          amount: Number(process.env.NEXT_PUBLIC_PRICE) || 29000,
          status: 'pending',
          customer_name: baseData.namaPihakKedua || baseData.namaDebitur || baseData.namaPenyewa || baseData.namaFreelancer || null,
          customer_email: baseData.emailPembeli || baseData.emailPenerima || null,
          customer_phone: baseData.nomorWhatsapp || null,
          pihak_pertama: baseData.namaPihakPertama || baseData.namaKreditur || null,
          pihak_kedua: baseData.namaPihakKedua || baseData.namaDebitur || null,
          contract_data: baseData,
        });
      } catch (dbErr) {
        // Non-fatal: log and continue
        console.error('[generate] Supabase insert error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      contractData: baseData,
      contractHTML,
    });
  } catch (error) {
    console.error("Error generating contract:", error);
    return NextResponse.json(
      { error: "Gagal membuat kontrak. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
