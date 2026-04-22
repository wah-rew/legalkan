// ─── Perjanjian Kerja Waktu Tertentu (PKWT) ───────────────────────────────────
// Dasar hukum: UU No. 13/2003 tentang Ketenagakerjaan, UU Cipta Kerja No. 11/2020,
// PP No. 35/2021 tentang Perjanjian Kerja Waktu Tertentu

import { formatRupiah, formatTanggal, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface PKWTData {
  // Perusahaan (Pihak Pertama)
  nama_perusahaan: string;
  jenis_perusahaan: string; // CV, PT, UD, Perorangan, etc.
  alamat_perusahaan: string;
  kota_perusahaan: string;
  nama_pimpinan: string;
  jabatan_pimpinan: string; // Direktur, Pemilik, dll
  // Karyawan (Pihak Kedua)
  nama_karyawan: string;
  nik_karyawan: string;
  alamat_karyawan: string;
  jenis_kelamin_karyawan?: string;      // L / P
  tanggal_lahir_karyawan?: string;
  telepon_karyawan?: string;            // NEW: No. HP / telepon pekerja
  email_karyawan?: string;              // NEW: Email pekerja
  // Rekening bank pekerja
  nama_bank_karyawan?: string;          // NEW: BCA, BNI, BRI, dll
  nomor_rekening_karyawan?: string;     // NEW: Nomor rekening
  atas_nama_rekening_karyawan?: string; // NEW: Nama pemilik rekening
  // Pekerjaan
  posisi_jabatan: string;
  deskripsi_pekerjaan?: string;
  ruang_lingkup_pekerjaan?: string;    // NEW: Ruang lingkup / scope pekerjaan
  departemen?: string;
  lokasi_kerja: string;
  // Masa Kerja
  tanggal_mulai: string;
  tanggal_berakhir: string;
  // Gaji & Kompensasi
  gaji_pokok: number;
  tunjangan_makan?: number;
  tunjangan_transport?: number;
  tunjangan_lainnya?: number;
  cara_pembayaran_gaji?: "tunai" | "transfer_bank";
  tanggal_bayar_gaji?: string;         // "setiap tanggal 25"
  // Jam Kerja
  jam_kerja_per_hari?: number;         // default 8
  hari_kerja_per_minggu?: number;      // default 5
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

export function generatePKWTHTML(d: PKWTData): string {
  const pb = new PasalBuilder();
  const tglMulai = formatTanggal(d.tanggal_mulai);
  const tglBerakhir = formatTanggal(d.tanggal_berakhir);
  const tglPenandatanganan = formatTanggal(d.tanggal_penandatanganan);
  const gajiPokok = formatRupiah(d.gaji_pokok);
  const tunjanganMakan = d.tunjangan_makan ? formatRupiah(d.tunjangan_makan) : null;
  const tunjanganTransport = d.tunjangan_transport ? formatRupiah(d.tunjangan_transport) : null;
  const tunjanganLainnya = d.tunjangan_lainnya ? formatRupiah(d.tunjangan_lainnya) : null;
  const totalGaji = formatRupiah(
    d.gaji_pokok + (d.tunjangan_makan || 0) + (d.tunjangan_transport || 0) + (d.tunjangan_lainnya || 0)
  );
  const jamKerja = d.jam_kerja_per_hari || 8;
  const hariKerja = d.hari_kerja_per_minggu || 5;

  // ─── Pasal 1: Dasar Hukum ─────────────────────────────────────────────────
  const dasarHukum = pb.pasal("Dasar Hukum", `
    <p>Perjanjian Kerja Waktu Tertentu (PKWT) ini dibuat dan dilaksanakan berdasarkan:</p>
    <ol style="padding-left: 18px; margin-top: 8px;">
      <li>Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan;</li>
      <li>Undang-Undang No. 11 Tahun 2020 tentang Cipta Kerja beserta peraturan turunannya;</li>
      <li>Peraturan Pemerintah No. 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja;</li>
      <li>Peraturan perundang-undangan ketenagakerjaan lain yang berlaku di Republik Indonesia.</li>
    </ol>
    <p style="margin-top: 10px;">Perjanjian ini merupakan PKWT sebagaimana dimaksud dalam PP No. 35/2021, untuk pekerjaan yang bersifat tidak tetap atau untuk jangka waktu tertentu. Sesuai ketentuan Pasal 12 PP No. 35/2021, <strong>PKWT ini tidak mencantumkan masa percobaan kerja</strong>.</p>
  `);

  // ─── Pasal 2: Para Pihak ──────────────────────────────────────────────────
  const paraPihak = pb.pasal("Para Pihak", `
    <p>Di <strong>${d.kota_penandatanganan}</strong>, pada tanggal <strong>${tglPenandatanganan}</strong>, Perjanjian Kerja ini disepakati oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemberi Kerja / Perusahaan)</p>
      <p><strong>Nama Perusahaan :</strong> ${d.jenis_perusahaan} ${d.nama_perusahaan}</p>
      <p><strong>Alamat :</strong> ${d.alamat_perusahaan}, ${d.kota_perusahaan}</p>
      <p><strong>Diwakili oleh :</strong> ${d.nama_pimpinan}, selaku ${d.jabatan_pimpinan}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Perusahaan"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Pekerja)</p>
      <p><strong>Nama :</strong> ${d.nama_karyawan}</p>
      <p><strong>NIK :</strong> ${d.nik_karyawan}</p>
      ${d.jenis_kelamin_karyawan ? `<p><strong>Jenis Kelamin :</strong> ${d.jenis_kelamin_karyawan === 'L' ? 'Laki-laki' : d.jenis_kelamin_karyawan === 'P' ? 'Perempuan' : d.jenis_kelamin_karyawan}</p>` : ''}
      ${d.tanggal_lahir_karyawan ? `<p><strong>Tanggal Lahir :</strong> ${formatTanggal(d.tanggal_lahir_karyawan)}</p>` : ''}
      <p><strong>Alamat :</strong> ${d.alamat_karyawan}</p>
      ${d.telepon_karyawan ? `<p><strong>No. Telepon :</strong> ${d.telepon_karyawan}</p>` : ''}
      ${d.email_karyawan ? `<p><strong>Email :</strong> ${d.email_karyawan}</p>` : ''}
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Pekerja"</strong>.</p>
    </div>
    <p>Para Pihak sepakat untuk membuat Perjanjian Kerja Waktu Tertentu (PKWT) ini berdasarkan peraturan perundang-undangan sebagaimana tercantum dalam Pasal 1 Perjanjian ini.</p>
  `);

  // ─── Pasal 3: Jabatan, Ruang Lingkup, dan Tempat Kerja ───────────────────
  const posisi = pb.pasal("Jabatan, Ruang Lingkup Pekerjaan, dan Tempat Kerja", `
    <p>1. PIHAK PERTAMA mempekerjakan PIHAK KEDUA sebagai <strong>${d.posisi_jabatan}</strong>${d.departemen ? ` pada Departemen ${d.departemen}` : ''}.</p>
    ${d.deskripsi_pekerjaan ? `<p>2. Uraian pekerjaan: ${d.deskripsi_pekerjaan}</p>` : ''}
    ${d.ruang_lingkup_pekerjaan ? `<p>${d.deskripsi_pekerjaan ? '3' : '2'}. Ruang lingkup pekerjaan: ${d.ruang_lingkup_pekerjaan}</p>` : ''}
    <p>${[d.deskripsi_pekerjaan, d.ruang_lingkup_pekerjaan].filter(Boolean).length + 2}. Tempat kerja: <strong>${d.lokasi_kerja}</strong>. Perusahaan berhak menugaskan PIHAK KEDUA ke lokasi lain atas dasar kebutuhan operasional dengan pemberitahuan terlebih dahulu.</p>
    <p>${[d.deskripsi_pekerjaan, d.ruang_lingkup_pekerjaan].filter(Boolean).length + 3}. Pekerjaan ini bersifat tidak tetap dan untuk jangka waktu tertentu sebagaimana diatur dalam Pasal 4 Perjanjian ini.</p>
    <p>${[d.deskripsi_pekerjaan, d.ruang_lingkup_pekerjaan].filter(Boolean).length + 4}. PIHAK KEDUA wajib melaksanakan pekerjaan dengan penuh tanggung jawab, jujur, dan sesuai standar perusahaan.</p>
  `);

  // ─── Pasal 4: Masa Kerja ──────────────────────────────────────────────────
  const masaKerja = pb.pasal("Jangka Waktu Perjanjian", `
    <p>1. PKWT ini berlaku selama periode tertentu sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Tanggal Mulai :</strong> ${tglMulai}</p>
      <p><strong>Tanggal Berakhir :</strong> ${tglBerakhir}</p>
    </div>
    <p>2. PKWT ini berakhir demi hukum pada tanggal yang telah ditetapkan tanpa memerlukan pemberitahuan pengakhiran terlebih dahulu, sesuai Pasal 61 ayat (1) UU Ketenagakerjaan jo. PP No. 35/2021.</p>
    <p>3. PKWT ini dapat diperpanjang paling banyak 1 (satu) kali atas kesepakatan tertulis Para Pihak sebelum berakhirnya masa PKWT ini, dengan jangka waktu perpanjangan sesuai ketentuan Pasal 8 PP No. 35/2021.</p>
    <p>4. Perpanjangan PKWT wajib dicatatkan kepada instansi yang bertanggung jawab di bidang ketenagakerjaan sesuai ketentuan yang berlaku.</p>
  `);

  // ─── Pasal 5: Upah dan Pembayaran ────────────────────────────────────────
  const punya_rekening = d.nama_bank_karyawan && d.nomor_rekening_karyawan;
  const gajiKompen = pb.pasal("Upah dan Cara Pembayaran", `
    <p>1. PIHAK PERTAMA memberikan upah kepada PIHAK KEDUA sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Gaji Pokok :</strong> ${gajiPokok} / bulan</p>
      ${tunjanganMakan ? `<p><strong>Tunjangan Makan :</strong> ${tunjanganMakan} / bulan</p>` : ''}
      ${tunjanganTransport ? `<p><strong>Tunjangan Transport :</strong> ${tunjanganTransport} / bulan</p>` : ''}
      ${tunjanganLainnya ? `<p><strong>Tunjangan Lainnya :</strong> ${tunjanganLainnya} / bulan</p>` : ''}
      <p><strong>Total Upah Bulanan :</strong> ${totalGaji}</p>
    </div>
    <p>2. Upah dibayarkan secara ${d.cara_pembayaran_gaji === 'transfer_bank' ? 'transfer bank' : 'tunai'}${d.tanggal_bayar_gaji ? ` ${d.tanggal_bayar_gaji}` : ' setiap bulan'}.${punya_rekening ? '' : ''}</p>
    ${punya_rekening ? `
    <p>3. Pembayaran upah dilakukan ke rekening PIHAK KEDUA:</p>
    <div class="pihak-box">
      <p><strong>Bank :</strong> ${d.nama_bank_karyawan}</p>
      <p><strong>No. Rekening :</strong> ${d.nomor_rekening_karyawan}</p>
      <p><strong>Atas Nama :</strong> ${d.atas_nama_rekening_karyawan || d.nama_karyawan}</p>
    </div>
    <p>4. PIHAK PERTAMA wajib membayar upah minimal sesuai Upah Minimum Kabupaten/Kota (UMK) yang berlaku di wilayah tempat kerja.</p>
    <p>5. Upah tidak dibayarkan untuk hari ketidakhadiran tanpa keterangan yang sah, sesuai prinsip <em>no work no pay</em> (Pasal 93 UU Ketenagakerjaan).</p>
    <p>6. Upah sebagaimana tersebut di atas merupakan penghasilan bruto PIHAK KEDUA. Kewajiban pembayaran Pajak Penghasilan (PPh Pasal 21) atas penghasilan PIHAK KEDUA menjadi tanggung jawab PIHAK KEDUA sesuai ketentuan perpajakan yang berlaku. PIHAK PERTAMA akan memotong dan menyetorkan PPh Pasal 21 apabila diperlukan sesuai peraturan perundang-undangan perpajakan.</p>
    ` : `
    <p>3. PIHAK PERTAMA wajib membayar upah minimal sesuai Upah Minimum Kabupaten/Kota (UMK) yang berlaku di wilayah tempat kerja.</p>
    <p>4. Upah tidak dibayarkan untuk hari ketidakhadiran tanpa keterangan yang sah, sesuai prinsip <em>no work no pay</em> (Pasal 93 UU Ketenagakerjaan).</p>
    <p>5. Upah sebagaimana tersebut di atas merupakan penghasilan bruto PIHAK KEDUA. Kewajiban pembayaran Pajak Penghasilan (PPh Pasal 21) atas penghasilan PIHAK KEDUA menjadi tanggung jawab PIHAK KEDUA sesuai ketentuan perpajakan yang berlaku. PIHAK PERTAMA akan memotong dan menyetorkan PPh Pasal 21 apabila diperlukan sesuai peraturan perundang-undangan perpajakan.</p>
    `}
  `);

  // ─── Pasal 6: Jam Kerja ──────────────────────────────────────────────────
  const jamKerjaSection = pb.pasal("Jam Kerja dan Waktu Istirahat", `
    <p>1. Jam kerja PIHAK KEDUA adalah <strong>${jamKerja} (${jamKerja === 8 ? 'delapan' : String(jamKerja)}) jam per hari</strong> selama <strong>${hariKerja} (${hariKerja === 5 ? 'lima' : hariKerja === 6 ? 'enam' : String(hariKerja)}) hari kerja per minggu</strong>, sesuai Pasal 77 UU Ketenagakerjaan.</p>
    <p>2. PIHAK KEDUA berhak atas waktu istirahat minimal 30 (tiga puluh) menit setelah bekerja 4 (empat) jam berturut-turut.</p>
    <p>3. PIHAK KEDUA berhak atas istirahat mingguan 1 (satu) hari untuk 6 hari kerja/minggu atau 2 (dua) hari untuk 5 hari kerja/minggu.</p>
    <p>4. Kerja lembur dilaksanakan atas perintah tertulis perusahaan dan wajib dibayar upah lembur sesuai Peraturan Pemerintah yang berlaku. Lembur maksimal 4 jam/hari dan 18 jam/minggu.</p>
  `);

  // ─── Pasal 7: Hak dan Kewajiban ──────────────────────────────────────────
  const hakKewajiban = pb.pasal("Hak dan Kewajiban Para Pihak", `
    <p><strong>A. Tanggung Jawab PIHAK KEDUA (Pekerja):</strong></p>
    <ul>
      <li>Melaksanakan pekerjaan dengan penuh tanggung jawab, disiplin, dan integritas;</li>
      <li>Mematuhi peraturan perusahaan, tata tertib kerja, dan kode etik yang berlaku;</li>
      <li>Memberitahukan ketidakhadiran sebelum jam kerja dimulai beserta alasan yang sah;</li>
      <li>Menjaga dan merawat aset, peralatan, dan properti milik Perusahaan;</li>
      <li>Menyerahkan seluruh hasil pekerjaan dan aset perusahaan pada saat berakhirnya perjanjian ini;</li>
      <li>Tidak bekerja pada pihak lain yang memiliki konflik kepentingan dengan Perusahaan selama masa PKWT berlaku.</li>
    </ul>
    <p style="margin-top: 10px;"><strong>B. Hak PIHAK KEDUA (Pekerja):</strong></p>
    <ul>
      <li>Menerima upah sesuai perjanjian ini tepat waktu;</li>
      <li>Mendapatkan cuti tahunan 12 (dua belas) hari setelah 12 (dua belas) bulan bekerja secara berturut-turut sesuai Pasal 79 UU Ketenagakerjaan;</li>
      <li>Mendapatkan perlindungan keselamatan dan kesehatan kerja;</li>
      <li>Mendapatkan kompensasi PKWT saat perjanjian berakhir sesuai ketentuan Pasal 11 Perjanjian ini dan PP No. 35/2021.</li>
    </ul>
    <p style="margin-top: 10px;"><strong>C. Kewajiban PIHAK PERTAMA (Perusahaan):</strong></p>
    <ul>
      <li>Membayar upah sesuai ketentuan perjanjian ini tepat pada waktunya;</li>
      <li>Mendaftarkan PIHAK KEDUA ke program BPJS Ketenagakerjaan dan BPJS Kesehatan;</li>
      <li>Menyediakan sarana, prasarana, dan lingkungan kerja yang aman dan layak;</li>
      <li>Membayar kompensasi PKWT saat perjanjian berakhir sesuai PP No. 35/2021.</li>
    </ul>
  `);

  // ─── Pasal 8: BPJS ───────────────────────────────────────────────────────
  const bpjs = pb.pasal("Jaminan Sosial Ketenagakerjaan", `
    <p>1. PIHAK PERTAMA wajib mendaftarkan PIHAK KEDUA ke dalam program jaminan sosial yang diselenggarakan oleh BPJS, yaitu:</p>
    <ul>
      <li><strong>BPJS Ketenagakerjaan</strong>: Jaminan Kecelakaan Kerja (JKK), Jaminan Kematian (JKm), Jaminan Hari Tua (JHT), dan Jaminan Pensiun (JP) sesuai yang dipersyaratkan;</li>
      <li><strong>BPJS Kesehatan</strong>: Perlindungan kesehatan bagi PIHAK KEDUA sesuai ketentuan yang berlaku.</li>
    </ul>
    <p>2. Iuran BPJS ditanggung sesuai ketentuan peraturan perundang-undangan yang berlaku (sebagian oleh Perusahaan, sebagian oleh Pekerja).</p>
    <p>3. PIHAK KEDUA tidak dapat melepaskan atau menolak kepesertaan program BPJS sebagaimana diatur dalam Undang-Undang No. 24 Tahun 2011 tentang BPJS.</p>
  `);

  // ─── Pasal 9: Kerahasiaan (NDA) ──────────────────────────────────────────
  const kerahasiaan = pb.pasal("Kerahasiaan Informasi", `
    <p>1. PIHAK KEDUA wajib menjaga kerahasiaan seluruh informasi yang diperoleh selama masa kerja, termasuk namun tidak terbatas pada:</p>
    <ul>
      <li>Informasi keuangan, strategi bisnis, dan rencana usaha Perusahaan;</li>
      <li>Data pelanggan, pemasok, dan mitra bisnis;</li>
      <li>Proses produksi, teknologi, dan metode kerja yang bersifat rahasia;</li>
      <li>Informasi lain yang dinyatakan bersifat rahasia oleh Perusahaan.</li>
    </ul>
    <p>2. Kewajiban kerahasiaan ini berlaku selama masa PKWT dan tetap berlaku selama <strong>2 (dua) tahun</strong> setelah berakhirnya perjanjian ini karena alasan apapun.</p>
    <p>3. PIHAK KEDUA dilarang mengungkapkan informasi rahasia kepada pihak ketiga tanpa persetujuan tertulis dari PIHAK PERTAMA.</p>
    <p>4. Pelanggaran atas ketentuan kerahasiaan ini dapat mengakibatkan tuntutan hukum sesuai peraturan perundang-undangan yang berlaku.</p>
  `);

  // ─── Pasal 10: Hak Kekayaan Intelektual ──────────────────────────────────
  const hki = pb.pasal("Hak Kekayaan Intelektual", `
    <p>1. Seluruh hasil karya, kreasi, produk, dan/atau inovasi yang dibuat, dikembangkan, atau dihasilkan oleh PIHAK KEDUA dalam rangka pelaksanaan tugas dan kewajibannya berdasarkan Perjanjian ini (<em>"Hasil Karya"</em>) merupakan milik eksklusif PIHAK PERTAMA.</p>
    <p>2. PIHAK KEDUA dengan ini secara tegas mengalihkan seluruh hak cipta, hak paten, merek, rahasia dagang, dan hak kekayaan intelektual lainnya atas Hasil Karya kepada PIHAK PERTAMA sejak saat karya tersebut dibuat.</p>
    <p>3. PIHAK KEDUA menjamin bahwa:</p>
    <ul>
      <li>Hasil Karya merupakan karya orisinal yang dibuat sendiri oleh PIHAK KEDUA;</li>
      <li>Hasil Karya tidak melanggar hak cipta, paten, atau hak kekayaan intelektual pihak ketiga manapun;</li>
      <li>PIHAK KEDUA berhak untuk mengalihkan hak atas Hasil Karya kepada PIHAK PERTAMA.</li>
    </ul>
    <p>4. Apabila di kemudian hari terdapat klaim dari pihak ketiga atas Hasil Karya, PIHAK KEDUA bertanggung jawab sepenuhnya dan wajib membebaskan PIHAK PERTAMA dari segala tuntutan dan kerugian yang timbul.</p>
    <p>5. Ketentuan ini tetap berlaku setelah berakhirnya Perjanjian ini.</p>
  `);

  // ─── Pasal 11: Kompensasi PKWT ───────────────────────────────────────────
  const kompensasi = pb.pasal("Kompensasi Berakhirnya PKWT", `
    <p>1. Berdasarkan Pasal 15 dan 16 PP No. 35/2021, PIHAK PERTAMA berkewajiban membayarkan uang kompensasi kepada PIHAK KEDUA ketika PKWT ini berakhir, dengan ketentuan sebagai berikut:</p>
    <ul>
      <li>Masa kerja <strong>12 (dua belas) bulan secara terus-menerus</strong>: kompensasi sebesar <strong>1 (satu) bulan upah</strong>;</li>
      <li>Masa kerja di bawah 12 (dua belas) bulan: dihitung secara proporsional (prorata) dengan rumus: <strong>(masa kerja ÷ 12) × 1 bulan upah</strong>.</li>
    </ul>
    <p>2. Upah yang digunakan sebagai dasar perhitungan kompensasi adalah upah pokok ditambah tunjangan tetap.</p>
    <p>3. Uang kompensasi sebagaimana dimaksud dalam ayat (1) tidak berlaku apabila PKWT berakhir karena pekerja mengundurkan diri atas kemauan sendiri, sesuai ketentuan PP No. 35/2021.</p>
    <p>4. Uang kompensasi wajib dibayarkan oleh PIHAK PERTAMA paling lambat pada hari terakhir masa kerja PIHAK KEDUA.</p>
  `);

  // ─── Pasal 12: Pengakhiran ────────────────────────────────────────────────
  const pengakhiran = pb.pasal("Pengakhiran Perjanjian", `
    <p>1. Demi hukum, PKWT ini berakhir dengan sendirinya pada tanggal <strong>${tglBerakhir}</strong> tanpa memerlukan pemberitahuan pengakhiran secara khusus.</p>
    <p>2. Perjanjian dapat diakhiri sebelum waktunya apabila:</p>
    <ul>
      <li>PIHAK KEDUA mengundurkan diri secara sukarela dengan pemberitahuan tertulis minimal <strong>30 (tiga puluh) hari</strong> sebelumnya;</li>
      <li>PIHAK KEDUA melakukan pelanggaran berat atau tindak pidana yang merugikan Perusahaan, yang dibuktikan secara sah;</li>
      <li>Terjadi <em>force majeure</em> atau keadaan kahar yang menyebabkan kegiatan usaha tidak dapat dilanjutkan;</li>
      <li>Para Pihak sepakat untuk mengakhiri perjanjian lebih awal secara tertulis.</li>
    </ul>
    <p>3. Dalam hal pengakhiran sebelum waktunya oleh PIHAK PERTAMA tanpa alasan sah, berlaku ketentuan Pasal 62 UU Ketenagakerjaan mengenai ganti rugi.</p>
    <p>4. Pengakhiran PKWT sebelum waktunya yang dilakukan oleh PIHAK PERTAMA wajib disertai pembayaran kompensasi proporsional sesuai ketentuan PP No. 35/2021.</p>
  `);

  // ─── Pasal 13: Force Majeure ──────────────────────────────────────────────
  const forceMajeure = pb.pasal("Keadaan Kahar (Force Majeure)", `
    <p>1. Keadaan kahar dalam perjanjian ini mencakup segala kejadian di luar kendali wajar Para Pihak yang menyebabkan terhambatnya atau tidak dapat dipenuhinya kewajiban, termasuk namun tidak terbatas pada: bencana alam, kebakaran, wabah penyakit, perang, pemberontakan, atau kebijakan pemerintah yang secara langsung menghalangi pelaksanaan perjanjian.</p>
    <p>2. Pihak yang mengalami keadaan kahar wajib memberitahukan kepada Pihak lainnya secara tertulis dalam waktu <strong>7 (tujuh) hari</strong> sejak terjadinya keadaan kahar.</p>
    <p>3. Keadaan kahar yang berlangsung lebih dari 30 (tiga puluh) hari berturut-turut dapat menjadi alasan pengakhiran perjanjian berdasarkan kesepakatan tertulis Para Pihak.</p>
  `);

  // ─── Pasal 14: Penyelesaian Perselisihan ─────────────────────────────────
  const sengketa = pb.pasal("Penyelesaian Perselisihan", `
    <p>1. Setiap perselisihan yang timbul dari atau berkaitan dengan perjanjian ini diselesaikan terlebih dahulu melalui musyawarah untuk mufakat antara Para Pihak (<em>Bipartit</em>) dalam jangka waktu paling lama 30 (tiga puluh) hari kerja.</p>
    <p>2. Apabila musyawarah tidak tercapai, perselisihan diselesaikan melalui mekanisme Tripartit berupa mediasi atau konsiliasi di Dinas Ketenagakerjaan setempat, sesuai UU No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial.</p>
    <p>3. Apabila penyelesaian Tripartit tidak berhasil, Para Pihak dapat mengajukan perkara ke <strong>Pengadilan Hubungan Industrial (PHI)</strong> yang berwenang di wilayah hukum tempat perjanjian ini dibuat.</p>
  `);

  // ─── Pasal 15: Ketentuan Penutup ─────────────────────────────────────────
  const penutup = pb.pasal("Ketentuan Penutup", `
    <p>1. Perjanjian ini disusun dalam 2 (dua) rangkap asli, masing-masing berkekuatan hukum yang setara — satu disimpan oleh PIHAK PERTAMA dan satu oleh PIHAK KEDUA.</p>
    <p>2. Perubahan, penambahan, atau pengakhiran atas perjanjian ini hanya dapat dilakukan dengan persetujuan tertulis yang ditandatangani oleh Para Pihak.</p>
    <p>3. Apabila terdapat ketentuan dalam perjanjian ini yang bertentangan dengan peraturan perundang-undangan yang berlaku, maka ketentuan tersebut dianggap tidak berlaku dan digantikan oleh ketentuan yang sah berdasarkan hukum yang berlaku, sementara ketentuan lainnya dalam perjanjian ini tetap berlaku penuh.</p>
    <p>4. Para Pihak menyatakan telah membaca, memahami, dan menyetujui seluruh isi perjanjian ini dengan sukarela dan tanpa paksaan dari pihak manapun.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>Perjanjian Kerja Waktu Tertentu</h1>
  <p class="subtitle">(PKWT — Berdasarkan UU No. 13/2003 Jo. UU Cipta Kerja & PP No. 35/2021)</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${dasarHukum}
  ${paraPihak}
  ${posisi}
  ${masaKerja}
  ${gajiKompen}
  ${jamKerjaSection}
  ${hakKewajiban}
  ${bpjs}
  ${kerahasiaan}
  ${hki}
  ${kompensasi}
  ${pengakhiran}
  ${forceMajeure}
  ${sengketa}
  ${penutup}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah PKWT ini dibuat dan ditandatangani pada tanggal <strong>${tglPenandatanganan}</strong> di <strong>${d.kota_penandatanganan}</strong>,
    dalam keadaan sehat, sadar, dan tanpa paksaan dari pihak manapun.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(${d.jabatan_pimpinan})</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pimpinan}</strong></p>
        <p style="font-size: 10pt;">${d.jenis_perusahaan} ${d.nama_perusahaan}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Pekerja)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_karyawan}</strong></p>
        <p style="font-size: 10pt;">NIK: ${d.nik_karyawan}</p>
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
