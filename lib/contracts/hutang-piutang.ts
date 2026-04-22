// ─── Perjanjian Hutang Piutang ────────────────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1754–1773

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface HutangPiutangData {
  // Para Pihak
  nama_pemberi_pinjaman: string;
  nik_pemberi_pinjaman: string;
  alamat_pemberi_pinjaman: string;
  nomor_telepon_pemberi: string;
  // Rekening Pemberi Pinjaman
  namaBank?: string;
  nomorRekening?: string;
  atasNamaRekening?: string;
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
  // Denda
  dendaKeterlambatan?: string; // % per hari, default "0.5"
  // Saksi
  nama_saksi_1: string;
  nik_saksi_1?: string;
  saksi1Alamat?: string;
  nama_saksi_2?: string;
  nik_saksi_2?: string;
  saksi2Alamat?: string;
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  lokasiPembuatan?: string;
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
  const dendaPersen = d.dendaKeterlambatan || "0,5";
  const dendaTerbilang = dendaPersen === "0,5" ? "nol koma lima" : dendaPersen.replace(".", ",");
  const lokasiTtd = d.lokasiPembuatan || d.kota_penandatanganan;

  const dasarHukum = pb.pasal("Dasar Hukum", `
    <p>Perjanjian ini dibuat berdasarkan ketentuan hukum yang berlaku di Negara Republik Indonesia, antara lain:</p>
    <ul>
      <li><strong>KUHPerdata Pasal 1754–1773</strong> — tentang Pinjam Meminjam (Perjanjian Hutang Piutang);</li>
      <li><strong>KUHPerdata Pasal 1320</strong> — tentang syarat sahnya perjanjian (kesepakatan, kecakapan, hal tertentu, sebab yang halal);</li>
      <li><strong>KUHPerdata Pasal 1338</strong> — tentang asas kebebasan berkontrak, kekuatan mengikat, dan pelaksanaan dengan itikad baik;</li>
      <li><strong>KUHPerdata Pasal 1243–1252</strong> — tentang penggantian biaya, kerugian, dan bunga akibat wanprestasi;</li>
      <li><strong>KUHPerdata Pasal 1765 dan 1767</strong> — tentang bunga pinjaman yang diperjanjikan secara tertulis.</li>
    </ul>
    <p>Para Pihak menyatakan telah memahami dan menyepakati seluruh ketentuan dalam Perjanjian ini atas dasar kehendak bebas, tanpa paksaan atau tekanan dari pihak manapun.</p>
  `);

  const pembukaan = pb.pasal("Para Pihak", `
    <p>Pada tanggal <strong>${tglPenandatanganan}</strong>, bertempat di <strong>${lokasiTtd}</strong>, Perjanjian ini dibuat oleh dan antara:</p>
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
    <p>PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut <strong>"Para Pihak"</strong>.</p>
  `);

  const pokokPinjaman = pb.pasal("Objek Perjanjian / Pokok Pinjaman", `
    <p>1. PIHAK PERTAMA dengan ini menyatakan telah meminjamkan kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima pinjaman uang dari PIHAK PERTAMA sebesar:</p>
    <div class="pihak-box">
      <p><strong>Jumlah Pinjaman : ${jumlahFormatted}</strong></p>
      <p><strong>Terbilang :</strong> (${jumlahTerbilang} rupiah)</p>
    </div>
    <p>2. Penyerahan uang pinjaman dilakukan pada tanggal <strong>${tglPinjaman}</strong>.</p>
    <p>3. <strong>Konfirmasi Penerimaan:</strong> Peminjam (PIHAK KEDUA) mengakui dan menyatakan telah menerima uang pinjaman tersebut dengan baik dan benar, dan dengan ditandatanganinya Perjanjian ini, penerimaan uang dianggap telah terjadi secara sah.</p>
  `);

  const jangkaWaktu = pb.pasal("Jangka Waktu dan Cara Pembayaran", `
    <p>1. Pengembalian pinjaman oleh PIHAK KEDUA kepada PIHAK PERTAMA dilaksanakan selambat-lambatnya pada tanggal <strong>${tglJatuhTempo}</strong>.</p>
    <p>2. Cara pengembalian: <strong>${
      d.cara_pembayaran_kembali === "sekaligus"
        ? "sekaligus lunas pada tanggal jatuh tempo"
        : d.cara_pembayaran_kembali === "cicilan_bulanan"
          ? `dicicil setiap bulan${d.jumlah_cicilan ? ` sebanyak ${d.jumlah_cicilan} kali` : ""}${d.jumlah_angsuran ? ` sebesar ${formatRupiah(d.jumlah_angsuran)} per bulan` : ""}`
          : `dicicil setiap minggu${d.jumlah_cicilan ? ` sebanyak ${d.jumlah_cicilan} kali` : ""}${d.jumlah_angsuran ? ` sebesar ${formatRupiah(d.jumlah_angsuran)} per minggu` : ""}`
    }</strong>.</p>
    <p>3. Pembayaran dilakukan melalui transfer ke rekening PIHAK PERTAMA:</p>
    <div class="pihak-box">
      ${d.namaBank ? `<p><strong>Bank :</strong> ${d.namaBank}</p>` : "<p><strong>Bank :</strong> _______________</p>"}
      ${d.nomorRekening ? `<p><strong>Nomor Rekening :</strong> ${d.nomorRekening}</p>` : "<p><strong>Nomor Rekening :</strong> _______________</p>"}
      ${d.atasNamaRekening ? `<p><strong>Atas Nama :</strong> ${d.atasNamaRekening}</p>` : `<p><strong>Atas Nama :</strong> ${d.nama_pemberi_pinjaman}</p>`}
    </div>
    <p>4. Apabila tanggal jatuh tempo jatuh pada hari libur nasional atau hari Minggu, maka kewajiban pembayaran tetap harus dipenuhi pada hari kerja sebelumnya.</p>
    <p>5. Keterlambatan lebih dari <strong>3 (tiga) hari kalender</strong> setelah tanggal jatuh tempo dianggap sebagai wanprestasi dan dikenakan ketentuan denda sebagaimana diatur dalam Pasal Wanprestasi.</p>
    <p>6. <strong>Pelunasan Dipercepat:</strong> Peminjam (PIHAK KEDUA) dapat melakukan pelunasan dipercepat (full prepayment) kapan saja sebelum tanggal jatuh tempo tanpa dikenakan penalti atau biaya tambahan apapun.</p>
  `);

  const bunga = pb.pasal("Bunga Pinjaman", d.ada_bunga && d.persentase_bunga
    ? `
    <p>1. Para Pihak sepakat bahwa atas pinjaman ini dikenakan <strong>bunga sebesar ${d.persentase_bunga}% (${terbilang(d.persentase_bunga)} persen) per bulan</strong>, dihitung secara <strong>${d.jenis_bunga === "flat" ? "flat (dari pokok pinjaman awal)" : d.jenis_bunga === "efektif" ? "efektif/proporsional atas saldo pokok yang belum dibayar" : "majemuk (berbunga atas bunga)"}</strong>.</p>
    <p>2. Bunga mulai dihitung sejak tanggal penyerahan uang pinjaman yaitu <strong>${tglPinjaman}</strong>.</p>
    <p>3. Untuk perhitungan bunga efektif, besaran bunga setiap periode dihitung secara proporsional atas saldo pokok yang belum dibayar pada periode tersebut, sehingga beban bunga berkurang seiring pelunasan cicilan pokok.</p>
    <p>4. Besaran bunga ini disepakati secara sukarela oleh kedua belah pihak sesuai Pasal 1765 dan 1767 KUHPerdata. Apabila bunga yang disepakati melebihi bunga menurut undang-undang, maka berlaku ketentuan Pasal 1767 KUHPerdata.</p>
    <p>5. Pembayaran bunga dilakukan bersamaan dengan pembayaran cicilan pokok, atau pada tanggal jatuh tempo apabila pembayaran sekaligus.</p>
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
      ${d.nilai_jaminan ? `<p><strong>Nilai Taksiran Jaminan :</strong> ${formatRupiah(d.nilai_jaminan)}</p>` : ""}
    </div>
    <p>2. Jaminan tersebut berada dalam <strong>penguasaan PIHAK PERTAMA</strong> selama pinjaman belum lunas sepenuhnya.</p>
    <p>3. PIHAK PERTAMA wajib menjaga dan merawat barang jaminan dengan baik dan mengembalikannya kepada PIHAK KEDUA dalam kondisi semula setelah pinjaman lunas.</p>
    <p>4. Apabila PIHAK KEDUA wanprestasi, PIHAK PERTAMA berhak menggunakan jaminan sebagai kompensasi setelah melalui prosedur hukum yang berlaku. Untuk jaminan berupa kendaraan atau barang bergerak, berlaku ketentuan UU No. 42/1999 tentang Jaminan Fidusia.</p>
    <p>5. <strong>Larangan Pengalihan Jaminan:</strong> Jaminan sebagaimana dimaksud tidak dapat dipindahtangankan, digadaikan, atau dibebani hak lainnya kepada pihak ketiga tanpa persetujuan tertulis dari PIHAK PERTAMA selama pinjaman belum lunas.</p>
    `
    : `
    <p>Para Pihak sepakat bahwa pinjaman ini <strong>tidak disertai jaminan/agunan</strong>. Pinjaman ini semata-mata didasarkan atas kepercayaan Para Pihak.</p>
    `
  );

  const wanprestasi = pb.pasal("Wanprestasi dan Konsekuensi", `
    <p>1. PIHAK KEDUA dikategorikan telah <strong>wanprestasi (cidera janji)</strong> dalam kondisi berikut:</p>
    <ul>
      <li>Tidak membayar cicilan atau pokok pinjaman pada waktu yang telah ditentukan;</li>
      <li>Tidak memenuhi kewajiban lain sebagaimana diatur dalam Perjanjian ini.</li>
    </ul>
    <p>2. Atas keterlambatan pembayaran, PIHAK KEDUA dikenakan <strong>denda keterlambatan sebesar ${dendaPersen}% (${dendaTerbilang} persen) per hari</strong> dari jumlah yang terlambat dibayarkan, terhitung sejak tanggal jatuh tempo hingga tanggal pelunasan aktual.</p>
    <p>3. Apabila keterlambatan lebih dari 30 (tiga puluh) hari kalender, PIHAK PERTAMA berhak untuk menyatakan seluruh sisa hutang <strong>jatuh tempo seketika</strong> (acceleration clause) dan menuntut pelunasan penuh beserta bunga dan denda yang terakumulasi.</p>
    <p>4. PIHAK PERTAMA berhak mengeksekusi jaminan (apabila ada) sebagai bentuk penyelesaian kewajiban PIHAK KEDUA yang menunggak.</p>
    <p>5. Seluruh biaya penagihan, termasuk biaya advokat dan biaya pengadilan, menjadi beban dan tanggung jawab PIHAK KEDUA apabila terjadi wanprestasi.</p>
    <p>6. Ketentuan ini mengacu pada KUHPerdata Pasal 1243–1252 tentang penggantian biaya, kerugian, dan bunga.</p>
  `);

  const forceMajeure = pb.pasal("Keadaan Memaksa (Force Majeure)", `
    <p>1. <strong>Definisi:</strong> Keadaan memaksa (force majeure) diartikan sebagai kondisi di luar kemampuan dan kendali Para Pihak yang tidak dapat diprediksi sebelumnya, termasuk namun tidak terbatas pada: bencana alam, wabah penyakit, perang, huru-hara, pemogokan massal, kebakaran, gempa bumi, banjir bandang, atau kebijakan pemerintah yang secara langsung menghalangi pelaksanaan kewajiban berdasarkan Perjanjian ini.</p>
    <p>2. Pihak yang mengalami force majeure wajib memberitahukan secara tertulis kepada pihak lain dalam waktu <strong>14 (empat belas) hari kalender</strong> sejak terjadinya peristiwa force majeure, disertai bukti-bukti yang relevan.</p>
    <p>3. Selama force majeure berlangsung, kewajiban Pihak yang terdampak ditangguhkan dan tidak dianggap sebagai wanprestasi, sesuai dengan lamanya peristiwa force majeure berlangsung.</p>
    <p>4. Apabila force majeure berlangsung lebih dari 60 (enam puluh) hari kalender berturut-turut, Para Pihak dapat merundingkan kembali syarat-syarat Perjanjian ini atau mengakhiri Perjanjian secara bersama-sama tanpa ada pihak yang dapat menuntut ganti rugi.</p>
  `);

  const pengalihanHak = pb.pasal("Pengalihan Hak dan Kewajiban", `
    <p>1. PIHAK KEDUA tidak dapat mengalihkan seluruh atau sebagian kewajiban-kewajibannya dalam Perjanjian ini kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari PIHAK PERTAMA.</p>
    <p>2. PIHAK PERTAMA berhak untuk mengalihkan seluruh atau sebagian hak-haknya berdasarkan Perjanjian ini kepada pihak ketiga, dengan terlebih dahulu memberikan pemberitahuan tertulis kepada PIHAK KEDUA dalam waktu 7 (tujuh) hari sebelum pengalihan tersebut dilakukan.</p>
    <p>3. Pengalihan hak oleh PIHAK PERTAMA sebagaimana dimaksud pada ayat 2 tidak mengubah, mengurangi, atau membebaskan kewajiban-kewajiban PIHAK KEDUA sebagaimana diatur dalam Perjanjian ini.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Setiap perselisihan yang muncul dari atau sehubungan dengan Perjanjian ini terlebih dahulu diselesaikan melalui <strong>musyawarah untuk mencapai mufakat</strong> dalam waktu 30 (tiga puluh) hari kalender sejak salah satu pihak menyampaikan keberatan secara tertulis.</p>
    <p>2. Apabila penyelesaian musyawarah tidak tercapai, Para Pihak sepakat menyelesaikan sengketa melalui <strong>Pengadilan Negeri</strong> di wilayah hukum tempat Perjanjian ini ditandatangani, yaitu Pengadilan Negeri di kota <strong>${d.kota_penandatanganan}</strong>.</p>
    <p>3. Para Pihak memilih domisili hukum yang tetap di kantor Panitera Pengadilan Negeri ${d.kota_penandatanganan}.</p>
    <p>4. Pilihan hukum yang berlaku adalah <strong>Hukum Negara Republik Indonesia</strong>.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Penutup", `
    <p>1. Dokumen ini mencerminkan keseluruhan kesepakatan Para Pihak, serta menggantikan seluruh perjanjian, pembicaraan, atau komunikasi sebelumnya — baik lisan maupun tertulis — yang berkaitan dengan pokok yang sama.</p>
    <p>2. Setiap perubahan Perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak.</p>
    <p>3. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap asli</strong>, masing-masing bermaterai cukup dan mempunyai kekuatan hukum yang sama, satu rangkap untuk masing-masing pihak.</p>
    <p>4. Perjanjian ini tunduk pada hukum Republik Indonesia, khususnya KUHPerdata Pasal 1313, 1320, 1338, dan 1754–1773.</p>
    <p>5. <strong>Severabilitas:</strong> Apabila salah satu atau lebih ketentuan dalam Perjanjian ini dinyatakan tidak sah, batal demi hukum, atau tidak dapat dilaksanakan oleh pengadilan yang berwenang, maka ketentuan-ketentuan lainnya tetap berlaku sepenuhnya dan mengikat Para Pihak.</p>
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

  ${dasarHukum}
  ${pembukaan}
  ${pokokPinjaman}
  ${jangkaWaktu}
  ${bunga}
  ${jaminan}
  ${wanprestasi}
  ${forceMajeure}
  ${pengalihanHak}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 4px;">
    Demikianlah Perjanjian ini dibuat dan ditandatangani oleh Para Pihak dan Saksi-Saksi pada tanggal <strong>${tglPenandatanganan}</strong>.
  </p>
  <p style="text-align: center; margin-bottom: 16px; font-weight: 700;">
    Dibuat di: ${lokasiTtd}
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Pemberi Pinjaman)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pemberi_pinjaman}</strong></p>
        <p style="font-size: 10pt; color: #555;">NIK: ${d.nik_pemberi_pinjaman}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Penerima Pinjaman)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_penerima_pinjaman}</strong></p>
        <p style="font-size: 10pt; color: #555;">NIK: ${d.nik_penerima_pinjaman}</p>
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
        ${d.nik_saksi_1 ? `<p style="font-size: 10pt; color: #555;">NIK: ${d.nik_saksi_1}</p>` : ""}
        ${d.saksi1Alamat ? `<p style="font-size: 10pt; color: #555;">${d.saksi1Alamat}</p>` : ""}
      </td>
      <td>
        <p>Saksi 2</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_saksi_2 || "________________"}</strong></p>
        ${d.nik_saksi_2 ? `<p style="font-size: 10pt; color: #555;">NIK: ${d.nik_saksi_2}</p>` : ""}
        ${d.saksi2Alamat ? `<p style="font-size: 10pt; color: #555;">${d.saksi2Alamat}</p>` : ""}
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
