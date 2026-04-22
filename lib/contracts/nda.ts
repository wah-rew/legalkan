// ─── Perjanjian Non-Disclosure Agreement (NDA) Bilateral B2B ─────────────────
// Dasar hukum: KUHPerdata Pasal 1320, 1338, 1365 | UU ITE No. 11/2008

import { formatTanggal, baseCSS, PasalBuilder, disclaimerPasal } from "./helpers";

export interface NDAFormData {
  nomorPerjanjian: string;    // auto-generated LK-NDA-YYYYMM-XXXX
  tanggalPerjanjian: string;

  // Pihak Pertama
  namaPerusahaan1: string;
  bentukBadanHukum1: string;  // PT / CV / Firma / Perorangan
  alamat1: string;
  npwp1: string;
  namaRepresentatif1: string;
  posisiRepresentatif1: string;

  // Pihak Kedua
  namaPerusahaan2: string;
  bentukBadanHukum2: string;
  alamat2: string;
  npwp2: string;
  namaRepresentatif2: string;
  posisiRepresentatif2: string;

  // NDA specific
  tujuanKerjasama: string;      // business cooperation purpose
  tanggalEfektif: string;
  tanggalBerakhir: string;
  durasiKerahasiaan: string;    // default "2 (dua) tahun"
  penyelesaianSengketa?: string; // BANI / PN Jakarta Selatan / PN Pihak Pertama

  // Signature
  tanggalTtdPihak1: string;
  tanggalTtdPihak2: string;

  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
}

