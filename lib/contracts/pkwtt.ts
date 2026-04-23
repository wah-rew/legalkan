// ─── Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ───────────────────────────
// Dasar hukum:
//   - UU No. 13 Tahun 2003 tentang Ketenagakerjaan
//   - UU No. 11 Tahun 2020 tentang Cipta Kerja
//   - PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja & PHK
//   - UU No. 24 Tahun 2011 tentang BPJS
//   - UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi
//   - UU No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial

import { formatRupiah, formatTanggal, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface PKWTTData {
  // Perusahaan
  namaPerusahaan: string;
  bidangUsaha: string;
  alamatPerusahaan: string;
  namaRepresentatif: string;
  jabatanRepresentatif: string; // Direktur/HRD Manager/dll

  // Karyawan
  namaKaryawan: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string; // Laki-laki / Perempuan
  nikKTP: string;
  alamatKaryawan: string;
  pendidikanTerakhir: string; // S1/S2/SMA/dll
  nomorTelepon: string;

  // Jabatan
  namaJabatan: string;
  divisi: string;
  lokasiKerja: string;
  tanggalMulaiKerja: string;

  // Waktu kerja
  polakKerja: string; // "5 hari" atau "6 hari"
  jadwalKerja: string; // e.g. "Senin s.d. Jumat, 08.00-17.00 WIB"

  // Upah
  upahPokok: number;
  tunjanganTetap: number;
  tanggalPembayaran: string; // e.g. "25"

  // Non-compete
  durasiNonCompete: string; // e.g. "6" bulan

  // Lokasi & tanggal
  kota: string;
  tanggalPerjanjian: string;

  // Saksi (opsional)
  saksi1Nama?: string;
  saksi2Nama?: string;

  nomorPKWTT: string; // auto-generated
}

export function generatePKWTTNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `LK-PKWTT-${year}${month}-${random}`;
}

