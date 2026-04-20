// ─── Kontrak Kerja Freelancer / Perjanjian Jasa ───────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1601–1617, UU No. 28/2014 tentang Hak Cipta

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface FreelancerData {
  // Para Pihak
  nama_pemberi_kerja: string;
  nama_perusahaan?: string;
  alamat_pemberi_kerja: string;
  nama_freelancer: string;
  nik_freelancer: string;
  alamat_freelancer: string;
  nomor_rekening_freelancer: string;
  nama_bank_freelancer: string;
  atas_nama_rekening: string;
  // Detail Pekerjaan
  judul_pekerjaan: string;
  deskripsi_pekerjaan: string;
  deliverable: string;
  jumlah_revisi: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi_kerja: "remote" | "onsite" | "hybrid";
  // Kompensasi
  jumlah_imbalan: number;
  skema_pembayaran: "sekaligus" | "dp_pelunasan" | "bertahap" | "per_milestone";
  dp_persen?: number;
  tanggal_pembayaran_dp?: string;
  tanggal_pembayaran_lunas?: string;
  // Hak Cipta
  kepemilikan_hak_cipta: "pemberi_kerja" | "freelancer" | "bersama";
  hak_portofolio: boolean;
  // Kerahasiaan
  ada_nda: boolean;
  masa_kerahasiaan?: "1tahun" | "2tahun" | "5tahun" | "selamanya";
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

export function generateFreelancerHTML(d: FreelancerData): string {
  const pb = new PasalBuilder();
  const imbalanFormatted = formatRupiah(d.jumlah_imbalan);
  const imbalanTerbilang = terbilang(d.jumlah_imbalan);
  const tglMulai = formatTanggal(d.tanggal_mulai);
  const tglSelesai = formatTanggal(d.tanggal_selesai);
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const dpAmount = d.dp_persen ? Math.round(d.jumlah_imbalan * d.dp_persen / 100) : 0;
  const pelunasanAmount = d.jumlah_imbalan - dpAmount;

  const lokasiLabel = d.lokasi_kerja === "remote" ? "jarak jauh (remote)" : d.lokasi_kerja === "onsite" ? "di lokasi pemberi kerja (on-site)" : "campuran remote dan on-site (hybrid)";

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat dan ditandatangani di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemberi Kerja)</p>
      <p><strong>Nama :</strong> ${d.nama_pemberi_kerja}</p>
      ${d.nama_perusahaan ? `<p><strong>Perusahaan :</strong> ${d.nama_perusahaan}</p>` : ""}
      <p><strong>Alamat :</strong> ${d.alamat_pemberi_kerja}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Pemberi Kerja"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Freelancer)</p>
      <p><strong>Nama :</strong> ${d.nama_freelancer}</p>
      <p><strong>NIK :</strong> ${d.nik_freelancer}</p>
      <p><strong>Alamat :</strong> ${d.alamat_freelancer}</p>
      <p><strong>Rekening :</strong> ${d.nama_bank_freelancer} – ${d.nomor_rekening_freelancer} a.n. ${d.atas_nama_rekening}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Freelancer"</strong>.</p>
    </div>
    <p>Para Pihak menyatakan telah sepakat membuat Perjanjian Jasa Freelancer ini atas kehendak bebas, sesuai Pasal 1320 dan Pasal 1601 KUHPerdata.</p>
  `);

  const objekPekerjaan = pb.pasal("Lingkup Pekerjaan (Scope of Work)", `
    <p>1. PIHAK PERTAMA menugaskan PIHAK KEDUA, dan PIHAK KEDUA menerima penugasan untuk melaksanakan pekerjaan sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Judul Pekerjaan :</strong> ${d.judul_pekerjaan}</p>
      <p><strong>Deskripsi :</strong> ${d.deskripsi_pekerjaan}</p>
      <p><strong>Deliverable :</strong> ${d.deliverable}</p>
      <p><strong>Jumlah Revisi :</strong> ${d.jumlah_revisi} kali (revisi tambahan dikenakan biaya tersendiri yang disepakati)</p>
      <p><strong>Lokasi Kerja :</strong> ${lokasiLabel}</p>
    </div>
    <p>2. Segala pekerjaan di luar lingkup yang tercantum di atas (<em>change order</em>) wajib disetujui secara tertulis oleh Para Pihak dan dapat dikenakan biaya tambahan.</p>
    <p>3. PIHAK KEDUA wajib menyerahkan hasil pekerjaan sesuai standar kualitas yang wajar berlaku di industri dan sesuai brief yang diberikan PIHAK PERTAMA.</p>
  `);

  const jangkaWaktu = pb.pasal("Jangka Waktu", `
    <p>1. Perjanjian ini berlaku dari tanggal <strong>${tglMulai}</strong> sampai dengan tanggal <strong>${tglSelesai}</strong>.</p>
    <p>2. PIHAK PERTAMA berkewajiban memberikan brief, materi, dan informasi yang dibutuhkan PIHAK KEDUA dalam waktu <strong>3 (tiga) hari kerja</strong> setelah Perjanjian ditandatangani.</p>
    <p>3. Keterlambatan penyerahan brief oleh PIHAK PERTAMA akan menunda deadline secara proporsional dan tidak dianggap sebagai keterlambatan PIHAK KEDUA.</p>
    <p>4. PIHAK PERTAMA wajib memberikan feedback atas pekerjaan yang diserahkan PIHAK KEDUA dalam waktu maksimal <strong>5 (lima) hari kerja</strong>. Keterlambatan feedback menyebabkan perpanjangan otomatis deadline pekerjaan.</p>
  `);

  let pembayaranDetail = "";
  if (d.skema_pembayaran === "sekaligus") {
    pembayaranDetail = `<p>3. Pembayaran dilakukan secara <strong>sekaligus lunas</strong> sebesar <strong>${imbalanFormatted}</strong> setelah pekerjaan selesai dan disetujui PIHAK PERTAMA.</p>`;
  } else if (d.skema_pembayaran === "dp_pelunasan") {
    pembayaranDetail = `
      <p>3. Pembayaran dilakukan dengan mekanisme <strong>Uang Muka (DP) dan Pelunasan</strong>:</p>
      <ul>
        <li><strong>Uang Muka (DP):</strong> ${d.dp_persen || 50}% = ${formatRupiah(dpAmount)}, dibayar paling lambat ${d.tanggal_pembayaran_dp ? formatTanggal(d.tanggal_pembayaran_dp) : "sebelum pekerjaan dimulai"}.</li>
        <li><strong>Pelunasan:</strong> ${formatRupiah(pelunasanAmount)}, dibayar ${d.tanggal_pembayaran_lunas ? formatTanggal(d.tanggal_pembayaran_lunas) : "setelah pekerjaan selesai dan disetujui"}.</li>
      </ul>
      <p>4. Pekerjaan <strong>baru dimulai setelah DP diterima</strong> oleh PIHAK KEDUA.</p>
    `;
  } else {
    pembayaranDetail = `<p>3. Pembayaran dilakukan secara <strong>bertahap per milestone</strong> sesuai kesepakatan para pihak. Rincian milestone dan jadwal pembayaran menjadi lampiran Perjanjian ini.</p>`;
  }

  const pembayaran = pb.pasal("Kompensasi dan Pembayaran", `
    <p>1. Total imbalan jasa yang disepakati adalah sebesar:</p>
    <div class="pihak-box">
      <p><strong>Total Nilai Kontrak : ${imbalanFormatted}</strong></p>
      <p><strong>Terbilang :</strong> (${imbalanTerbilang} rupiah)</p>
    </div>
    <p>2. Pembayaran dilakukan melalui transfer ke rekening PIHAK KEDUA: <strong>${d.nama_bank_freelancer} – ${d.nomor_rekening_freelancer} a.n. ${d.atas_nama_rekening}</strong>.</p>
    ${pembayaranDetail}
    <p>5. Keterlambatan pembayaran lebih dari 7 (tujuh) hari dari jadwal yang disepakati dapat dikenakan denda keterlambatan sebesar 1% per minggu dari jumlah yang terlambat.</p>
    <p>6. Apabila PIHAK PERTAMA membatalkan proyek setelah pekerjaan dimulai, PIHAK PERTAMA tetap wajib membayar proporsional atas pekerjaan yang telah diselesaikan PIHAK KEDUA.</p>
  `);

  const hakCipta = pb.pasal("Hak Kekayaan Intelektual", `
    <p>1. <strong>Kepemilikan Hak Cipta:</strong> Setelah seluruh kewajiban pembayaran dipenuhi oleh PIHAK PERTAMA, hak atas hasil karya/deliverable dalam Perjanjian ini ${
      d.kepemilikan_hak_cipta === "pemberi_kerja"
        ? "sepenuhnya beralih kepada <strong>PIHAK PERTAMA</strong>"
        : d.kepemilikan_hak_cipta === "freelancer"
          ? "tetap menjadi milik <strong>PIHAK KEDUA</strong>. PIHAK PERTAMA mendapat lisensi non-eksklusif untuk menggunakan hasil karya"
          : "dimiliki bersama oleh <strong>Para Pihak secara proporsional</strong>"
    }.</p>
    <p>2. Hak moral sebagaimana diatur UU No. 28/2014 tentang Hak Cipta tetap melekat pada PIHAK KEDUA sebagai pencipta, meskipun hak ekonomi telah dialihkan.</p>
    <p>3. <strong>Hak Portofolio:</strong> PIHAK KEDUA ${d.hak_portofolio ? "berhak menampilkan hasil karya ini dalam portofolio, media sosial, dan materi promosi" : "tidak diperkenankan menampilkan hasil karya ini sebagai portofolio tanpa persetujuan tertulis PIHAK PERTAMA"}.</p>
    <p>4. Sebelum pembayaran lunas, hak cipta tetap berada pada PIHAK KEDUA.</p>
  `);

  const kerahasiaan = pb.pasal("Kerahasiaan", d.ada_nda
    ? `
    <p>1. PIHAK KEDUA wajib menjaga kerahasiaan seluruh informasi, data, strategi bisnis, dan hal lain yang diperoleh dari PIHAK PERTAMA dalam rangka pelaksanaan Perjanjian ini.</p>
    <p>2. Kewajiban kerahasiaan ini berlaku selama Perjanjian berjalan dan ${
      d.masa_kerahasiaan === "selamanya"
        ? "untuk selamanya setelah Perjanjian berakhir"
        : `selama ${d.masa_kerahasiaan?.replace("tahun", " tahun")} setelah Perjanjian berakhir`
    }.</p>
    <p>3. Pengecualian: informasi yang sudah menjadi pengetahuan pubum, atau yang wajib diungkap berdasarkan hukum yang berlaku.</p>
    <p>4. Pelanggaran ketentuan kerahasiaan memberikan hak kepada PIHAK PERTAMA untuk menuntut ganti rugi sesuai ketentuan hukum yang berlaku.</p>
    `
    : `<p>Para Pihak sepakat untuk menjaga kerahasiaan informasi yang diperoleh dalam rangka pelaksanaan Perjanjian ini sesuai dengan norma kepatutan dan praktik bisnis yang berlaku.</p>`
  );

  const pemutusanKontrak = pb.pasal("Pemutusan Kontrak dan Force Majeure", `
    <p>1. PIHAK PERTAMA dapat memutus Perjanjian ini apabila PIHAK KEDUA tidak menyerahkan pekerjaan sesuai deadline tanpa alasan yang sah, setelah memberi pemberitahuan tertulis 7 (tujuh) hari lebih dahulu. Dalam hal ini, DP tidak dikembalikan.</p>
    <p>2. PIHAK KEDUA dapat memutus Perjanjian ini apabila PIHAK PERTAMA gagal membayar sesuai jadwal setelah pemberitahuan tertulis 7 (tujuh) hari. PIHAK KEDUA berhak atas pembayaran proporsional atas pekerjaan yang telah diselesaikan.</p>
    <p>3. <strong>Force Majeure:</strong> Kejadian di luar kendali Para Pihak (bencana alam, pandemi, kebijakan pemerintah yang material) yang menghalangi pelaksanaan Perjanjian ini tidak dianggap sebagai wanprestasi. Para Pihak akan berunding dalam 14 (empat belas) hari untuk menyepakati solusi.</p>
    <p>4. Status hubungan kerja: PIHAK KEDUA adalah <strong>kontraktor independen</strong>, bukan karyawan PIHAK PERTAMA. Perjanjian ini bukan merupakan Perjanjian Kerja Waktu Tertentu (PKWT) sebagaimana UU Ketenagakerjaan.</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Setiap sengketa yang timbul akan diselesaikan secara musyawarah dalam 30 (tiga puluh) hari.</p>
    <p>2. Apabila musyawarah gagal, sengketa diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong> berdasarkan hukum Republik Indonesia.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini merupakan keseluruhan kesepakatan dan menggantikan semua perjanjian sebelumnya.</p>
    <p>2. Perubahan Perjanjian hanya sah apabila dibuat tertulis dan ditandatangani Para Pihak.</p>
    <p>3. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap asli</strong>, masing-masing bermaterai cukup.</p>
    <p>4. Perjanjian ini tunduk pada KUHPerdata Pasal 1601–1617 dan UU No. 28/2014 tentang Hak Cipta.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN JASA FREELANCER</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1601–1617 dan UU No. 28/2014 tentang Hak Cipta</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${objekPekerjaan}
  ${jangkaWaktu}
  ${pembayaran}
  ${hakCipta}
  ${kerahasiaan}
  ${pemutusanKontrak}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat dan ditandatangani di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Pemberi Kerja)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pemberi_kerja}</strong></p>
        ${d.nama_perusahaan ? `<p style="font-size: 10pt;">${d.nama_perusahaan}</p>` : ""}
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Freelancer)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_freelancer}</strong></p>
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
