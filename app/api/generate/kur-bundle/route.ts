import { NextRequest, NextResponse } from "next/server";
import { generateContractNumber } from "@/lib/contracts/helpers";
import { supabase } from "@/lib/supabase";
import { generateSuratKeteranganUsahaHTML, SuratKeteranganUsahaData } from "@/lib/contracts/surat-keterangan-usaha";
import { generatePernyataanUsahaAktifHTML, PernyataanUsahaAktifData } from "@/lib/contracts/pernyataan-usaha-aktif";
import { generateSuratKuasaHTML, SuratKuasaData } from "@/lib/contracts/surat-kuasa";
import { generatePKWTHTML, PKWTData } from "@/lib/contracts/pkwt";
import { generateBagiHasilHTML } from "@/lib/contracts/bagi-hasil";
import { generateHutangPiutangHTML } from "@/lib/contracts/hutang-piutang";

// ── Step 5 Details ────────────────────────────────────────────────────────────
export interface Step5DocDetails {
  namaLengkapPemilik?: string;
  nikPemilik?: string;
  alamatLengkap?: string;
  tanggalLahirPemilik?: string;
  karyawan?: Array<{
    namaKaryawan: string;
    nikKaryawan: string;
    jabatan: string;
    gajiPokok: number;
    durasiKontrak: string; // "6 bulan" | "12 bulan" | "24 bulan" | "Sesuai kesepakatan"
    // NEW: extended PKWT fields
    teleponKaryawan?: string;
    emailKaryawan?: string;
    ruangLingkup?: string;
    namaBankKaryawan?: string;
    nomorRekeningKaryawan?: string;
    atasNamaRekeningKaryawan?: string;
  }>;
  namaMitra?: string;
  nikMitra?: string;
  porsiPemilik?: number;
  namaPemberiPinjaman?: string;
  nikPemberiPinjaman?: string;
  jumlahPinjaman?: number;
  bungaPerTahun?: number;
  jangkaWaktu?: number; // months
  namaPemberKuasa?: string;
  namaPenerimaKuasa?: string;
  nikPenerimaKuasa?: string;
  keperluanKuasa?: string;
  // SKU (Surat Keterangan Usaha) RT/Lurah fields
  namaUsahaSKU?: string;
  jenisUsahaSKU?: string;
  lamaUsahaSKU?: string;
  nomorRT?: string;
  nomorRW?: string;
  kelurahan?: string;
  kecamatan?: string;
  kodePos?: string;
  kotaSKU?: string;
  provinsi?: string;
  namaKetuaRT?: string;
  namaKetuaRW?: string;
  namaLurah?: string;
}

export interface KURWizardData {
  // Step 1: Profil Usaha
  namaUsaha: string;
  bentukUsaha: "Perorangan" | "CV" | "PT" | "UD" | "Koperasi";
  bidangUsaha: string;
  lamaUsaha: "<6bln" | "6-12bln" | "1-2thn" | ">2thn";
  alamatUsaha: string;
  kotaUsaha: string;
  // Step 2: Skala Usaha
  jumlahKaryawan: "0" | "1-5" | "6-20" | ">20";
  omzetPerBulan: "<5jt" | "5-20jt" | "20-50jt" | ">50jt";
  modalBerasalDari: "Sendiri" | "Keluarga/Teman" | "Investor" | "Campuran";
  punyaNIB: boolean;
  adaAgunan: boolean;
  // Step 3: Struktur Usaha
  adaKaryawanTetap: boolean;
  adaMitra: boolean;
  jumlahMitra: number;
  adaPinjamanLuar: boolean;
  pernahApplyKUR: boolean;
  // Contact
  namaPemilik: string;
  emailPembeli: string;
  nomorWhatsapp?: string;
  // Step 4 selections
  pkwtCount?: number;        // override for PKWT count
  skippedDocIds?: string[];  // doc IDs to skip
  // Step 5 details
  docDetails?: Step5DocDetails;
}

export interface KURBundleDocument {
  id: string;
  title: string;
  description: string;
  html: string;
  nomorKontrak: string;
}

export interface KURBundleResult {
  documents: KURBundleDocument[];
  totalPrice: number;
  separatePrice: number;
  savingsPercent: number;
  contractData: {
    nomorKontrak: string;
    namaUsaha: string;
    emailPembeli: string;
    nomorWhatsapp?: string;
    contractType: string;
    contractTitle: string;
    tanggalPembuatan: string;
    namaPihakPertama: string;
    namaPihakKedua: string;
    alamatProperti: string;
    hargaSewa: number;
    durasiSewa: number;
    tanggalMulai: string;
    tanggalBerakhir: string;
  };
}

