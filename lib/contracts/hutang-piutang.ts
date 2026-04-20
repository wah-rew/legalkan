// ─── Perjanjian Hutang Piutang ────────────────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1754–1773

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface HutangPiutangData {
  // Para Pihak
  nama_pemberi_pinjaman: string;
  nik_pemberi_pinjaman: string;
  alamat_pemberi_pinjaman: string;
  nomor_telepon_pemberi: string;
  nama_penerima_pinjaman: string;
  nik_penerima_pinjaman: string;
  alamat_penerima_pinjaman: string;
  nomor_telepon_penerima: string;
  // Detail Pinjaman
  jumlah_pinjaman: number;
  tanggal_pinjaman: string;
  tanggal_jatuh_tempo: string;
  cara_pembayaran_kembali: "sekaligus" | "cicilan_bulanan" | "cicilan_mingguan";
  jumlah_cicilan?: number;
  jumlah_angsuran?: number;
  // Bunga
  ada_bunga: boolean;
  persentase_bunga?: number;
  jenis_bunga?: "flat" | "efektif" | "majemuk";
  // Jaminan
  ada_jaminan: boolean;
  jenis_jaminan?: string;
  deskripsi_jaminan?: string;
  nilai_jaminan?: number;
  // Saksi
  nama_saksi_1: string;
  nik_saksi_1?: string;
  nama_saksi_2?: string;
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  // Injected
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateHutangPiutangHTML(d: HutangPiutangData): string {
  const pb = new PasalBuilder();
  const jumlahFormatted = formatRupiah(d.jumlah_pinjaman);
  const jumlahTerbilang = terbilang(d.jumlah_pinjaman);
  const tglPinjaman = formatTanggal(d.tanggal_pinjaman);
  const tglJatuhTempo = formatTanggal(d.tanggal_jatuh_tempo);
  const tglPenandatanganan = formatTanggal(d.tanggal_penandatanganan);

  const pembukaan = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat dan ditandatangani di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglPenandatanganan}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemberi Pinjaman / Kreditur)</p>
      <p><strong>Nama :</strong> ${d.nama_pemberi_pinjaman}</p>
      <p><strong>NIK :</strong> ${d.nik_pemberi_pinjaman}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pemberi_pinjaman}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_pemberi}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Pemberi Pinjaman"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Penerima Pinjaman / Debitur)</p>
      <p><strong>Nama :</strong> ${d.nama_penerima_pinjaman}</p>
      <p><strong>NIK :</strong> ${d.nik_penerima_pinjaman}</p>
      <p><strong>Alamat :</strong> ${d.alamat_penerima_pinjaman}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_penerima}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Penerima Pinjaman"</strong>.</p>
    </div>
    <p>PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut <strong>"Para Pihak"</strong>. Para Pihak menyatakan telah sepakat membuat Perjanjian Hutang Piutang ini atas dasar kehendak bebas, tanpa paksaan atau tekanan dari pihak manapun, sesuai Pasal 1320 dan Pasal 1754 KUHPerdata.</p>
  `);

  const pokokPinjaman = pb.pasal("Pokok Pinjaman", `
    <p>1. PIHAK PERTAMA dengan ini menyatakan telah meminjamkan kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima pinjaman uang dari PIHAK PERTAMA sebesar:</p>
    <div class="pihak-box">
      <p><strong>Jumlah Pinjaman : ${jumlahFormatted}</strong></p>
      <p><strong>Terbilang :</strong> (${jumlahTerbilang} rupiah)</p>
    </div>
    <p>2. Penyerahan uang pinjaman dilakukan pada tanggal <strong>${tglPinjaman}</strong>. Dengan ditandatanganinya Perjanjian ini, PIHAK KEDUA menyatakan telah menerima pinjaman tersebut dengan baik.</p>
    <p>3. Perjanjian ini tunduk pada ketentuan KUHPerdata Pasal 1754–1773 tentang Pinjam Meminjam.</p>
  `);

  const jangkaWaktu = pb.pasal("Jangka Waktu dan Jatuh Tempo", `
    <p>1. Pinjaman ini wajib dikembalikan oleh PIHAK KEDUA kepada PIHAK PERTAMA paling lambat pada tanggal <strong>${tglJatuhTempo}</strong>.</p>
    <p>2. Cara pengembalian: <strong>${
      d.cara_pembayaran_kembali === "sekaligus"
        ? "sekaligus lunas pada tanggal jatuh tempo"
        : d.cara_pembayaran_kembali === "cicilan_bulanan"
          ? `dicicil setiap bulan${d.jumlah_cicilan ? ` sebanyak ${d.jumlah_cicilan} kali` : ""}${d.jumlah_angsuran ? ` sebesar ${formatRupiah(d.jumlah_angsuran)} per bulan` : ""}`
          : `dicicil setiap minggu${d.jumlah_cicilan ? ` sebanyak ${d.jumlah_cicilan} kali` : ""}${d.jumlah_angsuran ? ` sebesar ${formatRupiah(d.jumlah_angsuran)} per minggu` : ""}`
    }</strong>.</p>
    <p>3. Apabila tanggal jatuh tempo jatuh pada hari libur nasional atau hari Minggu, maka kewajiban pembayaran tetap harus dipenuhi pada hari kerja sebelumnya.</p>
    <p>4. Keterlambatan lebih dari <strong>3 (tiga) hari kalender</strong> setelah tanggal jatuh tempo dianggap sebagai wanprestasi dan dikenakan ketentuan denda sebagaimana diatur dalam Pasal Denda Keterlambatan.</p>
  `);

  const bunga = pb.pasal("Bunga", d.ada_bunga && d.persentase_bunga
    ? `
    <p>1. Para Pihak sepakat bahwa atas pinjaman ini dikenakan <strong>bunga sebesar ${d.persentase_bunga}% (${terbilang(d.persentase_bunga)} persen) per bulan</strong>, dihitung secara <strong>${d.jenis_bunga === "flat" ? "flat (dari pokok pinjaman awal)" : d.jenis_bunga === "efektif" ? "efektif (dari saldo pokok yang tersisa)" : "majemuk (berbunga atas bunga)"}</strong>.</p>
    <p>2. Bunga mulai dihitung sejak tanggal penyerahan uang pinjaman yaitu <strong>${tglPinjaman}</strong>.</p>
    <p>3. Besaran bunga ini disepakati secara sukarela oleh kedua belah pihak sesuai Pasal 1765 dan 1767 KUHPerdata. Apabila bunga yang disepakati melebihi bunga menurut undang-undang, maka berlaku ketentuan Pasal 1767 KUHPerdata.</p>
    <p>4. Pembayaran bunga dilakukan bersamaan dengan pembayaran cicilan pokok, atau pada tanggal jatuh tempo apabila pembayaran sekaligus.</p>
    `
    : `
    <p>1. Para Pihak sepakat bahwa pinjaman ini <strong>tidak dikenakan bunga</strong> (pinjaman tanpa bunga / 0%).</p>
    <p>2. Ketentuan ini sesuai Pasal 1765 KUHPerdata yang menyatakan bunga hanya berlaku jika diperjanjikan secara tertulis.</p>
    `
  );

  const jaminan = pb.pasal("Jaminan / Agunan", d.ada_jaminan && d.jenis_jaminan
    ? `
    <p>1. Sebagai jaminan atas pinjaman ini, PIHAK KEDUA menyerahkan jaminan berupa:</p>
    <div class="pihak-box">
      <p><strong>Jenis Jaminan :</strong> ${d.jenis_jaminan}</p>
      ${d.deskripsi_jaminan ? `<p><strong>Deskripsi :</strong> ${d.deskripsi_jaminan}</p>` : ""}
      ${d.nilai_jaminan ? `<p><strong>Estimasi Nilai :</strong> ${formatRupiah(d.nilai_jaminan)}</p>` : ""}
    </div>
    <p>2. Jaminan tersebut berada dalam <strong>penguasaan PIHAK PERTAMA</strong> selama pinjaman belum lunas sepenuhnya.</p>
    <p>3. PIHAK PERTAMA wajib menjaga dan merawat barang jaminan dengan baik dan mengembalikannya kepada PIHAK KEDUA dalam kondisi semula setelah pinjaman lunas.</p>
    <p>4. Apabila PIHAK KEDUA wanprestasi, PIHAK PERTAMA berhak menggunakan jaminan sebagai kompensasi setelah melalui prosedur hukum yang berlaku. Untuk jaminan berupa kendaraan atau barang bergerak, berlaku ketentuan UU No. 42/1999 tentang Jaminan Fidusia.</p>
    `
    : `
    <p>Para Pihak sepakat bahwa pinjaman ini <strong>tidak disertai jaminan/agunan</strong>. Pinjaman ini semata-mata didasarkan atas kepercayaan Para Pihak.</p>
    `
  );

  const wanprestasi = pb.pasal("Wanprestasi dan Denda Keterlambatan", `
    <p>1. PIHAK KEDUA dinyatakan <strong>wanprestasi (cidera janji)</strong> apabila:</p>
    <ul>
      <li>Tidak membayar cicilan atau pokok pinjaman pada waktu yang telah ditentukan;</li>
      <li>Tidak memenuhi kewajiban lain sebagaimana diatur dalam Perjanjian ini.</li>
    </ul>
    <p>2. Atas keterlambatan pembayaran, PIHAK KEDUA dikenakan <strong>denda keterlambatan sebesar 0,5% (nol koma lima persen) per hari</strong> dari jumlah yang terlambat dibayarkan, terhitung sejak tanggal jatuh tempo hingga tanggal pelunasan aktual.</p>
    <p>3. Apabila keterlambatan lebih dari 30 (tiga puluh) hari kalender, PIHAK PERTAMA berhak untuk menyatakan seluruh sisa hutang <strong>jatuh tempo seketika</strong> (acceleration clause) dan menuntut pelunasan penuh beserta bunga dan denda yang terakumulasi.</p>
    <p>4. PIHAK PERTAMA berhak mengeksekusi jaminan (apabila ada) sebagai bentuk penyelesaian kewajiban PIHAK KEDUA yang menunggak.</p>
    <p>5. Seluruh biaya penagihan, termasuk biaya advokat dan biaya pengadilan, menjadi beban dan tanggung jawab PIHAK KEDUA apabila terjadi wanprestasi.</p>
    <p>6. Ketentuan ini mengacu pada KUHPerdata Pasal 1243–1252 tentang penggantian biaya, kerugian, dan bunga.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Setiap sengketa yang timbul dari atau berkaitan dengan Perjanjian ini akan diselesaikan secara <strong>musyawarah untuk mencapai mufakat</strong> dalam waktu 30 (tiga puluh) hari kalender sejak salah satu pihak menyampaikan keberatan secara tertulis.</p>
    <p>2. Apabila penyelesaian musyawarah tidak tercapai, Para Pihak sepakat menyelesaikan sengketa melalui <strong>Pengadilan Negeri</strong> di wilayah hukum tempat Perjanjian ini ditandatangani, yaitu Pengadilan Negeri di kota <strong>${d.kota_penandatanganan}</strong>.</p>
    <p>3. Para Pihak memilih domisili hukum yang tetap di kantor Panitera Pengadilan Negeri ${d.kota_penandatanganan}.</p>
    <p>4. Pilihan hukum yang berlaku adalah <strong>Hukum Negara Republik Indonesia</strong>.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini merupakan keseluruhan kesepakatan Para Pihak dan menggantikan seluruh perjanjian lisan maupun tertulis sebelumnya mengenai hal yang sama.</p>
    <p>2. Setiap perubahan Perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak.</p>
    <p>3. Apabila salah satu ketentuan dinyatakan tidak sah oleh pengadilan, ketentuan lainnya tetap berlaku.</p>
    <p>4. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap asli</strong>, masing-masing bermaterai cukup dan mempunyai kekuatan hukum yang sama.</p>
    <p>5. Perjanjian ini tunduk pada hukum Republik Indonesia, khususnya KUHPerdata Pasal 1313, 1320, 1338, dan 1754–1773.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN HUTANG PIUTANG</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Indonesia Pasal 1754–1773</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${pembukaan}
  ${pokokPinjaman}
  ${jangkaWaktu}
  ${bunga}
  ${jaminan}
  ${wanprestasi}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat dan ditandatangani oleh Para Pihak dan Saksi-Saksi pada tanggal <strong>${tglPenandatanganan}</strong> di <strong>${d.kota_penandatanganan}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Pemberi Pinjaman)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pemberi_pinjaman}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Penerima Pinjaman)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_penerima_pinjaman}</strong></p>
      </td>
    </tr>
  </table>

  <p style="text-align: center; margin-top: 24px; font-weight: 700;">SAKSI-SAKSI:</p>
  <table class="tanda-tangan">
    <tr>
      <td>
        <p>Saksi 1</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_saksi_1}</strong></p>
        ${d.nik_saksi_1 ? `<p style="font-size: 10pt;">NIK: ${d.nik_saksi_1}</p>` : ""}
      </td>
      <td>
        <p>Saksi 2</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_saksi_2 || "________________"}</strong></p>
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
