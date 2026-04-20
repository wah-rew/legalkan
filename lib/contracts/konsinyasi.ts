// ─── Perjanjian Titip Jual / Konsinyasi ─────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1694–1739 (Penitipan), Pasal 1792–1819 (Kuasa)

import { formatRupiah, formatTanggal, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface KonsinyasiData {
  // Para Pihak
  nama_konsinyor: string;
  nik_konsinyor: string;
  alamat_konsinyor: string;
  nomor_telepon_konsinyor: string;
  nama_bank_konsinyor: string;
  nomor_rekening_konsinyor: string;
  nama_konsinyee: string;
  nik_konsinyee: string;
  alamat_toko_konsinyee: string;
  nomor_telepon_konsinyee: string;
  // Detail Barang
  nama_produk: string;
  deskripsi_produk: string;
  jumlah_unit_awal: number;
  harga_pokok: number;
  harga_jual_ditetapkan: number;
  boleh_diskon: boolean;
  diskon_maks?: number;
  // Komisi
  jenis_komisi: "persentase" | "flat" | "selisih";
  persentase_komisi?: number;
  komisi_flat?: number;
  // Periode
  tanggal_mulai: string;
  tanggal_berakhir: string;
  periode_laporan: "mingguan" | "dua_mingguan" | "bulanan";
  tanggal_setor_hasil: string;
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

export function generateKonsinyasiHTML(d: KonsinyasiData): string {
  const pb = new PasalBuilder();
  const tglMulai = formatTanggal(d.tanggal_mulai);
  const tglBerakhir = formatTanggal(d.tanggal_berakhir);
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const hargaPokok = formatRupiah(d.harga_pokok);
  const hargaJual = formatRupiah(d.harga_jual_ditetapkan);
  const totalNilaiTitipan = formatRupiah(d.jumlah_unit_awal * d.harga_pokok);

  const komisiDesc = d.jenis_komisi === "persentase"
    ? `${d.persentase_komisi}% dari harga jual setiap produk terjual`
    : d.jenis_komisi === "flat"
      ? `${formatRupiah(d.komisi_flat || 0)} per unit terjual`
      : `selisih antara harga jual aktual dan harga pokok (${formatRupiah(d.harga_pokok)})`;

  const periodeLaporan = d.periode_laporan === "mingguan" ? "setiap minggu" : d.periode_laporan === "dua_mingguan" ? "setiap dua minggu" : "setiap bulan";

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Konsinyor / Pemilik Barang)</p>
      <p><strong>Nama :</strong> ${d.nama_konsinyor}</p>
      <p><strong>NIK :</strong> ${d.nik_konsinyor}</p>
      <p><strong>Alamat :</strong> ${d.alamat_konsinyor}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_konsinyor}</p>
      <p><strong>Rekening :</strong> ${d.nama_bank_konsinyor} – ${d.nomor_rekening_konsinyor}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Konsinyor"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Konsinyee / Penjual)</p>
      <p><strong>Nama :</strong> ${d.nama_konsinyee}</p>
      <p><strong>NIK :</strong> ${d.nik_konsinyee}</p>
      <p><strong>Alamat Toko :</strong> ${d.alamat_toko_konsinyee}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_konsinyee}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Konsinyee"</strong>.</p>
    </div>
    <p>Para Pihak sepakat membuat Perjanjian Titip Jual (Konsinyasi) atas kehendak bebas sesuai KUHPerdata Pasal 1320 dan Pasal 1694.</p>
  `);

  const barangKonsinyasi = pb.pasal("Barang Konsinyasi", `
    <p>1. PIHAK PERTAMA menitipkan kepada PIHAK KEDUA barang konsinyasi dengan rincian sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Nama Produk :</strong> ${d.nama_produk}</p>
      <p><strong>Deskripsi :</strong> ${d.deskripsi_produk}</p>
      <p><strong>Jumlah Unit :</strong> ${d.jumlah_unit_awal} unit</p>
      <p><strong>Harga Pokok/unit :</strong> ${hargaPokok}</p>
      <p><strong>Harga Jual Ditetapkan :</strong> ${hargaJual}/unit</p>
      <p><strong>Total Nilai Titipan :</strong> ${totalNilaiTitipan}</p>
    </div>
    <p>2. <strong>Kepemilikan Barang:</strong> Barang konsinyasi tetap menjadi <strong>milik PIHAK PERTAMA</strong> sampai terjual dan pembayaran diterima oleh PIHAK PERTAMA. PIHAK KEDUA hanya bertindak sebagai pemegang titipan.</p>
    <p>3. Penyerahan barang konsinyasi dilakukan pada tanggal <strong>${tglMulai}</strong> dan wajib disertai <strong>Berita Acara Serah Terima Barang (BASTB)</strong> yang ditandatangani Para Pihak, memuat jumlah dan kondisi barang secara rinci.</p>
    <p>4. PIHAK KEDUA dilarang menjual barang di bawah harga yang ditetapkan tanpa izin tertulis PIHAK PERTAMA${d.boleh_diskon && d.diskon_maks ? `, kecuali diskon maksimal ${d.diskon_maks}%` : ""}.</p>
  `);

  const komisi = pb.pasal("Harga Jual dan Komisi", `
    <p>1. Harga jual produk yang ditetapkan PIHAK PERTAMA adalah <strong>${hargaJual} per unit</strong>.</p>
    <p>2. Atas setiap produk yang berhasil terjual, PIHAK KEDUA berhak mendapat komisi sebesar: <strong>${komisiDesc}</strong>.</p>
    <p>3. Komisi dihitung dan disetorkan bersamaan dengan hasil penjualan sesuai jadwal yang disepakati.</p>
    <p>4. PIHAK KEDUA tidak berhak atas komisi atas barang yang hilang, rusak, atau dikembalikan akibat kelalaian PIHAK KEDUA.</p>
  `);

  const pelaporan = pb.pasal("Pelaporan dan Penyetoran Hasil Penjualan", `
    <p>1. PIHAK KEDUA wajib memberikan <strong>laporan penjualan</strong> kepada PIHAK PERTAMA ${periodeLaporan}, mencakup:</p>
    <ul>
      <li>Jumlah unit terjual pada periode laporan;</li>
      <li>Jumlah stok tersisa;</li>
      <li>Total uang yang harus disetor kepada PIHAK PERTAMA;</li>
      <li>Kondisi barang yang belum terjual.</li>
    </ul>
    <p>2. Hasil penjualan (setelah dikurangi komisi PIHAK KEDUA) wajib disetor ke rekening PIHAK PERTAMA paling lambat pada tanggal <strong>${formatTanggal(d.tanggal_setor_hasil)}</strong> atau sesuai siklus yang disepakati.</p>
    <p>3. Keterlambatan penyetoran lebih dari <strong>7 (tujuh) hari</strong> dari jadwal dikenakan denda 1% per hari dari jumlah yang belum disetor.</p>
    <p>4. PIHAK PERTAMA berhak melakukan verifikasi stok dan pembukuan PIHAK KEDUA sewaktu-waktu dengan pemberitahuan terlebih dahulu.</p>
  `);

  const tanggungJawab = pb.pasal("Tanggung Jawab atas Barang", `
    <p>1. PIHAK KEDUA bertanggung jawab penuh atas keamanan, keutuhan, dan kondisi barang konsinyasi selama berada di tangan PIHAK KEDUA.</p>
    <p>2. Apabila barang konsinyasi <strong>hilang, rusak, atau dicuri</strong> saat berada di tangan PIHAK KEDUA, PIHAK KEDUA wajib mengganti kerugian sebesar <strong>harga pokok per unit</strong> dari barang yang hilang/rusak tersebut.</p>
    <p>3. PIHAK KEDUA <strong>dilarang</strong>:</p>
    <ul>
      <li>Menggunakan barang konsinyasi untuk keperluan pribadi;</li>
      <li>Menjaminkan barang konsinyasi kepada pihak ketiga;</li>
      <li>Memindahtangankan barang konsinyasi tanpa izin tertulis PIHAK PERTAMA.</li>
    </ul>
    <p>4. PIHAK KEDUA wajib menyimpan barang konsinyasi di tempat yang aman, terlindung, dan layak sesuai jenis produk.</p>
  `);

  const jangkaWaktu = pb.pasal("Jangka Waktu dan Pengembalian Barang", `
    <p>1. Perjanjian konsinyasi ini berlaku dari tanggal <strong>${tglMulai}</strong> sampai dengan <strong>${tglBerakhir}</strong>.</p>
    <p>2. Perjanjian dapat diperpanjang atas kesepakatan tertulis Para Pihak sebelum tanggal berakhir.</p>
    <p>3. Pada akhir masa konsinyasi (atau saat Perjanjian berakhir), PIHAK KEDUA wajib:</p>
    <ul>
      <li>Mengembalikan seluruh barang yang tidak terjual dalam kondisi <strong>baik dan layak jual</strong>;</li>
      <li>Melakukan rekonsiliasi stok dan menyetor seluruh hasil penjualan yang belum disetor;</li>
      <li>Menandatangani Berita Acara Pengembalian Barang.</li>
    </ul>
    <p>4. Barang yang dikembalikan dalam kondisi rusak atau tidak lengkap menjadi tanggung jawab PIHAK KEDUA.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Sengketa diselesaikan secara musyawarah dalam 21 (dua puluh satu) hari.</p>
    <p>2. Apabila gagal, sengketa diselesaikan di <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong>.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap</strong> bermaterai cukup, berlaku mulai tanggal ditandatangani.</p>
    <p>2. Perubahan hanya sah secara tertulis dengan tanda tangan Para Pihak.</p>
    <p>3. Perjanjian tunduk pada KUHPerdata Pasal 1694–1739 dan Pasal 1792–1819.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN TITIP JUAL (KONSINYASI)</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1694–1739 dan Pasal 1792–1819</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${barangKonsinyasi}
  ${komisi}
  ${pelaporan}
  ${tanggungJawab}
  ${jangkaWaktu}
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
        <p>(Konsinyor / Pemilik Barang)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_konsinyor}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Konsinyee / Penjual)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_konsinyee}</strong></p>
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
