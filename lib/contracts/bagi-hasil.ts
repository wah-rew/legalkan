// ─── Perjanjian Bagi Hasil Usaha ─────────────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1618–1652 (Maatschap / Persekutuan Perdata)
//              KUHPerdata Pasal 1320, 1338 (Perjanjian)
//              UU No. 8 Tahun 1997 tentang Dokumen Perusahaan

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface BagiHasilData {
  // Para Pihak
  nama_pihak_1: string;
  nik_pihak_1: string;
  alamat_pihak_1: string;
  nomorTelepon1?: string;
  peran_pihak_1: string;
  modal_pihak_1: number;
  bentuk_kontribusi_pihak_1: "uang_tunai" | "aset" | "tenaga" | "keahlian" | "campuran";
  nama_pihak_2: string;
  nik_pihak_2: string;
  alamat_pihak_2: string;
  nomorTelepon2?: string;
  peran_pihak_2: string;
  modal_pihak_2: number;
  bentuk_kontribusi_pihak_2: "uang_tunai" | "aset" | "tenaga" | "keahlian" | "campuran";
  // Detail Usaha
  nama_usaha: string;
  jenis_usaha: string;
  alamat_usaha: string;
  tanggal_mulai_usaha: string;
  total_modal: number;
  // Bagi Hasil
  persen_bagi_hasil_pihak_1: number;
  persen_bagi_hasil_pihak_2: number;
  persen_tanggung_rugi_pihak_1: number;
  persen_tanggung_rugi_pihak_2: number;
  periode_bagi_hasil: "bulanan" | "triwulan" | "semesteran" | "tahunan";
  tanggalPembagian?: string;       // tanggal pembagian keuntungan tiap bulan, default "10"
  tanggalLaporan?: string;         // tanggal penyerahan laporan bulanan, default "5"
  apakah_ada_gaji_pengelola: boolean;
  gaji_pengelola?: number;
  // Pengelolaan
  siapa_yang_mengelola: "pihak_1" | "pihak_2" | "bersama";
  keputusan_besar_threshold: number;
  batasModalTambahan?: string;     // batas nilai penambahan modal yang butuh persetujuan, default "5000000"
  batasInvestasi?: string;         // batas nilai investasi yang butuh persetujuan, default "2000000"
  frekuensi_laporan_keuangan: "bulanan" | "triwulan" | "semesteran";
  // Pengakhiran
  jangka_waktu_perjanjian: "1tahun" | "2tahun" | "3tahun" | "tidak_terbatas";
  tanggal_berakhir?: string;
  masaPemberitahuanKeluar?: string; // masa notifikasi sebelum keluar, default "3"
  // Non-compete
  radiusNonCompete?: string;       // radius larangan persaingan dalam meter, default "500"
  durasiNonCompete?: string;       // durasi larangan persaingan dalam tahun, default "1"
  // Sanksi
  sanksiDenda?: string;            // denda wanprestasi, default "1% omzet bulanan"
  // Saksi
  saksi_1: string;
  nik_saksi_1?: string;
  saksi1Alamat?: string;
  saksi_2?: string;
  nik_saksi_2?: string;
  saksi2Alamat?: string;
  // Penandatanganan
  kota_penandatanganan: string;
  lokasiPembuatan?: string;
  tanggal_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateBagiHasilHTML(d: BagiHasilData): string {
  const pb = new PasalBuilder();
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const tglMulai = formatTanggal(d.tanggal_mulai_usaha);
  const totalModalFormatted = formatRupiah(d.total_modal);
  const modal1 = formatRupiah(d.modal_pihak_1);
  const modal2 = formatRupiah(d.modal_pihak_2);

  // Resolved values with defaults
  const tanggalPembagian = d.tanggalPembagian || "10";
  const tanggalLaporan = d.tanggalLaporan || "5";
  const batasModalTambahan = d.batasModalTambahan ? formatRupiah(parseInt(d.batasModalTambahan)) : "Rp 5.000.000";
  const batasInvestasi = d.batasInvestasi ? formatRupiah(parseInt(d.batasInvestasi)) : "Rp 2.000.000";
  const masaPemberitahuan = d.masaPemberitahuanKeluar || "3";
  const masaPemberitahuanHari = String(parseInt(masaPemberitahuan) * 30);
  const radiusNonCompete = d.radiusNonCompete || "500";
  const durasiNonCompete = d.durasiNonCompete || "1";
  const sanksiDenda = d.sanksiDenda || "1% omzet bulanan";
  const lokasiPembuatan = d.lokasiPembuatan || d.kota_penandatanganan;

  const kontribusiLabel = (t: string) => {
    if (t === "uang_tunai") return "uang tunai";
    if (t === "aset") return "aset/barang";
    if (t === "tenaga") return "tenaga kerja";
    if (t === "keahlian") return "keahlian/skill";
    return "campuran (uang tunai + aset/tenaga)";
  };

  const periodeLabel = d.periode_bagi_hasil === "bulanan" ? "setiap bulan"
    : d.periode_bagi_hasil === "triwulan" ? "setiap 3 bulan"
    : d.periode_bagi_hasil === "semesteran" ? "setiap 6 bulan"
    : "setiap tahun";

  // ── Pasal 1: Dasar Hukum ──────────────────────────────────────────────────
  const dasarHukum = pb.pasal("Dasar Hukum", `
    <p>Perjanjian ini dibuat berdasarkan:</p>
    <ol>
      <li><strong>KUHPerdata Pasal 1320 dan 1338</strong> — syarat sahnya perjanjian dan asas kebebasan berkontrak;</li>
      <li><strong>KUHPerdata Pasal 1618–1652</strong> — tentang Persekutuan Perdata (Maatschap) sebagai landasan kemitraan usaha;</li>
      <li><strong>KUHPerdata Pasal 1635</strong> — larangan klausul leonine (tidak boleh membebankan seluruh kerugian kepada satu pihak);</li>
      <li><strong>Undang-Undang No. 8 Tahun 1997 tentang Dokumen Perusahaan</strong> — kewajiban pencatatan dan penyimpanan dokumen usaha.</li>
    </ol>
    <p>Para Pihak menyepakati bahwa seluruh ketentuan dalam Perjanjian ini merupakan hukum yang mengikat bagi Para Pihak (pacta sunt servanda) sesuai KUHPerdata Pasal 1338.</p>
  `);

  // ── Pasal 2: Para Pihak ───────────────────────────────────────────────────
  const paraPihak = pb.pasal("Para Pihak", `
    <p>Pada tanggal <strong>${tglTtd}</strong> di <strong>${lokasiPembuatan}</strong>, Perjanjian Kemitraan ini ditandatangani oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong></p>
      <p><strong>Nama :</strong> ${d.nama_pihak_1}</p>
      <p><strong>NIK :</strong> ${d.nik_pihak_1}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pihak_1}</p>
      ${d.nomorTelepon1 ? `<p><strong>No. Telepon :</strong> ${d.nomorTelepon1}</p>` : ""}
      <p><strong>Peran/Kontribusi :</strong> ${d.peran_pihak_1}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong></p>
      <p><strong>Nama :</strong> ${d.nama_pihak_2}</p>
      <p><strong>NIK :</strong> ${d.nik_pihak_2}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pihak_2}</p>
      ${d.nomorTelepon2 ? `<p><strong>No. Telepon :</strong> ${d.nomorTelepon2}</p>` : ""}
      <p><strong>Peran/Kontribusi :</strong> ${d.peran_pihak_2}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong>.</p>
    </div>
    <p>Para Pihak secara bersama-sama disebut <strong>"Mitra"</strong> dan sepakat membentuk kemitraan usaha (Persekutuan Perdata/Maatschap) sesuai KUHPerdata Pasal 1618.</p>
  `);

  // ── Pasal 3: Objek Kerjasama ──────────────────────────────────────────────
  const usaha = pb.pasal("Objek Kerjasama", `
    <div class="pihak-box">
      <p><strong>Nama Usaha :</strong> ${d.nama_usaha}</p>
      <p><strong>Jenis Usaha :</strong> ${d.jenis_usaha}</p>
      <p><strong>Alamat Usaha :</strong> ${d.alamat_usaha}</p>
      <p><strong>Tanggal Mulai Operasi :</strong> ${tglMulai}</p>
      <p><strong>Jangka Waktu :</strong> ${
        d.jangka_waktu_perjanjian === "tidak_terbatas"
          ? "Tidak terbatas sampai ada kesepakatan pengakhiran"
          : `${d.jangka_waktu_perjanjian.replace("tahun", " tahun")}${d.tanggal_berakhir ? ` (sampai dengan ${formatTanggal(d.tanggal_berakhir)})` : ""}`
      }</p>
    </div>
    <p>Usaha ini dijalankan atas nama kemitraan Para Pihak dan tunduk pada peraturan perundang-undangan yang berlaku di Republik Indonesia.</p>
  `);

  // ── Pasal 4: Kontribusi Para Pihak ────────────────────────────────────────
  const modal = pb.pasal("Kontribusi Para Pihak", `
    <p>1. Total modal kemitraan yang disepakati adalah sebesar <strong>${totalModalFormatted} (${terbilang(d.total_modal)} rupiah)</strong>, dengan rincian kontribusi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA:</strong> ${modal1} — dalam bentuk ${kontribusiLabel(d.bentuk_kontribusi_pihak_1)}</p>
      <p><strong>PIHAK KEDUA:</strong> ${modal2} — dalam bentuk ${kontribusiLabel(d.bentuk_kontribusi_pihak_2)}</p>
    </div>
    <p>2. Modal yang terkumpul digunakan untuk keperluan usaha, meliputi:</p>
    <ul>
      <li>Pengadaan peralatan dan perlengkapan operasional usaha;</li>
      <li>Pembelian bahan baku dan persediaan;</li>
      <li>Modal kerja operasional harian.</li>
    </ul>
    <p>3. Kontribusi berupa aset non-tunai dinilai berdasarkan kesepakatan Para Pihak sebagaimana tercantum di atas dan tidak dapat dipermasalahkan kembali setelah Perjanjian ini ditandatangani.</p>
    <p>4. Kontribusi modal masing-masing Pihak disetor paling lambat pada tanggal <strong>${tglMulai}</strong>.</p>
    <p>5. Penambahan modal oleh salah satu pihak hanya dapat dilakukan atas persetujuan tertulis Para Pihak, sebagaimana diatur dalam Pasal Pengambilan Keputusan.</p>
    ${d.apakah_ada_gaji_pengelola && d.gaji_pengelola ? `<p>6. Pengelola mendapat honor pengelolaan sebesar <strong>${formatRupiah(d.gaji_pengelola)}</strong> per bulan, dibebankan sebagai biaya operasional usaha sebelum perhitungan bagi hasil.</p>` : ""}
  `);

  // ── Pasal 5: Pembagian Keuntungan dan Kerugian ────────────────────────────
  const bagiHasil = pb.pasal("Pembagian Keuntungan dan Kerugian", `
    <p>1. Keuntungan bersih usaha dibagikan kepada Para Pihak dengan proporsi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA:</strong> ${d.persen_bagi_hasil_pihak_1}% dari keuntungan bersih</p>
      <p><strong>PIHAK KEDUA:</strong> ${d.persen_bagi_hasil_pihak_2}% dari keuntungan bersih</p>
    </div>
    <p>2. Kerugian usaha ditanggung Para Pihak dengan proporsi:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA:</strong> ${d.persen_tanggung_rugi_pihak_1}%</p>
      <p><strong>PIHAK KEDUA:</strong> ${d.persen_tanggung_rugi_pihak_2}%</p>
    </div>
    <p>3. Keuntungan bersih dihitung setelah dikurangi:</p>
    <ul>
      <li>Biaya operasional yang dapat dibuktikan dengan dokumen sah;</li>
      <li>Penyusutan aset usaha;</li>
      <li>Cadangan modal kerja yang disepakati Para Pihak.</li>
    </ul>
    <p>4. Distribusi keuntungan dilaksanakan <strong>${periodeLabel}</strong> pada tanggal <strong>${tanggalPembagian}</strong> berdasarkan laporan keuangan periode berjalan yang telah diverifikasi. Atas kesepakatan tertulis Para Pihak, sebagian laba dapat ditahan sebagai cadangan modal kerja.</p>
    <p>5. <strong>Larangan Klausul Leonine:</strong> Sesuai KUHPerdata Pasal 1635, tidak diperbolehkan membebankan seluruh kerugian kepada satu pihak saja. Apabila terdapat ketentuan demikian, demi hukum klausul tersebut batal.</p>
  `);

  // ── Pasal 6: Pelaporan Keuangan ───────────────────────────────────────────
  const pelaporanKeuangan = pb.pasal("Tata Cara Pelaporan Keuangan", `
    <p>1. <strong>Pencatatan Harian:</strong> Pihak pengelola berkewajiban mencatat setiap transaksi harian secara tertib, lengkap, dan dilengkapi bukti transaksi yang valid (nota, kwitansi, atau bukti pembayaran lainnya).</p>
    <p>2. <strong>Laporan Bulanan:</strong> Pihak yang mengelola usaha wajib menyusun dan menyerahkan laporan keuangan bulanan kepada seluruh Mitra paling lambat tanggal <strong>${tanggalLaporan}</strong> setiap bulannya, terdiri dari:</p>
    <ul>
      <li>Laporan laba rugi periode berjalan;</li>
      <li>Neraca keuangan (posisi aset, kewajiban, dan ekuitas);</li>
      <li>Laporan arus kas (cash flow statement).</li>
    </ul>
    <p>3. <strong>Verifikasi:</strong> Pihak Pertama berhak melakukan verifikasi atas laporan keuangan yang disampaikan. Apabila terdapat keberatan, Pihak Pertama wajib menyampaikannya secara tertulis dalam waktu 7 (tujuh) hari sejak laporan diterima. Apabila tidak ada keberatan dalam batas waktu tersebut, laporan dianggap disetujui.</p>
    <p>4. <strong>Akses Pembukuan:</strong> Semua Mitra berhak mengakses dan memeriksa pembukuan, laporan keuangan, dan catatan usaha kapanpun dengan pemberitahuan yang wajar kepada pengelola.</p>
    <p>5. <strong>Penyimpanan Dokumen:</strong> Seluruh dokumen keuangan, bukti transaksi, dan laporan keuangan wajib disimpan sekurang-kurangnya <strong>5 (lima) tahun</strong> sesuai ketentuan UU No. 8 Tahun 1997 tentang Dokumen Perusahaan.</p>
    <p>6. Rekening usaha wajib dipisahkan dari rekening pribadi Para Pihak. Semua transaksi usaha dilakukan melalui rekening usaha tersebut.</p>
  `);

  // ── Pasal 7: Mekanisme Pengambilan Keputusan ──────────────────────────────
  const pengambilanKeputusan = pb.pasal("Mekanisme Pengambilan Keputusan", `
    <p>1. <strong>Keputusan Operasional Harian:</strong> Pihak Kedua selaku pengelola berhak mengambil keputusan operasional rutin atas nama kemitraan tanpa memerlukan persetujuan Pihak Pertama terlebih dahulu.</p>
    <p>2. <strong>Keputusan Strategis:</strong> Keputusan yang memerlukan persetujuan tertulis bersama Para Pihak meliputi:</p>
    <ul>
      <li>Penambahan modal di atas <strong>${batasModalTambahan}</strong> per transaksi;</li>
      <li>Investasi atau pembelian aset baru di atas <strong>${batasInvestasi}</strong>;</li>
      <li>Perubahan jenis atau ruang lingkup usaha;</li>
      <li>Pengikatan kontrak jangka panjang (lebih dari 6 bulan);</li>
      <li>Penerimaan pinjaman atau kewajiban finansial signifikan;</li>
      <li>Hal-hal lain yang berdampak material bagi kelangsungan usaha.</li>
    </ul>
    <p>3. <strong>Dokumentasi Keputusan:</strong> Setiap keputusan strategis yang diambil bersama wajib didokumentasikan dalam risalah keputusan tertulis yang ditandatangani oleh Para Pihak dan disimpan sebagai bagian dari dokumen usaha.</p>
    <p>4. Penarikan dana usaha di atas <strong>${batasModalTambahan}</strong> memerlukan persetujuan Para Pihak sesuai mekanisme di atas.</p>
  `);

  // ── Pasal 8: Hak dan Kewajiban Para Pihak ────────────────────────────────
  const hakKewajiban = pb.pasal("Hak dan Kewajiban Para Pihak", `
    <p><strong>A. Pihak Pertama (Penyedia Modal) berhak:</strong></p>
    <ul>
      <li>Menerima laporan keuangan bulanan tepat waktu;</li>
      <li>Melakukan audit atau pemeriksaan atas pembukuan usaha;</li>
      <li>Mendapat bagian keuntungan sesuai proporsi yang disepakati;</li>
      <li>Memberikan persetujuan atas keputusan strategis.</li>
    </ul>
    <p><strong>B. Pihak Pertama wajib:</strong></p>
    <ul>
      <li>Menyetorkan modal sesuai kesepakatan dan jadwal yang ditentukan;</li>
      <li>Tidak mencampuri keputusan operasional harian;</li>
      <li>Merahasiakan informasi bisnis usaha kemitraan.</li>
    </ul>
    <p><strong>C. Pihak Kedua (Pengelola) berhak:</strong></p>
    <ul>
      <li>Mengambil keputusan operasional harian;</li>
      <li>Mendapat bagian keuntungan sesuai proporsi yang disepakati;</li>
      ${d.apakah_ada_gaji_pengelola && d.gaji_pengelola ? `<li>Mendapat honor pengelolaan sebesar ${formatRupiah(d.gaji_pengelola)} per bulan;</li>` : ""}
      <li>Mendapat dukungan dan akses modal dari Pihak Pertama.</li>
    </ul>
    <p><strong>D. Pihak Kedua wajib:</strong></p>
    <ul>
      <li>Mengelola usaha dengan penuh dedikasi, kejujuran, dan itikad baik;</li>
      <li>Menyusun dan menyerahkan laporan keuangan tepat waktu;</li>
      <li>Meminta persetujuan untuk keputusan yang melampaui batas kewenangan;</li>
      <li>Merahasiakan informasi bisnis usaha kemitraan;</li>
      <li>Menjaga dan merawat aset usaha dengan baik.</li>
    </ul>
  `);

  // ── Pasal 9: Prosedur Keluar dari Usaha ───────────────────────────────────
  const prosedurKeluar = pb.pasal("Prosedur Keluar dari Usaha", `
    <p>1. <strong>Pemberitahuan:</strong> Pihak yang ingin keluar dari kemitraan wajib memberitahukan secara tertulis kepada pihak lain minimal <strong>${masaPemberitahuan} (${masaPemberitahuanHari}) bulan hari</strong> sebelumnya untuk memungkinkan transisi yang tertib.</p>
    <p>2. <strong>Audit Keuangan:</strong> Setelah pemberitahuan keluar diterima, Para Pihak bersepakat untuk melakukan audit keuangan independen atas seluruh aset, kewajiban, dan posisi keuangan usaha. Biaya audit ditanggung usaha.</p>
    <p>3. <strong>Opsi Penyelesaian:</strong> Tergantung pada situasi yang terjadi, penyelesaian dilakukan dengan salah satu dari 4 (empat) cara berikut:</p>
    <ul>
      <li><strong>Opsi A – Pihak Pertama keluar:</strong> Pihak Kedua membeli bagian kepemilikan Pihak Pertama berdasarkan penilaian aset yang disepakati bersama (<em>right of first refusal</em>). Apabila tidak tercapai kesepakatan dalam 30 hari, bagian tersebut dapat ditawarkan kepada pihak ketiga;</li>
      <li><strong>Opsi B – Pihak Kedua keluar:</strong> Pihak Pertama membeli bagian kepemilikan Pihak Kedua atau menunjuk pengelola baru berdasarkan penilaian aset yang disepakati. Pihak Kedua wajib melakukan serah terima operasional secara lengkap;</li>
      <li><strong>Opsi C – Kedua pihak sepakat keluar:</strong> Dilakukan likuidasi usaha secara teratur — aset dijual, kewajiban diselesaikan, dan sisa aset dibagi proporsional sesuai kontribusi modal masing-masing pihak;</li>
      <li><strong>Opsi D – Likuidasi karena keadaan hukum:</strong> Salah satu pihak meninggal dunia, pailit, atau tidak cakap hukum — kemitraan dilikuidasi atau bagiannya dialihkan kepada ahli waris/kuasa hukum yang sah.</li>
    </ul>
    <p>4. <strong>Masa Transisi:</strong> Pihak yang keluar wajib menyelesaikan seluruh tanggung jawab yang sedang berjalan, melakukan serah terima aset, dokumen, dan informasi operasional secara lengkap kepada pihak yang meneruskan usaha.</p>
    <p>5. Para Pihak dilarang melakukan tindakan yang merugikan kepentingan usaha selama masa transisi berlangsung.</p>
  `);

  // ── Pasal 10: Larangan dan Pembatasan ────────────────────────────────────
  const laranganPembatasan = pb.pasal("Larangan dan Pembatasan", `
    <p>1. <strong>Klausul Non-Compete:</strong> Sepanjang Perjanjian berlaku dan selama <strong>${durasiNonCompete} (${durasiNonCompete === "1" ? "satu" : durasiNonCompete}) tahun</strong> setelah Perjanjian berakhir, Para Pihak dilarang mendirikan, memiliki, atau terlibat dalam usaha sejenis yang bersaing dengan usaha kemitraan ini dalam radius <strong>${radiusNonCompete} (${radiusNonCompete} meter)</strong> dari lokasi usaha, kecuali mendapat persetujuan tertulis dari pihak lain.</p>
    <p>2. <strong>Kerahasiaan Informasi:</strong> Para Pihak wajib menjaga kerahasiaan seluruh informasi bisnis, data pelanggan, strategi usaha, dan informasi keuangan yang diperoleh selama kemitraan berlangsung. Kewajiban kerahasiaan ini berlaku selama kemitraan dan <strong>${durasiNonCompete} tahun</strong> setelah berakhir.</p>
    <p>3. <strong>Penggunaan Aset:</strong> Aset usaha kemitraan hanya dapat digunakan untuk kepentingan usaha dan tidak boleh dijaminkan, dipindahtangankan, atau digunakan untuk kepentingan pribadi tanpa persetujuan tertulis Para Pihak.</p>
    <p>4. <strong>Benturan Kepentingan:</strong> Para Pihak wajib mengungkapkan setiap benturan kepentingan yang mungkin memengaruhi pengambilan keputusan usaha dan mengambil langkah-langkah yang diperlukan untuk mengatasinya.</p>
  `);

  // ── Pasal 11: Wanprestasi dan Sanksi ─────────────────────────────────────
  const wanprestasi = pb.pasal("Wanprestasi dan Sanksi", `
    <p>1. Suatu Pihak dinyatakan wanprestasi ketika yang bersangkutan lalai memenuhi kewajiban yang diatur dalam Perjanjian ini, termasuk namun tidak terbatas pada: tidak menyetor modal tepat waktu, tidak menyerahkan laporan keuangan, menyalahgunakan aset usaha, atau melanggar ketentuan larangan persaingan.</p>
    <p>2. <strong>Sanksi Bertingkat:</strong></p>
    <ul>
      <li><strong>Tahap 1 – Teguran Tertulis:</strong> Pihak yang dirugikan menyampaikan teguran tertulis kepada pihak yang wanprestasi. Pihak yang wanprestasi diberi waktu 14 (empat belas) hari untuk memenuhi kewajibannya;</li>
      <li><strong>Tahap 2 – Denda:</strong> Apabila pelanggaran berlanjut atau terulang setelah teguran tertulis, dikenakan denda sebesar <strong>${sanksiDenda}</strong> atas setiap bulan keterlambatan atau pelanggaran berlanjut;</li>
      <li><strong>Tahap 3 – Pengurangan Keuntungan:</strong> Apabila pelanggaran berat terbukti dan menimbulkan kerugian bagi usaha, bagian keuntungan pihak yang wanprestasi dapat dikurangi hingga <strong>50% (lima puluh persen)</strong> untuk periode selama kerugian berlangsung, berdasarkan keputusan bersama Para Pihak atau putusan pengadilan;</li>
      <li><strong>Tahap 4 – Pemutusan Sepihak:</strong> Apabila pelanggaran bersifat signifikan, material, atau berulang meskipun telah ditegur, pihak yang dirugikan berhak memutus Perjanjian ini secara sepihak dengan pemberitahuan tertulis.</li>
    </ul>
    <p>3. <strong>Ganti Rugi:</strong> Pihak yang melakukan wanprestasi wajib mengganti kerugian kepada pihak yang dirugikan, meliputi:</p>
    <ul>
      <li>Kerugian nyata (actual loss) yang dapat dibuktikan; dan</li>
      <li>Keuntungan yang hilang (lost profit) akibat wanprestasi tersebut.</li>
    </ul>
    <p>4. Pengenaan sanksi tidak menghapus kewajiban pihak yang wanprestasi untuk tetap memenuhi kewajibannya berdasarkan Perjanjian ini.</p>
  `);

  // ── Pasal 12: Force Majeure ───────────────────────────────────────────────
  const forceMajeure = pb.pasal("Force Majeure (Keadaan Kahar)", `
    <p>1. Force majeure adalah keadaan di luar kendali Para Pihak yang mengakibatkan tidak dapat dipenuhinya kewajiban, meliputi: bencana alam, banjir, gempa bumi, kebakaran, perang, kerusuhan, wabah/pandemi, pemadaman listrik berkepanjangan, kebijakan pemerintah yang berdampak langsung, atau keadaan luar biasa lainnya yang tidak dapat diantisipasi.</p>
    <p>2. Pihak yang mengalami force majeure wajib memberitahukan kepada pihak lain secara tertulis dalam waktu <strong>7 (tujuh) hari</strong> sejak terjadinya keadaan tersebut, disertai bukti yang memadai.</p>
    <p>3. <strong>Pembagian Kerugian:</strong> Kerugian yang timbul akibat force majeure ditanggung bersama oleh Para Pihak secara proporsional sesuai proporsi kontribusi modal masing-masing, kecuali disepakati lain secara tertulis.</p>
    <p>4. Kewajiban yang terdampak force majeure ditangguhkan selama keadaan tersebut berlangsung. Apabila force majeure berlangsung lebih dari <strong>90 (sembilan puluh) hari</strong>, Para Pihak dapat bermusyawarah untuk meninjau kembali atau mengakhiri Perjanjian.</p>
  `);

  // ── Pasal 13: Penyelesaian Sengketa ──────────────────────────────────────
  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. <strong>Musyawarah:</strong> Setiap perselisihan yang timbul dari atau sehubungan dengan Perjanjian ini diselesaikan terlebih dahulu melalui musyawarah untuk mufakat dalam jangka waktu <strong>30 (tiga puluh) hari</strong> sejak perselisihan disampaikan secara tertulis.</p>
    <p>2. <strong>Mediasi:</strong> Apabila musyawarah gagal, Para Pihak menempuh jalur mediasi dalam jangka waktu <strong>60 (enam puluh) hari</strong> dengan mediator yang disepakati bersama.</p>
    <p>3. <strong>Pengadilan:</strong> Apabila mediasi tidak menghasilkan penyelesaian, sengketa diselesaikan melalui <strong>Pengadilan Negeri yang memiliki yurisdiksi di tempat kedudukan usaha kemitraan ini</strong> berdasarkan hukum Republik Indonesia.</p>
  `);

  // ── Pasal 14: Ketentuan Penutup ───────────────────────────────────────────
  const ketentuan = pb.pasal("Ketentuan Penutup", `
    <p>1. Perjanjian ini mulai mengikat Para Pihak terhitung sejak tanggal penandatanganan.</p>
    <p>2. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap</strong> bermaterai cukup, masing-masing mempunyai kekuatan hukum yang sama.</p>
    <p>3. Perubahan atas Perjanjian ini hanya sah apabila dilakukan secara tertulis dan ditandatangani oleh Para Pihak.</p>
    <p>4. Apabila salah satu ketentuan dalam Perjanjian ini dinyatakan tidak sah atau tidak dapat dilaksanakan (<em>severability</em>), ketentuan lainnya tetap berlaku penuh.</p>
    <p>5. Perjanjian ini merupakan satu-satunya dasar kesepakatan yang berlaku, dan dengan ini menggantikan segala perjanjian, diskusi, atau negosiasi sebelumnya mengenai hal yang sama.</p>
    <p>6. Para Pihak sepakat untuk melaksanakan Perjanjian ini dengan itikad baik (good faith) sesuai asas-asas hukum perjanjian yang berlaku.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN BAGI HASIL USAHA</h1>
  <p class="subtitle">Persekutuan Perdata (Maatschap) — KUHPerdata Pasal 1618–1652</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${dasarHukum}
  ${paraPihak}
  ${usaha}
  ${modal}
  ${bagiHasil}
  ${pelaporanKeuangan}
  ${pengambilanKeputusan}
  ${hakKewajiban}
  ${prosedurKeluar}
  ${laranganPembatasan}
  ${wanprestasi}
  ${forceMajeure}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${lokasiPembuatan}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pihak_1}</strong></p>
        <p>NIK: ${d.nik_pihak_1}</p>
        <p>Tanggal: ${tglTtd}</p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pihak_2}</strong></p>
        <p>NIK: ${d.nik_pihak_2}</p>
        <p>Tanggal: ${tglTtd}</p>
      </td>
    </tr>
  </table>

  <p style="text-align: center; margin-top: 24px; font-weight: 700;">SAKSI-SAKSI:</p>
  <table class="tanda-tangan">
    <tr>
      <td>
        <p>Saksi 1</p>
        <div class="ttd-area"></div>
        <p><strong>${d.saksi_1}</strong></p>
        ${d.nik_saksi_1 ? `<p>NIK: ${d.nik_saksi_1}</p>` : ""}
        ${d.saksi1Alamat ? `<p>Alamat: ${d.saksi1Alamat}</p>` : ""}
      </td>
      <td>
        <p>Saksi 2</p>
        <div class="ttd-area"></div>
        <p><strong>${d.saksi_2 || "________________"}</strong></p>
        ${d.nik_saksi_2 ? `<p>NIK: ${d.nik_saksi_2}</p>` : ""}
        ${d.saksi2Alamat ? `<p>Alamat: ${d.saksi2Alamat}</p>` : ""}
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
