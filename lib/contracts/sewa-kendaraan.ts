// ─── Kontrak Sewa Kendaraan ──────────────────────────────────────────────────
// Dasar hukum: KUHPerdata 1548-1600, UU 22/2009 LLAJ, UU 8/1999 Perlindungan Konsumen

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface SewaKendaraanData {
  // Para Pihak
  nama_pemilik_kendaraan: string;
  nik_pemilik: string;
  alamat_pemilik: string;
  nomor_telepon_pemilik: string;
  nomor_rekening_pemilik: string;
  nama_bank_pemilik: string;
  nama_penyewa: string;
  nik_penyewa: string;
  alamat_penyewa: string;
  nomor_telepon_penyewa: string;
  nomor_sim: string;
  jenis_sim: "A" | "B1" | "B2" | "C" | "D";
  // Detail Kendaraan
  jenis_kendaraan: "motor" | "mobil" | "truk" | "lainnya";
  merek_kendaraan: string;
  model_kendaraan: string;
  tahun_kendaraan: number;
  warna_kendaraan: string;
  nomor_polisi: string;
  nomor_rangka: string;
  nomor_mesin: string;
  kondisi_awal_kendaraan: string;
  km_awal: number;
  // Detail Sewa
  tanggal_mulai_sewa: string;
  tanggal_selesai_sewa: string;
  jamPenyerahan?: string;      // default "08.00 WIB"
  jamPengembalian?: string;    // default "18.00 WIB"
  harga_sewa_per_hari?: number;
  harga_sewa_per_bulan?: number;
  total_harga_sewa: number;
  batas_km_per_hari?: number;
  biaya_km_lebih?: number;
  // Denda
  dendaKeterlambatan?: string; // default "200.000" per jam
  // Deposit / Jaminan
  jumlah_deposit: number;
  jumlahJaminan?: string;      // override text untuk jaminan (opsional)
  kapan_deposit_dikembalikan: string;
  // Pembayaran
  skema_pembayaran: "lunas_di_muka" | "dp_lunas_saat_kembali";
  // Ketentuan
  area_penggunaan: "dalam_kota" | "dalam_provinsi" | "seluruh_Indonesia";
  // Penandatanganan
  kota_penandatanganan: string;
  lokasiPembuatan?: string;
  tanggal_penandatanganan: string;
  saksi_1_nama?: string;
  saksi1Alamat?: string;
  saksi_2_nama?: string;
  saksi2Alamat?: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateSewaKendaraanHTML(d: SewaKendaraanData): string {
  const pb = new PasalBuilder();
  const tglMulai = formatTanggal(d.tanggal_mulai_sewa);
  const tglSelesai = formatTanggal(d.tanggal_selesai_sewa);
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const totalFormatted = formatRupiah(d.total_harga_sewa);
  const depositFormatted = formatRupiah(d.jumlah_deposit);
  const lokasiPembuatan = d.lokasiPembuatan || d.kota_penandatanganan;
  const jamPenyerahan = d.jamPenyerahan || "08.00 WIB";
  const jamPengembalian = d.jamPengembalian || "18.00 WIB";
  const dendaPerJam = d.dendaKeterlambatan
    ? formatRupiah(parseInt(d.dendaKeterlambatan.replace(/\D/g, ""), 10) || 200000)
    : "Rp 200.000";

  const areaLabel = d.area_penggunaan === "dalam_kota" ? "dalam kota tempat penyewaan"
    : d.area_penggunaan === "dalam_provinsi" ? "dalam wilayah provinsi"
    : "seluruh wilayah Indonesia";

  // ── Pasal 1: Dasar Hukum ──────────────────────────────────────────────────
  const dasarHukum = pb.pasal("Dasar Hukum", `
    <p>Perjanjian ini dibuat berdasarkan:</p>
    <ol>
      <li>Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal 1548–1600 tentang Sewa-Menyewa;</li>
      <li>Undang-Undang Nomor 22 Tahun 2009 tentang Lalu Lintas dan Angkutan Jalan (UU LLAJ);</li>
      <li>Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen;</li>
      <li>Peraturan perundang-undangan lain yang berlaku di wilayah Republik Indonesia.</li>
    </ol>
  `);

  // ── Pasal 2: Para Pihak ───────────────────────────────────────────────────
  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${lokasiPembuatan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemilik / Pemberi Sewa Kendaraan)</p>
      <p><strong>Nama :</strong> ${d.nama_pemilik_kendaraan}</p>
      <p><strong>NIK :</strong> ${d.nik_pemilik}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pemilik}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_pemilik}</p>
      <p><strong>Rekening :</strong> ${d.nama_bank_pemilik} – ${d.nomor_rekening_pemilik}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Penyewa Kendaraan)</p>
      <p><strong>Nama :</strong> ${d.nama_penyewa}</p>
      <p><strong>NIK :</strong> ${d.nik_penyewa}</p>
      <p><strong>Alamat :</strong> ${d.alamat_penyewa}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_penyewa}</p>
      <p><strong>Nomor SIM :</strong> ${d.nomor_sim} (SIM ${d.jenis_sim})</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong>.</p>
    </div>
    <p>Para Pihak sepakat untuk mengadakan Perjanjian Sewa Kendaraan dengan syarat dan ketentuan sebagaimana diatur dalam pasal-pasal berikut.</p>
  `);

  // ── Pasal 3: Objek Sewa ───────────────────────────────────────────────────
  const objekSewa = pb.pasal("Objek Sewa (Kendaraan)", `
    <p>1. PIHAK PERTAMA menyewakan kepada PIHAK KEDUA kendaraan dengan spesifikasi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Jenis :</strong> ${d.jenis_kendaraan.charAt(0).toUpperCase() + d.jenis_kendaraan.slice(1)}</p>
      <p><strong>Merek/Model :</strong> ${d.merek_kendaraan} ${d.model_kendaraan}</p>
      <p><strong>Tahun :</strong> ${d.tahun_kendaraan}</p>
      <p><strong>Warna :</strong> ${d.warna_kendaraan}</p>
      <p><strong>Nomor Polisi :</strong> ${d.nomor_polisi}</p>
      <p><strong>Nomor Rangka :</strong> ${d.nomor_rangka}</p>
      <p><strong>Nomor Mesin :</strong> ${d.nomor_mesin}</p>
      <p><strong>KM Awal :</strong> ${d.km_awal.toLocaleString("id-ID")} km</p>
    </div>
    <p>2. Kelengkapan kendaraan yang diserahkan:</p>
    <ul>
      <li>Surat Tanda Nomor Kendaraan (STNK);</li>
      <li>Kunci kendaraan (kunci utama dan/atau kunci cadangan);</li>
      <li>Toolkit / peralatan darurat kendaraan;</li>
      <li>Ban serep;</li>
      <li>Dokumen asuransi kendaraan (apabila ada).</li>
    </ul>
    <p>3. Kondisi kendaraan saat serah terima: ${d.kondisi_awal_kendaraan}. BPKB tetap dipegang oleh PIHAK PERTAMA.</p>
    <p>4. Penyerahan kendaraan wajib disertai <strong>Berita Acara Serah Terima (BAST)</strong> bermaterai yang ditandatangani Para Pihak, memuat kondisi kendaraan, KM odometer, kelengkapan kendaraan, dan dokumen yang diserahterimakan.</p>
  `);

  // ── Pasal 4: Jangka Waktu Sewa ────────────────────────────────────────────
  const jangkaWaktu = pb.pasal("Jangka Waktu Sewa", `
    <p>1. Sewa kendaraan berlaku dari tanggal <strong>${tglMulai}</strong> pukul <strong>${jamPenyerahan}</strong> sampai dengan tanggal <strong>${tglSelesai}</strong> pukul <strong>${jamPengembalian}</strong>.</p>
    <p>2. Penyerahan dan pengembalian kendaraan dilakukan pada waktu dan tempat yang disepakati Para Pihak sesuai angka 1 di atas.</p>
    <p>3. Apabila PIHAK KEDUA bermaksud memperpanjang masa sewa, pemberitahuan wajib disampaikan kepada PIHAK PERTAMA <strong>paling lambat 24 (dua puluh empat) jam</strong> sebelum masa sewa berakhir, dan perpanjangan baru sah setelah mendapat persetujuan tertulis dari PIHAK PERTAMA.</p>
    <p>4. Keterlambatan pengembalian tanpa pemberitahuan atau tanpa persetujuan perpanjangan dikenakan denda sebagaimana diatur dalam Pasal Denda dan Sanksi.</p>
    <p>5. Apabila kendaraan tidak dikembalikan lebih dari <strong>24 (dua puluh empat) jam</strong> dari waktu yang disepakati tanpa pemberitahuan, PIHAK PERTAMA berhak melaporkan kepada pihak berwajib.</p>
  `);

  // ── Pasal 5: Biaya Sewa dan Pembayaran ───────────────────────────────────
  const harga = pb.pasal("Biaya Sewa dan Pembayaran", `
    <p>1. Biaya sewa yang disepakati:</p>
    <div class="pihak-box">
      ${d.harga_sewa_per_hari ? `<p><strong>Harga per hari :</strong> ${formatRupiah(d.harga_sewa_per_hari)}</p>` : ""}
      ${d.harga_sewa_per_bulan ? `<p><strong>Harga per bulan :</strong> ${formatRupiah(d.harga_sewa_per_bulan)}</p>` : ""}
      <p><strong>Total Biaya Sewa :</strong> ${totalFormatted}</p>
      <p><strong>Terbilang :</strong> (${terbilang(d.total_harga_sewa)} rupiah)</p>
    </div>
    <p>2. Pembayaran dilakukan secara <strong>${d.skema_pembayaran === "lunas_di_muka" ? "lunas di muka sebelum kendaraan diserahkan" : "DP di muka, pelunasan saat kendaraan dikembalikan"}</strong> ke rekening PIHAK PERTAMA: ${d.nama_bank_pemilik} – ${d.nomor_rekening_pemilik}.</p>
    ${d.batas_km_per_hari && d.batas_km_per_hari > 0
      ? `<p>3. Batas penggunaan <strong>${d.batas_km_per_hari} km per hari</strong>. Kelebihan dikenakan biaya <strong>${d.biaya_km_lebih ? formatRupiah(d.biaya_km_lebih) + " per km" : "yang disepakati"}</strong>.</p>`
      : `<p>3. Tidak ada batas km harian.</p>`
    }
    <p>${d.batas_km_per_hari && d.batas_km_per_hari > 0 ? "4" : "3"}. <strong>Bahan Bakar Minyak (BBM):</strong> Kendaraan diserahkan dalam kondisi <strong>tangki penuh</strong>, dan wajib dikembalikan dalam kondisi <strong>tangki penuh</strong>. Apabila tidak penuh saat dikembalikan, PIHAK KEDUA dikenakan biaya pengisian BBM sesuai harga yang berlaku.</p>
    <p>${d.batas_km_per_hari && d.batas_km_per_hari > 0 ? "5" : "4"}. <strong>Biaya parkir, tol, dan biaya operasional lainnya</strong> selama masa sewa sepenuhnya menjadi tanggung jawab PIHAK KEDUA.</p>
  `);

  // ── Pasal 6: Jaminan ─────────────────────────────────────────────────────
  const jaminan = pb.pasal("Jaminan", `
    <p>1. Sebagai jaminan pelaksanaan kewajiban, PIHAK KEDUA menyerahkan kepada PIHAK PERTAMA salah satu dari:</p>
    <ul>
      <li>Uang jaminan sebesar <strong>${d.jumlahJaminan ? d.jumlahJaminan : depositFormatted}</strong>; <em>atau</em></li>
      <li>Fotokopi KTP dan/atau SIM yang berlaku (untuk jaminan identitas).</li>
    </ul>
    <p>2. ${d.jumlah_deposit > 0 ? `Uang jaminan sebesar <strong>${depositFormatted}</strong> digunakan sebagai jaminan atas kerusakan kendaraan, keterlambatan pengembalian, atau kewajiban lain yang belum dipenuhi PIHAK KEDUA.` : "Jenis dan besaran jaminan disesuaikan kesepakatan Para Pihak."}</p>
    <p>3. Jaminan dikembalikan <strong>${d.kapan_deposit_dikembalikan}</strong> setelah kendaraan dikembalikan dalam kondisi baik dan seluruh kewajiban PIHAK KEDUA dipenuhi.</p>
    <p>4. PIHAK PERTAMA berhak memotong/menahan jaminan untuk biaya perbaikan kerusakan yang disebabkan PIHAK KEDUA, denda keterlambatan, tunggakan BBM, atau kewajiban lainnya.</p>
    <p>5. Jaminan uang/dokumen ditahan hingga seluruh urusan tilang, kecelakaan, atau sengketa terkait kendaraan diselesaikan.</p>
  `);

  // ── Pasal 7: Kewajiban Penyewa ────────────────────────────────────────────
  const kewajibanPenyewa = pb.pasal("Hak dan Kewajiban Penyewa", `
    <p>1. PIHAK KEDUA berhak menggunakan kendaraan sesuai spesifikasi, jangka waktu, dan area yang disepakati.</p>
    <p>2. PIHAK KEDUA berkewajiban untuk:</p>
    <ul>
      <li>Menggunakan kendaraan dengan penuh tanggung jawab sesuai peraturan lalu lintas yang berlaku;</li>
      <li>Memiliki SIM yang valid dan sesuai jenis kendaraan sepanjang masa sewa;</li>
      <li>Merawat kendaraan selama masa sewa seperti milik sendiri;</li>
      <li>Membayar BBM, tol, parkir, dan biaya operasional lainnya;</li>
      <li>Menghubungi PIHAK PERTAMA dalam waktu <strong>1 (satu) jam</strong> apabila terjadi kecelakaan atau kerusakan;</li>
      <li>Mengembalikan kendaraan tepat waktu dalam kondisi bersih dan tidak lebih buruk dari saat diserahkan;</li>
      <li>Mengembalikan kendaraan beserta seluruh kelengkapan yang diserahterimakan.</li>
    </ul>
    <p>3. Area penggunaan kendaraan dibatasi untuk wilayah <strong>${areaLabel}</strong>. Penggunaan di luar wilayah tersebut wajib mendapat izin tertulis dari PIHAK PERTAMA.</p>
  `);

  // ── Pasal 8: Larangan ─────────────────────────────────────────────────────
  const larangan = pb.pasal("Larangan Penggunaan", `
    <p>PIHAK KEDUA <strong>dilarang keras</strong> melakukan hal-hal berikut selama masa sewa:</p>
    <ol>
      <li>Merokok di dalam kendaraan;</li>
      <li>Membawa hewan peliharaan di dalam kendaraan;</li>
      <li>Menggunakan kendaraan untuk kegiatan balapan atau uji kecepatan;</li>
      <li>Menggunakan kendaraan untuk kegiatan ilegal, kriminal, atau yang bertentangan dengan hukum;</li>
      <li>Memodifikasi kendaraan tanpa izin tertulis PIHAK PERTAMA;</li>
      <li>Meminjamkan atau menyewakan kembali kendaraan kepada pihak lain;</li>
      <li>Menggadaikan atau menjaminkan kendaraan kepada pihak mana pun;</li>
      <li>Menggunakan kendaraan untuk mengangkut barang berbahaya atau bahan terlarang;</li>
      <li>Membawa kendaraan keluar dari wilayah <strong>${areaLabel}</strong> tanpa izin tertulis.</li>
    </ol>
    <p>Pelanggaran larangan ini mengakibatkan pengakhiran perjanjian secara sepihak oleh PIHAK PERTAMA, dan PIHAK KEDUA bertanggung jawab penuh atas segala kerugian yang timbul.</p>
  `);

  // ── Pasal 9: Tanggung Jawab Kerusakan ────────────────────────────────────
  const kerusakan = pb.pasal("Tanggung Jawab Kerusakan", `
    <p>1. <strong>Kerusakan akibat pemakaian normal</strong> (ban bocor, goresan minor) yang wajar selama penggunaan sesuai ketentuan menjadi tanggung jawab bersama sesuai kesepakatan Para Pihak.</p>
    <p>2. <strong>Kerusakan akibat kelalaian atau kesalahan PIHAK KEDUA</strong> (tabrakan, terperosok, kerusakan interior) sepenuhnya menjadi tanggung jawab PIHAK KEDUA, termasuk biaya perbaikan dan biaya sewa selama masa perbaikan.</p>
    <p>3. <strong>Kehilangan kendaraan:</strong> Apabila kendaraan hilang selama masa sewa, PIHAK KEDUA wajib mengganti dengan kendaraan sejenis atau membayar nilai pasar kendaraan pada saat kehilangan, dikurangi klaim asuransi yang diterima (apabila ada). Selisih antara nilai ganti rugi asuransi dan nilai pasar kendaraan menjadi tanggung jawab PIHAK KEDUA.</p>
    <p>4. <strong>Total loss:</strong> Apabila kendaraan mengalami kerusakan total (total loss), PIHAK KEDUA wajib membayar penggantian senilai harga pasar kendaraan dikurangi nilai pertanggungan asuransi.</p>
    <p>5. PIHAK KEDUA wajib segera membuat Laporan Polisi apabila terjadi kecelakaan atau kehilangan, dan menyerahkan salinannya kepada PIHAK PERTAMA dalam waktu <strong>24 (dua puluh empat) jam</strong> sejak kejadian.</p>
  `);

  // ── Pasal 10: Prosedur Kecelakaan ─────────────────────────────────────────
  const prosedurKecelakaan = pb.pasal("Prosedur Kecelakaan", `
    <p>Apabila terjadi kecelakaan selama masa sewa, PIHAK KEDUA wajib mengikuti prosedur berikut:</p>
    <p><strong>A. Tindakan Segera:</strong></p>
    <ol>
      <li>Mengutamakan keselamatan jiwa — segera menjauh dari bahaya dan membantu korban jika ada;</li>
      <li>Menghubungi pihak kepolisian terdekat dan meminta bantuan jika diperlukan;</li>
      <li>Mendokumentasikan kejadian (foto kondisi kendaraan, lokasi, kerusakan, identitas pihak lain jika ada);</li>
      <li>Menghubungi PIHAK PERTAMA paling lambat <strong>1 (satu) jam</strong> setelah kejadian.</li>
    </ol>
    <p><strong>B. Pelaporan:</strong></p>
    <ol>
      <li>Menyampaikan laporan tertulis kepada PIHAK PERTAMA dalam waktu <strong>24 (dua puluh empat) jam</strong> sejak kejadian, disertai foto-foto kejadian dan surat keterangan kepolisian;</li>
      <li>Tidak boleh mengakui kesalahan atau membuat janji ganti rugi kepada pihak lain tanpa persetujuan PIHAK PERTAMA.</li>
    </ol>
    <p><strong>C. Klaim Asuransi dan Ganti Rugi:</strong></p>
    <ol>
      <li>Apabila kendaraan diasuransikan, klaim asuransi diurus bersama antara PIHAK PERTAMA dan PIHAK KEDUA;</li>
      <li>Selisih antara nilai klaim asuransi dan biaya perbaikan/kerugian aktual menjadi tanggung jawab PIHAK KEDUA;</li>
      <li>Tanggung jawab hukum kepada pihak ketiga (korban atau pemilik kendaraan lain) menjadi tanggung jawab PIHAK KEDUA sepenuhnya.</li>
    </ol>
  `);

  // ── Pasal 11: Denda dan Sanksi ────────────────────────────────────────────
  const dendaSanksi = pb.pasal("Denda dan Sanksi", `
    <p>1. <strong>Denda Keterlambatan:</strong> Keterlambatan pengembalian kendaraan dikenakan denda <strong>${dendaPerJam} per jam</strong>, terhitung sejak waktu seharusnya kendaraan dikembalikan.</p>
    <p>2. <strong>Denda Tilang:</strong></p>
    <ul>
      <li>Setiap pelanggaran lalu lintas dan tilang yang terjadi selama masa sewa menjadi tanggung jawab sepenuhnya PIHAK KEDUA;</li>
      <li>Uang jaminan dan/atau dokumen jaminan akan ditahan oleh PIHAK PERTAMA hingga urusan tilang diselesaikan oleh PIHAK KEDUA;</li>
      <li>PIHAK PERTAMA tidak bertanggung jawab atas akibat hukum dari pelanggaran lalu lintas yang dilakukan PIHAK KEDUA.</li>
    </ul>
    <p>3. <strong>Pelanggaran Larangan:</strong> Pelanggaran terhadap ketentuan Pasal Larangan Penggunaan dapat dikenakan denda tambahan sebesar <strong>100% – 200%</strong> dari tarif sewa harian, di samping kewajiban ganti rugi atas kerusakan yang ditimbulkan.</p>
    <p>4. <strong>Kendaraan Tidak Dikembalikan:</strong> Apabila kendaraan tidak dikembalikan lebih dari 1×24 jam dari batas waktu sewa tanpa kabar, PIHAK PERTAMA berhak melaporkan kepada pihak kepolisian dengan dugaan tindak pidana penggelapan.</p>
  `);

  // ── Pasal 12: Pengakhiran Perjanjian ──────────────────────────────────────
  const pengakhiran = pb.pasal("Pengakhiran Perjanjian", `
    <p>1. <strong>Berakhir Normal:</strong> Perjanjian berakhir dengan sendirinya pada tanggal ${tglSelesai} pukul ${jamPengembalian}, dengan dikembalikannya kendaraan dalam kondisi baik dan dilunaskannya seluruh kewajiban PIHAK KEDUA.</p>
    <p>2. <strong>Pengakhiran Sebelum Waktunya oleh PIHAK KEDUA:</strong> Apabila PIHAK KEDUA mengakhiri sewa sebelum tanggal yang disepakati, biaya sewa yang telah dibayarkan <strong>tidak dapat dikembalikan (no refund)</strong>, kecuali disepakati lain secara tertulis oleh Para Pihak.</p>
    <p>3. <strong>Pengakhiran Sepihak oleh PIHAK PERTAMA:</strong> PIHAK PERTAMA berhak mengakhiri perjanjian secara sepihak apabila PIHAK KEDUA melanggar ketentuan perjanjian ini, khususnya larangan-larangan yang diatur dalam Pasal Larangan Penggunaan, tanpa kewajiban mengembalikan biaya sewa.</p>
    <p>4. Pengakhiran perjanjian wajib disertai Berita Acara Pengembalian Kendaraan yang ditandatangani Para Pihak.</p>
  `);

  // ── Pasal 13: Penyelesaian Sengketa ───────────────────────────────────────
  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Setiap perselisihan yang timbul dari perjanjian ini diselesaikan secara musyawarah untuk mufakat dalam jangka waktu <strong>14 (empat belas) hari</strong> kalender sejak perselisihan diketahui.</p>
    <p>2. Apabila musyawarah tidak mencapai kesepakatan, Para Pihak dapat menempuh jalur <strong>mediasi</strong> melalui lembaga mediasi yang disepakati dalam waktu <strong>30 (tiga puluh) hari</strong>.</p>
    <p>3. Apabila mediasi gagal, perselisihan diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong> (domisili hukum PIHAK PERTAMA) sebagai yurisdiksi yang dipilih.</p>
  `);

  // ── Pasal 14: Ketentuan Lain-lain ─────────────────────────────────────────
  const ketentuan = pb.pasal("Ketentuan Lain-lain", `
    <p>1. <strong>Force Majeure:</strong> Apabila terjadi keadaan kahar (bencana alam, perang, pandemi, atau kejadian di luar kendali manusia) yang menghalangi pelaksanaan perjanjian, pihak yang terdampak wajib memberitahukan pihak lainnya dalam waktu <strong>24 (dua puluh empat) jam</strong> sejak terjadinya keadaan kahar. Para Pihak berunding dalam itikad baik untuk menyelesaikan dampaknya.</p>
    <p>2. <strong>Perubahan Perjanjian:</strong> Setiap perubahan atau penambahan ketentuan perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak.</p>
    <p>3. <strong>Hukum yang Berlaku:</strong> Perjanjian ini tunduk pada hukum yang berlaku di Negara Republik Indonesia.</p>
    <p>4. <strong>Keaslian Dokumen:</strong> Perjanjian ini dibuat dalam <strong>2 (dua) rangkap bermaterai cukup</strong>, masing-masing mempunyai kekuatan hukum yang sama, satu untuk PIHAK PERTAMA dan satu untuk PIHAK KEDUA.</p>
    <p>5. Perjanjian ini mulai berlaku sejak ditandatangani oleh Para Pihak dengan itikad baik.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN SEWA KENDARAAN</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1548–1600, UU No. 22 Tahun 2009 tentang LLAJ, dan UU No. 8 Tahun 1999 tentang Perlindungan Konsumen</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${dasarHukum}
  ${paraPihak}
  ${objekSewa}
  ${jangkaWaktu}
  ${harga}
  ${jaminan}
  ${kewajibanPenyewa}
  ${larangan}
  ${kerusakan}
  ${prosedurKecelakaan}
  ${dendaSanksi}
  ${pengakhiran}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${lokasiPembuatan}</strong> pada tanggal <strong>${tglTtd}</strong>, dengan itikad baik dan <strong>bermaterai cukup</strong>, untuk dipatuhi oleh Para Pihak.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Pemilik Kendaraan)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pemilik_kendaraan}</strong></p>
        <p>NIK: ${d.nik_pemilik}</p>
        <p>Tanggal: ${tglTtd}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Penyewa)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_penyewa}</strong></p>
        <p>NIK: ${d.nik_penyewa}</p>
        <p>Tanggal: ${tglTtd}</p>
      </td>
    </tr>
  </table>

  ${(d.saksi_1_nama || d.saksi_2_nama) ? `
  <p style="text-align: center; margin-top: 24px; font-weight: 700;">SAKSI-SAKSI:</p>
  <table class="tanda-tangan">
    <tr>
      ${d.saksi_1_nama ? `
      <td style="text-align: center;">
        <p>Saksi 1</p>
        <div class="ttd-area" style="margin: 8px auto 4px; width: 120px;"></div>
        <p><strong>${d.saksi_1_nama}</strong></p>
        ${d.saksi1Alamat ? `<p style="font-size: 11px;">${d.saksi1Alamat}</p>` : ""}
        <p style="font-size: 11px;">Tanggal: ${tglTtd}</p>
      </td>
      ` : ""}
      ${d.saksi_2_nama ? `
      <td style="text-align: center;">
        <p>Saksi 2</p>
        <div class="ttd-area" style="margin: 8px auto 4px; width: 120px;"></div>
        <p><strong>${d.saksi_2_nama}</strong></p>
        ${d.saksi2Alamat ? `<p style="font-size: 11px;">${d.saksi2Alamat}</p>` : ""}
        <p style="font-size: 11px;">Tanggal: ${tglTtd}</p>
      </td>
      ` : ""}
    </tr>
  </table>
  ` : ""}

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
