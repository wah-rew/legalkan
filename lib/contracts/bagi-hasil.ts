// ─── Perjanjian Bagi Hasil Usaha ─────────────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1618–1652 (Maatschap / Persekutuan Perdata)

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface BagiHasilData {
  // Para Pihak
  nama_pihak_1: string;
  nik_pihak_1: string;
  alamat_pihak_1: string;
  peran_pihak_1: string;
  modal_pihak_1: number;
  bentuk_kontribusi_pihak_1: "uang_tunai" | "aset" | "tenaga" | "keahlian" | "campuran";
  nama_pihak_2: string;
  nik_pihak_2: string;
  alamat_pihak_2: string;
  peran_pihak_2: string;
  modal_pihak_2: number;
  bentuk_kontribusi_pihak_2: "uang_tunai" | "aset" | "tenaga" | "keahlian" | "campuran";
  // Detail Usaha
  nama_usaha: string;
  jenis_usaha: string;
  alamat_usaha: string;
  tanggal_mulai_usaha: string;
  total_modal: number;
  // Bagi Hasil
  persen_bagi_hasil_pihak_1: number;
  persen_bagi_hasil_pihak_2: number;
  persen_tanggung_rugi_pihak_1: number;
  persen_tanggung_rugi_pihak_2: number;
  periode_bagi_hasil: "bulanan" | "triwulan" | "semesteran" | "tahunan";
  apakah_ada_gaji_pengelola: boolean;
  gaji_pengelola?: number;
  // Pengelolaan
  siapa_yang_mengelola: "pihak_1" | "pihak_2" | "bersama";
  keputusan_besar_threshold: number;
  frekuensi_laporan_keuangan: "bulanan" | "triwulan" | "semesteran";
  // Pengakhiran
  jangka_waktu_perjanjian: "1tahun" | "2tahun" | "3tahun" | "tidak_terbatas";
  tanggal_berakhir?: string;
  // Saksi
  saksi_1: string;
  saksi_2?: string;
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateBagiHasilHTML(d: BagiHasilData): string {
  const pb = new PasalBuilder();
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const tglMulai = formatTanggal(d.tanggal_mulai_usaha);
  const totalModalFormatted = formatRupiah(d.total_modal);
  const modal1 = formatRupiah(d.modal_pihak_1);
  const modal2 = formatRupiah(d.modal_pihak_2);

  const kontribusiLabel = (t: string) => {
    if (t === "uang_tunai") return "uang tunai";
    if (t === "aset") return "aset/barang";
    if (t === "tenaga") return "tenaga kerja";
    if (t === "keahlian") return "keahlian/skill";
    return "campuran (uang tunai + aset/tenaga)";
  };

  const periodeLabel = d.periode_bagi_hasil === "bulanan" ? "setiap bulan"
    : d.periode_bagi_hasil === "triwulan" ? "setiap 3 bulan"
    : d.periode_bagi_hasil === "semesteran" ? "setiap 6 bulan"
    : "setiap tahun";

  const laporanLabel = d.frekuensi_laporan_keuangan === "bulanan" ? "setiap bulan"
    : d.frekuensi_laporan_keuangan === "triwulan" ? "setiap 3 bulan"
    : "setiap 6 bulan";

  const pengelolaLabel = d.siapa_yang_mengelola === "pihak_1" ? d.nama_pihak_1
    : d.siapa_yang_mengelola === "pihak_2" ? d.nama_pihak_2
    : "Para Pihak bersama-sama";

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong></p>
      <p><strong>Nama :</strong> ${d.nama_pihak_1}</p>
      <p><strong>NIK :</strong> ${d.nik_pihak_1}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pihak_1}</p>
      <p><strong>Peran/Kontribusi :</strong> ${d.peran_pihak_1}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong></p>
      <p><strong>Nama :</strong> ${d.nama_pihak_2}</p>
      <p><strong>NIK :</strong> ${d.nik_pihak_2}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pihak_2}</p>
      <p><strong>Peran/Kontribusi :</strong> ${d.peran_pihak_2}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong>.</p>
    </div>
    <p>Para Pihak secara bersama-sama disebut <strong>"Mitra"</strong> dan sepakat membentuk kemitraan usaha (Persekutuan Perdata/Maatschap) sesuai KUHPerdata Pasal 1618.</p>
  `);

  const usaha = pb.pasal("Nama, Jenis, dan Lokasi Usaha", `
    <div class="pihak-box">
      <p><strong>Nama Usaha :</strong> ${d.nama_usaha}</p>
      <p><strong>Jenis Usaha :</strong> ${d.jenis_usaha}</p>
      <p><strong>Alamat Usaha :</strong> ${d.alamat_usaha}</p>
      <p><strong>Tanggal Mulai Operasi :</strong> ${tglMulai}</p>
    </div>
    <p>Usaha ini dijalankan atas nama kemitraan Para Pihak dan tunduk pada peraturan perundang-undangan yang berlaku di Republik Indonesia.</p>
  `);

  const modal = pb.pasal("Kontribusi Modal", `
    <p>1. Total modal kemitraan yang disepakati adalah sebesar <strong>${totalModalFormatted} (${terbilang(d.total_modal)} rupiah)</strong>, dengan rincian kontribusi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA:</strong> ${modal1} — dalam bentuk ${kontribusiLabel(d.bentuk_kontribusi_pihak_1)}</p>
      <p><strong>PIHAK KEDUA:</strong> ${modal2} — dalam bentuk ${kontribusiLabel(d.bentuk_kontribusi_pihak_2)}</p>
    </div>
    <p>2. Kontribusi berupa aset non-tunai dinilai berdasarkan kesepakatan Para Pihak sebagaimana tercantum di atas dan tidak dapat dipermasalahkan kembali setelah Perjanjian ini ditandatangani.</p>
    <p>3. Para Pihak wajib menyetorkan kontribusi modal pada tanggal <strong>${tglMulai}</strong>.</p>
    <p>4. Penambahan modal oleh salah satu pihak hanya dapat dilakukan atas persetujuan tertulis Para Pihak.</p>
  `);

  const pengelolaan = pb.pasal("Pengelolaan Usaha", `
    <p>1. Pengelolaan usaha sehari-hari dilakukan oleh <strong>${pengelolaLabel}</strong>.</p>
    <p>2. Pengelola berhak mengambil keputusan operasional rutin atas nama kemitraan.</p>
    <p>3. Keputusan yang memerlukan persetujuan bersama Para Pihak adalah transaksi atau komitmen yang nilainya melebihi <strong>${formatRupiah(d.keputusan_besar_threshold)}</strong> atau yang berdampak material bagi usaha.</p>
    <p>4. Semua Mitra berhak mengakses dan memeriksa pembukuan, laporan keuangan, dan catatan usaha kapanpun dengan pemberitahuan yang wajar.</p>
    ${d.apakah_ada_gaji_pengelola && d.gaji_pengelola ? `<p>5. Pengelola mendapat honor pengelolaan sebesar <strong>${formatRupiah(d.gaji_pengelola)}</strong> per bulan, dibebankan sebagai biaya operasional usaha sebelum perhitungan bagi hasil.</p>` : ""}
    <p>${d.apakah_ada_gaji_pengelola && d.gaji_pengelola ? "6" : "5"}. Para Pihak dilarang menjalankan usaha sejenis yang bersaing secara langsung dengan usaha kemitraan ini tanpa persetujuan tertulis.</p>
  `);

  const bagiHasil = pb.pasal("Pembagian Keuntungan dan Kerugian", `
    <p>1. Keuntungan bersih usaha dibagikan kepada Para Pihak dengan proporsi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA:</strong> ${d.persen_bagi_hasil_pihak_1}% dari keuntungan bersih</p>
      <p><strong>PIHAK KEDUA:</strong> ${d.persen_bagi_hasil_pihak_2}% dari keuntungan bersih</p>
    </div>
    <p>2. Kerugian usaha ditanggung Para Pihak dengan proporsi:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA:</strong> ${d.persen_tanggung_rugi_pihak_1}%</p>
      <p><strong>PIHAK KEDUA:</strong> ${d.persen_tanggung_rugi_pihak_2}%</p>
    </div>
    <p>3. Pembagian keuntungan dilakukan <strong>${periodeLabel}</strong>. Para Pihak dapat bersepakat untuk menahan sebagian laba sebagai cadangan modal kerja.</p>
    <p>4. <strong>Larangan Klausul Leonine:</strong> Sesuai KUHPerdata Pasal 1635, tidak diperbolehkan membebankan seluruh kerugian kepada satu pihak saja. Apabila terdapat ketentuan demikian, demi hukum klausul tersebut batal.</p>
    <p>5. Laporan keuangan diterbitkan <strong>${laporanLabel}</strong> dan diserahkan kepada semua Mitra paling lambat 14 (empat belas) hari setelah akhir periode laporan.</p>
  `);

  const rekening = pb.pasal("Rekening Usaha dan Keuangan", `
    <p>1. Keuangan usaha wajib dipisahkan dari keuangan pribadi Para Pihak menggunakan rekening usaha tersendiri atas nama kemitraan atau atas nama yang disepakati.</p>
    <p>2. Penarikan uang dari rekening usaha di atas <strong>${formatRupiah(d.keputusan_besar_threshold)}</strong> memerlukan persetujuan ${d.siapa_yang_mengelola === "bersama" ? "kedua belah pihak" : "pengelola dan salah satu pihak lainnya"}.</p>
    <p>3. Semua transaksi usaha wajib didokumentasikan dengan bukti yang sah.</p>
  `);

  const pengakhiran = pb.pasal("Jangka Waktu dan Pengakhiran Kemitraan", `
    <p>1. Perjanjian ini berlaku ${
      d.jangka_waktu_perjanjian === "tidak_terbatas"
        ? "untuk jangka waktu <strong>tidak terbatas</strong> sampai ada kesepakatan pengakhiran"
        : `selama <strong>${d.jangka_waktu_perjanjian.replace("tahun", " tahun")}</strong>${d.tanggal_berakhir ? `, sampai dengan ${formatTanggal(d.tanggal_berakhir)}` : ""}`
    }.</p>
    <p>2. Perjanjian ini berakhir karena:</p>
    <ul>
      <li>Jangka waktu habis dan tidak diperpanjang;</li>
      <li>Kesepakatan tertulis Para Pihak;</li>
      <li>Salah satu pihak meninggal dunia, pailit, atau tidak cakap hukum;</li>
      <li>Tujuan usaha telah tercapai atau tidak mungkin dicapai.</li>
    </ul>
    <p>3. Pihak yang ingin keluar dari kemitraan wajib memberitahukan secara tertulis minimal 60 (enam puluh) hari sebelumnya. Para Pihak berhak membeli bagian pihak yang keluar sebelum dijual ke pihak lain (<em>right of first refusal</em>).</p>
    <p>4. Pada saat pengakhiran, usaha dilakukan likuidasi: aset dijual, kewajiban diselesaikan, sisa aset dibagi proporsional sesuai kontribusi modal masing-masing pihak.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Sengketa diselesaikan secara musyawarah dalam 30 (tiga puluh) hari.</p>
    <p>2. Apabila gagal, sengketa diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong> berdasarkan hukum Republik Indonesia.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap</strong> bermaterai cukup, berlaku sejak ditandatangani.</p>
    <p>2. Perubahan hanya sah secara tertulis dengan tanda tangan Para Pihak.</p>
    <p>3. Perjanjian tunduk pada KUHPerdata Pasal 1618–1652 tentang Maatschap/Persekutuan Perdata.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN BAGI HASIL USAHA</h1>
  <p class="subtitle">Persekutuan Perdata (Maatschap) — KUHPerdata Pasal 1618–1652</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${usaha}
  ${modal}
  ${pengelolaan}
  ${bagiHasil}
  ${rekening}
  ${pengakhiran}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pihak_1}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pihak_2}</strong></p>
      </td>
    </tr>
  </table>

  <p style="text-align: center; margin-top: 24px; font-weight: 700;">SAKSI-SAKSI:</p>
  <table class="tanda-tangan">
    <tr>
      <td>
        <p>Saksi 1</p>
        <div class="ttd-area"></div>
        <p><strong>${d.saksi_1}</strong></p>
      </td>
      <td>
        <p>Saksi 2</p>
        <div class="ttd-area"></div>
        <p><strong>${d.saksi_2 || "________________"}</strong></p>
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
