import { NextRequest, NextResponse } from "next/server";
import { generatePKWTT, generatePKWTTNumber, PKWTTData } from "@/lib/contracts/pkwtt";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const required: (keyof PKWTTData)[] = [
      "namaPerusahaan",
      "bidangUsaha",
      "alamatPerusahaan",
      "namaRepresentatif",
      "jabatanRepresentatif",
      "namaKaryawan",
      "tempatLahir",
      "tanggalLahir",
      "jenisKelamin",
      "nikKTP",
      "alamatKaryawan",
      "pendidikanTerakhir",
      "namaJabatan",
      "divisi",
      "lokasiKerja",
      "tanggalMulaiKerja",
      "polakKerja",
      "jadwalKerja",
      "upahPokok",
      "tanggalPembayaran",
      "durasiNonCompete",
      "kota",
      "tanggalPerjanjian",
    ];

    for (const field of required) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    if (!body.emailPembeli?.includes("@")) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const nomorPKWTT = generatePKWTTNumber();

    const pkwttData: PKWTTData = {
      namaPerusahaan: body.namaPerusahaan,
      bidangUsaha: body.bidangUsaha,
      alamatPerusahaan: body.alamatPerusahaan,
      namaRepresentatif: body.namaRepresentatif,
      jabatanRepresentatif: body.jabatanRepresentatif,
      namaKaryawan: body.namaKaryawan,
      tempatLahir: body.tempatLahir,
      tanggalLahir: body.tanggalLahir,
      jenisKelamin: body.jenisKelamin,
      nikKTP: body.nikKTP,
      alamatKaryawan: body.alamatKaryawan,
      pendidikanTerakhir: body.pendidikanTerakhir,
      nomorTelepon: body.nomorTelepon || "",
      namaJabatan: body.namaJabatan,
      divisi: body.divisi,
      lokasiKerja: body.lokasiKerja,
      tanggalMulaiKerja: body.tanggalMulaiKerja,
      polakKerja: body.polakKerja,
      jadwalKerja: body.jadwalKerja,
      upahPokok: Number(body.upahPokok),
      tunjanganTetap: Number(body.tunjanganTetap) || 0,
      tanggalPembayaran: body.tanggalPembayaran,
      durasiNonCompete: body.durasiNonCompete,
      kota: body.kota,
      tanggalPerjanjian: body.tanggalPerjanjian,
      saksi1Nama: body.saksi1Nama || undefined,
      saksi2Nama: body.saksi2Nama || undefined,
      nomorPKWTT,
    };

    const contractHTML = generatePKWTT(pkwttData);

    const contractData = {
      ...pkwttData,
      contractType: "pkwtt",
      contractTitle: "Perjanjian Kerja Waktu Tidak Tertentu (PKWTT)",
      nomorKontrak: nomorPKWTT,
      tanggalPembuatan: new Date().toISOString().split("T")[0],
      emailPembeli: body.emailPembeli,
      nomorWhatsapp: body.nomorWhatsapp || undefined,
    };

    // Save to Supabase (graceful fallback)
    if (supabase) {
      try {
        await supabase.from("orders").insert({
          order_id: nomorPKWTT,
          contract_type: "pkwtt",
          contract_title: "Perjanjian Kerja Waktu Tidak Tertentu (PKWTT)",
          amount: 49000,
          status: "pending",
          customer_name: body.namaRepresentatif || null,
          customer_email: body.emailPembeli || null,
          customer_phone: body.nomorWhatsapp || null,
          pihak_pertama: body.namaPerusahaan,
          pihak_kedua: body.namaKaryawan,
          contract_data: contractData,
        });
      } catch (dbErr) {
        console.error("[generate/pkwtt] Supabase insert error (non-fatal):", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      contractData,
      contractHTML,
    });
  } catch (error) {
    console.error("Error generating PKWTT:", error);
    return NextResponse.json(
      { error: "Gagal membuat PKWTT. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
