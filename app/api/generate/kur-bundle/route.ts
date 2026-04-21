import { NextRequest, NextResponse } from "next/server";
import { generateContractNumber } from "@/lib/contracts/helpers";
import { supabase } from "@/lib/supabase";
import { generateSuratKeteranganUsahaHTML, SuratKeteranganUsahaData } from "@/lib/contracts/surat-keterangan-usaha";
import { generatePernyataanUsahaAktifHTML, PernyataanUsahaAktifData } from "@/lib/contracts/pernyataan-usaha-aktif";
import { generateSuratKuasaHTML, SuratKuasaData } from "@/lib/contracts/surat-kuasa";
import { generatePKWTHTML, PKWTData } from "@/lib/contracts/pkwt";
import { generateBagiHasilHTML } from "@/lib/contracts/bagi-hasil";
import { generateHutangPiutangHTML } from "@/lib/contracts/hutang-piutang";

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
    // Aliases for payment page compat
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
  const base = 59000;
  const perDoc = 25000;
  const cap = 199000;
  if (docCount <= 2) return base;
  const total = base + (docCount - 2) * perDoc;
  return Math.min(total, cap);
}

function calcSeparatePrice(docCount: number): number {
  // Individual prices if bought separately
  return docCount * 39000;
}

export async function POST(req: NextRequest) {
  try {
    const wizard: KURWizardData = await req.json();

    const tanggalPembuatan = new Date().toISOString().split("T")[0];

    // ── Determine which documents are needed ──────────────────────────────────
    const docs: KURBundleDocument[] = [];

    const baseData = {
      emailPembeli: wizard.emailPembeli,
      nomorWhatsapp: wizard.nomorWhatsapp,
      tanggalPembuatan,
      contractType: "kur-bundle",
      contractTitle: "Paket KUR-Ready",
      // Fill with wizard data
      nama_pemilik: wizard.namaPemilik || wizard.namaUsaha,
      nik_pemilik: "___________________",
      alamat_pemilik: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
      nama_usaha: wizard.namaUsaha,
      jenis_usaha: wizard.bentukUsaha,
      bidang_usaha: wizard.bidangUsaha,
      alamat_usaha: wizard.alamatUsaha,
      kota_usaha: wizard.kotaUsaha,
      lama_usaha: LAMA_USAHA_MAP[wizard.lamaUsaha] || wizard.lamaUsaha,
      tanggal_surat: tanggalPembuatan,
      kota_penandatanganan: wizard.kotaUsaha,
    };

    // ── 1. Surat Pernyataan Usaha Aktif (ALWAYS) ──────────────────────────────
    const pernyataanNomor = generateContractNumber();
    const pernyataanHtml = generatePernyataanUsahaAktifHTML({
      ...baseData,
      nomorKontrak: pernyataanNomor,
      contractTitle: "Surat Pernyataan Usaha Aktif",
    } as PernyataanUsahaAktifData);

    docs.push({
      id: "pernyataan-usaha-aktif",
      title: "Surat Pernyataan Usaha Aktif",
      description: "Deklarasi bahwa usahamu sedang aktif beroperasi, tidak dalam gagal bayar, dan patuh hukum.",
      html: pernyataanHtml,
      nomorKontrak: pernyataanNomor,
    });

    // ── 2. Surat Keterangan Usaha (ALWAYS) ───────────────────────────────────
    const skuNomor = generateContractNumber();
    const skuHtml = generateSuratKeteranganUsahaHTML({
      ...baseData,
      nomorKontrak: skuNomor,
      contractTitle: "Surat Keterangan Usaha",
    } as SuratKeteranganUsahaData);

    docs.push({
      id: "surat-keterangan-usaha",
      title: "Surat Keterangan Usaha",
      description: "Dokumen formal yang menerangkan keberadaan, jenis, dan alamat usahamu untuk keperluan bank.",
      html: skuHtml,
      nomorKontrak: skuNomor,
    });

    // ── 3. PKWT (if has employees) ────────────────────────────────────────────
    const hasKaryawan = wizard.jumlahKaryawan !== "0" || wizard.adaKaryawanTetap;
    if (hasKaryawan) {
      // Determine number of PKWTs to generate (max 5)
      let numPKWT = 1;
      if (wizard.jumlahKaryawan === "1-5") numPKWT = Math.min(5, 3);
      else if (wizard.jumlahKaryawan === "6-20") numPKWT = 5;
      else if (wizard.jumlahKaryawan === ">20") numPKWT = 5;

      for (let i = 1; i <= numPKWT; i++) {
        const pkwtNomor = generateContractNumber();
        const pkwtData: PKWTData = {
          nama_perusahaan: wizard.namaUsaha,
          jenis_perusahaan: wizard.bentukUsaha,
          alamat_perusahaan: wizard.alamatUsaha,
          kota_perusahaan: wizard.kotaUsaha,
          nama_pimpinan: wizard.namaPemilik || wizard.namaUsaha,
          jabatan_pimpinan: wizard.bentukUsaha === "PT" ? "Direktur" : "Pemilik",
          nama_karyawan: `[Nama Karyawan ${i}]`,
          nik_karyawan: "___________________",
          alamat_karyawan: "___________________",
          posisi_jabatan: `[Posisi Karyawan ${i}]`,
          lokasi_kerja: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
          tanggal_mulai: tanggalPembuatan,
          tanggal_berakhir: new Date(new Date(tanggalPembuatan).setFullYear(new Date(tanggalPembuatan).getFullYear() + 1)).toISOString().split("T")[0],
          gaji_pokok: 0,
          kota_penandatanganan: wizard.kotaUsaha,
          tanggal_penandatanganan: tanggalPembuatan,
          emailPembeli: wizard.emailPembeli,
          nomorWhatsapp: wizard.nomorWhatsapp,
          nomorKontrak: pkwtNomor,
          tanggalPembuatan,
          contractType: "kur-bundle",
          contractTitle: `PKWT Karyawan ${i}`,
        };

        docs.push({
          id: `pkwt-${i}`,
          title: `PKWT Karyawan ${i}`,
          description: `Perjanjian Kerja Waktu Tertentu untuk karyawan ke-${i}. Isi nama, NIK, posisi, dan gaji karyawan.`,
          html: generatePKWTHTML(pkwtData),
          nomorKontrak: pkwtNomor,
        });
      }
    }

    // ── 4. Perjanjian Bagi Hasil (if has partner) ─────────────────────────────
    if (wizard.adaMitra) {
      const bagiHasilNomor = generateContractNumber();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bagiHasilData: any = {
        nama_pihak_1: wizard.namaPemilik || wizard.namaUsaha,
        nik_pihak_1: "___________________",
        alamat_pihak_1: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
        peran_pihak_1: "Pengelola Utama",
        modal_pihak_1: 0,
        bentuk_kontribusi_pihak_1: "campuran",
        nama_pihak_2: "[Nama Mitra Usaha]",
        nik_pihak_2: "___________________",
        alamat_pihak_2: "___________________",
        peran_pihak_2: "Mitra Investor",
        modal_pihak_2: 0,
        bentuk_kontribusi_pihak_2: "uang_tunai",
        nama_usaha: wizard.namaUsaha,
        jenis_usaha: wizard.bidangUsaha,
        alamat_usaha: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
        tanggal_mulai_usaha: tanggalPembuatan,
        total_modal: 0,
        persen_bagi_hasil_pihak_1: 50,
        persen_bagi_hasil_pihak_2: 50,
        persen_tanggung_rugi_pihak_1: 50,
        persen_tanggung_rugi_pihak_2: 50,
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
        nomorKontrak: bagiHasilNomor,
        tanggalPembuatan,
        contractType: "kur-bundle",
        contractTitle: "Perjanjian Bagi Hasil Usaha",
      };

      docs.push({
        id: "perjanjian-bagi-hasil",
        title: "Perjanjian Bagi Hasil Usaha",
        description: "Dokumen kemitraan usaha yang mengatur porsi bagi hasil dengan mitra bisnis kamu.",
        html: generateBagiHasilHTML(bagiHasilData),
        nomorKontrak: bagiHasilNomor,
      });
    }

    // ── 5. Perjanjian Hutang Piutang (if modal dari luar) ─────────────────────
    if (wizard.modalBerasalDari !== "Sendiri" && wizard.adaPinjamanLuar) {
      const hutangNomor = generateContractNumber();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hutangData: any = {
        nama_pemberi_pinjaman: "[Nama Pemberi Pinjaman]",
        nik_pemberi_pinjaman: "___________________",
        alamat_pemberi_pinjaman: "___________________",
        nomor_telepon_pemberi: "___________________",
        nama_penerima_pinjaman: wizard.namaPemilik || wizard.namaUsaha,
        nik_penerima_pinjaman: "___________________",
        alamat_penerima_pinjaman: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
        nomor_telepon_penerima: wizard.nomorWhatsapp || "___________________",
        jumlah_pinjaman: 0,
        tanggal_pinjaman: tanggalPembuatan,
        tanggal_jatuh_tempo: new Date(new Date(tanggalPembuatan).setFullYear(new Date(tanggalPembuatan).getFullYear() + 1)).toISOString().split("T")[0],
        cara_pembayaran_kembali: "cicilan_bulanan",
        ada_bunga: false,
        ada_jaminan: false,
        nama_saksi_1: "[Nama Saksi]",
        kota_penandatanganan: wizard.kotaUsaha,
        tanggal_penandatanganan: tanggalPembuatan,
        emailPembeli: wizard.emailPembeli,
        nomorWhatsapp: wizard.nomorWhatsapp,
        nomorKontrak: hutangNomor,
        tanggalPembuatan,
        contractType: "kur-bundle",
        contractTitle: "Perjanjian Hutang Piutang",
      };

      docs.push({
        id: "perjanjian-hutang-piutang",
        title: "Perjanjian Hutang Piutang",
        description: "Dokumentasi modal pinjaman dari pihak luar (bukan bank). Bantu menunjukkan arus modal usaha ke bank.",
        html: generateHutangPiutangHTML(hutangData),
        nomorKontrak: hutangNomor,
      });
    }

    // ── 6. Surat Kuasa (if CV/PT) ─────────────────────────────────────────────
    if (wizard.bentukUsaha === "CV" || wizard.bentukUsaha === "PT") {
      const kuasaNomor = generateContractNumber();
      const kuasaData: SuratKuasaData = {
        nama_pemberi_kuasa: wizard.namaPemilik || wizard.namaUsaha,
        jabatan_pemberi_kuasa: wizard.bentukUsaha === "PT" ? "Direktur Utama" : "Pengurus",
        nama_perusahaan: wizard.namaUsaha,
        bentuk_perusahaan: wizard.bentukUsaha,
        alamat_perusahaan: wizard.alamatUsaha,
        kota_perusahaan: wizard.kotaUsaha,
        nama_penerima_kuasa: "[Nama Penerima Kuasa]",
        jabatan_penerima_kuasa: "[Jabatan Penerima Kuasa]",
        keperluan_kuasa: "pengajuan Kredit Usaha Rakyat (KUR)",
        tanggal_surat: tanggalPembuatan,
        masa_berlaku: "3 bulan sejak tanggal ditandatangani",
        kota_penandatanganan: wizard.kotaUsaha,
        emailPembeli: wizard.emailPembeli,
        nomorWhatsapp: wizard.nomorWhatsapp,
        nomorKontrak: kuasaNomor,
        tanggalPembuatan,
        contractType: "kur-bundle",
        contractTitle: "Surat Kuasa Direksi/Pengurus",
      };

      docs.push({
        id: "surat-kuasa",
        title: "Surat Kuasa Direksi/Pengurus",
        description: `Izin resmi dari ${wizard.bentukUsaha} ${wizard.namaUsaha} untuk menguasakan pengajuan KUR kepada pihak yang ditunjuk.`,
        html: generateSuratKuasaHTML(kuasaData),
        nomorKontrak: kuasaNomor,
      });
    }

    // ── Pricing ──────────────────────────────────────────────────────────────
    const docCount = docs.length;
    const totalPrice = calcPrice(docCount);
    const separatePrice = calcSeparatePrice(docCount);
    const savingsPercent = Math.round(((separatePrice - totalPrice) / separatePrice) * 100);

    // ── Master order number ───────────────────────────────────────────────────
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
          customer_name: wizard.namaPemilik || wizard.namaUsaha,
          customer_email: wizard.emailPembeli,
          customer_phone: wizard.nomorWhatsapp || null,
          pihak_pertama: wizard.namaPemilik || wizard.namaUsaha,
          pihak_kedua: wizard.namaUsaha,
          contract_data: { wizard, documents: docs.map((d) => ({ id: d.id, title: d.title, nomorKontrak: d.nomorKontrak })) },
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
      // PaymentData compatibility fields
      namaPihakPertama: wizard.namaPemilik || wizard.namaUsaha,
      namaPihakKedua: wizard.namaPemilik || wizard.namaUsaha,
      alamatProperti: `${wizard.alamatUsaha}, ${wizard.kotaUsaha}`,
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
