// ─── Kontrak Event Organizer / Fotografer / Videografer ─────────────────────
// Dasar hukum: KUHPerdata Pasal 1320, 1338, 1601b-1617 (Pemborongan),
//              UU No. 8/1999 Perlindungan Konsumen, UU No. 28/2014 Hak Cipta

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface EventOrganizerData {
  // Para Pihak
  nama_klien: string;
  nik_klien: string;
  alamat_klien: string;
  nomor_telepon_klien: string;
  emailKlien?: string;
  namaMempelaiPria?: string;
  namaMempelaiWanita?: string;
  nama_eo_fotografer: string;
  nama_usaha_vendor?: string;
  alamat_vendor: string;
  nomor_telepon_vendor: string;
  emailEO?: string;
  nomor_rekening_vendor: string;
  nama_bank_vendor: string;
  atasNamaRekening?: string;
  // Detail Layanan
  jenis_layanan: "event_organizer" | "fotografer" | "videografer" | "fotografer_videografer" | "dekorasi" | "catering" | "MC" | "hiburan";
  nama_acara: string;
  jenis_acara: "pernikahan" | "ulang_tahun" | "seminar" | "konferensi" | "pameran" | "launching_produk" | "lainnya";
  tanggal_acara: string;
  waktu_mulai_acara: string;
  waktu_selesai_acara: string;
  lokasi_acara: string;
  estimasi_tamu: number;
  // Detail Fotografi/Videografi
  durasi_pemotretan?: number;
  jumlah_fotografer?: number;
  jumlah_foto_diedit?: number;
  format_file_foto?: string;
  durasi_video?: string;
  waktu_pengiriman_foto?: number;
  waktu_pengiriman_video?: number;
  media_penyerahan?: string;
  // Untuk EO
  ruang_lingkup_eo?: string;
  // Harga
  total_harga: number;
  biaya_dp: number;
  persen_dp: number;
  tanggal_dp: string;
  tanggal_pelunasan: string;
  biaya_transportasi?: number;
  biaya_akomodasi?: number;
  dendaKeterlambatan?: string;
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  lokasiPembuatan?: string;
  // Saksi
  saksi1Nama?: string;
  saksi1NIK?: string;
  saksi1Alamat?: string;
  saksi2Nama?: string;
  saksi2NIK?: string;
  saksi2Alamat?: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateEventOrganizerHTML(d: EventOrganizerData): string {
  const pb = new PasalBuilder();
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const tglAcara = formatTanggal(d.tanggal_acara);
  const totalFormatted = formatRupiah(d.total_harga);
  const totalTerbilang = terbilang(d.total_harga);
  const dpFormatted = formatRupiah(d.biaya_dp);
  const pelunasanAmt = d.total_harga - d.biaya_dp + (d.biaya_transportasi || 0) + (d.biaya_akomodasi || 0);
  const pelunasanFormatted = formatRupiah(pelunasanAmt);
  const lokasiDibuat = d.lokasiPembuatan || d.kota_penandatanganan;

  const jenisLayananLabel = {
    event_organizer: "Event Organizer",
    fotografer: "Fotografer",
    videografer: "Videografer",
    fotografer_videografer: "Fotografer & Videografer",
    dekorasi: "Dekorasi",
    catering: "Catering",
    MC: "Master of Ceremony (MC)",
    hiburan: "Hiburan/Band",
  }[d.jenis_layanan] || d.jenis_layanan;

  // ── Pasal 1: Dasar Hukum ───────────────────────────────────────────────────
  const dasarHukum = pb.pasal("Dasar Hukum", `
    <p>Perjanjian ini disusun berdasarkan ketentuan perundang-undangan yang berlaku di Republik Indonesia, yaitu:</p>
    <ol>
      <li>KUHPerdata Pasal 1320 tentang syarat sahnya perjanjian;</li>
      <li>KUHPerdata Pasal 1338 tentang kebebasan berkontrak dan kepastian hukum perjanjian;</li>
      <li>KUHPerdata Pasal 1601b–1617 tentang Pemborongan Pekerjaan;</li>
      <li>Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen;</li>
      <li>Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta.</li>
    </ol>
  `);

  // ── Pasal 2: Para Pihak ────────────────────────────────────────────────────
  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${lokasiDibuat}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Klien / Pemberi Kerja)</p>
      <p><strong>Nama :</strong> ${d.nama_klien}</p>
      <p><strong>NIK :</strong> ${d.nik_klien}</p>
      <p><strong>Alamat :</strong> ${d.alamat_klien}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_klien}</p>
      ${d.emailKlien ? `<p><strong>Email :</strong> ${d.emailKlien}</p>` : ""}
      ${d.jenis_acara === "pernikahan" && d.namaMempelaiPria ? `<p><strong>Mempelai Pria :</strong> ${d.namaMempelaiPria}</p>` : ""}
      ${d.jenis_acara === "pernikahan" && d.namaMempelaiWanita ? `<p><strong>Mempelai Wanita :</strong> ${d.namaMempelaiWanita}</p>` : ""}
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Klien"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (${jenisLayananLabel} / Vendor)</p>
      <p><strong>Nama :</strong> ${d.nama_eo_fotografer}</p>
      ${d.nama_usaha_vendor ? `<p><strong>Nama Usaha :</strong> ${d.nama_usaha_vendor}</p>` : ""}
      <p><strong>Alamat :</strong> ${d.alamat_vendor}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_vendor}</p>
      ${d.emailEO ? `<p><strong>Email :</strong> ${d.emailEO}</p>` : ""}
      <p><strong>Rekening :</strong> ${d.nama_bank_vendor} – ${d.nomor_rekening_vendor}${d.atasNamaRekening ? ` a/n ${d.atasNamaRekening}` : ""}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Vendor"</strong>.</p>
    </div>
    <p>Para Pihak sepakat membuat Perjanjian Jasa ${jenisLayananLabel} ini atas kehendak bebas sesuai KUHPerdata Pasal 1320 dan 1338.</p>
  `);

  // ── Pasal 3: Objek Perjanjian ──────────────────────────────────────────────
  const detailAcara = pb.pasal("Objek Perjanjian", `
    <div class="pihak-box">
      <p><strong>Nama Acara :</strong> ${d.nama_acara}</p>
      <p><strong>Jenis Acara :</strong> ${d.jenis_acara.replace(/_/g, " ")}</p>
      <p><strong>Tanggal :</strong> ${tglAcara}</p>
      <p><strong>Waktu :</strong> ${d.waktu_mulai_acara} – ${d.waktu_selesai_acara} WIB</p>
      <p><strong>Lokasi :</strong> ${d.lokasi_acara}</p>
      <p><strong>Estimasi Tamu :</strong> ± ${d.estimasi_tamu} orang</p>
      <p><strong>Layanan :</strong> ${jenisLayananLabel}</p>
    </div>
    <p>PIHAK PERTAMA menyewa jasa PIHAK KEDUA untuk acara tersebut di atas, dan PIHAK KEDUA menerima penugasan ini.</p>
  `);

  // ── Pasal 4: Ruang Lingkup Layanan ────────────────────────────────────────
  const scopeOfWork = pb.pasal("Ruang Lingkup Layanan", `
    ${(d.jenis_layanan === "fotografer" || d.jenis_layanan === "videografer" || d.jenis_layanan === "fotografer_videografer") ? `
    <p>1. Untuk layanan <strong>${jenisLayananLabel}</strong>, lingkup pekerjaan meliputi:</p>
    <ul>
      ${d.durasi_pemotretan ? `<li><strong>Durasi Pemotretan:</strong> ${d.durasi_pemotretan} jam</li>` : ""}
      ${d.jumlah_fotografer ? `<li><strong>Jumlah Fotografer/Videografer:</strong> ${d.jumlah_fotografer} orang</li>` : ""}
      ${d.jumlah_foto_diedit ? `<li><strong>Jumlah Foto Edited:</strong> ${d.jumlah_foto_diedit} foto</li>` : ""}
      ${d.format_file_foto ? `<li><strong>Format File Foto:</strong> ${d.format_file_foto}</li>` : ""}
      ${d.durasi_video ? `<li><strong>Video:</strong> ${d.durasi_video}</li>` : ""}
      ${d.waktu_pengiriman_foto ? `<li><strong>Pengiriman Foto:</strong> maksimal ${d.waktu_pengiriman_foto} hari setelah acara</li>` : ""}
      ${d.waktu_pengiriman_video ? `<li><strong>Pengiriman Video:</strong> maksimal ${d.waktu_pengiriman_video} minggu setelah acara</li>` : ""}
      ${d.media_penyerahan ? `<li><strong>Media Penyerahan:</strong> ${d.media_penyerahan}</li>` : ""}
    </ul>
    ` : ""}
    ${d.ruang_lingkup_eo ? `<p>1. Lingkup pekerjaan EO:</p><div class="pihak-box"><p>${d.ruang_lingkup_eo}</p></div>` : ""}
    <p>2. Pekerjaan di luar lingkup yang tercantum di atas dapat dilaksanakan atas kesepakatan tertulis dan biaya tambahan yang disepakati.</p>
    <p>3. Jam kerja PIHAK KEDUA dimulai <strong>${d.waktu_mulai_acara}</strong> sampai <strong>${d.waktu_selesai_acara}</strong>. Apabila acara melebihi batas waktu yang disepakati, PIHAK PERTAMA wajib membayar biaya <em>overtime</em> sesuai kesepakatan pada saat itu.</p>
  `);

  // ── Pasal 5: Nilai Kontrak dan Pembayaran ──────────────────────────────────
  const hargaPembayaran = pb.pasal("Nilai Kontrak dan Pembayaran", `
    <p>1. Total harga layanan yang disepakati:</p>
    <div class="pihak-box">
      <p><strong>Harga Layanan :</strong> ${totalFormatted}</p>
      ${d.biaya_transportasi ? `<p><strong>Biaya Transportasi :</strong> ${formatRupiah(d.biaya_transportasi)}</p>` : ""}
      ${d.biaya_akomodasi ? `<p><strong>Biaya Akomodasi :</strong> ${formatRupiah(d.biaya_akomodasi)}</p>` : ""}
      <p><strong>Terbilang :</strong> (${totalTerbilang} rupiah)</p>
    </div>
    <p>2. Jadwal Pembayaran:</p>
    <ul>
      <li><strong>Uang Muka (DP) ${d.persen_dp}%:</strong> ${dpFormatted} — dibayar paling lambat <strong>${formatTanggal(d.tanggal_dp)}</strong></li>
      <li><strong>Pelunasan:</strong> ${pelunasanFormatted} — dibayar paling lambat <strong>${formatTanggal(d.tanggal_pelunasan)}</strong></li>
    </ul>
    <p>3. Pembayaran dilakukan melalui transfer ke rekening PIHAK KEDUA:</p>
    <div class="pihak-box">
      <p><strong>Bank :</strong> ${d.nama_bank_vendor}</p>
      <p><strong>Nomor Rekening :</strong> ${d.nomor_rekening_vendor}</p>
      ${d.atasNamaRekening ? `<p><strong>Atas Nama :</strong> ${d.atasNamaRekening}</p>` : `<p><strong>Atas Nama :</strong> ${d.nama_eo_fotografer}</p>`}
    </div>
    <p>4. <strong>Tanggal acara baru dianggap terkonfirmasi setelah DP diterima</strong> oleh PIHAK KEDUA. DP diterima sebagai jaminan pemesanan tanggal.</p>
    <p>5. Apabila pelunasan tidak diterima sesuai jadwal, PIHAK KEDUA berhak menunda atau menahan layanan hingga pembayaran diselesaikan${d.dendaKeterlambatan ? `. Keterlambatan pembayaran dikenakan denda sebesar <strong>${d.dendaKeterlambatan}</strong>` : ""}.</p>
  `);

  // ── Pasal 6: Hak dan Kewajiban Para Pihak ─────────────────────────────────
  const kondisiKerja = pb.pasal("Hak dan Kewajiban Para Pihak", `
    <p><strong>A. Kewajiban PIHAK PERTAMA:</strong></p>
    <ol>
      <li>Menyediakan konsumsi (makan dan minum) yang layak untuk seluruh anggota tim PIHAK KEDUA selama bertugas;</li>
      <li>Menyediakan area yang aman untuk menyimpan peralatan PIHAK KEDUA;</li>
      <li>Memberikan akses ke seluruh area acara yang diperlukan PIHAK KEDUA;</li>
      <li>Memberikan informasi dan koordinasi yang cukup terkait rundown acara dan kontak PIC di lokasi;</li>
      <li>Mengkonfirmasi detail teknis acara selambat-lambatnya <strong>H-7</strong> sebelum hari acara.</li>
    </ol>
    <p><strong>B. Kewajiban PIHAK KEDUA:</strong></p>
    <ol>
      <li>Melaksanakan jasa sesuai lingkup yang disepakati dalam perjanjian ini dengan standar profesional;</li>
      <li>Bertanggung jawab atas peralatan dan perlengkapannya sendiri;</li>
      <li>Hadir tepat waktu sesuai jadwal yang disepakati;</li>
      <li>Memberikan laporan progres apabila ada kendala dalam pelaksanaan;</li>
      <li>Menyimpan kerahasiaan informasi pribadi klien dan tidak mempublikasikan data sensitif tanpa izin.</li>
    </ol>
  `);

  // ── Pasal 7: Kebijakan Pembatalan ─────────────────────────────────────────
  const pembatalan = pb.pasal("Kebijakan Pembatalan", `
    <p>1. <strong>Pembatalan oleh PIHAK PERTAMA:</strong></p>
    <ul>
      <li>Lebih dari <strong>90 hari</strong> sebelum acara: DP hangus 50%</li>
      <li><strong>60–90 hari</strong> sebelum acara: DP hangus seluruhnya</li>
      <li><strong>30–60 hari</strong> sebelum acara: DP hangus + 25% dari sisa pembayaran</li>
      <li>Kurang dari <strong>30 hari</strong>: DP hangus + 50% dari total harga wajib dibayar</li>
    </ul>
    <p>2. <strong>Pembatalan oleh PIHAK KEDUA:</strong> PIHAK KEDUA wajib mengembalikan DP dan berupaya menyediakan pengganti yang setara. Apabila pengganti tidak tersedia, PIHAK KEDUA mengembalikan DP beserta kompensasi sebesar 20% dari nilai kontrak.</p>
    <p>3. <strong>Penjadwalan Ulang (Reschedule):</strong> Diperbolehkan maksimal <strong>1 (satu) kali</strong>, dengan pemberitahuan minimal 14 hari sebelum tanggal acara asal. Reschedule tergantung ketersediaan PIHAK KEDUA dan dapat dikenakan biaya administrasi.</p>
  `);

  // ── Pasal 8: Force Majeure ─────────────────────────────────────────────────
  const forceMajeure = pb.pasal("Force Majeure", `
    <p>1. <strong>Definisi Force Majeure</strong> meliputi namun tidak terbatas pada: bencana alam (gempa, banjir, gunung meletus), pandemi atau wabah yang dinyatakan resmi, perang, kerusuhan, kebakaran, larangan pemerintah yang relevan, atau kejadian luar biasa lain yang di luar kendali Para Pihak.</p>
    <p>2. Pihak yang mengalami force majeure wajib memberikan pemberitahuan tertulis kepada pihak lain dalam waktu <strong>7 (tujuh) hari</strong> sejak kejadian disertai bukti resmi.</p>
    <p>3. <strong>Opsi Penundaan:</strong> Apabila terjadi force majeure, Para Pihak dapat menyepakati penundaan (reschedule) acara ke tanggal baru sesuai ketersediaan tanpa dikenakan penalti pembatalan, selama pemberitahuan dilakukan dalam batas waktu yang wajar.</p>
    <p>4. <strong>Pembatalan Total:</strong> Apabila penundaan tidak dimungkinkan, kerugian dibagi secara proporsional berdasarkan pekerjaan yang telah dilaksanakan oleh PIHAK KEDUA hingga saat kejadian force majeure. PIHAK KEDUA berhak menahan biaya atas pekerjaan yang telah dikerjakan; selebihnya dikembalikan kepada PIHAK PERTAMA.</p>
    <p>5. Force majeure yang berlangsung lebih dari <strong>6 (enam) bulan</strong> sejak tanggal kejadian memberikan hak kepada masing-masing pihak untuk mengakhiri perjanjian ini dengan pemberitahuan tertulis, tanpa kewajiban penalti di luar ketentuan ayat (4).</p>
  `);

  // ── Pasal 9: Hak Cipta Foto dan Video ─────────────────────────────────────
  const hakCipta = pb.pasal("Hak Cipta Foto dan Video", `
    <p>1. <strong>Kepemilikan Bersama:</strong> Hak cipta atas foto/video yang dihasilkan merupakan milik bersama antara PIHAK PERTAMA dan PIHAK KEDUA sesuai UU No. 28/2014 tentang Hak Cipta.</p>
    <p>2. <strong>Hak PIHAK PERTAMA (Klien):</strong></p>
    <ul>
      <li>Menggunakan foto/video untuk keperluan pribadi: cetak, album, kenangan keluarga;</li>
      <li>Membagikan foto/video di media sosial pribadi dengan <em>credit</em> kepada PIHAK KEDUA;</li>
      <li>Meminta penghapusan atau tidak dipublikasikannya foto/video tertentu yang dianggap tidak sesuai, dengan pemberitahuan tertulis.</li>
    </ul>
    <p>3. <strong>Hak PIHAK KEDUA (Vendor/EO):</strong></p>
    <ul>
      <li>Menggunakan foto/video untuk keperluan komersial terbatas: portofolio, website, media sosial bisnis, dan materi promosi;</li>
      <li>Menyertakan watermark atau credit pada foto/video yang dipublikasikan.</li>
    </ul>
    <p>4. <strong>Larangan:</strong></p>
    <ul>
      <li>PIHAK KEDUA <strong>tidak</strong> diperkenankan menjual atau mengalihkan foto/video kepada pihak ketiga tanpa izin tertulis PIHAK PERTAMA;</li>
      <li>PIHAK PERTAMA tidak diperkenankan mengkomersilkan foto/video kepada pihak lain tanpa izin tertulis PIHAK KEDUA;</li>
      <li>PIHAK PERTAMA tidak diperkenankan mengedit, mengubah, atau menambahkan elemen pada foto/video secara substansial tanpa persetujuan PIHAK KEDUA.</li>
    </ul>
  `);

  // ── Pasal 10: Perubahan dan Tambahan Layanan ───────────────────────────────
  const perubahanLayanan = pb.pasal("Perubahan dan Tambahan Layanan", `
    <p>1. <strong>Perubahan Minor</strong> (perubahan dekorasi, menu, jadwal kecil): dapat diajukan hingga <strong>H-14</strong> sebelum acara, tergantung ketersediaan dan biaya tambahan yang disepakati.</p>
    <p>2. <strong>Perubahan Major</strong> (perubahan venue, konsep acara, penambahan layanan besar): harus diajukan minimal <strong>H-30</strong> sebelum acara. PIHAK KEDUA berhak menolak atau menetapkan biaya tambahan.</p>
    <p>3. <strong>Pengurangan Layanan:</strong> Pengurangan ruang lingkup yang telah disepakati harus diajukan minimal <strong>H-21</strong>. Pengurangan tidak secara otomatis mengakibatkan pengembalian dana; besaran penyesuaian harga dinegosiasikan para pihak.</p>
    <p>4. Seluruh perubahan yang disepakati harus dikonfirmasi dalam bentuk tertulis (surat, email, atau pesan aplikasi yang dapat dibuktikan) dan ditandatangani/diakui kedua belah pihak.</p>
  `);

  // ── Pasal 11: Tanggung Jawab dan Batas Kewajiban ──────────────────────────
  const tanggungjawab = pb.pasal("Tanggung Jawab dan Batas Kewajiban", `
    <p>1. PIHAK KEDUA bertanggung jawab atas kualitas layanan sesuai standar yang disepakati dalam perjanjian ini.</p>
    <p>2. <strong>Batas Tanggung Jawab Finansial:</strong> Total tanggung jawab finansial PIHAK KEDUA kepada PIHAK PERTAMA atas segala klaim yang timbul dari perjanjian ini, dalam keadaan apapun, tidak akan melebihi <strong>nilai kontrak yang tertera dalam Pasal 5 perjanjian ini</strong>.</p>
    <p>3. PIHAK KEDUA tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan, atau kerugian konsekuensial yang mungkin dialami PIHAK PERTAMA akibat pelaksanaan perjanjian ini.</p>
    <p>4. PIHAK KEDUA disarankan memiliki asuransi pertanggungjawaban umum dan perlindungan peralatan yang memadai selama pelaksanaan layanan.</p>
    <p>5. <strong>Compliance Perizinan:</strong> PIHAK KEDUA bertanggung jawab untuk memastikan seluruh izin yang diperlukan dalam pelaksanaan layanannya (izin usaha, izin penggunaan peralatan, dll.) telah terpenuhi sesuai peraturan perundang-undangan yang berlaku.</p>
  `);

  // ── Pasal 12: Koordinasi dan Komunikasi ───────────────────────────────────
  const koordinasi = pb.pasal("Koordinasi dan Komunikasi", `
    <p>1. <strong>Jadwal Pertemuan Koordinasi:</strong></p>
    <ul>
      <li><strong>H-60:</strong> Pertemuan awal — konfirmasi konsep dan ruang lingkup;</li>
      <li><strong>H-30:</strong> Pertemuan progres — update dekorasi, catering, rundown;</li>
      <li><strong>H-7:</strong> Pertemuan teknis — finalisasi layout, vendor list, kontak;</li>
      <li><strong>H-3:</strong> <em>Final meeting</em> — konfirmasi seluruh detail teknis hari H.</li>
    </ul>
    <p>2. <strong>Hotline Darurat:</strong> PIHAK KEDUA menyediakan nomor hotline yang dapat dihubungi mulai <strong>H-1</strong> hingga selesainya acara. Nomor hotline dikonfirmasi pada pertemuan H-7.</p>
    <p>3. <strong>Contact Person 24/7:</strong> Mulai <strong>H-7</strong> hingga acara selesai, PIHAK KEDUA menetapkan satu contact person yang dapat dihubungi 24 jam sehari untuk keperluan koordinasi darurat.</p>
    <p>4. Para Pihak dapat membentuk grup WhatsApp atau saluran komunikasi bersama untuk memudahkan koordinasi tim di lapangan.</p>
  `);

  // ── Pasal 13: Penyelesaian Sengketa ───────────────────────────────────────
  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Sengketa diselesaikan secara musyawarah mufakat dalam waktu <strong>14 (empat belas) hari</strong> sejak sengketa disampaikan secara tertulis.</p>
    <p>2. Apabila musyawarah gagal, Para Pihak dapat menempuh jalur mediasi melalui lembaga yang disepakati dalam waktu <strong>30 (tiga puluh) hari</strong>.</p>
    <p>3. Apabila mediasi tidak menghasilkan kesepakatan, sengketa diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong> sebagai pengadilan yang berwenang.</p>
    <p>4. Selama proses penyelesaian sengketa berlangsung, Para Pihak tetap wajib melaksanakan kewajiban masing-masing sebagaimana tertuang dalam perjanjian ini.</p>
  `);

  // ── Pasal 14: Ketentuan Lain-lain ─────────────────────────────────────────
  const ketentuanLain = pb.pasal("Ketentuan Lain-Lain", `
    <p>1. <strong>Kerahasiaan:</strong> Para Pihak sepakat untuk menjaga kerahasiaan seluruh informasi sensitif yang diperoleh selama pelaksanaan perjanjian ini, kecuali diwajibkan oleh hukum.</p>
    <p>2. <strong>Subkontrak:</strong> PIHAK KEDUA diperkenankan menggunakan subkontraktor dalam pelaksanaan layanannya, namun PIHAK KEDUA tetap bertanggung jawab penuh atas kualitas dan hasil kerja subkontraktor tersebut. PIHAK PERTAMA berhak mengetahui identitas subkontraktor utama yang terlibat dalam pelaksanaan acara.</p>
    <p>3. <strong>Hak Kekayaan Intelektual Konsep:</strong> Konsep kreatif, desain, dan ide orisinal yang dikembangkan PIHAK KEDUA untuk acara ini tetap menjadi hak intelektual PIHAK KEDUA. PIHAK PERTAMA mendapat lisensi untuk menggunakan konsep tersebut dalam konteks acara yang disepakati.</p>
    <p>4. <strong>Itikad Baik:</strong> Para Pihak sepakat untuk menjalankan perjanjian ini dengan itikad baik dan berorientasi pada solusi yang menguntungkan kedua belah pihak (<em>win-win solution</em>).</p>
  `);

  // ── Pasal 15: Ketentuan Penutup ────────────────────────────────────────────
  const ketentuan = pb.pasal("Ketentuan Penutup", `
    <p>1. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap bermaterai cukup</strong>, masing-masing mempunyai kekuatan hukum yang sama, satu rangkap untuk PIHAK PERTAMA dan satu rangkap untuk PIHAK KEDUA.</p>
    <p>2. Perubahan, penambahan, atau pengurangan atas perjanjian ini hanya sah apabila dibuat secara tertulis dalam bentuk <strong>adendum</strong> yang ditandatangani oleh Para Pihak.</p>
    <p>3. Apabila terdapat ketentuan yang tidak diatur dalam perjanjian ini, Para Pihak sepakat untuk merujuk pada peraturan perundang-undangan yang berlaku di Republik Indonesia.</p>
    <p>4. Perjanjian ini berlaku sejak tanggal ditandatangani oleh Para Pihak.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  // ── Tanda Tangan ───────────────────────────────────────────────────────────
  const hasSaksi = d.saksi1Nama || d.saksi2Nama;
  const saksiSection = hasSaksi ? `
    <p style="text-align: center; font-weight: 600; margin: 24px 0 8px;">SAKSI-SAKSI</p>
    <table class="tanda-tangan">
      <tr>
        ${d.saksi1Nama ? `
        <td>
          <p><strong>SAKSI 1</strong></p>
          <div class="ttd-area"></div>
          <p><strong>${d.saksi1Nama}</strong></p>
          ${d.saksi1NIK ? `<p style="font-size: 9pt;">NIK: ${d.saksi1NIK}</p>` : ""}
          ${d.saksi1Alamat ? `<p style="font-size: 9pt;">${d.saksi1Alamat}</p>` : ""}
        </td>
        ` : "<td></td>"}
        ${d.saksi2Nama ? `
        <td>
          <p><strong>SAKSI 2</strong></p>
          <div class="ttd-area"></div>
          <p><strong>${d.saksi2Nama}</strong></p>
          ${d.saksi2NIK ? `<p style="font-size: 9pt;">NIK: ${d.saksi2NIK}</p>` : ""}
          ${d.saksi2Alamat ? `<p style="font-size: 9pt;">${d.saksi2Alamat}</p>` : ""}
        </td>
        ` : "<td></td>"}
      </tr>
    </table>
  ` : "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>KONTRAK JASA ${jenisLayananLabel.toUpperCase()}</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1320, 1338, 1601b–1617 dan UU No. 28/2014 tentang Hak Cipta</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${dasarHukum}
  ${paraPihak}
  ${detailAcara}
  ${scopeOfWork}
  ${hargaPembayaran}
  ${kondisiKerja}
  ${pembatalan}
  ${forceMajeure}
  ${hakCipta}
  ${perubahanLayanan}
  ${tanggungjawab}
  ${koordinasi}
  ${sengketa}
  ${ketentuanLain}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${lokasiDibuat}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Klien)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_klien}</strong></p>
        ${d.nik_klien ? `<p style="font-size: 9pt;">NIK: ${d.nik_klien}</p>` : ""}
        <p style="font-size: 9pt;">Tanggal: ${tglTtd}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(${jenisLayananLabel})</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_eo_fotografer}</strong></p>
        ${d.nama_usaha_vendor ? `<p style="font-size: 10pt;">${d.nama_usaha_vendor}</p>` : ""}
        <p style="font-size: 9pt;">Tanggal: ${tglTtd}</p>
      </td>
    </tr>
  </table>

  ${saksiSection}

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
