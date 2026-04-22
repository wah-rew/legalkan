// ─── Perjanjian Titip Jual / Konsinyasi ─────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1694–1739 (Penitipan), Pasal 1792–1819 (Kuasa),
//              Pasal 1320 & 1338, UU 8/1999 Perlindungan Konsumen, UU 20/2008 UMKM

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
  // Nama toko (distinct dari nama pemilik)
  namaToko?: string;
  // Detail Barang
  nama_produk: string;
  deskripsi_produk: string;
  jumlah_unit_awal: number;
  harga_pokok: number;
  harga_jual_ditetapkan: number;
  boleh_diskon: boolean;
  diskon_maks?: number;
  masaKadaluarsa?: string;    // masa kadaluarsa produk (hari)
  tanggalSerah?: string;      // tanggal penyerahan barang
  // Komisi
  jenis_komisi: "persentase" | "flat" | "selisih";
  persentase_komisi?: number;
  komisi_flat?: number;
  // Periode
  tanggal_mulai: string;
  tanggal_berakhir: string;
  periode_laporan: "mingguan" | "dua_mingguan" | "bulanan";
  periodelaporan?: string;     // periode laporan dalam hari (default "14")
  periodePembayaran?: string;  // periode pembayaran setelah laporan (default "14")
  dendaKeterlambatan?: string; // denda keterlambatan % dari nilai barang (default "2")
  tanggal_setor_hasil: string;
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  lokasiPembuatan?: string;    // lokasi pembuatan (bisa sama dengan kota TTD)
  // Saksi
  saksi1Nama?: string;
  saksi1Nik?: string;
  saksi1Alamat?: string;
  saksi2Nama?: string;
  saksi2Nik?: string;
  saksi2Alamat?: string;
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
  const tglSerah = d.tanggalSerah ? formatTanggal(d.tanggalSerah) : tglMulai;
  const hargaPokok = formatRupiah(d.harga_pokok);
  const hargaJual = formatRupiah(d.harga_jual_ditetapkan);
  const totalNilaiTitipan = formatRupiah(d.jumlah_unit_awal * d.harga_pokok);
  const lokasiPembuatan = d.lokasiPembuatan || d.kota_penandatanganan;
  const periodelaporan = d.periodelaporan || "14";
  const periodePembayaran = d.periodePembayaran || "14";
  const dendaKeterlambatan = d.dendaKeterlambatan || "2";
  const namaToko = d.namaToko || d.nama_konsinyee;

  // Komisi calculations
  const komisiPersen = d.persentase_komisi || 0;
  const komisiPerUnit = d.jenis_komisi === "persentase"
    ? d.harga_jual_ditetapkan * (komisiPersen / 100)
    : d.komisi_flat || 0;
  const bagianPenitipPerUnit = d.jenis_komisi === "persentase"
    ? d.harga_jual_ditetapkan - komisiPerUnit
    : d.harga_jual_ditetapkan - (d.komisi_flat || 0);

  const komisiDesc = d.jenis_komisi === "persentase"
    ? `${d.persentase_komisi}% dari harga jual setiap produk terjual`
    : d.jenis_komisi === "flat"
      ? `${formatRupiah(d.komisi_flat || 0)} per unit terjual`
      : `selisih antara harga jual aktual dan harga pokok (${hargaPokok})`;

  // ─── Pasal 1: Dasar Hukum ──────────────────────────────────────────────────
  const dasarHukum = pb.pasal("Dasar Hukum", `
    <p>Perjanjian Titip Jual (Konsinyasi) ini didasarkan pada ketentuan peraturan perundang-undangan yang berlaku di Republik Indonesia, antara lain:</p>
    <ul>
      <li>Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal <strong>1792–1819</strong> tentang Pemberian Kuasa;</li>
      <li>KUHPerdata Pasal <strong>1320</strong> tentang Syarat Sahnya Perjanjian;</li>
      <li>KUHPerdata Pasal <strong>1338</strong> tentang Kebebasan Berkontrak dan Asas Pacta Sunt Servanda;</li>
      <li>KUHPerdata Pasal <strong>1694–1739</strong> tentang Penitipan Barang;</li>
      <li>Undang-Undang Nomor <strong>8 Tahun 1999</strong> tentang Perlindungan Konsumen;</li>
      <li>Undang-Undang Nomor <strong>20 Tahun 2008</strong> tentang Usaha Mikro, Kecil, dan Menengah (UMKM).</li>
    </ul>
  `);

  // ─── Pasal 2: Para Pihak ───────────────────────────────────────────────────
  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${lokasiPembuatan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Penitip / Pemilik Barang)</p>
      <p><strong>Nama :</strong> ${d.nama_konsinyor}</p>
      <p><strong>NIK :</strong> ${d.nik_konsinyor || "-"}</p>
      <p><strong>Alamat :</strong> ${d.alamat_konsinyor}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_konsinyor || "-"}</p>
      <p><strong>Rekening :</strong> ${d.nama_bank_konsinyor} – ${d.nomor_rekening_konsinyor}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Penitip"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Penerima Titipan / Penjual)</p>
      <p><strong>Nama Toko :</strong> ${namaToko}</p>
      <p><strong>Pemilik :</strong> ${d.nama_konsinyee}</p>
      <p><strong>NIK :</strong> ${d.nik_konsinyee || "-"}</p>
      <p><strong>Alamat Toko :</strong> ${d.alamat_toko_konsinyee}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_konsinyee || "-"}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Penerima Titipan"</strong>.</p>
    </div>
    <p>Para Pihak sepakat membuat Perjanjian Titip Jual (Konsinyasi) atas kehendak bebas, tanpa paksaan, dan memenuhi syarat sah perjanjian sebagaimana diatur dalam KUHPerdata Pasal 1320.</p>
  `);

  // ─── Pasal 3: Objek Konsinyasi ─────────────────────────────────────────────
  const objekKonsinyasi = pb.pasal("Objek Konsinyasi", `
    <p>1. PIHAK PERTAMA menitipkan kepada PIHAK KEDUA barang konsinyasi dengan rincian sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Nama Produk :</strong> ${d.nama_produk}</p>
      <p><strong>Deskripsi :</strong> ${d.deskripsi_produk || "-"}</p>
      <p><strong>Jumlah Unit :</strong> ${d.jumlah_unit_awal} unit</p>
      <p><strong>Harga Pokok (HPP) / unit :</strong> ${hargaPokok}</p>
      <p><strong>Harga Jual Ditetapkan :</strong> ${hargaJual} / unit</p>
      <p><strong>Total Nilai Titipan :</strong> ${totalNilaiTitipan}</p>
      ${d.masaKadaluarsa ? `<p><strong>Masa Kadaluarsa Produk :</strong> ${d.masaKadaluarsa} hari sejak tanggal produksi</p>` : ""}
    </div>
    <p>2. <strong>Kepemilikan Barang:</strong> Barang konsinyasi tetap menjadi <strong>milik PIHAK PERTAMA</strong> sampai terjual dan pembayaran diterima. PIHAK KEDUA hanya bertindak sebagai pemegang titipan.</p>
    <p>3. Penyerahan barang konsinyasi dilakukan pada tanggal <strong>${tglSerah}</strong> dan wajib disertai <strong>Berita Acara Serah Terima Barang (BASTB)</strong> yang ditandatangani Para Pihak, memuat jumlah dan kondisi barang secara rinci.</p>
    <p>4. PIHAK KEDUA dilarang menjual barang di bawah harga yang ditetapkan tanpa izin tertulis PIHAK PERTAMA${d.boleh_diskon && d.diskon_maks ? `, kecuali diskon maksimal ${d.diskon_maks}%` : ""}.</p>
  `);

  // ─── Pasal 4: Jangka Waktu ─────────────────────────────────────────────────
  const jangkaWaktu = pb.pasal("Jangka Waktu", `
    <p>1. Perjanjian konsinyasi ini berlaku dari tanggal <strong>${tglMulai}</strong> sampai dengan <strong>${tglBerakhir}</strong>.</p>
    <p>2. Perjanjian dapat diperpanjang atas kesepakatan tertulis Para Pihak sebelum tanggal berakhir.</p>
    <p>3. Apabila tidak ada pemberitahuan tertulis untuk mengakhiri atau memperpanjang selambat-lambatnya 14 (empat belas) hari sebelum berakhirnya masa perjanjian, maka Perjanjian ini dinyatakan berakhir secara otomatis.</p>
  `);

  // ─── Pasal 5: Sistem Komisi dan Pembagian Hasil ────────────────────────────
  const sistemKomisi = pb.pasal("Sistem Komisi dan Pembagian Hasil", `
    <p>1. Harga jual produk yang ditetapkan PIHAK PERTAMA adalah <strong>${hargaJual} per unit</strong>.</p>
    <p>2. Atas setiap produk yang berhasil terjual, PIHAK KEDUA berhak mendapat komisi sebesar: <strong>${komisiDesc}</strong>.</p>
    ${d.jenis_komisi === "persentase" ? `
    <p>3. Rincian perhitungan komisi per unit yang terjual:</p>
    <div class="pihak-box">
      <p><strong>Harga Jual / unit :</strong> ${hargaJual}</p>
      <p><strong>Komisi PIHAK KEDUA (${d.persentase_komisi}%) :</strong> ${formatRupiah(komisiPerUnit)}</p>
      <p><strong>Bagian PIHAK PERTAMA :</strong> ${formatRupiah(bagianPenitipPerUnit)}</p>
    </div>` : `
    <p>3. Komisi dihitung dan disetorkan bersamaan dengan hasil penjualan sesuai jadwal yang disepakati.</p>`}
    <p>4. PIHAK KEDUA tidak berhak atas komisi atas barang yang hilang, rusak, atau dikembalikan akibat kelalaian PIHAK KEDUA.</p>
    <p>5. Dalam hal PIHAK KEDUA memberikan diskon kepada konsumen${d.boleh_diskon && d.diskon_maks ? ` (maks. ${d.diskon_maks}%)` : ""}, selisih harga diskon ditanggung sepenuhnya oleh PIHAK KEDUA dari porsi komisinya.</p>
  `);

  // ─── Pasal 6: Pelaporan dan Pembayaran ────────────────────────────────────
  const pelaporanPembayaran = pb.pasal("Pelaporan dan Pembayaran", `
    <p>1. PIHAK KEDUA wajib memberikan <strong>laporan penjualan</strong> kepada PIHAK PERTAMA setiap <strong>${periodelaporan} (${periodelaporan === "7" ? "tujuh" : periodelaporan === "14" ? "empat belas" : periodelaporan === "30" ? "tiga puluh" : periodelaporan}) hari</strong>, mencakup:</p>
    <ul>
      <li>Jumlah unit terjual pada periode laporan;</li>
      <li>Jumlah stok tersisa;</li>
      <li>Total uang yang harus disetor kepada PIHAK PERTAMA;</li>
      <li>Kondisi barang yang belum terjual;</li>
      <li>Bukti penjualan (struk, nota, atau catatan penjualan).</li>
    </ul>
    <p>2. Pembayaran hasil penjualan (setelah dikurangi komisi PIHAK KEDUA) wajib disetor ke rekening PIHAK PERTAMA paling lambat <strong>${periodePembayaran} (${periodePembayaran === "7" ? "tujuh" : periodePembayaran === "14" ? "empat belas" : periodePembayaran === "30" ? "tiga puluh" : periodePembayaran}) hari</strong> setelah laporan penjualan diterima dan diverifikasi oleh PIHAK PERTAMA.</p>
    <p>3. Keterlambatan penyetoran dikenakan denda sebagaimana diatur dalam Pasal Wanprestasi.</p>
    <p>4. PIHAK PERTAMA berhak melakukan verifikasi stok dan pembukuan PIHAK KEDUA sewaktu-waktu dengan pemberitahuan terlebih dahulu.</p>
  `);

  // ─── Pasal 7: Hak dan Kewajiban Penitip ───────────────────────────────────
  const hakPenitip = pb.pasal("Hak dan Kewajiban Penitip", `
    <p><strong>Hak PIHAK PERTAMA:</strong></p>
    <ul>
      <li>Menerima laporan penjualan secara berkala sesuai jadwal yang disepakati;</li>
      <li>Menerima pembayaran hasil penjualan tepat waktu sesuai ketentuan;</li>
      <li>Melakukan audit stok di tempat PIHAK KEDUA;</li>
      <li>Menarik kembali barang yang tidak terjual sewaktu-waktu dengan pemberitahuan 7 hari.</li>
    </ul>
    <p><strong>Kewajiban PIHAK PERTAMA:</strong></p>
    <ul>
      <li>Menyerahkan barang dalam kondisi baik, layak jual, dan sesuai standar kualitas;</li>
      <li>Memberikan informasi lengkap mengenai produk, termasuk cara penyimpanan yang benar;</li>
      <li>Mengganti produk yang cacat produksi sesuai ketentuan;</li>
      <li>Memberi notifikasi kepada PIHAK KEDUA jika ada perubahan harga jual secara tertulis.</li>
    </ul>
  `);

  // ─── Pasal 8: Hak dan Kewajiban Penerima ──────────────────────────────────
  const hakPenerima = pb.pasal("Hak dan Kewajiban Penerima Titipan", `
    <p><strong>Hak PIHAK KEDUA:</strong></p>
    <ul>
      <li>Menerima komisi sesuai ketentuan yang disepakati;</li>
      <li>Mengembalikan barang yang tidak terjual pada akhir masa perjanjian;</li>
      <li>Mendapatkan informasi dan dukungan produk dari PIHAK PERTAMA.</li>
    </ul>
    <p><strong>Kewajiban PIHAK KEDUA:</strong></p>
    <ul>
      <li>Menjaga keamanan, keutuhan, dan kondisi barang konsinyasi;</li>
      <li>Menyimpan barang di tempat yang aman, terlindung, sesuai jenis produk;</li>
      <li>Menjual barang sesuai harga yang ditetapkan PIHAK PERTAMA;</li>
      <li>Tidak menggunakan, menjaminkan, atau memindahtangankan barang tanpa izin;</li>
      <li>Memberikan laporan penjualan lengkap beserta bukti penjualan sesuai jadwal;</li>
      <li>Menyetor hasil penjualan tepat waktu sesuai ketentuan.</li>
    </ul>
  `);

  // ─── Pasal 9: Tanggung Jawab Kerusakan Barang ─────────────────────────────
  const tanggungJawabKerusakan = pb.pasal("Tanggung Jawab Kerusakan Barang", `
    <p>Tanggung jawab atas kerusakan atau kehilangan barang konsinyasi ditentukan berdasarkan penyebab kejadian sebagai berikut:</p>
    <p>1. <strong>Cacat Produksi:</strong> Apabila kerusakan disebabkan oleh cacat produksi atau kualitas yang menjadi tanggung jawab PIHAK PERTAMA, maka PIHAK PERTAMA wajib mengganti barang dengan produk baru dalam kondisi baik dalam waktu 7 (tujuh) hari kerja sejak laporan diterima.</p>
    <p>2. <strong>Kelalaian Penerima:</strong> Apabila kerusakan disebabkan oleh kelalaian PIHAK KEDUA dalam penyimpanan, penanganan, atau penggunaan yang tidak sesuai petunjuk, maka PIHAK KEDUA wajib mengganti kerugian sebesar <strong>harga pokok (HPP) per unit</strong> dari barang yang rusak.</p>
    <p>3. <strong>Force Majeure:</strong> Apabila kerusakan atau kehilangan disebabkan oleh kejadian di luar kendali Para Pihak (bencana alam, kebakaran, dll.), risiko ditanggung bersama. PIHAK KEDUA wajib memberikan notifikasi kepada PIHAK PERTAMA dalam waktu <strong>24 (dua puluh empat) jam</strong> sejak kejadian disertai bukti pendukung.</p>
    <p>4. <strong>Kadaluarsa Produk:</strong> Apabila produk mencapai atau melampaui masa kadaluarsa, tanggung jawab berada pada PIHAK PERTAMA. Namun, PIHAK KEDUA <strong>wajib menginformasikan</strong> kepada PIHAK PERTAMA selambat-lambatnya <strong>14 (empat belas) hari</strong> sebelum produk mendekati batas kadaluarsa agar dapat diambil atau diganti tepat waktu.</p>
  `);

  // ─── Pasal 10: Mekanisme Retur Barang ─────────────────────────────────────
  const returBarang = pb.pasal("Mekanisme Retur Barang", `
    <p>1. <strong>Retur dari Konsumen Akhir:</strong> Apabila konsumen mengembalikan produk karena cacat atau tidak sesuai kualitas yang dijanjikan, PIHAK PERTAMA bertanggung jawab atas retur tersebut dan wajib mengganti produk atau mengembalikan harga jual kepada PIHAK KEDUA.</p>
    <p>2. <strong>Retur Barang kepada PIHAK PERTAMA:</strong> PIHAK KEDUA dapat mengembalikan sisa barang konsinyasi yang tidak terjual kepada PIHAK PERTAMA, dengan ketentuan:</p>
    <ul>
      <li>Barang dalam kondisi baik dan masih dalam kemasan asli;</li>
      <li>Tidak melewati masa kadaluarsa${d.masaKadaluarsa ? ` (${d.masaKadaluarsa} hari sejak produksi)` : ""};</li>
      <li>Biaya pengiriman retur ditanggung oleh <strong>PIHAK PERTAMA</strong>.</li>
    </ul>
    <p>3. <strong>Prosedur Retur:</strong></p>
    <ul>
      <li>PIHAK KEDUA memberikan pemberitahuan tertulis kepada PIHAK PERTAMA mengenai rencana retur, mencakup jumlah dan kondisi barang;</li>
      <li>Para Pihak membuat dan menandatangani <strong>Berita Acara Retur</strong> yang memuat rincian barang yang dikembalikan, kondisi barang, dan nilai retur;</li>
      <li>Berita Acara Retur menjadi dasar rekonsiliasi keuangan antara Para Pihak.</li>
    </ul>
  `);

  // ─── Pasal 11: Pengakhiran Kerjasama ──────────────────────────────────────
  const pengakhiran = pb.pasal("Pengakhiran Kerjasama", `
    <p>1. <strong>Pengakhiran Normal:</strong> Perjanjian berakhir pada tanggal <strong>${tglBerakhir}</strong>. Dalam waktu <strong>7 (tujuh) hari</strong> setelah pengakhiran, PIHAK KEDUA wajib:</p>
    <ul>
      <li>Mengembalikan seluruh barang yang tidak terjual dalam kondisi baik;</li>
      <li>Melakukan rekonsiliasi stok dan menyerahkan laporan penjualan akhir;</li>
      <li>Melunasi seluruh hasil penjualan yang belum disetor;</li>
      <li>Menandatangani Berita Acara Pengembalian Barang.</li>
    </ul>
    <p>2. <strong>Pengakhiran Sebelum Waktunya:</strong> Salah satu pihak dapat mengakhiri Perjanjian sebelum masa berakhir dengan memberikan pemberitahuan tertulis kepada pihak lain minimal <strong>30 (tiga puluh) hari</strong> sebelumnya. Seluruh kewajiban yang telah timbul tetap harus diselesaikan.</p>
    <p>3. <strong>Pengakhiran Sepihak:</strong> PIHAK PERTAMA berhak mengakhiri Perjanjian secara sepihak tanpa pemberitahuan 30 hari apabila:</p>
    <ul>
      <li>PIHAK KEDUA terlambat menyetor hasil penjualan lebih dari 30 (tiga puluh) hari;</li>
      <li>PIHAK KEDUA terbukti menggelapkan atau menyalahgunakan barang konsinyasi;</li>
      <li>PIHAK KEDUA menjual barang di bawah harga yang ditetapkan tanpa izin;</li>
      <li>PIHAK KEDUA dinyatakan pailit atau berhenti beroperasi.</li>
    </ul>
    <p>4. <strong>Pasca Pengakhiran:</strong> Setelah Perjanjian berakhir, PIHAK KEDUA dilarang menjual sisa barang konsinyasi yang belum dikembalikan tanpa persetujuan tertulis PIHAK PERTAMA.</p>
  `);

  // ─── Pasal 12: Wanprestasi dan Sanksi ─────────────────────────────────────
  const wanprestasi = pb.pasal("Wanprestasi dan Sanksi", `
    <p>1. Apabila PIHAK KEDUA terlambat menyetor hasil penjualan melewati batas waktu yang ditentukan, dikenakan <strong>denda keterlambatan sebesar ${dendaKeterlambatan}% (${dendaKeterlambatan === "2" ? "dua" : dendaKeterlambatan} persen) dari nilai barang</strong> yang pembayarannya terlambat untuk setiap minggu keterlambatan.</p>
    <p>2. Mekanisme penyelesaian wanprestasi ditempuh secara bertahap:</p>
    <ul>
      <li><strong>Tahap 1 – Teguran Tertulis:</strong> PIHAK PERTAMA mengirimkan teguran tertulis pertama;</li>
      <li><strong>Tahap 2 – Denda:</strong> Apabila tidak ada respons dalam 7 hari, denda mulai berjalan;</li>
      <li><strong>Tahap 3 – Ganti Rugi:</strong> Apabila tidak diselesaikan dalam 30 hari, PIHAK PERTAMA berhak menuntut ganti rugi penuh;</li>
      <li><strong>Tahap 4 – Pemutusan:</strong> PIHAK PERTAMA berhak memutus Perjanjian dan mengambil kembali seluruh barang konsinyasi.</li>
    </ul>
  `);

  // ─── Pasal 13: Penyelesaian Sengketa ──────────────────────────────────────
  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. <strong>Musyawarah:</strong> Segala sengketa yang timbul dari Perjanjian ini diselesaikan terlebih dahulu secara musyawarah mufakat dalam waktu <strong>14 (empat belas) hari</strong> sejak sengketa dilaporkan secara tertulis.</p>
    <p>2. <strong>Mediasi:</strong> Apabila musyawarah tidak menghasilkan kesepakatan, Para Pihak sepakat menempuh jalur mediasi melalui mediator yang disepakati bersama dalam waktu <strong>30 (tiga puluh) hari</strong>.</p>
    <p>3. <strong>Pengadilan:</strong> Apabila mediasi gagal, sengketa diselesaikan melalui <strong>Pengadilan Negeri di wilayah domisili PIHAK KEDUA (Penerima Titipan)</strong>, yaitu wilayah hukum ${d.kota_penandatanganan}.</p>
  `);

  // ─── Pasal 14: Ketentuan Lain-lain ────────────────────────────────────────
  const ketentuanLain = pb.pasal("Ketentuan Lain-lain", `
    <p>1. <strong>Kerahasiaan:</strong> Para Pihak sepakat menjaga kerahasiaan informasi bisnis, data produk, dan harga yang diperoleh dalam pelaksanaan Perjanjian ini.</p>
    <p>2. <strong>Perubahan Perjanjian:</strong> Segala perubahan atau penambahan atas Perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak.</p>
    <p>3. <strong>Hukum yang Berlaku:</strong> Perjanjian ini tunduk pada hukum Negara Republik Indonesia.</p>
    <p>4. <strong>Keutuhan Perjanjian:</strong> Apabila salah satu ketentuan dalam Perjanjian ini dinyatakan tidak sah atau tidak dapat dilaksanakan, ketentuan lainnya tetap berlaku secara penuh.</p>
  `);

  // ─── Pasal 15: Ketentuan Penutup ───────────────────────────────────────────
  const penutup = pb.pasal("Ketentuan Penutup", `
    <p>1. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap bermaterai cukup</strong> sesuai ketentuan UU No. 10 Tahun 2020 tentang Bea Meterai, masing-masing mempunyai kekuatan hukum yang sama.</p>
    <p>2. Perjanjian ini mulai berlaku sejak tanggal ditandatangani oleh Para Pihak dengan itikad baik (<em>bonafide</em>) dan sukarela.</p>
    <p>3. Hal-hal yang belum diatur dalam Perjanjian ini akan diselesaikan atas dasar musyawarah mufakat sesuai peraturan perundang-undangan yang berlaku.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  // ─── Signature Block ────────────────────────────────────────────────────────
  const hasSaksi = d.saksi1Nama || d.saksi2Nama;
  const saksiBlock = hasSaksi ? `
    <p style="text-align: center; margin-top: 24px; font-weight: bold;">SAKSI-SAKSI:</p>
    <table class="tanda-tangan">
      <tr>
        ${d.saksi1Nama ? `<td>
          <p><strong>Saksi 1</strong></p>
          <div class="ttd-area"></div>
          <p><strong>${d.saksi1Nama}</strong></p>
          ${d.saksi1Nik ? `<p>NIK: ${d.saksi1Nik}</p>` : ""}
          ${d.saksi1Alamat ? `<p style="font-size:10pt;">${d.saksi1Alamat}</p>` : ""}
        </td>` : "<td></td>"}
        ${d.saksi2Nama ? `<td>
          <p><strong>Saksi 2</strong></p>
          <div class="ttd-area"></div>
          <p><strong>${d.saksi2Nama}</strong></p>
          ${d.saksi2Nik ? `<p>NIK: ${d.saksi2Nik}</p>` : ""}
          ${d.saksi2Alamat ? `<p style="font-size:10pt;">${d.saksi2Alamat}</p>` : ""}
        </td>` : "<td></td>"}
      </tr>
    </table>` : "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN TITIP JUAL (KONSINYASI)</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1792–1819, Pasal 1320 &amp; 1338, UU 8/1999, UU 20/2008</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${dasarHukum}
  ${paraPihak}
  ${objekKonsinyasi}
  ${jangkaWaktu}
  ${sistemKomisi}
  ${pelaporanPembayaran}
  ${hakPenitip}
  ${hakPenerima}
  ${tanggungJawabKerusakan}
  ${returBarang}
  ${pengakhiran}
  ${wanprestasi}
  ${sengketa}
  ${ketentuanLain}
  ${penutup}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${lokasiPembuatan}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Penitip / Pemilik Barang)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_konsinyor}</strong></p>
        <p>NIK: ${d.nik_konsinyor || "-"}</p>
        <p style="font-size:10pt;">Tanggal: ____________________</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Penerima Titipan / Penjual)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_konsinyee}</strong></p>
        <p>NIK: ${d.nik_konsinyee || "-"}</p>
        <p style="font-size:10pt;">Tanggal: ____________________</p>
      </td>
    </tr>
  </table>

  ${saksiBlock}

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
