// ─── Kontrak Event Organizer / Fotografer / Videografer ─────────────────────
// Dasar hukum: KUHPerdata Pasal 1601b, UU No. 28/2014 tentang Hak Cipta

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface EventOrganizerData {
  // Para Pihak
  nama_klien: string;
  nik_klien: string;
  alamat_klien: string;
  nomor_telepon_klien: string;
  nama_eo_fotografer: string;
  nama_usaha_vendor?: string;
  alamat_vendor: string;
  nomor_telepon_vendor: string;
  nomor_rekening_vendor: string;
  nama_bank_vendor: string;
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

export function generateEventOrganizerHTML(d: EventOrganizerData): string {
  const pb = new PasalBuilder();
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const tglAcara = formatTanggal(d.tanggal_acara);
  const totalFormatted = formatRupiah(d.total_harga);
  const totalTerbilang = terbilang(d.total_harga);
  const dpFormatted = formatRupiah(d.biaya_dp);
  const pelunasanAmt = d.total_harga - d.biaya_dp + (d.biaya_transportasi || 0) + (d.biaya_akomodasi || 0);
  const pelunasanFormatted = formatRupiah(pelunasanAmt);

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

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Klien / Pemberi Kerja)</p>
      <p><strong>Nama :</strong> ${d.nama_klien}</p>
      <p><strong>NIK :</strong> ${d.nik_klien}</p>
      <p><strong>Alamat :</strong> ${d.alamat_klien}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_klien}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Klien"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (${jenisLayananLabel} / Vendor)</p>
      <p><strong>Nama :</strong> ${d.nama_eo_fotografer}</p>
      ${d.nama_usaha_vendor ? `<p><strong>Nama Usaha :</strong> ${d.nama_usaha_vendor}</p>` : ""}
      <p><strong>Alamat :</strong> ${d.alamat_vendor}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_vendor}</p>
      <p><strong>Rekening :</strong> ${d.nama_bank_vendor} – ${d.nomor_rekening_vendor}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Vendor"</strong>.</p>
    </div>
    <p>Para Pihak sepakat membuat Perjanjian Jasa ${jenisLayananLabel} ini atas kehendak bebas sesuai KUHPerdata Pasal 1320 dan 1601b.</p>
  `);

  const detailAcara = pb.pasal("Detail Acara", `
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

  const scopeOfWork = pb.pasal("Lingkup Pekerjaan (Scope of Work)", `
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

  const hargaPembayaran = pb.pasal("Harga dan Pembayaran", `
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
    <p>3. Pembayaran dilakukan melalui transfer ke rekening PIHAK KEDUA: <strong>${d.nama_bank_vendor} – ${d.nomor_rekening_vendor}</strong>.</p>
    <p>4. <strong>Tanggal acara baru dianggap terkonfirmasi setelah DP diterima</strong> oleh PIHAK KEDUA. DP diterima sebagai jaminan pemesanan tanggal.</p>
    <p>5. Apabila pelunasan tidak diterima sesuai jadwal, PIHAK KEDUA berhak menunda atau menahan layanan hingga pembayaran diselesaikan.</p>
  `);

  const pembatalan = pb.pasal("Pembatalan dan Penjadwalan Ulang", `
    <p>1. <strong>Pembatalan oleh PIHAK PERTAMA:</strong></p>
    <ul>
      <li>Lebih dari <strong>30 hari</strong> sebelum acara: DP hangus (tidak dikembalikan)</li>
      <li><strong>14–30 hari</strong> sebelum acara: DP hangus + 25% dari sisa pembayaran</li>
      <li><strong>7–13 hari</strong> sebelum acara: DP hangus + 50% dari sisa pembayaran</li>
      <li>Kurang dari <strong>7 hari</strong>: DP hangus + 100% dari total harga wajib dibayar</li>
    </ul>
    <p>2. <strong>Pembatalan oleh PIHAK KEDUA:</strong> PIHAK KEDUA wajib mengembalikan DP dan berupaya menyediakan pengganti yang setara. Apabila pengganti tidak tersedia, PIHAK KEDUA mengembalikan DP beserta kompensasi sebesar 20% dari nilai kontrak.</p>
    <p>3. <strong>Force Majeure:</strong> Apabila acara dibatalkan karena bencana alam, pandemi, larangan pemerintah, atau keadaan kahar lain yang dibuktikan secara resmi, DP <strong>dapat dijadwalkan ulang</strong> (bukan dikembalikan) ke tanggal lain sesuai ketersediaan PIHAK KEDUA.</p>
    <p>4. <strong>Penjadwalan Ulang (Reschedule):</strong> Diperbolehkan maksimal <strong>1 (satu) kali</strong>, dengan pemberitahuan minimal 14 hari sebelum tanggal acara asal. Reschedule tergantung ketersediaan PIHAK KEDUA dan dapat dikenakan biaya administrasi.</p>
  `);

  const hakCipta = pb.pasal("Hak Cipta dan Penggunaan Karya", `
    <p>1. Hak cipta atas foto/video yang dihasilkan PIHAK KEDUA tetap menjadi milik PIHAK KEDUA sebagai pencipta, sesuai UU No. 28/2014 tentang Hak Cipta.</p>
    <p>2. PIHAK PERTAMA mendapat <strong>lisensi tidak eksklusif</strong> untuk menggunakan foto/video untuk keperluan pribadi (cetak, media sosial pribadi, kenangan keluarga).</p>
    <p>3. PIHAK KEDUA berhak menggunakan foto/video untuk keperluan <strong>portofolio, website, dan media sosial bisnis</strong>, kecuali PIHAK PERTAMA secara tertulis meminta foto tidak dipublikasikan.</p>
    <p>4. PIHAK PERTAMA tidak diperkenankan menjual atau mengkomersilkan foto/video kepada pihak lain tanpa izin tertulis PIHAK KEDUA.</p>
    <p>5. PIHAK PERTAMA tidak diperkenankan mengedit, mengubah, atau menambahkan elemen pada foto/video secara substansial tanpa persetujuan PIHAK KEDUA.</p>
  `);

  const kondisiKerja = pb.pasal("Kondisi Kerja Vendor", `
    <p>1. PIHAK PERTAMA wajib menyediakan:</p>
    <ul>
      <li>Konsumsi (makan dan minum) yang layak untuk seluruh anggota tim PIHAK KEDUA selama bertugas;</li>
      <li>Area yang aman untuk menyimpan peralatan PIHAK KEDUA;</li>
      <li>Akses ke seluruh area acara yang diperlukan PIHAK KEDUA untuk menjalankan tugasnya;</li>
      <li>Informasi dan koordinasi yang cukup terkait rundown acara dan kontak PIC di lokasi.</li>
    </ul>
    <p>2. PIHAK KEDUA bertanggung jawab atas peralatan dan perlengkapannya sendiri.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Sengketa diselesaikan secara musyawarah dalam 21 (dua puluh satu) hari.</p>
    <p>2. Apabila gagal, diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong>.</p>
    <p>3. Perjanjian ini tunduk pada KUHPerdata Pasal 1601b dan UU No. 28/2014 tentang Hak Cipta.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap</strong> bermaterai cukup.</p>
    <p>2. Perubahan hanya sah secara tertulis dan ditandatangani Para Pihak.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>KONTRAK JASA ${jenisLayananLabel.toUpperCase()}</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1601b dan UU No. 28/2014 tentang Hak Cipta</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${detailAcara}
  ${scopeOfWork}
  ${hargaPembayaran}
  ${pembatalan}
  ${hakCipta}
  ${kondisiKerja}
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
        <p>(Klien)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_klien}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(${jenisLayananLabel})</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_eo_fotografer}</strong></p>
        ${d.nama_usaha_vendor ? `<p style="font-size: 10pt;">${d.nama_usaha_vendor}</p>` : ""}
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