export function generateNDA(data: NDAFormData): string {
  const pb = new PasalBuilder();

  const tglPerjanjian = formatTanggal(data.tanggalPerjanjian);
  const tglEfektif    = formatTanggal(data.tanggalEfektif);
  const tglBerakhir   = formatTanggal(data.tanggalBerakhir);
  const tglTtd1       = formatTanggal(data.tanggalTtdPihak1);
  const tglTtd2       = formatTanggal(data.tanggalTtdPihak2);

  const sengketa = data.penyelesaianSengketa || "BANI";

  // ── Mukadimah / Para Pihak ───────────────────────────────────────────────────
  const paraPihak = pb.pasal("Para Pihak", `
    <p>Pada tanggal <strong>${tglPerjanjian}</strong>, Perjanjian Kerahasiaan (Non-Disclosure Agreement) ini disepakati oleh dan antara:</p>

    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong></p>
      <p><strong>Nama Perusahaan &nbsp;:</strong> ${data.bentukBadanHukum1} ${data.namaPerusahaan1}</p>
      <p><strong>Alamat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${data.alamat1}</p>
      <p><strong>NPWP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${data.npwp1}</p>
      <p><strong>Diwakili oleh &nbsp;&nbsp;:</strong> ${data.namaRepresentatif1}, selaku ${data.posisiRepresentatif1}</p>
      <p style="margin-top:6px;">Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong>.</p>
    </div>

    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong></p>
      <p><strong>Nama Perusahaan &nbsp;:</strong> ${data.bentukBadanHukum2} ${data.namaPerusahaan2}</p>
      <p><strong>Alamat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${data.alamat2}</p>
      <p><strong>NPWP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${data.npwp2}</p>
      <p><strong>Diwakili oleh &nbsp;&nbsp;:</strong> ${data.namaRepresentatif2}, selaku ${data.posisiRepresentatif2}</p>
      <p style="margin-top:6px;">Selanjutnya disebut <strong>"PIHAK KEDUA"</strong>.</p>
    </div>

    <p>PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama selanjutnya disebut <strong>"Para Pihak"</strong>.</p>

    <p>Para Pihak bermaksud untuk melakukan diskusi dan/atau evaluasi mengenai <strong>${data.tujuanKerjasama}</strong> ("Tujuan") dan dalam rangka Tujuan tersebut, masing-masing Pihak dapat mengungkapkan informasi rahasia kepada Pihak lainnya.</p>

    <p>Atas dasar kehendak bebas dan itikad baik sebagaimana dimaksud Pasal 1320 dan Pasal 1338 KUHPerdata, Para Pihak sepakat untuk terikat dalam Perjanjian Kerahasiaan ini dengan syarat dan ketentuan sebagai berikut:</p>
  `);

  // ── Pasal 2: Definisi ────────────────────────────────────────────────────────
  const definisi = pb.pasal("Definisi", `
    <p>Dalam Perjanjian ini, yang dimaksud dengan:</p>
    <p>1. <strong>"Informasi Rahasia"</strong> mencakup seluruh informasi, data, dan materi apa pun yang disampaikan oleh salah satu Pihak ("Pihak Pengungkap") kepada Pihak lainnya ("Pihak Penerima") sehubungan dengan Tujuan, baik secara lisan, tertulis, digital, visual, atau dalam bentuk lain, yang meliputi namun tidak terbatas pada:</p>
    <ul>
      <li>data keuangan, proyeksi pendapatan, dan informasi akuntansi;</li>
      <li>rencana bisnis, strategi pemasaran, dan roadmap produk;</li>
      <li>informasi teknis, algoritma, kode sumber, dan spesifikasi produk;</li>
      <li>informasi mengenai pelanggan, pemasok, mitra, dan karyawan;</li>
      <li>metode operasional, proses bisnis, dan prosedur internal;</li>
      <li>informasi mengenai harga, kontrak, dan negosiasi bisnis;</li>
      <li>penelitian, pengembangan, dan inovasi yang belum dipublikasikan;</li>
      <li>setiap informasi yang ditandai atau dinyatakan sebagai "rahasia" atau "confidential".</li>
    </ul>
    <p>2. <strong>"Pihak Pengungkap"</strong> adalah Pihak yang mengungkapkan Informasi Rahasia kepada Pihak lainnya.</p>
    <p>3. <strong>"Pihak Penerima"</strong> adalah Pihak yang menerima Informasi Rahasia dari Pihak lainnya.</p>
    <p>4. <strong>"Tujuan"</strong> adalah ${data.tujuanKerjasama} sebagaimana disebutkan di atas.</p>
  `);

  // ── Pasal 3: Kewajiban Kerahasiaan ──────────────────────────────────────────
  const kewajiban = pb.pasal("Kewajiban Kerahasiaan", `
    <p>1. Dalam kapasitasnya sebagai Pihak Penerima, pihak tersebut terikat untuk:</p>
    <ul>
      <li>menjaga kerahasiaan Informasi Rahasia dengan standar perlindungan sekurang-kurangnya setara dengan yang diterapkan pada informasi rahasia miliknya sendiri, dan tidak kurang dari standar yang wajar;</li>
      <li>tidak mengungkapkan Informasi Rahasia kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari Pihak Pengungkap;</li>
      <li>menggunakan Informasi Rahasia semata-mata untuk Tujuan dan tidak untuk kepentingan lain;</li>
      <li>membatasi akses Informasi Rahasia hanya kepada karyawan, direktur, konsultan, atau agen yang benar-benar membutuhkan (<em>need-to-know basis</em>);</li>
      <li>memastikan setiap penerima akses internal terikat kewajiban kerahasiaan setara dengan Perjanjian ini;</li>
      <li>segera memberitahukan Pihak Pengungkap secara tertulis apabila mengetahui atau menduga terjadinya pelanggaran atau pengungkapan Informasi Rahasia yang tidak sah.</li>
    </ul>
    <p>2. Tanpa persetujuan tertulis Pihak Pengungkap, Pihak Penerima dilarang keras untuk:</p>
    <ul>
      <li>melakukan rekayasa balik (<em>reverse engineering</em>), dekompilasi, atau analisis terhadap Informasi Rahasia;</li>
      <li>menggunakan Informasi Rahasia untuk kepentingan bisnis atau komersial di luar Tujuan;</li>
      <li>mengambil tindakan yang merugikan kepentingan Pihak Pengungkap berdasarkan Informasi Rahasia;</li>
      <li>membuat salinan, reproduksi, atau ringkasan Informasi Rahasia di luar yang diperlukan untuk Tujuan.</li>
    </ul>
    <p>3. Perjanjian ini bersifat <strong>bilateral</strong>. Kedua Pihak secara bergantian dapat bertindak sebagai Pihak Pengungkap maupun Pihak Penerima, dan masing-masing terikat kewajiban yang sama berdasarkan Pasal ini.</p>
  `);

  // ── Pasal 4: Pengecualian ────────────────────────────────────────────────────
  const pengecualian = pb.pasal("Pengecualian dari Kewajiban Kerahasiaan", `
    <p>Kewajiban kerahasiaan sebagaimana diatur dalam Pasal 3 tidak berlaku terhadap informasi yang:</p>
    <p>1. pada saat pengungkapan atau setelahnya telah menjadi <strong>milik pubum</strong> bukan karena pelanggaran Perjanjian ini oleh Pihak Penerima;</p>
    <p>2. <strong>telah diketahui</strong> oleh Pihak Penerima sebelum pengungkapan oleh Pihak Pengungkap, sebagaimana dibuktikan oleh catatan atau dokumen yang ada sebelum pengungkapan;</p>
    <p>3. diterima secara sah dari <strong>pihak ketiga yang tidak terikat</strong> kewajiban kerahasiaan terhadap Pihak Pengungkap;</p>
    <p>4. <strong>dikembangkan secara independen</strong> oleh Pihak Penerima tanpa menggunakan atau merujuk pada Informasi Rahasia, sebagaimana dibuktikan secara tertulis;</p>
    <p>5. wajib diungkapkan berdasarkan <strong>perintah pengadilan, peraturan perundang-undangan, atau otoritas pemerintah yang berwenang</strong>, dengan ketentuan Pihak Penerima terlebih dahulu memberitahukan Pihak Pengungkap secara tertulis (sepanjang diizinkan hukum) agar Pihak Pengungkap dapat mengupayakan perlindungan hukum yang tepat; atau</p>
    <p>6. disetujui untuk diungkapkan secara <strong>tertulis oleh Pihak Pengungkap</strong>.</p>
  `);

  // ── Pasal 5: Jangka Waktu ───────────────────────────────────────────────────
  const jangkaWaktu = pb.pasal("Jangka Waktu Perjanjian", `
    <p>1. Perjanjian ini berlaku efektif sejak tanggal <strong>${tglEfektif}</strong> sampai dengan tanggal <strong>${tglBerakhir}</strong> ("Masa Berlaku").</p>
    <p>2. Berakhirnya Jangka Waktu Perjanjian tidak menghapus kewajiban kerahasiaan Para Pihak. Kewajiban kerahasiaan tetap berlaku selama <strong>${data.durasiKerahasiaan}</strong> sejak tanggal berakhirnya Perjanjian ini.</p>
    <p>3. Hak dan kewajiban yang telah timbul selama Jangka Waktu tetap berlaku meskipun Perjanjian telah berakhir.</p>
    <p>4. Perjanjian ini dapat diakhiri lebih awal apabila Para Pihak sepakat secara tertulis, atau apabila salah satu Pihak melakukan pelanggaran material yang tidak diperbaiki dalam waktu 14 (empat belas) hari sejak pemberitahuan tertulis oleh Pihak lainnya.</p>
  `);

  // ── Pasal 6: Pengembalian / Pemusnahan ──────────────────────────────────────
  const pengembalian = pb.pasal("Pengembalian dan Pemusnahan Informasi Rahasia", `
    <p>1. Dalam waktu <strong>30 (tiga puluh) hari</strong> sejak berakhirnya Jangka Waktu atau atas permintaan tertulis Pihak Pengungkap, Pihak Penerima wajib:</p>
    <ul>
      <li>mengembalikan seluruh Informasi Rahasia beserta salinannya kepada Pihak Pengungkap; atau</li>
      <li>memusnahkan seluruh Informasi Rahasia beserta salinannya secara permanen dan tidak dapat dipulihkan.</li>
    </ul>
    <p>2. Pihak Penerima wajib memberikan <strong>konfirmasi tertulis</strong> kepada Pihak Pengungkap mengenai pengembalian atau pemusnahan yang telah dilakukan, termasuk rincian dokumen atau data yang bersangkutan.</p>
    <p>3. Pengecualian berlaku terhadap salinan Informasi Rahasia yang tersimpan dalam sistem cadang otomatis (<em>automated backup system</em>) yang tidak dapat diakses secara normal dalam praktik bisnis sehari-hari, dengan ketentuan bahwa salinan tersebut tetap tunduk pada kewajiban kerahasiaan.</p>
  `);

  // ── Pasal 7: Tidak Ada Kewajiban Mengungkapkan ───────────────────────────────
  const tidakAda = pb.pasal("Tidak Ada Kewajiban Mengungkapkan", `
    <p>1. Perjanjian ini <strong>tidak mewajibkan</strong> salah satu Pihak untuk mengungkapkan Informasi Rahasia apapun kepada Pihak lainnya.</p>
    <p>2. Perjanjian ini tidak menciptakan kewajiban bagi Para Pihak untuk melanjutkan diskusi, negosiasi, atau menjalin hubungan bisnis lebih lanjut satu sama lain.</p>
    <p>3. Perjanjian ini tidak memberikan lisensi, hak, atau kepentingan apapun atas hak kekayaan intelektual milik Pihak Pengungkap kepada Pihak Penerima. Seluruh hak kekayaan intelektual tetap menjadi milik Pihak Pengungkap.</p>
    <p>4. Perjanjian ini tidak menghalangi masing-masing Pihak untuk mengadakan perjanjian serupa dengan pihak ketiga lainnya.</p>
  `);

  // ── Pasal 8: Ganti Rugi ──────────────────────────────────────────────────────
  const gantiRugi = pb.pasal("Ganti Rugi dan Konsekuensi Pelanggaran", `
    <p>1. Para Pihak mengakui dan memahami bahwa setiap pelanggaran atas kewajiban kerahasiaan yang diatur dalam Perjanjian ini berpotensi menimbulkan <strong>kerugian yang tidak dapat sepenuhnya dipulihkan melalui ganti rugi berupa uang</strong> (<em>irreparable harm</em>) bagi Pihak Pengungkap.</p>
    <p>2. Pihak yang melanggar kewajiban kerahasiaan wajib mengganti seluruh kerugian yang diderita Pihak lainnya, termasuk namun tidak terbatas pada:</p>
    <ul>
      <li>kerugian materiil langsung yang dapat dibuktikan;</li>
      <li>kerugian immateriil berupa reputasi dan kesempatan bisnis yang hilang;</li>
      <li>seluruh biaya hukum, termasuk biaya advokat yang wajar.</li>
    </ul>
    <p>3. Pihak Pengungkap berhak untuk, tanpa mengesampingkan upaya hukum lainnya:</p>
    <ul>
      <li>mengajukan permohonan <strong>sita jaminan (<em>conservatoir beslag</em>)</strong> atas aset milik Pihak yang melanggar;</li>
      <li>mengajukan permohonan <strong>penetapan provisi atau putusan sela</strong> guna mencegah atau menghentikan pelanggaran lebih lanjut;</li>
      <li>menempuh upaya hukum lain yang tersedia berdasarkan hukum yang berlaku di Republik Indonesia.</li>
    </ul>
    <p>4. Kegagalan atau keterlambatan salah satu Pihak dalam menegakkan haknya berdasarkan Pasal ini tidak dianggap sebagai pelepasan (<em>waiver</em>) atas hak tersebut.</p>
  `);

  // ── Pasal 9: Force Majeure ───────────────────────────────────────────────────
  const forceMajeure = pb.pasal("Keadaan Kahar (Force Majeure)", `
    <p>1. Para Pihak dibebaskan dari tanggung jawab atas kegagalan atau keterlambatan pelaksanaan kewajiban berdasarkan Perjanjian ini yang disebabkan oleh keadaan kahar (<em>force majeure</em>), yaitu kejadian di luar kendali Para Pihak yang tidak dapat diantisipasi, termasuk namun tidak terbatas pada: bencana alam, gempa bumi, banjir, kebakaran, perang, huru-hara, pandemi atau epidemi yang ditetapkan oleh otoritas yang berwenang, serta kebijakan pemerintah yang berdampak material.</p>
    <p>2. Pihak yang mengalami keadaan kahar wajib memberitahukan Pihak lainnya secara tertulis dalam waktu <strong>7 (tujuh) hari</strong> sejak terjadinya keadaan kahar tersebut, disertai bukti atau keterangan yang memadai.</p>
    <p>3. Apabila keadaan kahar berlangsung lebih dari <strong>30 (tiga puluh) hari</strong>, Para Pihak sepakat untuk berunding guna menentukan langkah penyelesaian yang saling menguntungkan.</p>
  `);

  // ── Pasal 10: Penyelesaian Sengketa ─────────────────────────────────────────
  let sengketaContent: string;
  if (sengketa === "BANI") {
    sengketaContent = `
    <p>1. Setiap sengketa, perselisihan, atau perbedaan pendapat yang timbul dari atau berkaitan dengan Perjanjian ini, termasuk mengenai keberadaan, keabsahan, atau pengakhirannya, akan diselesaikan secara bertahap sebagai berikut:</p>
    <p>2. <strong>Tahap I — Musyawarah Mufakat:</strong> Para Pihak terlebih dahulu menyelesaikan sengketa melalui musyawarah mufakat dalam jangka waktu <strong>30 (tiga puluh) hari</strong> sejak salah satu Pihak menyampaikan pemberitahuan tertulis mengenai sengketa.</p>
    <p>3. <strong>Tahap II — Mediasi:</strong> Apabila musyawarah tidak menghasilkan kesepakatan, Para Pihak menempuh mediasi melalui <strong>Badan Arbitrase Nasional Indonesia (BANI)</strong> dalam jangka waktu <strong>30 (tiga puluh) hari</strong>.</p>
    <p>4. <strong>Tahap III — Arbitrase:</strong> Apabila mediasi gagal, sengketa diselesaikan melalui <strong>Arbitrase BANI</strong> sesuai dengan peraturan BANI yang berlaku. Putusan arbitrase bersifat <strong>final dan mengikat</strong> Para Pihak dan tidak dapat diajukan banding. Jumlah arbiter adalah 3 (tiga) orang. Tempat arbitrase adalah Jakarta.</p>
    `;
  } else if (sengketa === "PN Jakarta Selatan") {
    sengketaContent = `
    <p>1. Setiap sengketa yang timbul dari atau berkaitan dengan Perjanjian ini akan diselesaikan secara bertahap sebagai berikut:</p>
    <p>2. <strong>Tahap I — Musyawarah:</strong> Para Pihak menyelesaikan sengketa melalui musyawarah dalam <strong>30 (tiga puluh) hari</strong>.</p>
    <p>3. <strong>Tahap II — Mediasi:</strong> Apabila musyawarah gagal, Para Pihak menempuh mediasi dalam <strong>30 (tiga puluh) hari</strong>.</p>
    <p>4. <strong>Tahap III — Litigasi:</strong> Apabila mediasi gagal, sengketa diselesaikan melalui <strong>Pengadilan Negeri Jakarta Selatan</strong>.</p>
    `;
  } else {
    sengketaContent = `
    <p>1. Setiap sengketa yang timbul dari atau berkaitan dengan Perjanjian ini akan diselesaikan secara bertahap sebagai berikut:</p>
    <p>2. <strong>Tahap I — Musyawarah:</strong> Para Pihak menyelesaikan sengketa melalui musyawarah dalam <strong>30 (tiga puluh) hari</strong>.</p>
    <p>3. <strong>Tahap II — Mediasi:</strong> Apabila musyawarah gagal, Para Pihak menempuh mediasi dalam <strong>30 (tiga puluh) hari</strong>.</p>
    <p>4. <strong>Tahap III — Litigasi:</strong> Apabila mediasi gagal, sengketa diselesaikan melalui <strong>Pengadilan Negeri yang berdomisili di wilayah hukum PIHAK PERTAMA</strong>.</p>
    `;
  }

  const penyelesaianSengketa = pb.pasal("Penyelesaian Sengketa", sengketaContent);

  // ── Pasal 11: Hukum yang Berlaku ────────────────────────────────────────────
  const hukumBerlaku = pb.pasal("Hukum yang Berlaku", `
    <p>1. Perjanjian ini dibuat, ditafsirkan, dan dilaksanakan berdasarkan <strong>hukum Republik Indonesia</strong>.</p>
    <p>2. Untuk hal-hal yang tidak diatur secara khusus dalam Perjanjian ini, berlaku ketentuan umum <strong>Kitab Undang-Undang Hukum Perdata (KUHPerdata)</strong> Republik Indonesia sebagai pelengkap.</p>
  `);

  // ── Pasal 12: Ketentuan Umum ─────────────────────────────────────────────────
  const ketentuanUmum = pb.pasal("Ketentuan Umum", `
    <p>1. <strong>Kelengkapan Perjanjian.</strong> Dokumen ini merupakan satu-satunya kesepakatan lengkap Para Pihak terkait kerahasiaan informasi, dan menggantikan seluruh perjanjian, diskusi, pernyataan, atau komunikasi sebelumnya, baik lisan maupun tertulis, yang berkaitan dengan hal yang sama.</p>
    <p>2. <strong>Perubahan.</strong> Setiap perubahan atau penambahan terhadap Perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh wakil yang berwenang dari masing-masing Pihak.</p>
    <p>3. <strong>Dapat Dipisahkan (<em>Severability</em>).</strong> Apabila salah satu ketentuan dalam Perjanjian ini dinyatakan tidak sah, tidak berlaku, atau tidak dapat dilaksanakan oleh pengadilan atau arbiter yang berwenang, maka ketentuan-ketentuan lainnya tetap berlaku sepenuhnya.</p>
    <p>4. <strong>Mengikat Penerus.</strong> Perjanjian ini mengikat dan berlaku bagi Para Pihak beserta penerus hak, pengganti, penerima pengalihan, dan perwakilan yang sah dari masing-masing Pihak.</p>
    <p>5. <strong>Rangkap Asli.</strong> Perjanjian ini dibuat dalam <strong>2 (dua) rangkap asli</strong>, masing-masing bermaterai cukup sesuai UU No. 10/2020 tentang Bea Meterai, dengan kekuatan hukum yang sama, dan masing-masing Pihak memegang satu rangkap.</p>
    <p>6. <strong>Tidak Ada Hubungan Keagenan.</strong> Perjanjian ini tidak menciptakan hubungan keagenan, kemitraan, joint venture, atau hubungan kerja apapun antara Para Pihak.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>
    ${baseCSS()}
    .nda-header-line { border: none; border-top: 3px double #333; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>PERJANJIAN KERAHASIAAN</h1>
  <h1 style="font-size:12pt;">(NON-DISCLOSURE AGREEMENT / NDA)</h1>
  <p class="subtitle">Bilateral — Berlaku untuk Kedua Pihak Secara Setara</p>
  <p class="nomor">Nomor: ${data.nomorPerjanjian}</p>
  <p class="subtitle" style="font-size:10pt;">Berdasarkan KUHPerdata Pasal 1320, 1338, 1365 &amp; UU ITE No. 11/2008</p>
  <hr class="divider" />

  ${paraPihak}
  ${definisi}
  ${kewajiban}
  ${pengecualian}
  ${jangkaWaktu}
  ${pengembalian}
  ${tidakAda}
  ${gantiRugi}
  ${forceMajeure}
  ${penyelesaianSengketa}
  ${hukumBerlaku}
  ${ketentuanUmum}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 20px;">
    Demikianlah Perjanjian ini dibuat dan ditandatangani oleh Para Pihak dengan penuh kesadaran dan tanpa paksaan dari pihak manapun.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>${data.bentukBadanHukum1} ${data.namaPerusahaan1}</p>
        <div class="ttd-area"></div>
        <p><strong>${data.namaRepresentatif1}</strong></p>
        <p style="font-size:10pt;">${data.posisiRepresentatif1}</p>
        <p style="font-size:10pt;">${tglTtd1}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>${data.bentukBadanHukum2} ${data.namaPerusahaan2}</p>
        <div class="ttd-area"></div>
        <p><strong>${data.namaRepresentatif2}</strong></p>
        <p style="font-size:10pt;">${data.posisiRepresentatif2}</p>
        <p style="font-size:10pt;">${tglTtd2}</p>
      </td>
    </tr>
  </table>

  <div class="footer">
    <p>Dokumen dibuat menggunakan platform LegalKan &bull; ${data.nomorPerjanjian} &bull; ${formatTanggal(data.tanggalPerjanjian)}</p>
    <p>LegalKan bukan kantor hukum. Tempelkan Meterai Rp 10.000 sebelum penandatanganan.</p>
  </div>
</body>
</html>`;
}

// Generate NDA-specific contract number
export function generateNDANumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 9000) + 1000);
  return `LK-NDA-${year}${month}-${random}`;
}
