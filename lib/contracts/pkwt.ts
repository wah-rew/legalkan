// ─── Perjanjian Kerja Waktu Tertentu (PKWT) ───────────────────────────────────
// Dasar hukum: UU No. 13/2003 tentang Ketenagakerjaan, PP No. 35/2021

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
  tanggal_lahir_karyawan?: string;
  // Pekerjaan
  posisi_jabatan: string;
  deskripsi_pekerjaan?: string;
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
  jadwal_pembayaran_gaji?: string; // "setiap tanggal 25"
  // Jam Kerja
  jam_kerja_per_hari?: number; // default 8
  hari_kerja_per_minggu?: number; // default 5
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

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat dan ditandatangani di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglPenandatanganan}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemberi Kerja / Perusahaan)</p>
      <p><strong>Nama Perusahaan :</strong> ${d.jenis_perusahaan} ${d.nama_perusahaan}</p>
      <p><strong>Alamat :</strong> ${d.alamat_perusahaan}, ${d.kota_perusahaan}</p>
      <p><strong>Diwakili oleh :</strong> ${d.nama_pimpinan}, selaku ${d.jabatan_pimpinan}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Perusahaan"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Karyawan / Pekerja)</p>
      <p><strong>Nama :</strong> ${d.nama_karyawan}</p>
      <p><strong>NIK :</strong> ${d.nik_karyawan}</p>
      ${d.tanggal_lahir_karyawan ? `<p><strong>Tanggal Lahir :</strong> ${formatTanggal(d.tanggal_lahir_karyawan)}</p>` : ''}
      <p><strong>Alamat :</strong> ${d.alamat_karyawan}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Pekerja"</strong>.</p>
    </div>
    <p>Para Pihak sepakat untuk membuat Perjanjian Kerja Waktu Tertentu (PKWT) ini berdasarkan UU No. 13/2003 tentang Ketenagakerjaan sebagaimana diubah oleh UU Cipta Kerja dan PP No. 35/2021 tentang PKWT.</p>
  `);

  const posisi = pb.pasal("Posisi, Pekerjaan, dan Tempat Kerja", `
    <p>1. PIHAK PERTAMA mempekerjakan PIHAK KEDUA sebagai <strong>${d.posisi_jabatan}</strong>${d.departemen ? ` pada Departemen ${d.departemen}` : ''}.</p>
    ${d.deskripsi_pekerjaan ? `<p>2. Uraian pekerjaan: ${d.deskripsi_pekerjaan}</p>` : ''}
    <p>${d.deskripsi_pekerjaan ? '3' : '2'}. Tempat kerja: <strong>${d.lokasi_kerja}</strong>. Perusahaan berhak menugaskan PIHAK KEDUA ke lokasi lain atas dasar kebutuhan operasional dengan pemberitahuan terlebih dahulu.</p>
    <p>${d.deskripsi_pekerjaan ? '4' : '3'}. PIHAK KEDUA wajib melaksanakan pekerjaan dengan penuh tanggung jawab, jujur, dan sesuai standar perusahaan.</p>
  `);

  const masaKerja = pb.pasal("Masa Kerja", `
    <p>1. PKWT ini berlaku selama periode tertentu sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Tanggal Mulai :</strong> ${tglMulai}</p>
      <p><strong>Tanggal Berakhir :</strong> ${tglBerakhir}</p>
    </div>
    <p>2. PKWT ini berakhir demi hukum pada tanggal yang telah ditetapkan tanpa memerlukan pemberitahuan pengakhiran terlebih dahulu, sesuai Pasal 61 UU Ketenagakerjaan.</p>
    <p>3. Perpanjangan PKWT dapat dilakukan atas kesepakatan tertulis Para Pihak sebelum berakhirnya masa PKWT ini, sesuai ketentuan PP No. 35/2021.</p>
  `);

  const gajiKompen = pb.pasal("Upah dan Kompensasi", `
    <p>1. PIHAK PERTAMA memberikan upah kepada PIHAK KEDUA sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Gaji Pokok :</strong> ${gajiPokok}</p>
      ${tunjanganMakan ? `<p><strong>Tunjangan Makan :</strong> ${tunjanganMakan}</p>` : ''}
      ${tunjanganTransport ? `<p><strong>Tunjangan Transport :</strong> ${tunjanganTransport}</p>` : ''}
      ${tunjanganLainnya ? `<p><strong>Tunjangan Lainnya :</strong> ${tunjanganLainnya}</p>` : ''}
      <p><strong>Total Upah Bulanan :</strong> ${totalGaji}</p>
    </div>
    <p>2. Upah dibayarkan secara ${d.cara_pembayaran_gaji === 'transfer_bank' ? 'transfer bank' : 'tunai'}${d.jadwal_pembayaran_gaji ? ` ${d.jadwal_pembayaran_gaji}` : ' setiap bulan'}.</p>
    <p>3. Upah tidak dibayarkan untuk hari ketidakhadiran tanpa keterangan yang sah, sesuai prinsip no work no pay (Pasal 93 UU Ketenagakerjaan).</p>
    <p>4. PIHAK PERTAMA wajib membayar upah minimal sesuai Upah Minimum Kabupaten/Kota (UMK) yang berlaku.</p>
  `);

  const jamKerjaSection = pb.pasal("Jam Kerja dan Waktu Istirahat", `
    <p>1. Jam kerja PIHAK KEDUA adalah <strong>${jamKerja} (${jamKerja === 8 ? 'delapan' : jamKerja}) jam per hari</strong> selama <strong>${hariKerja} (${hariKerja === 5 ? 'lima' : hariKerja === 6 ? 'enam' : String(hariKerja)}) hari kerja per minggu</strong>.</p>
    <p>2. PIHAK KEDUA berhak atas waktu istirahat minimal 30 menit setelah bekerja 4 jam berturut-turut.</p>
    <p>3. Kerja lembur dilaksanakan atas perintah tertulis perusahaan dan mendapat upah lembur sesuai Peraturan Pemerintah yang berlaku.</p>
  `);

  const hakKewajiban = pb.pasal("Hak dan Kewajiban", `
    <p><strong>Kewajiban PIHAK KEDUA:</strong></p>
    <ul>
      <li>Melaksanakan pekerjaan dengan baik dan penuh tanggung jawab;</li>
      <li>Mematuhi peraturan perusahaan, tata tertib, dan kode etik yang berlaku;</li>
      <li>Menjaga kerahasiaan informasi dan data perusahaan;</li>
      <li>Memberitahukan ketidakhadiran sebelum jam kerja dimulai beserta alasan yang sah;</li>
      <li>Menyerahkan hasil pekerjaan dan aset perusahaan pada saat berakhirnya perjanjian.</li>
    </ul>
    <p style="margin-top: 10px;"><strong>Hak PIHAK KEDUA:</strong></p>
    <ul>
      <li>Menerima upah sesuai perjanjian ini;</li>
      <li>Mendapatkan cuti tahunan 12 hari setelah 12 bulan bekerja secara berturut-turut (Pasal 79 UU Ketenagakerjaan);</li>
      <li>Mendapatkan perlindungan keselamatan dan kesehatan kerja;</li>
      <li>Mendapatkan pesangon/kompensasi apabila diatur dalam peraturan yang berlaku.</li>
    </ul>
  `);

  const pengakhiran = pb.pasal("Pengakhiran Perjanjian", `
    <p>1. PKWT ini berakhir secara otomatis pada tanggal yang telah ditetapkan (${tglBerakhir}).</p>
    <p>2. Perjanjian dapat diakhiri sebelum waktunya apabila:</p>
    <ul>
      <li>PIHAK KEDUA mengundurkan diri dengan pemberitahuan minimal 14 hari kerja sebelumnya;</li>
      <li>PIHAK KEDUA melakukan pelanggaran berat sesuai peraturan perusahaan;</li>
      <li>Terjadi force majeure yang menyebabkan kegiatan usaha tidak dapat dilanjutkan.</li>
    </ul>
    <p>3. Dalam hal pengakhiran sebelum waktunya oleh PIHAK PERTAMA tanpa alasan sah, berlaku ketentuan Pasal 62 UU Ketenagakerjaan.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Perselisihan", `
    <p>1. Setiap perselisihan diselesaikan terlebih dahulu secara musyawarah mufakat.</p>
    <p>2. Apabila tidak tercapai kesepakatan, diselesaikan melalui mediasi di Dinas Ketenagakerjaan setempat, sesuai UU No. 2/2004 tentang Penyelesaian Perselisihan Hubungan Industrial.</p>
    <p>3. Apabila mediasi gagal, para pihak dapat mengajukan perkara ke Pengadilan Hubungan Industrial (PHI) yang berwenang.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>Perjanjian Kerja Waktu Tertentu (PKWT)</h1>
  <p class="subtitle">Berdasarkan UU No. 13/2003 tentang Ketenagakerjaan & PP No. 35/2021</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${posisi}
  ${masaKerja}
  ${gajiKompen}
  ${jamKerjaSection}
  ${hakKewajiban}
  ${pengakhiran}
  ${sengketa}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah PKWT ini dibuat dan ditandatangani pada tanggal <strong>${tglPenandatanganan}</strong> di <strong>${d.kota_penandatanganan}</strong>.
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
        <p>(Karyawan)</p>
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
