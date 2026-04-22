import { NextRequest, NextResponse } from "next/server";
import { generateNDA, generateNDANumber, NDAFormData } from "@/lib/contracts/nda";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const required: (keyof NDAFormData)[] = [
      "namaPerusahaan1",
      "alamat1",
      "npwp1",
      "namaRepresentatif1",
      "posisiRepresentatif1",
      "namaPerusahaan2",
      "alamat2",
      "npwp2",
      "namaRepresentatif2",
      "posisiRepresentatif2",
      "tujuanKerjasama",
      "tanggalEfektif",
      "tanggalBerakhir",
      "emailPembeli",
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    const nomorPerjanjian = generateNDANumber();
    const tanggalPerjanjian = new Date().toISOString().split("T")[0];

    const ndaData: NDAFormData = {
      ...body,
      nomorPerjanjian,
      tanggalPerjanjian,
      durasiKerahasiaan: body.durasiKerahasiaan || "2 (dua) tahun",
      tanggalTtdPihak1: body.tanggalTtdPihak1 || tanggalPerjanjian,
      tanggalTtdPihak2: body.tanggalTtdPihak2 || tanggalPerjanjian,
    };

    const contractHTML = generateNDA(ndaData);

    const contractData = {
      ...ndaData,
      contractType: "nda",
      contractTitle: "Perjanjian Kerahasiaan (NDA) Bilateral",
      nomorKontrak: nomorPerjanjian,
      tanggalPembuatan: tanggalPerjanjian,
    };

    // Save to Supabase (graceful fallback if not configured)
    if (supabase) {
      try {
        await supabase.from("orders").insert({
          order_id: nomorPerjanjian,
          contract_type: "nda",
          contract_title: "Perjanjian Kerahasiaan (NDA) Bilateral",
          amount: 49000,
          status: "pending",
          customer_name: ndaData.namaRepresentatif1 || null,
          customer_email: ndaData.emailPembeli || null,
          customer_phone: ndaData.nomorWhatsapp || null,
          pihak_pertama: `${ndaData.bentukBadanHukum1} ${ndaData.namaPerusahaan1}`,
          pihak_kedua: `${ndaData.bentukBadanHukum2} ${ndaData.namaPerusahaan2}`,
          contract_data: contractData,
        });
      } catch (dbErr) {
        console.error("[generate/nda] Supabase insert error (non-fatal):", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      contractData,
      contractHTML,
    });
  } catch (error) {
    console.error("Error generating NDA:", error);
    return NextResponse.json(
      { error: "Gagal membuat NDA. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