const LAMA_USAHA_MAP: Record<string, string> = {
  "<6bln": "kurang dari 6 bulan",
  "6-12bln": "6–12 bulan",
  "1-2thn": "1–2 tahun",
  ">2thn": "lebih dari 2 tahun",
};

function calcPrice(docCount: number): number {
  if (docCount === 0) return 0;
  if (docCount <= 2) return 59000;
  return Math.min(59000 + (docCount - 2) * 25000, 199000);
}

function calcSeparatePrice(docCount: number): number {
  return docCount * 39000;
}

// Duration in months → end date string
function durationToEndDate(startDate: string, durasiKontrak: string): string {
  const months: Record<string, number> = {
    "6 bulan": 6, "12 bulan": 12, "24 bulan": 24, "Sesuai kesepakatan": 12,
  };
  const m = months[durasiKontrak] ?? 12;
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + m);
  return d.toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  try {
    const wizard: KURWizardData = await req.json();
    const tanggalPembuatan = new Date().toISOString().split("T")[0];
    const details = wizard.docDetails || {};
    const skipped = new Set(wizard.skippedDocIds || []);

    // ── Resolved owner data (Step 5 first, fallback to wizard) ───────────────
    const namaPemilik = details.namaLengkapPemilik || wizard.namaPemilik || wizard.namaUsaha;
    const nikPemilik = details.nikPemilik || "___________________";
    const alamatPemilik = details.alamatLengkap || `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`;

    const baseData = {
      emailPembeli: wizard.emailPembeli,
      nomorWhatsapp: wizard.nomorWhatsapp,
      tanggalPembuatan,
      contractType: "kur-bundle",
      contractTitle: "Paket KUR-Ready",
      nama_pemilik: namaPemilik,
      nik_pemilik: nikPemilik,
      alamat_pemilik: alamatPemilik,
      nama_usaha: wizard.namaUsaha,
      jenis_usaha: wizard.bentukUsaha,
      bidang_usaha: wizard.bidangUsaha,
      alamat_usaha: wizard.alamatUsaha,
      kota_usaha: wizard.kotaUsaha,
      lama_usaha: LAMA_USAHA_MAP[wizard.lamaUsaha] || wizard.lamaUsaha,
      tanggal_surat: tanggalPembuatan,
      kota_penandatanganan: wizard.kotaUsaha,
    };

    const docs: KURBundleDocument[] = [];

    // ── 1. Surat Pernyataan Usaha Aktif (ALWAYS unless skipped) ──────────────
    if (!skipped.has("pernyataan-usaha-aktif")) {
      const nomorKontrak = generateContractNumber();
      docs.push({
        id: "pernyataan-usaha-aktif",
        title: "Surat Pernyataan Usaha Aktif",
        description: "Deklarasi bahwa usahamu sedang aktif beroperasi, tidak dalam gagal bayar, dan patuh hukum.",
        html: generatePernyataanUsahaAktifHTML({
          ...baseData,
          nomorKontrak,
          contractTitle: "Surat Pernyataan Usaha Aktif",
        } as PernyataanUsahaAktifData),
        nomorKontrak,
      });
    }

    // ── 2. Surat Keterangan Usaha (ALWAYS unless skipped) ────────────────────
    if (!skipped.has("surat-keterangan-usaha")) {
      const nomorKontrak = generateContractNumber();
      const skuLamaUsaha = details.lamaUsahaSKU
        || (wizard.lamaUsaha === "<6bln" ? "< 1"
          : wizard.lamaUsaha === "6-12bln" ? "1"
          : wizard.lamaUsaha === "1-2thn" ? "2"
          : wizard.lamaUsaha === ">2thn" ? "3"
          : "1");
      docs.push({
        id: "surat-keterangan-usaha",
        title: "Surat Keterangan Usaha",
        description: "Dokumen formal yang menerangkan keberadaan, jenis, dan alamat usahamu untuk keperluan bank.",
        html: generateSuratKeteranganUsahaHTML({
          namaUsaha: details.namaUsahaSKU || wizard.namaUsaha,
          jenisUsaha: details.jenisUsahaSKU || wizard.bidangUsaha,
          alamatUsaha: wizard.alamatUsaha,
          lamaUsaha: skuLamaUsaha,
          namaPemilik,
          nikPemilik,
          nomorRT: details.nomorRT || "",
          nomorRW: details.nomorRW || "",
          kelurahan: details.kelurahan || "",
          kecamatan: details.kecamatan || "",
          kodePos: details.kodePos || "",
          kota: details.kotaSKU || wizard.kotaUsaha,
          provinsi: details.provinsi || "",
          namaKetuaRT: details.namaKetuaRT || "",
          namaKetuaRW: details.namaKetuaRW || "",
          namaLurah: details.namaLurah || "",
          nomorSurat: nomorKontrak,
          tanggalSurat: tanggalPembuatan,
          emailPembeli: wizard.emailPembeli,
          nomorWhatsapp: wizard.nomorWhatsapp,
          nomorKontrak,
          tanggalPembuatan,
          contractType: "kur-bundle",
          contractTitle: "Surat Keterangan Usaha",
        } as SuratKeteranganUsahaData),
        nomorKontrak,
      });
    }

    // ── 3. PKWT (if has employees and not skipped) ────────────────────────────
    const hasKaryawan = wizard.jumlahKaryawan !== "0" || wizard.adaKaryawanTetap;
    if (hasKaryawan && !skipped.has("pkwt")) {
      // Determine count: use explicit pkwtCount override, else compute from jumlahKaryawan
      let numPKWT = wizard.pkwtCount;
      if (numPKWT == null) {
        if (wizard.jumlahKaryawan === "1-5") numPKWT = 3;
        else if (wizard.jumlahKaryawan === "6-20" || wizard.jumlahKaryawan === ">20") numPKWT = 5;
        else numPKWT = 1;
      }
      numPKWT = Math.min(Math.max(1, numPKWT), 5);

      for (let i = 0; i < numPKWT; i++) {
        const emp = details.karyawan?.[i];
        const nomorKontrak = generateContractNumber();
        const tanggalBerakhir = durationToEndDate(tanggalPembuatan, emp?.durasiKontrak || "12 bulan");

        const pkwtData: PKWTData = {
          nama_perusahaan: wizard.namaUsaha,
          jenis_perusahaan: wizard.bentukUsaha,
          alamat_perusahaan: wizard.alamatUsaha,
          kota_perusahaan: wizard.kotaUsaha,
          nama_pimpinan: namaPemilik,
          jabatan_pimpinan: wizard.bentukUsaha === "PT" ? "Direktur" : "Pemilik",
          nama_karyawan: emp?.namaKaryawan || `[Nama Karyawan ${i + 1}]`,
          nik_karyawan: emp?.nikKaryawan || "___________________",
          alamat_karyawan: "___________________",
          posisi_jabatan: emp?.jabatan || `[Posisi Karyawan ${i + 1}]`,
          ruang_lingkup_pekerjaan: emp?.ruangLingkup || undefined,
          lokasi_kerja: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
          tanggal_mulai: tanggalPembuatan,
          tanggal_berakhir: tanggalBerakhir,
          gaji_pokok: emp?.gajiPokok || 0,
          cara_pembayaran_gaji: emp?.nomorRekeningKaryawan ? "transfer_bank" : "tunai",
          nama_bank_karyawan: emp?.namaBankKaryawan || undefined,
          nomor_rekening_karyawan: emp?.nomorRekeningKaryawan || undefined,
          atas_nama_rekening_karyawan: emp?.atasNamaRekeningKaryawan || emp?.namaKaryawan || undefined,
          telepon_karyawan: emp?.teleponKaryawan || undefined,
          email_karyawan: emp?.emailKaryawan || undefined,
          kota_penandatanganan: wizard.kotaUsaha,
          tanggal_penandatanganan: tanggalPembuatan,
          emailPembeli: wizard.emailPembeli,
          nomorWhatsapp: wizard.nomorWhatsapp,
          nomorKontrak,
          tanggalPembuatan,
          contractType: "kur-bundle",
          contractTitle: `PKWT Karyawan ${i + 1}`,
        };

        docs.push({
          id: `pkwt-${i + 1}`,
          title: `PKWT Karyawan ${i + 1}${emp?.namaKaryawan ? ` — ${emp.namaKaryawan}` : ""}`,
          description: `Perjanjian Kerja Waktu Tertentu untuk karyawan ke-${i + 1}.${emp?.jabatan ? ` Jabatan: ${emp.jabatan}.` : ""}`,
          html: generatePKWTHTML(pkwtData),
          nomorKontrak,
        });
      }
    }

    // ── 4. Perjanjian Bagi Hasil (if has partner and not skipped) ─────────────
    if (wizard.adaMitra && !skipped.has("bagi-hasil")) {
      const nomorKontrak = generateContractNumber();
      const porsiPemilik = details.porsiPemilik ?? 50;
      const porsiMitra = 100 - porsiPemilik;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bagiHasilData: any = {
        nama_pihak_1: namaPemilik,
        nik_pihak_1: nikPemilik,
        alamat_pihak_1: alamatPemilik,
        peran_pihak_1: "Pengelola Utama",
        modal_pihak_1: 0,
        bentuk_kontribusi_pihak_1: "campuran",
        nama_pihak_2: details.namaMitra || "[Nama Mitra Usaha]",
        nik_pihak_2: details.nikMitra || "___________________",
        alamat_pihak_2: "___________________",
        peran_pihak_2: "Mitra Investor",
        modal_pihak_2: 0,
        bentuk_kontribusi_pihak_2: "uang_tunai",
        nama_usaha: wizard.namaUsaha,
        jenis_usaha: wizard.bidangUsaha,
        alamat_usaha: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
        tanggal_mulai_usaha: tanggalPembuatan,
        total_modal: 0,
        persen_bagi_hasil_pihak_1: porsiPemilik,
        persen_bagi_hasil_pihak_2: porsiMitra,
        persen_tanggung_rugi_pihak_1: porsiPemilik,
        persen_tanggung_rugi_pihak_2: porsiMitra,
        periode_bagi_hasil: "bulanan",
        apakah_ada_gaji_pengelola: false,
        siapa_yang_mengelola: "pihak_1",
        keputusan_besar_threshold: 5000000,
        frekuensi_laporan_keuangan: "bulanan",
        jangka_waktu_perjanjian: "1tahun",
        saksi_1: "[Nama Saksi]",
        tanggal_penandatanganan: tanggalPembuatan,
        kota_penandatanganan: wizard.kotaUsaha,
        emailPembeli: wizard.emailPembeli,
        nomorWhatsapp: wizard.nomorWhatsapp,
        nomorKontrak,
        tanggalPembuatan,
        contractType: "kur-bundle",
        contractTitle: "Perjanjian Bagi Hasil Usaha",
      };

      docs.push({
        id: "perjanjian-bagi-hasil",
        title: "Perjanjian Bagi Hasil Usaha",
        description: `Dokumen kemitraan usaha. Porsi pemilik ${porsiPemilik}% — mitra ${porsiMitra}%.`,
        html: generateBagiHasilHTML(bagiHasilData),
        nomorKontrak,
      });
    }

    // ── 5. Perjanjian Hutang Piutang (if modal dari luar and not skipped) ──────
    if (wizard.modalBerasalDari !== "Sendiri" && wizard.adaPinjamanLuar && !skipped.has("hutang-piutang")) {
      const nomorKontrak = generateContractNumber();
      const jangkaWaktu = details.jangkaWaktu || 12;
      const jatuhTempo = new Date(tanggalPembuatan);
      jatuhTempo.setMonth(jatuhTempo.getMonth() + jangkaWaktu);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hutangData: any = {
        nama_pemberi_pinjaman: details.namaPemberiPinjaman || "[Nama Pemberi Pinjaman]",
        nik_pemberi_pinjaman: details.nikPemberiPinjaman || "___________________",
        alamat_pemberi_pinjaman: "___________________",
        nomor_telepon_pemberi: "___________________",
        nama_penerima_pinjaman: namaPemilik,
        nik_penerima_pinjaman: nikPemilik,
        alamat_penerima_pinjaman: alamatPemilik,
        nomor_telepon_penerima: wizard.nomorWhatsapp || "___________________",
        jumlah_pinjaman: details.jumlahPinjaman || 0,
        tanggal_pinjaman: tanggalPembuatan,
        tanggal_jatuh_tempo: jatuhTempo.toISOString().split("T")[0],
        cara_pembayaran_kembali: "cicilan_bulanan",
        ada_bunga: (details.bungaPerTahun || 0) > 0,
        persen_bunga_pertahun: details.bungaPerTahun || 0,
        ada_jaminan: false,
        nama_saksi_1: "[Nama Saksi]",
        kota_penandatanganan: wizard.kotaUsaha,
        tanggal_penandatanganan: tanggalPembuatan,
        emailPembeli: wizard.emailPembeli,
        nomorWhatsapp: wizard.nomorWhatsapp,
        nomorKontrak,
        tanggalPembuatan,
        contractType: "kur-bundle",
        contractTitle: "Perjanjian Hutang Piutang",
      };

      docs.push({
        id: "perjanjian-hutang-piutang",
        title: "Perjanjian Hutang Piutang",
        description: `Dokumentasi pinjaman modal dari ${details.namaPemberiPinjaman || "pihak luar"}. Jangka ${jangkaWaktu} bulan.`,
        html: generateHutangPiutangHTML(hutangData),
        nomorKontrak,
      });
    }

    // ── 6. Surat Kuasa (if CV/PT and not skipped) ─────────────────────────────
    if ((wizard.bentukUsaha === "CV" || wizard.bentukUsaha === "PT") && !skipped.has("surat-kuasa")) {
      const nomorKontrak = generateContractNumber();
      const kuasaData: SuratKuasaData = {
        nama_pemberi_kuasa: details.namaPemberKuasa || namaPemilik,
        jabatan_pemberi_kuasa: wizard.bentukUsaha === "PT" ? "Direktur Utama" : "Pengurus",
        nama_perusahaan: wizard.namaUsaha,
        bentuk_perusahaan: wizard.bentukUsaha,
        alamat_perusahaan: wizard.alamatUsaha,
        kota_perusahaan: wizard.kotaUsaha,
        nama_penerima_kuasa: details.namaPenerimaKuasa || "[Nama Penerima Kuasa]",
        jabatan_penerima_kuasa: "[Jabatan Penerima Kuasa]",
        keperluan_kuasa: details.keperluanKuasa || "pengajuan Kredit Usaha Rakyat (KUR)",
        tanggal_surat: tanggalPembuatan,
        masa_berlaku: "3 bulan sejak tanggal ditandatangani",
        kota_penandatanganan: wizard.kotaUsaha,
        emailPembeli: wizard.emailPembeli,
        nomorWhatsapp: wizard.nomorWhatsapp,
        nomorKontrak,
        tanggalPembuatan,
        contractType: "kur-bundle",
        contractTitle: "Surat Kuasa Direksi/Pengurus",
      };

      docs.push({
        id: "surat-kuasa",
        title: "Surat Kuasa Direksi/Pengurus",
        description: `Kuasa dari ${wizard.bentukUsaha} ${wizard.namaUsaha} untuk ${details.keperluanKuasa || "pengajuan KUR"}.`,
        html: generateSuratKuasaHTML(kuasaData),
        nomorKontrak,
      });
    }

    // ── Pricing ───────────────────────────────────────────────────────────────
    const docCount = docs.length;
    const totalPrice = calcPrice(docCount);
    const separatePrice = calcSeparatePrice(docCount);
    const savingsPercent = separatePrice > 0
      ? Math.round(((separatePrice - totalPrice) / separatePrice) * 100)
      : 0;

    // ── Master order ──────────────────────────────────────────────────────────
    const masterNomor = generateContractNumber();

    // ── Save to Supabase ──────────────────────────────────────────────────────
    if (supabase) {
      try {
        await supabase.from("orders").insert({
          order_id: masterNomor,
          contract_type: "kur-bundle",
          contract_title: `Paket KUR-Ready (${docCount} dokumen)`,
          amount: totalPrice,
          status: "pending",
          customer_name: namaPemilik,
          customer_email: wizard.emailPembeli,
          customer_phone: wizard.nomorWhatsapp || null,
          pihak_pertama: namaPemilik,
          pihak_kedua: wizard.namaUsaha,
          contract_data: {
            wizard,
            documents: docs.map((d) => ({ id: d.id, title: d.title, nomorKontrak: d.nomorKontrak })),
          },
        });
      } catch (dbErr) {
        console.error("[kur-bundle] Supabase insert error (non-fatal):", dbErr);
      }
    }

    const contractData = {
      nomorKontrak: masterNomor,
      namaUsaha: wizard.namaUsaha,
      emailPembeli: wizard.emailPembeli,
      nomorWhatsapp: wizard.nomorWhatsapp,
      contractType: "kur-bundle",
      contractTitle: `Paket KUR-Ready (${docCount} dokumen)`,
      tanggalPembuatan,
      namaPihakPertama: namaPemilik,
      namaPihakKedua: namaPemilik,
      alamatProperti: alamatPemilik,
      hargaSewa: totalPrice,
      durasiSewa: 0,
      tanggalMulai: tanggalPembuatan,
      tanggalBerakhir: tanggalPembuatan,
    };

    return NextResponse.json({
      success: true,
      documents: docs,
      totalPrice,
      separatePrice,
      savingsPercent,
      contractData,
    });
  } catch (error) {
    console.error("[kur-bundle] Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat paket dokumen KUR. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