export function generatePKWTT(d: PKWTTData): string {
  const pb = new PasalBuilder();

  const tglMulai = formatTanggal(d.tanggalMulaiKerja);
  const tglPerjanjian = formatTanggal(d.tanggalPerjanjian);
  const tglLahir = formatTanggal(d.tanggalLahir);

  const upahPokok = formatRupiah(d.upahPokok);
  const tunjanganTetap = d.tunjanganTetap ? formatRupiah(d.tunjanganTetap) : null;
  const totalUpah = formatRupiah(d.upahPokok + (d.tunjanganTetap || 0));

  const hariKerja = d.polakKerja === "5 hari" ? 5 : 6;
  const istirahatMingguan = hariKerja === 5 ? "2 (dua) hari" : "1 (satu) hari";

  // ─── Pasal 1: Hubungan Kerja dan Jabatan ──────────────────────────────────
  const p1 = pb.pasal("Hubungan Kerja dan Jabatan", `
    <p>1. PIHAK PERTAMA dengan ini menyatakan menerima dan mempekerjakan PIHAK KEDUA sebagai Karyawan Tetap (PKWTT) pada:</p>
    <div class="pihak-box">
      <p><strong>Jabatan/Posisi :</strong> ${d.namaJabatan}</p>
      <p><strong>Divisi / Departemen :</strong> ${d.divisi}</p>
      <p><strong>Lokasi Kerja :</strong> ${d.lokasiKerja}</p>
      <p><strong>Tanggal Mulai Kerja :</strong> ${tglMulai}</p>
    </div>
    <p>2. PIHAK KEDUA menyatakan bersedia bekerja kepada PIHAK PERTAMA dengan mematuhi seluruh peraturan perusahaan, kebijakan internal, dan ketentuan yang diatur dalam Perjanjian ini.</p>
    <p>3. Perjanjian ini merupakan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) sebagaimana diatur dalam Pasal 56 ayat (2) dan Pasal 60 Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan jo. Undang-Undang No. 11 Tahun 2020 tentang Cipta Kerja.</p>
    <p>4. PIHAK PERTAMA dapat melakukan mutasi, rotasi, atau penugasan PIHAK KEDUA ke jabatan/departemen lain yang setara atau lebih tinggi sesuai kebutuhan operasional perusahaan, dengan memperhatikan kompetensi dan hak-hak PIHAK KEDUA.</p>
    <p>5. PIHAK PERTAMA dapat menugaskan PIHAK KEDUA ke lokasi kerja lain dalam wilayah Indonesia dengan pemberitahuan tertulis sekurang-kurangnya <strong>30 (tiga puluh) hari kalender</strong> sebelumnya.</p>
  `);

  // ─── Pasal 2: Masa Percobaan ───────────────────────────────────────────────
  const p2 = pb.pasal("Masa Percobaan", `
    <p>1. PIHAK KEDUA diwajibkan menjalani <strong>masa percobaan (probation) selama 3 (tiga) bulan</strong> terhitung sejak tanggal <strong>${tglMulai}</strong>, sesuai ketentuan Pasal 60 Undang-Undang No. 13 Tahun 2003 tentang Ketenagakerjaan.</p>
    <p>2. Selama masa percobaan, PIHAK KEDUA menerima upah sebagaimana tercantum dalam Pasal 5 Perjanjian ini, dan tidak boleh ditetapkan di bawah upah minimum yang berlaku.</p>
    <p>3. Selama masa percobaan, PIHAK PERTAMA berhak mengakhiri hubungan kerja sewaktu-waktu apabila PIHAK KEDUA dinilai tidak memenuhi standar kinerja yang dipersyaratkan, tanpa wajib membayar uang pesangon, uang penghargaan masa kerja, maupun uang penggantian hak.</p>
    <p>4. Selama masa percobaan, PIHAK KEDUA berhak mengundurkan diri dengan pemberitahuan tertulis kepada PIHAK PERTAMA.</p>
    <p>5. Apabila setelah berakhirnya masa percobaan PIHAK PERTAMA tidak memberitahukan pengakhiran hubungan kerja secara tertulis kepada PIHAK KEDUA, maka PIHAK KEDUA dianggap telah lulus masa percobaan dan hubungan kerja berlanjut sebagai karyawan tetap.</p>
    <p>6. Hasil evaluasi masa percobaan akan dikomunikasikan secara tertulis kepada PIHAK KEDUA.</p>
  `);

  // ─── Pasal 3: Waktu Kerja dan Waktu Istirahat ─────────────────────────────
  const p3 = pb.pasal("Waktu Kerja dan Waktu Istirahat", `
    <p>1. Hari dan jam kerja PIHAK KEDUA adalah sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Pola Kerja :</strong> ${d.polakKerja} kerja per minggu</p>
      <p><strong>Jadwal Kerja :</strong> ${d.jadwalKerja}</p>
      <p><strong>Hari Istirahat :</strong> ${istirahatMingguan} per minggu</p>
    </div>
    <p>2. PIHAK KEDUA berhak atas waktu istirahat antara jam kerja sekurang-kurangnya <strong>30 (tiga puluh) menit</strong> setelah bekerja selama 4 (empat) jam terus-menerus, sesuai Pasal 79 ayat (2) huruf a Undang-Undang No. 13 Tahun 2003.</p>
    <p>3. PIHAK PERTAMA dapat menetapkan jadwal kerja yang berbeda dari ketentuan di atas sesuai kebutuhan operasional, sepanjang tidak melebihi <strong>8 (delapan) jam per hari dan 40 (empat puluh) jam per minggu</strong> sesuai Pasal 77 Undang-Undang No. 13 Tahun 2003.</p>
    <p>4. Pada hari libur nasional yang ditetapkan oleh Pemerintah, PIHAK KEDUA tidak diwajibkan masuk kerja kecuali ada ketentuan lain dari PIHAK PERTAMA disertai kompensasi sesuai peraturan yang berlaku.</p>
    <p>5. Ketentuan mengenai waktu kerja bagi PIHAK KEDUA yang bersifat teknis atau operasional khusus dapat diatur lebih lanjut dalam peraturan internal perusahaan.</p>
  `);

  // ─── Pasal 4: Kerja Lembur ────────────────────────────────────────────────
  const p4 = pb.pasal("Kerja Lembur", `
    <p>1. Kerja lembur hanya dapat dilakukan apabila ada <strong>perintah tertulis atau persetujuan dari PIHAK PERTAMA</strong> sesuai Pasal 78 Undang-Undang No. 13 Tahun 2003.</p>
    <p>2. Waktu kerja lembur dibatasi paling banyak <strong>4 (empat) jam dalam 1 (satu) hari</strong> dan <strong>18 (delapan belas) jam dalam 1 (satu) minggu</strong> sesuai PP No. 35 Tahun 2021.</p>
    <p>3. Upah lembur dihitung dan dibayarkan sesuai ketentuan peraturan perundang-undangan yang berlaku, dengan rincian:</p>
    <ul>
      <li>Jam pertama lembur di hari kerja biasa: <strong>1,5× upah sejam</strong>;</li>
      <li>Jam kedua dan seterusnya lembur di hari kerja biasa: <strong>2× upah sejam</strong>;</li>
      <li>Lembur di hari istirahat/libur resmi: dihitung sesuai PP No. 35 Tahun 2021.</li>
    </ul>
    <p>4. Upah sejam dihitung sebesar <strong>1/173 (satu per seratus tujuh puluh tiga) × upah sebulan</strong>.</p>
    <p>5. PIHAK PERTAMA wajib membayar upah lembur paling lambat bersamaan dengan pembayaran upah bulanan.</p>
    <p>6. PIHAK KEDUA berhak menolak perintah lembur apabila terdapat alasan yang dapat diterima, tanpa dikenai sanksi.</p>
  `);

  // ─── Pasal 5: Upah dan Tunjangan ─────────────────────────────────────────
  const p5 = pb.pasal("Upah dan Tunjangan", `
    <p>1. PIHAK PERTAMA memberikan upah kepada PIHAK KEDUA dengan rincian sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Upah Pokok :</strong> ${upahPokok} per bulan</p>
      ${tunjanganTetap ? `<p><strong>Tunjangan Tetap :</strong> ${tunjanganTetap} per bulan</p>` : ""}
      <p><strong>Total Upah Bulanan :</strong> ${totalUpah} per bulan</p>
    </div>
    <p>2. Upah dibayarkan paling lambat pada <strong>tanggal ${d.tanggalPembayaran} setiap bulannya</strong> melalui transfer ke rekening bank PIHAK KEDUA. Apabila tanggal tersebut jatuh pada hari libur, pembayaran dilakukan pada hari kerja sebelumnya.</p>
    <p>3. Upah sebagaimana tersebut dalam ayat (1) tidak boleh lebih rendah dari Upah Minimum Provinsi (UMP) atau Upah Minimum Kabupaten/Kota (UMK) yang berlaku di wilayah tempat kerja, sesuai ketentuan peraturan perundang-undangan.</p>
    <p>4. <strong>Tunjangan Tidak Tetap</strong> (tunjangan makan, transport, dan lainnya) dapat diberikan sesuai kebijakan perusahaan yang berlaku dari waktu ke waktu, dan tidak diperhitungkan sebagai dasar penghitungan lembur, pesangon, atau kompensasi lainnya.</p>
    <p>5. <strong>Tunjangan Hari Raya (THR)</strong> diberikan kepada PIHAK KEDUA sesuai Peraturan Menteri Ketenagakerjaan No. 6 Tahun 2016 tentang THR Keagamaan:</p>
    <ul>
      <li>Masa kerja ≥ 12 bulan: <strong>1 (satu) bulan upah</strong>;</li>
      <li>Masa kerja ≥ 1 bulan &lt; 12 bulan: dihitung secara proporsional <strong>(masa kerja / 12 × 1 bulan upah)</strong>;</li>
      <li>Dibayarkan paling lambat <strong>7 (tujuh) hari sebelum Hari Raya Keagamaan</strong>.</li>
    </ul>
    <p>6. Upah tidak dibayarkan untuk hari ketidakhadiran PIHAK KEDUA tanpa keterangan yang sah, sesuai prinsip <em>no work, no pay</em> sebagaimana diatur dalam Pasal 93 Undang-Undang No. 13 Tahun 2003.</p>
    <p>7. Penyesuaian upah dapat dilakukan oleh PIHAK PERTAMA sesuai penilaian kinerja, kemampuan perusahaan, dan peraturan yang berlaku, dengan pemberitahuan tertulis kepada PIHAK KEDUA.</p>
    <p>8. Atas upah yang diterima, PIHAK PERTAMA akan melakukan pemotongan Pajak Penghasilan Pasal 21 (PPh 21) sesuai peraturan perpajakan yang berlaku dan menyetorkannya kepada negara atas nama PIHAK KEDUA.</p>
  `);

  // ─── Pasal 6: Hak Cuti ────────────────────────────────────────────────────
  const p6 = pb.pasal("Hak Cuti", `
    <p>1. <strong>Cuti Tahunan:</strong> PIHAK KEDUA berhak atas cuti tahunan <strong>12 (dua belas) hari kerja</strong> setelah bekerja selama 12 (dua belas) bulan berturut-turut, sesuai Pasal 79 ayat (2) huruf c Undang-Undang No. 13 Tahun 2003. Cuti tahunan diajukan minimum 3 (tiga) hari kerja sebelumnya dan mendapat persetujuan atasan.</p>
    <p>2. <strong>Cuti Sakit:</strong> PIHAK KEDUA berhak atas cuti sakit dengan ketentuan:</p>
    <ul>
      <li>Sakit dengan surat keterangan dokter: upah dibayar penuh;</li>
      <li>Sakit berturut-turut dengan keterangan dokter: bulan 1–4 dibayar 100%, bulan 5–8 dibayar 75%, bulan 9–12 dibayar 50%, bulan 13 dan seterusnya dibayar 25%;</li>
      <li>Setelah 12 bulan sakit berturut-turut, dapat menjadi alasan PHK dengan hak-hak sesuai ketentuan.</li>
    </ul>
    <p>3. <strong>Cuti Melahirkan:</strong> Karyawan perempuan berhak atas cuti melahirkan selama <strong>3 (tiga) bulan</strong> (1,5 bulan sebelum dan 1,5 bulan setelah melahirkan) dengan upah penuh, sesuai Pasal 82 Undang-Undang No. 13 Tahun 2003.</p>
    <p>4. <strong>Cuti Keguguran:</strong> Karyawan perempuan yang mengalami keguguran berhak atas cuti <strong>1,5 (satu setengah) bulan</strong> dengan upah penuh, sesuai Pasal 82 ayat (2) Undang-Undang No. 13 Tahun 2003.</p>
    <p>5. <strong>Cuti Haid:</strong> Karyawan perempuan tidak wajib masuk kerja pada hari pertama dan kedua waktu haid jika merasakan sakit, sesuai Pasal 81 Undang-Undang No. 13 Tahun 2003.</p>
    <p>6. <strong>Izin Berupah (Istirahat Keluarga):</strong> PIHAK KEDUA berhak atas izin tidak masuk kerja dengan tetap mendapat upah penuh untuk keperluan berikut:</p>
    <table style="width:100%; border-collapse: collapse; margin: 8px 0; font-size: 11pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc; padding:6px; text-align:left;">Keperluan</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Lama Izin</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="border:1px solid #ccc; padding:6px;">Pernikahan karyawan sendiri</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">3 hari</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Pernikahan anak karyawan</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2 hari</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Khitanan/Baptis anak karyawan</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2 hari</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Istri karyawan melahirkan/keguguran</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2 hari</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Suami/istri/anak/orangtua/mertua meninggal dunia</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2 hari</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Anggota keluarga dalam satu rumah meninggal dunia</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">1 hari</td></tr>
      </tbody>
    </table>
    <p>7. Pengajuan cuti dilakukan melalui prosedur yang diatur dalam peraturan perusahaan dan mendapatkan persetujuan dari atasan langsung, kecuali cuti darurat/sakit.</p>
  `);

  // ─── Pasal 7: Jaminan Sosial BPJS ─────────────────────────────────────────
  const p7 = pb.pasal("Jaminan Sosial Ketenagakerjaan dan Kesehatan", `
    <p>1. PIHAK PERTAMA wajib mendaftarkan PIHAK KEDUA ke dalam program jaminan sosial sesuai Undang-Undang No. 24 Tahun 2011 tentang BPJS, meliputi:</p>
    <p><strong>A. BPJS Ketenagakerjaan:</strong></p>
    <table style="width:100%; border-collapse: collapse; margin: 8px 0; font-size: 11pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc; padding:6px; text-align:left;">Program</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Iuran Perusahaan</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Iuran Pekerja</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="border:1px solid #ccc; padding:6px;">Jaminan Kecelakaan Kerja (JKK)</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">0,24% – 1,74% upah</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">—</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Jaminan Kematian (JKM)</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">0,30% upah</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">—</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Jaminan Hari Tua (JHT)</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">3,70% upah</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2,00% upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Jaminan Pensiun (JP)</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2,00% upah</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">1,00% upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Jaminan Kehilangan Pekerjaan (JKP)</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">0,22% upah</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">—</td></tr>
      </tbody>
    </table>
    <p><strong>B. BPJS Kesehatan:</strong></p>
    <table style="width:100%; border-collapse: collapse; margin: 8px 0; font-size: 11pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc; padding:6px; text-align:left;">Iuran</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Perusahaan</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Pekerja</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="border:1px solid #ccc; padding:6px;">BPJS Kesehatan</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">4,00% upah</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">1,00% upah</td></tr>
      </tbody>
    </table>
    <p>2. Besaran upah yang menjadi dasar perhitungan iuran BPJS adalah upah pokok ditambah tunjangan tetap, dengan batasan upah tertinggi dan terendah sesuai ketentuan yang berlaku.</p>
    <p>3. Iuran yang menjadi beban PIHAK KEDUA sebagaimana tercantum dalam tabel di atas akan dipotong dari upah bulanan PIHAK KEDUA oleh PIHAK PERTAMA dan disetor kepada BPJS.</p>
    <p>4. PIHAK KEDUA tidak dapat menolak atau melepaskan kepesertaan BPJS yang bersifat wajib sesuai peraturan perundang-undangan.</p>
    <p>5. Cakupan manfaat masing-masing program mengikuti ketentuan BPJS Ketenagakerjaan dan BPJS Kesehatan yang berlaku.</p>
  `);

  // ─── Pasal 8: Kewajiban Pihak Kedua ─────────────────────────────────────
  const p8 = pb.pasal("Kewajiban Pihak Kedua", `
    <p>Selama masa hubungan kerja, PIHAK KEDUA berkewajiban untuk:</p>
    <ol style="padding-left: 18px; margin-top: 8px;">
      <li>Melaksanakan seluruh tugas dan pekerjaan yang diberikan dengan penuh tanggung jawab, kejujuran, profesionalisme, dan dedikasi;</li>
      <li>Mematuhi peraturan perusahaan, kebijakan internal, prosedur operasi standar (SOP), dan kode etik yang ditetapkan PIHAK PERTAMA;</li>
      <li>Hadir dan bekerja sesuai jam dan hari kerja yang telah ditetapkan; apabila tidak dapat hadir, wajib memberitahukan selambat-lambatnya sebelum jam kerja dimulai disertai alasan yang dapat dipertanggungjawabkan;</li>
      <li>Menjaga dan merawat seluruh aset, peralatan, fasilitas, dan properti milik PIHAK PERTAMA yang digunakan dalam pelaksanaan pekerjaan;</li>
      <li>Memberikan informasi yang jujur dan akurat kepada PIHAK PERTAMA mengenai perkembangan pekerjaan dan setiap permasalahan yang dihadapi;</li>
      <li>Mengikuti pelatihan, pendidikan, dan pengembangan yang diselenggarakan atau diwajibkan oleh PIHAK PERTAMA;</li>
      <li>Menjaga nama baik, reputasi, dan kepercayaan PIHAK PERTAMA di hadapan pelanggan, mitra, dan masyarakat umum;</li>
      <li>Melaporkan setiap potensi konflik kepentingan, benturan kepentingan, atau pelanggaran etika kepada atasan langsung atau divisi HRD;</li>
      <li>Mengembalikan seluruh aset, dokumen, data, dan properti milik PIHAK PERTAMA dalam kondisi baik pada saat berakhirnya hubungan kerja;</li>
      <li>Mematuhi ketentuan kerahasiaan dan larangan sebagaimana diatur dalam Pasal 10, 11, dan 12 Perjanjian ini.</li>
    </ol>
  `);

  // ─── Pasal 9: Hak Pihak Kedua ─────────────────────────────────────────────
  const p9 = pb.pasal("Hak Pihak Kedua", `
    <p>Selama masa hubungan kerja, PIHAK KEDUA berhak untuk:</p>
    <ol style="padding-left: 18px; margin-top: 8px;">
      <li>Menerima upah dan tunjangan sesuai ketentuan Pasal 5 Perjanjian ini tepat pada waktunya;</li>
      <li>Mendapatkan cuti tahunan, cuti sakit, cuti melahirkan, dan izin berupah sesuai ketentuan Pasal 6 Perjanjian ini;</li>
      <li>Mendapatkan perlindungan keselamatan dan kesehatan kerja (K3) yang layak sesuai peraturan yang berlaku;</li>
      <li>Mendapatkan perlakuan yang adil, bermartabat, dan tidak diskriminatif dari PIHAK PERTAMA;</li>
      <li>Mendapatkan fasilitas dan sarana kerja yang memadai untuk mendukung pelaksanaan tugas;</li>
      <li>Mengikuti program pelatihan dan pengembangan kompetensi yang disediakan oleh PIHAK PERTAMA;</li>
      <li>Mendapatkan penilaian kinerja yang transparan dan objektif secara berkala;</li>
      <li>Mendapatkan Tunjangan Hari Raya (THR) sesuai ketentuan Pasal 5 ayat (5) Perjanjian ini;</li>
      <li>Mendapatkan kepesertaan BPJS Ketenagakerjaan dan BPJS Kesehatan sesuai ketentuan Pasal 7 Perjanjian ini;</li>
      <li>Mendapatkan uang pesangon, uang penghargaan masa kerja, dan uang penggantian hak sesuai ketentuan Pasal 15 Perjanjian ini apabila hubungan kerja berakhir.</li>
    </ol>
  `);

  // ─── Pasal 10: Kerahasiaan Informasi ─────────────────────────────────────
  const p10 = pb.pasal("Kerahasiaan Informasi", `
    <p>1. Dalam pelaksanaan tugasnya, PIHAK KEDUA akan memperoleh dan/atau memiliki akses terhadap informasi rahasia milik PIHAK PERTAMA, termasuk namun tidak terbatas pada:</p>
    <ul>
      <li>Informasi keuangan, akuntansi, laporan bisnis, dan proyeksi perusahaan;</li>
      <li>Strategi bisnis, rencana pengembangan, dan roadmap produk/layanan;</li>
      <li>Data pelanggan, pemasok, mitra bisnis, dan pihak ketiga lainnya;</li>
      <li>Proses produksi, teknologi, sistem informasi, dan metode kerja rahasia;</li>
      <li>Informasi kepegawaian dan kebijakan kompensasi karyawan;</li>
      <li>Dokumen, data, dan materi lain yang dinyatakan bersifat rahasia oleh PIHAK PERTAMA.</li>
    </ul>
    <p>2. PIHAK KEDUA dengan ini berjanji dan setuju untuk:</p>
    <ul>
      <li>Menjaga kerahasiaan seluruh Informasi Rahasia dengan standar pengamanan yang tidak kurang dari pengamanan yang diterapkan untuk informasi rahasianya sendiri;</li>
      <li>Tidak mengungkapkan, menyebarkan, atau memindahtangankan Informasi Rahasia kepada pihak ketiga manapun tanpa persetujuan tertulis dari PIHAK PERTAMA;</li>
      <li>Menggunakan Informasi Rahasia hanya untuk keperluan pelaksanaan tugas dalam Perjanjian ini;</li>
      <li>Segera memberitahukan kepada PIHAK PERTAMA apabila terjadi atau diperkirakan akan terjadi kebocoran Informasi Rahasia.</li>
    </ul>
    <p>3. Kewajiban kerahasiaan ini berlaku selama masa hubungan kerja dan tetap berlaku <strong>selamanya (tanpa batas waktu)</strong> setelah berakhirnya hubungan kerja antara Para Pihak, tanpa memandang alasan berakhirnya hubungan kerja.</p>
    <p>4. Kewajiban kerahasiaan tidak berlaku apabila Informasi Rahasia:</p>
    <ul>
      <li>Telah diketahui oleh publik secara umum bukan karena tindakan PIHAK KEDUA;</li>
      <li>Diwajibkan untuk diungkapkan berdasarkan putusan pengadilan atau peraturan perundang-undangan, dengan pemberitahuan terlebih dahulu kepada PIHAK PERTAMA.</li>
    </ul>
    <p>5. Pelanggaran atas ketentuan kerahasiaan ini menimbulkan tanggung jawab hukum perdata dan/atau pidana sesuai peraturan perundang-undangan yang berlaku di Indonesia.</p>
  `);

  // ─── Pasal 11: Hak Kekayaan Intelektual ──────────────────────────────────
  const p11 = pb.pasal("Hak Kekayaan Intelektual", `
    <p>1. Seluruh hasil karya, kreasi, inovasi, penemuan, program komputer, desain, konten, laporan, dan/atau produk lainnya (<em>"Hasil Karya"</em>) yang dibuat, dikembangkan, atau dihasilkan oleh PIHAK KEDUA — baik secara mandiri maupun bersama pihak lain — dalam rangka pelaksanaan tugas dan kewajibannya berdasarkan Perjanjian ini, adalah <strong>milik eksklusif PIHAK PERTAMA</strong>.</p>
    <p>2. PIHAK KEDUA dengan ini secara tegas dan tanpa syarat mengalihkan kepada PIHAK PERTAMA seluruh hak kekayaan intelektual atas Hasil Karya tersebut, termasuk namun tidak terbatas pada:</p>
    <ul>
      <li>Hak Cipta (sebagaimana diatur dalam UU No. 28 Tahun 2014 tentang Hak Cipta);</li>
      <li>Hak Paten dan Paten Sederhana (sebagaimana diatur dalam UU No. 13 Tahun 2016 tentang Paten);</li>
      <li>Hak atas Merek dan Indikasi Geografis;</li>
      <li>Rahasia Dagang;</li>
      <li>Desain Industri; dan</li>
      <li>Hak kekayaan intelektual lainnya yang relevan.</li>
    </ul>
    <p>3. Pengalihan hak kekayaan intelektual sebagaimana dimaksud dalam ayat (2) berlaku sejak saat Hasil Karya tersebut dibuat/diciptakan dan tidak memerlukan perjanjian pengalihan hak terpisah.</p>
    <p>4. Apabila diperlukan, PIHAK KEDUA bersedia menandatangani dokumen-dokumen tambahan untuk menegaskan pengalihan hak kekayaan intelektual kepada PIHAK PERTAMA.</p>
    <p>5. PIHAK KEDUA menjamin bahwa Hasil Karya merupakan karya orisinal dan tidak melanggar hak kekayaan intelektual pihak manapun. Apabila terdapat klaim dari pihak ketiga, PIHAK KEDUA bertanggung jawab sepenuhnya dan wajib membebaskan (indemnify) PIHAK PERTAMA dari segala tuntutan dan kerugian.</p>
    <p>6. Ketentuan Pasal ini tetap berlaku setelah berakhirnya hubungan kerja.</p>
  `);

  // ─── Pasal 12: Larangan bagi Pihak Kedua ─────────────────────────────────
  const p12 = pb.pasal("Larangan bagi Pihak Kedua", `
    <p>Selama masa hubungan kerja dan dalam jangka waktu <strong>${d.durasiNonCompete} (${d.durasiNonCompete} bulan dalam bahasa terbilang) bulan</strong> setelah berakhirnya hubungan kerja, PIHAK KEDUA dilarang untuk:</p>
    <ol style="padding-left: 18px; margin-top: 8px;">
      <li><strong>Persaingan Usaha (Non-Compete):</strong> Bekerja, mendirikan, atau memiliki kepentingan dalam perusahaan/usaha yang secara langsung bersaing dengan bidang usaha PIHAK PERTAMA di wilayah yang sama;</li>
      <li><strong>Pembajakan Karyawan (Non-Solicitation Karyawan):</strong> Mengajak, merekrut, atau mendorong karyawan PIHAK PERTAMA untuk meninggalkan perusahaan;</li>
      <li><strong>Pembajakan Pelanggan (Non-Solicitation Klien):</strong> Mendekati, merayu, atau menawarkan jasa/produk yang bersifat kompetitif kepada pelanggan, klien, atau mitra bisnis PIHAK PERTAMA;</li>
      <li><strong>Penggunaan Informasi Rahasia:</strong> Menggunakan informasi rahasia PIHAK PERTAMA untuk kepentingan pribadi atau pihak lain;</li>
      <li><strong>Penipuan dan Kecurangan:</strong> Melakukan tindakan yang berpotensi merugikan PIHAK PERTAMA secara finansial maupun reputasional, termasuk pemalsuan dokumen, penggelapan aset, atau korupsi;</li>
      <li><strong>Penerimaan Gratifikasi:</strong> Menerima suap, komisi tersembunyi, hadiah, atau keuntungan lain dari pihak ketiga yang berkaitan dengan pekerjaan di PIHAK PERTAMA tanpa sepengetahuan dan persetujuan tertulis PIHAK PERTAMA;</li>
      <li><strong>Aktivitas Sampingan Konflik Kepentingan:</strong> Menjalankan usaha atau pekerjaan sampingan yang menimbulkan konflik kepentingan dengan PIHAK PERTAMA tanpa persetujuan tertulis.</li>
    </ol>
    <p>Pelanggaran atas larangan-larangan di atas menimbulkan hak PIHAK PERTAMA untuk mengakhiri hubungan kerja dan/atau menuntut ganti rugi sesuai peraturan yang berlaku.</p>
  `);

  // ─── Pasal 13: Sanksi dan Tindakan Disiplin ───────────────────────────────
  const p13 = pb.pasal("Sanksi dan Tindakan Disiplin", `
    <p>1. Dalam hal PIHAK KEDUA melakukan pelanggaran terhadap kewajiban, larangan, atau ketentuan dalam Perjanjian ini maupun peraturan perusahaan, PIHAK PERTAMA berhak menerapkan tindakan disiplin progresif sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Surat Peringatan Pertama (SP-1):</strong> Diberikan untuk pelanggaran ringan. Berlaku selama <strong>6 (enam) bulan</strong>.</p>
      <p><strong>Surat Peringatan Kedua (SP-2):</strong> Diberikan apabila dalam masa berlaku SP-1, PIHAK KEDUA melakukan pelanggaran kembali. Berlaku selama <strong>6 (enam) bulan</strong>.</p>
      <p><strong>Surat Peringatan Ketiga (SP-3):</strong> Diberikan apabila dalam masa berlaku SP-2, PIHAK KEDUA melakukan pelanggaran kembali. Berlaku selama <strong>6 (enam) bulan</strong>.</p>
      <p><strong>Skorsing:</strong> Dapat dilakukan sebelum atau sesudah SP-3 untuk pelanggaran yang memerlukan investigasi, dengan upah tetap dibayarkan selama skorsing.</p>
      <p><strong>Pemutusan Hubungan Kerja (PHK):</strong> Dilakukan apabila PIHAK KEDUA masih melakukan pelanggaran setelah SP-3, atau karena alasan sebagaimana Pasal 14.</p>
    </div>
    <p>2. Untuk <strong>pelanggaran berat</strong> sebagaimana diatur dalam Pasal 158 Undang-Undang No. 13 Tahun 2003 dan ketentuan perundang-undangan yang berlaku, PIHAK PERTAMA dapat langsung melakukan PHK tanpa Surat Peringatan.</p>
    <p>3. Contoh pelanggaran berat meliputi: pencurian, penggelapan, penganiayaan, ancaman kekerasan, membujuk atasan/rekan melakukan perbuatan melanggar hukum, merusak aset perusahaan, pelecehan seksual, penyalahgunaan narkoba di lingkungan kerja, atau menyerang kehormatan perusahaan.</p>
    <p>4. Setiap Surat Peringatan disampaikan secara tertulis kepada PIHAK KEDUA dan didokumentasikan dalam berkas kepegawaian.</p>
    <p>5. Proses pemberian tindakan disiplin dilakukan secara adil, transparan, dan memberikan kesempatan kepada PIHAK KEDUA untuk memberikan klarifikasi.</p>
  `);

  // ─── Pasal 14: Pemutusan Hubungan Kerja ──────────────────────────────────
  const p14 = pb.pasal("Pemutusan Hubungan Kerja", `
    <p>1. Pemutusan Hubungan Kerja (PHK) dilaksanakan sesuai ketentuan Pasal 154A Undang-Undang No. 13 Tahun 2003 sebagaimana diubah oleh Undang-Undang Cipta Kerja No. 11 Tahun 2020, yang antara lain mencakup alasan:</p>
    <ul>
      <li>Perusahaan melakukan penggabungan, peleburan, pengambilalihan, atau pemisahan;</li>
      <li>Perusahaan melakukan efisiensi;</li>
      <li>Perusahaan tutup karena mengalami kerugian terus-menerus;</li>
      <li>Perusahaan dalam keadaan penundaan kewajiban pembayaran utang (PKPU);</li>
      <li>Pekerja melakukan pelanggaran ketentuan perjanjian kerja atau peraturan perusahaan;</li>
      <li>Pekerja mengajukan pengunduran diri;</li>
      <li>Pekerja mangkir selama 5 hari kerja berturut-turut tanpa keterangan tertulis yang sah;</li>
      <li>Pekerja ditahan pihak berwajib selama 6 bulan atau dinyatakan bersalah oleh pengadilan;</li>
      <li>Pekerja memasuki usia pensiun; atau</li>
      <li>Pekerja meninggal dunia.</li>
    </ul>
    <p>2. <strong>Pengunduran Diri:</strong> PIHAK KEDUA yang mengundurkan diri secara sukarela wajib menyampaikan surat pengunduran diri secara tertulis kepada PIHAK PERTAMA selambat-lambatnya <strong>30 (tiga puluh) hari kalender</strong> sebelum tanggal efektif pengunduran diri. Selama masa pemberitahuan, PIHAK KEDUA wajib menjalankan tugasnya dan melakukan serah terima (handover) pekerjaan kepada penggantinya.</p>
    <p>3. Dalam hal PHK, PIHAK PERTAMA wajib memberikan pemberitahuan tertulis paling lambat <strong>14 (empat belas) hari kerja</strong> sebelum tanggal PHK, kecuali untuk pelanggaran berat.</p>
    <p>4. Hak-hak PIHAK KEDUA saat PHK dihitung sesuai ketentuan Pasal 15 Perjanjian ini dan peraturan perundang-undangan yang berlaku.</p>
  `);

  // ─── Pasal 15: Pesangon, Penghargaan, Penggantian Hak ────────────────────
  const p15 = pb.pasal("Uang Pesangon, Penghargaan Masa Kerja, dan Penggantian Hak", `
    <p>1. Dalam hal terjadi PHK, PIHAK PERTAMA wajib membayar kepada PIHAK KEDUA uang pesangon, uang penghargaan masa kerja, dan uang penggantian hak sesuai PP No. 35 Tahun 2021 dan ketentuan berikut:</p>
    <p><strong>A. Uang Pesangon (UP):</strong></p>
    <table style="width:100%; border-collapse: collapse; margin: 8px 0; font-size: 11pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc; padding:6px; text-align:left;">Masa Kerja</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Uang Pesangon</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="border:1px solid #ccc; padding:6px;">Kurang dari 1 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">1 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">1 tahun – kurang dari 2 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">2 tahun – kurang dari 3 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">3 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">3 tahun – kurang dari 4 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">4 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">4 tahun – kurang dari 5 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">5 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">5 tahun – kurang dari 6 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">6 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">6 tahun – kurang dari 7 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">7 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">7 tahun – kurang dari 8 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">8 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">8 tahun atau lebih</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">9 bulan upah</td></tr>
      </tbody>
    </table>
    <p><strong>B. Uang Penghargaan Masa Kerja (UPMK):</strong></p>
    <table style="width:100%; border-collapse: collapse; margin: 8px 0; font-size: 11pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc; padding:6px; text-align:left;">Masa Kerja</th>
          <th style="border:1px solid #ccc; padding:6px; text-align:center;">Uang Penghargaan</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="border:1px solid #ccc; padding:6px;">3 tahun – kurang dari 6 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">2 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">6 tahun – kurang dari 9 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">3 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">9 tahun – kurang dari 12 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">4 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">12 tahun – kurang dari 15 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">5 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">15 tahun – kurang dari 18 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">6 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">18 tahun – kurang dari 21 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">7 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">21 tahun – kurang dari 24 tahun</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">8 bulan upah</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">24 tahun atau lebih</td><td style="border:1px solid #ccc; padding:6px; text-align:center;">10 bulan upah</td></tr>
      </tbody>
    </table>
    <p><strong>C. Uang Penggantian Hak (UPH):</strong> Dihitung dari sisa hak cuti tahunan yang belum diambil dan biaya atau ongkos pulang ke tempat asal (bila berlaku), sesuai PP No. 35 Tahun 2021.</p>
    <p>2. Besaran pesangon yang dibayarkan tergantung pada <strong>alasan PHK</strong> sesuai PP No. 35 Tahun 2021 (dapat berupa 0,5×, 1×, atau 2× dari ketentuan di atas).</p>
    <p>3. Upah yang digunakan sebagai dasar perhitungan pesangon adalah <strong>upah pokok ditambah tunjangan tetap</strong>.</p>
    <p>4. Pembayaran pesangon dan hak-hak PIHAK KEDUA dilakukan paling lambat pada hari terakhir kerja PIHAK KEDUA.</p>
  `);

  // ─── Pasal 16: Penyelesaian Perselisihan ─────────────────────────────────
  const p16 = pb.pasal("Penyelesaian Perselisihan Hubungan Industrial", `
    <p>1. Setiap perselisihan hubungan industrial yang timbul dari atau berkaitan dengan pelaksanaan Perjanjian ini diselesaikan melalui mekanisme berikut secara berurutan:</p>
    <p><strong>Tahap 1 — Bipartit:</strong> Para Pihak wajib menyelesaikan perselisihan secara musyawarah untuk mufakat (<em>Bipartit</em>) dalam jangka waktu paling lama <strong>30 (tiga puluh) hari kerja</strong> sejak dimulainya perundingan.</p>
    <p><strong>Tahap 2 — Tripartit (Mediasi/Konsiliasi):</strong> Apabila Bipartit gagal atau tidak tercapai kesepakatan, Para Pihak menempuh upaya penyelesaian melalui mediasi atau konsiliasi di <strong>Dinas Ketenagakerjaan</strong> setempat, sesuai Undang-Undang No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial (PPHI).</p>
    <p><strong>Tahap 3 — Pengadilan Hubungan Industrial (PHI):</strong> Apabila mediasi/konsiliasi tidak berhasil, Para Pihak dapat mengajukan gugatan ke <strong>Pengadilan Hubungan Industrial (PHI)</strong> pada Pengadilan Negeri yang berwenang di wilayah hukum tempat perjanjian ini dibuat.</p>
    <p><strong>Tahap 4 — Mahkamah Agung (MA):</strong> Putusan PHI dapat diajukan kasasi ke Mahkamah Agung sesuai ketentuan yang berlaku.</p>
    <p>2. Selama proses penyelesaian perselisihan berlangsung, Para Pihak tetap memenuhi kewajiban masing-masing berdasarkan Perjanjian ini.</p>
    <p>3. Hukum yang berlaku dalam Perjanjian ini adalah hukum Republik Indonesia.</p>
  `);

  // ─── Pasal 17: Force Majeure ──────────────────────────────────────────────
  const p17 = pb.pasal("Keadaan Kahar (Force Majeure)", `
    <p>1. Yang dimaksud dengan Keadaan Kahar dalam Perjanjian ini adalah kejadian atau keadaan di luar kendali wajar Para Pihak yang secara langsung menghalangi atau menghambat pelaksanaan kewajiban, termasuk namun tidak terbatas pada: bencana alam (gempa bumi, banjir, gunung meletus, tsunami), epidemi/pandemi, kebakaran, perang, pemberontakan, terorisme, pemogokan massal, atau kebijakan pemerintah yang bersifat memaksa.</p>
    <p>2. Pihak yang terdampak Keadaan Kahar wajib memberitahukan kepada Pihak lainnya secara tertulis dalam waktu <strong>7 (tujuh) hari kerja</strong> sejak terjadinya Keadaan Kahar, disertai keterangan mengenai sifat, perkiraan jangka waktu, dan dampak Keadaan Kahar tersebut.</p>
    <p>3. Pihak yang terdampak Keadaan Kahar dibebaskan dari kewajiban pelaksanaan Perjanjian selama Keadaan Kahar berlangsung dan dalam jangka waktu yang wajar setelah berakhirnya Keadaan Kahar.</p>
    <p>4. Apabila Keadaan Kahar berlangsung lebih dari <strong>60 (enam puluh) hari kalender</strong> berturut-turut, Para Pihak dapat melakukan perundingan untuk menentukan apakah Perjanjian ini perlu disesuaikan atau diakhiri, dengan memperhatikan hak-hak PIHAK KEDUA sesuai peraturan ketenagakerjaan yang berlaku.</p>
    <p>5. Ketidakmampuan finansial atau kesulitan ekonomi perusahaan tidak termasuk dalam kategori Keadaan Kahar.</p>
  `);

  // ─── Pasal 18: Perlindungan Data Pribadi ─────────────────────────────────
  const p18 = pb.pasal("Perlindungan Data Pribadi", `
    <p>1. Para Pihak mengakui bahwa dalam pelaksanaan Perjanjian ini, masing-masing Pihak akan memproses data pribadi Pihak lainnya. Pemrosesan data pribadi tersebut tunduk pada ketentuan Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) beserta peraturan pelaksanaannya.</p>
    <p>2. <strong>Data Pribadi PIHAK KEDUA</strong> yang diproses oleh PIHAK PERTAMA dalam rangka hubungan kerja meliputi antara lain: nama, NIK KTP, tanggal lahir, alamat, nomor telepon, email, data pendidikan, data rekening bank, data kepegawaian, dan data lain yang diperlukan dalam rangka pelaksanaan hak dan kewajiban ketenagakerjaan.</p>
    <p>3. PIHAK PERTAMA berjanji untuk:</p>
    <ul>
      <li>Memproses data pribadi PIHAK KEDUA hanya untuk tujuan yang sah dan berkaitan dengan pengelolaan hubungan kerja;</li>
      <li>Menerapkan langkah-langkah keamanan teknis dan organisasional yang memadai untuk melindungi data pribadi;</li>
      <li>Tidak mengungkapkan data pribadi PIHAK KEDUA kepada pihak ketiga tanpa persetujuan atau dasar hukum yang sah, kecuali untuk pemenuhan kewajiban hukum (perpajakan, BPJS, dsb.);</li>
      <li>Memberitahukan PIHAK KEDUA apabila terjadi pelanggaran keamanan data (data breach) yang berdampak pada data pribadinya, sesuai ketentuan UU PDP.</li>
    </ul>
    <p>4. PIHAK KEDUA berhak untuk mengakses, memperbaiki, dan (dalam kondisi tertentu) meminta penghapusan data pribadinya sesuai hak-hak yang diatur dalam UU PDP.</p>
    <p>5. Kewajiban perlindungan data pribadi ini tetap berlaku setelah berakhirnya hubungan kerja, untuk data yang masih tersimpan sesuai kewajiban hukum yang berlaku.</p>
  `);

  // ─── Pasal 19: Ketentuan Lain-lain ───────────────────────────────────────
  const p19 = pb.pasal("Ketentuan Lain-lain", `
    <p>1. <strong>Keseluruhan Perjanjian (Entire Agreement):</strong> Perjanjian ini, bersama-sama dengan lampiran-lampirannya (jika ada), merupakan keseluruhan perjanjian antara Para Pihak mengenai hal-hal yang diatur di dalamnya, dan menggantikan seluruh perjanjian, negosiasi, dan kesepahaman sebelumnya baik tertulis maupun lisan.</p>
    <p>2. <strong>Pemisahan Ketentuan (Severability):</strong> Apabila salah satu atau lebih ketentuan dalam Perjanjian ini dinyatakan tidak sah, tidak berlaku, atau tidak dapat dilaksanakan berdasarkan peraturan perundang-undangan yang berlaku, maka ketentuan tersebut dianggap terpisah dari Perjanjian ini dan tidak mempengaruhi keabsahan serta keberlakuan ketentuan-ketentuan lainnya.</p>
    <p>3. <strong>Perubahan (Adendum):</strong> Perubahan, penambahan, atau modifikasi atas Perjanjian ini hanya dapat dilakukan secara tertulis dalam bentuk Adendum/Addendum yang ditandatangani oleh Para Pihak dan menjadi bagian tidak terpisahkan dari Perjanjian ini.</p>
    <p>4. <strong>Tidak Ada Pengabaian (No Waiver):</strong> Kelalaian salah satu Pihak untuk melaksanakan hak-haknya berdasarkan Perjanjian ini tidak dapat ditafsirkan sebagai pengabaian atas hak-hak tersebut.</p>
    <p>5. <strong>Pemberitahuan:</strong> Setiap pemberitahuan berdasarkan Perjanjian ini wajib disampaikan secara tertulis kepada alamat Para Pihak sebagaimana tercantum dalam Perjanjian ini.</p>
    <p>6. <strong>Bahasa:</strong> Perjanjian ini dibuat dalam Bahasa Indonesia. Apabila terdapat perbedaan antara versi Bahasa Indonesia dengan versi bahasa lain (jika ada), maka versi Bahasa Indonesia yang berlaku.</p>
    <p>7. <strong>Peraturan Perusahaan:</strong> Hal-hal yang belum atau tidak diatur secara khusus dalam Perjanjian ini akan diatur dalam Peraturan Perusahaan, kebijakan internal, atau ketentuan yang ditetapkan oleh PIHAK PERTAMA dari waktu ke waktu, sepanjang tidak bertentangan dengan peraturan perundang-undangan yang berlaku.</p>
  `);

  // ─── Pasal 20: Penutup ────────────────────────────────────────────────────
  const p20 = pb.pasal("Penutup", `
    <p>1. Perjanjian ini dibuat dalam 2 (dua) rangkap asli yang masing-masing memiliki kekuatan hukum yang sama — satu rangkap disimpan oleh PIHAK PERTAMA dan satu rangkap disimpan oleh PIHAK KEDUA.</p>
    <p>2. Perjanjian ini mulai berlaku sejak ditandatangani oleh Para Pihak pada tanggal <strong>${tglPerjanjian}</strong> di <strong>${d.kota}</strong>.</p>
    <p>3. Para Pihak menyatakan bahwa masing-masing telah membaca, memahami, dan menyetujui seluruh isi Perjanjian ini dengan sukarela, tanpa paksaan, tekanan, atau pengaruh dari pihak manapun, serta dalam kondisi sehat jasmani dan rohani.</p>
    <p>4. Para Pihak menjamin bahwa mereka memiliki kapasitas hukum penuh dan kewenangan yang diperlukan untuk menandatangani dan melaksanakan Perjanjian ini.</p>
  `);

  // ─── Disclaimer ───────────────────────────────────────────────────────────
  const disclaimer = disclaimerPasal(pb);

  // ─── Build signature block ─────────────────────────────────────────────────
  const hasSaksi = d.saksi1Nama || d.saksi2Nama;
  const saksiBlock = hasSaksi ? `
    <div style="margin-top: 24px;">
      <p style="text-align: center; font-weight: bold; margin-bottom: 12px;">SAKSI-SAKSI</p>
      <table class="tanda-tangan">
        <tr>
          ${d.saksi1Nama ? `
          <td>
            <p>Saksi 1</p>
            <div class="ttd-area"></div>
            <p><strong>${d.saksi1Nama}</strong></p>
          </td>` : '<td></td>'}
          ${d.saksi2Nama ? `
          <td>
            <p>Saksi 2</p>
            <div class="ttd-area"></div>
            <p><strong>${d.saksi2Nama}</strong></p>
          </td>` : '<td></td>'}
        </tr>
      </table>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>Perjanjian Kerja Waktu Tidak Tertentu</h1>
  <p class="subtitle">(PKWTT — Berdasarkan UU No. 13/2003 Jo. UU Cipta Kerja No. 11/2020 &amp; PP No. 35/2021)</p>
  <p class="nomor">Nomor: ${d.nomorPKWTT}</p>
  <hr class="divider" />

  <p style="text-align: justify; margin-bottom: 16px;">
    Pada hari ini, <strong>${tglPerjanjian}</strong>, bertempat di <strong>${d.kota}</strong>,
    Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ini dibuat dan disepakati oleh dan antara:
  </p>

  <div class="pihak-box">
    <p><strong>PIHAK PERTAMA</strong> (Perusahaan / Pemberi Kerja)</p>
    <p><strong>Nama Perusahaan :</strong> ${d.namaPerusahaan}</p>
    <p><strong>Bidang Usaha :</strong> ${d.bidangUsaha}</p>
    <p><strong>Alamat :</strong> ${d.alamatPerusahaan}</p>
    <p><strong>Diwakili oleh :</strong> ${d.namaRepresentatif}, selaku ${d.jabatanRepresentatif}</p>
    <p>Selanjutnya dalam Perjanjian ini disebut sebagai <strong>"PIHAK PERTAMA"</strong>.</p>
  </div>

  <div class="pihak-box">
    <p><strong>PIHAK KEDUA</strong> (Pekerja / Karyawan)</p>
    <p><strong>Nama Lengkap :</strong> ${d.namaKaryawan}</p>
    <p><strong>Tempat, Tgl. Lahir :</strong> ${d.tempatLahir}, ${tglLahir}</p>
    <p><strong>Jenis Kelamin :</strong> ${d.jenisKelamin}</p>
    <p><strong>NIK KTP :</strong> ${d.nikKTP}</p>
    <p><strong>Alamat :</strong> ${d.alamatKaryawan}</p>
    <p><strong>Pendidikan Terakhir :</strong> ${d.pendidikanTerakhir}</p>
    ${d.nomorTelepon ? `<p><strong>No. Telepon :</strong> ${d.nomorTelepon}</p>` : ""}
    <p>Selanjutnya dalam Perjanjian ini disebut sebagai <strong>"PIHAK KEDUA"</strong>.</p>
  </div>

  <p style="text-align: justify; margin: 16px 0;">
    Para Pihak secara bersama-sama disebut sebagai <strong>"Para Pihak"</strong>. Para Pihak sepakat untuk membuat dan melaksanakan
    Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ini dengan tunduk pada ketentuan-ketentuan sebagai berikut:
  </p>

  <hr class="divider" />

  ${p1}
  ${p2}
  ${p3}
  ${p4}
  ${p5}
  ${p6}
  ${p7}
  ${p8}
  ${p9}
  ${p10}
  ${p11}
  ${p12}
  ${p13}
  ${p14}
  ${p15}
  ${p16}
  ${p17}
  ${p18}
  ${p19}
  ${p20}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat dan ditandatangani pada tanggal <strong>${tglPerjanjian}</strong>
    di <strong>${d.kota}</strong>, dalam keadaan sehat, sadar, dan tanpa paksaan dari pihak manapun.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(${d.jabatanRepresentatif})</p>
        <div class="ttd-area"></div>
        <p><strong>${d.namaRepresentatif}</strong></p>
        <p style="font-size: 10pt;">${d.namaPerusahaan}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Karyawan)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.namaKaryawan}</strong></p>
        <p style="font-size: 10pt;">NIK: ${d.nikKTP}</p>
      </td>
    </tr>
  </table>

  ${saksiBlock}

  ${baseFooter(d.nomorPKWTT, tglPerjanjian)}
</body>
</html>`;
}
