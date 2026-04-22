export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  category: string;
  date: string; // YYYY-MM-DD
  readTime: number; // in minutes
  relatedContract: string; // href
  metaDescription: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "syarat-dokumen-kur-umkm-2024",
    title: "Syarat Dokumen KUR untuk UMKM 2024 — Panduan Lengkap",
    excerpt:
      "Mau apply KUR tapi bingung dokumen apa yang harus disiapkan? Ini daftar lengkap syarat dokumen KUR untuk UMKM 2024, plus tips agar permohonanmu lebih mudah disetujui bank.",
    category: "KUR & UMKM",
    date: "2026-04-15",
    readTime: 7,
    relatedContract: "/kur",
    metaDescription:
      "Daftar lengkap syarat dokumen KUR UMKM 2024: NIB, NPWP, SKU, laporan keuangan, dan lainnya. Tips agar dokumenmu lebih bankable dan mudah disetujui.",
    content: `
<h2>Apa Itu KUR dan Kenapa Dokumen Itu Penting Banget?</h2>
<p>KUR (Kredit Usaha Rakyat) adalah pinjaman bersubsidi pemerintah yang dirancang khusus buat pelaku UMKM. Bunganya jauh lebih rendah dari kredit biasa — di 2024, bunga KUR hanya sekitar 6% per tahun. Menarik banget, kan?</p>
<p>Tapi ada satu hal yang sering jadi batu sandungan: <strong>dokumen</strong>. Banyak pengajuan KUR yang ditolak bukan karena bisnisnya kurang bagus, tapi karena dokumennya tidak lengkap atau tidak rapi. Bank butuh bukti bahwa kamu adalah peminjam yang "bankable" — dan dokumen adalah cara kamu membuktikannya.</p>

<h2>Daftar Dokumen KUR yang Biasanya Diminta Bank</h2>
<p>Setiap bank punya ketentuan sedikit berbeda, tapi umumnya ini dokumen yang wajib kamu siapkan:</p>

<h3>Dokumen Identitas Pribadi</h3>
<ul>
  <li><strong>KTP</strong> (Kartu Tanda Penduduk) pemohon yang masih berlaku</li>
  <li><strong>KK</strong> (Kartu Keluarga)</li>
  <li><strong>Buku nikah</strong> (jika sudah menikah) — beberapa bank mensyaratkan ini</li>
  <li><strong>NPWP</strong> pribadi (wajib untuk pinjaman di atas Rp 50 juta)</li>
</ul>

<h3>Dokumen Legalitas Usaha</h3>
<ul>
  <li><strong>NIB (Nomor Induk Berusaha)</strong> — ini wajib dan harus punya sebelum apply KUR</li>
  <li><strong>SKU (Surat Keterangan Usaha)</strong> dari kelurahan atau kecamatan</li>
  <li><strong>SIUP atau TDP</strong> (jika ada, untuk usaha yang lebih formal)</li>
  <li><strong>NPWP usaha</strong> (untuk KUR Kecil dan Menengah)</li>
</ul>

<h3>Dokumen Keuangan</h3>
<ul>
  <li><strong>Laporan keuangan</strong> minimal 6 bulan terakhir (bisa berupa catatan sederhana)</li>
  <li><strong>Rekening koran</strong> 3-6 bulan terakhir</li>
  <li><strong>Bukti transaksi usaha</strong> — nota, invoice, atau bukti penjualan lainnya</li>
</ul>

<h3>Dokumen Agunan (Jika Ada)</h3>
<ul>
  <li>Sertifikat tanah atau BPKB kendaraan (untuk KUR Kecil dan Menengah)</li>
  <li>KUR Mikro (hingga Rp 100 juta) biasanya <em>tanpa agunan</em></li>
</ul>

<h2>Perbedaan KUR Mikro, Kecil, dan Menengah</h2>
<p>Penting untuk tahu kategori KUR mana yang cocok buat usahamu, karena syarat dokumennya juga berbeda:</p>
<ul>
  <li><strong>KUR Mikro</strong>: Plafon sampai Rp 100 juta, bunga 6%/tahun, tanpa agunan tambahan. Cocok untuk usaha kecil yang baru berkembang.</li>
  <li><strong>KUR Kecil</strong>: Plafon Rp 100 juta – Rp 500 juta, butuh agunan, laporan keuangan lebih lengkap.</li>
  <li><strong>KUR Menengah</strong>: Plafon Rp 500 juta – Rp 10 miliar, persyaratan lebih ketat, biasanya perlu laporan keuangan dari akuntan.</li>
</ul>

<h2>Tips Biar Dokumenmu Lebih "Bankable"</h2>
<p>Ini yang membedakan pengajuan yang disetujui vs yang ditolak:</p>

<h3>1. Rapikan Laporan Keuangan Dulu</h3>
<p>Kamu tidak perlu pakai software akuntansi canggih. Cukup buat catatan pemasukan dan pengeluaran yang konsisten selama 6 bulan. Bank ingin melihat bahwa bisnismu menghasilkan uang secara rutin.</p>

<h3>2. Pastikan NIB Sudah Sesuai KBLI</h3>
<p>KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) yang kamu pilih saat daftar NIB harus sesuai dengan usaha yang sebenarnya kamu jalani. Ketidaksesuaian ini sering jadi alasan penolakan.</p>

<h3>3. Pisahkan Rekening Usaha dan Pribadi</h3>
<p>Kalau kamu masih pakai rekening pribadi untuk usaha, segera buka rekening khusus usaha. Rekening koran yang rapi menunjukkan aktivitas bisnis yang sehat.</p>

<h3>4. Siapkan Proposal Usaha Sederhana</h3>
<p>Meskipun tidak selalu diminta, proposal usaha yang menjelaskan bisnis kamu, proyeksi pendapatan, dan rencana penggunaan pinjaman akan membuat officer bank lebih yakin.</p>

<h2>Mulai Siapkan Dokumen KUR-mu Sekarang</h2>
<p>Dokumen adalah kunci pertama yang membuka pintu KUR. Semakin lengkap dan rapi, semakin besar peluang disetujui. Kalau kamu butuh bantuan menyiapkan dokumen legal seperti perjanjian kerja sama atau surat keterangan usaha, LegalKan bisa bantu kamu dalam hitungan menit.</p>
<p>👉 <a href="/kur">Siapkan Paket Dokumen KUR di LegalKan</a> — lengkap, cepat, dan sesuai persyaratan bank.</p>
    `,
  },
  {
    slug: "cara-daftar-nib-online-gratis",
    title: "Cara Daftar NIB Online Gratis di OSS — Selesai 15 Menit",
    excerpt:
      "NIB adalah syarat wajib sebelum bisa apply KUR atau buka rekening usaha. Kabar baiknya, daftarnya gratis dan bisa dilakukan online dari HP. Ini panduan step-by-step-nya.",
    category: "KUR & UMKM",
    date: "2026-04-10",
    readTime: 6,
    relatedContract: "/nib-guide",
    metaDescription:
      "Cara daftar NIB online gratis di OSS-RBA oss.go.id. Panduan lengkap step-by-step, tips pilih KBLI yang tepat, dan FAQ umum tentang NIB untuk UMKM.",
    content: `
<h2>Apa Itu NIB dan Kenapa Kamu Harus Punya?</h2>
<p>NIB (Nomor Induk Berusaha) adalah identitas tunggal bagi pelaku usaha di Indonesia. Sejak berlakunya PP No. 5 Tahun 2021, NIB menggantikan berbagai izin usaha lama seperti TDP, SIUP, dan API menjadi satu dokumen terpadu.</p>
<p>Kenapa penting? Karena tanpa NIB, kamu tidak bisa:</p>
<ul>
  <li>Apply KUR (Kredit Usaha Rakyat) di bank manapun</li>
  <li>Membuka rekening usaha di banyak bank</li>
  <li>Mendaftar sebagai vendor/supplier perusahaan besar</li>
  <li>Mengikuti program bantuan pemerintah untuk UMKM</li>
  <li>Ekspor barang secara legal</li>
</ul>
<p>Kabar baiknya: <strong>daftar NIB itu gratis dan bisa dilakukan dari HP kamu sekarang</strong>.</p>

<h2>Sebelum Mulai: Dokumen yang Perlu Disiapkan</h2>
<p>Siapkan ini dulu biar prosesnya lancar:</p>
<ul>
  <li>KTP yang masih berlaku</li>
  <li>NPWP pribadi (kalau ada — bisa menyusul)</li>
  <li>Alamat email aktif</li>
  <li>Nomor HP aktif</li>
  <li>Informasi tentang usahamu: nama usaha, alamat, dan jenis kegiatan usaha</li>
</ul>

<h2>Step-by-Step Daftar NIB di OSS</h2>

<h3>Langkah 1: Buka Situs OSS</h3>
<p>Buka browser dan pergi ke <strong>oss.go.id</strong>. Klik tombol "Daftar" atau "Masuk" di pojok kanan atas. Kalau belum punya akun, pilih "Daftar Akun" terlebih dahulu.</p>

<h3>Langkah 2: Buat Akun OSS</h3>
<p>Isi formulir pendaftaran akun dengan:</p>
<ul>
  <li>NIK (dari KTP)</li>
  <li>Tanggal lahir</li>
  <li>Email aktif</li>
  <li>Nomor HP</li>
</ul>
<p>Verifikasi email kamu dari link yang dikirim ke inbox. Kalau tidak ada di inbox, cek folder spam.</p>

<h3>Langkah 3: Login dan Mulai Perizinan Baru</h3>
<p>Setelah login, klik "Perizinan Berusaha" → "Permohonan Baru". Pilih skala usaha kamu: <strong>Usaha Mikro/Kecil</strong> untuk UMKM.</p>

<h3>Langkah 4: Isi Data Usaha</h3>
<p>Ini bagian terpenting. Isi dengan teliti:</p>
<ul>
  <li><strong>Nama usaha</strong>: bisa nama toko, brand, atau nama kamu sendiri</li>
  <li><strong>KBLI (Klasifikasi Baku Lapangan Usaha)</strong>: kode 5 digit yang menentukan jenis usahamu</li>
  <li><strong>Alamat usaha</strong>: bisa alamat rumah untuk usaha rumahan</li>
  <li><strong>Modal usaha</strong>: perkiraan nilai aset usahamu</li>
</ul>

<h3>Langkah 5: Pilih KBLI yang Tepat</h3>
<p>Ini sering jadi kebingungan. KBLI adalah kode 5 digit yang menggambarkan jenis kegiatan usahamu. Beberapa contoh:</p>
<ul>
  <li><strong>47211</strong> — Perdagangan eceran makanan di toko</li>
  <li><strong>62010</strong> — Aktivitas pemrograman komputer (untuk developer/programmer)</li>
  <li><strong>74100</strong> — Aktivitas desain khusus (untuk desainer)</li>
  <li><strong>56101</strong> — Restoran dan warung makan</li>
  <li><strong>43221</strong> — Instalasi listrik</li>
</ul>
<p>Tips: Cari di kolom pencarian OSS dengan kata kunci yang menggambarkan usahamu. Kalau usahamu punya beberapa kegiatan, kamu bisa pilih lebih dari satu KBLI.</p>

<h3>Langkah 6: Submit dan Dapatkan NIB</h3>
<p>Review semua data, centang persetujuan, lalu klik "Submit". Sistem OSS akan langsung memproses dan biasanya <strong>NIB keluar dalam hitungan menit</strong> — bahkan detik!</p>
<p>NIB kamu akan tampil di dashboard. Download dan simpan dokumennya.</p>

<h2>FAQ Umum tentang NIB</h2>

<h3>Apakah NIB bisa dipakai untuk lebih dari satu jenis usaha?</h3>
<p>Ya! Satu NIB bisa mencakup beberapa KBLI. Jadi kalau kamu jualan makanan sekaligus buka jasa catering, bisa dimasukkan semuanya dalam satu NIB.</p>

<h3>Apakah NIB bisa diubah alamatnya?</h3>
<p>Bisa. Login ke OSS, pilih NIB yang sudah ada, lalu ajukan perubahan data.</p>

<h3>Apakah usaha rumahan bisa punya NIB?</h3>
<p>Tentu! Usaha dari rumah sekalipun bisa punya NIB. Alamat rumah bisa dipakai sebagai alamat usaha.</p>

<h3>Apakah NIB sama dengan SIUP?</h3>
<p>Tidak sama, tapi NIB <em>menggantikan</em> SIUP untuk sebagian besar jenis usaha. NIB sekarang berfungsi sebagai izin usaha dasar yang diakui pemerintah.</p>

<h2>Sudah Punya NIB? Langkah Selanjutnya</h2>
<p>Setelah NIB di tangan, kamu sudah bisa mulai proses pengajuan KUR. Tapi ingat, bank juga butuh dokumen legal usaha yang rapi. LegalKan bisa membantu kamu menyiapkan dokumen perjanjian dan surat resmi yang dibutuhkan.</p>
<p>👉 <a href="/nib-guide">Lihat panduan NIB lengkap di LegalKan</a> untuk langkah selanjutnya setelah dapat NIB.</p>
    `,
  },
  {
    slug: "tips-buat-kontrak-sewa-rumah-aman",
    title: "7 Hal Wajib Ada di Kontrak Sewa Rumah — Jangan Sampai Ketinggalan",
    excerpt:
      "Sewa rumah tanpa kontrak yang jelas = undangan masalah. Dari deposit yang tidak dikembalikan sampai pengusiran mendadak — ini 7 klausul wajib yang harus ada di setiap kontrak sewa rumah.",
    category: "Properti",
    date: "2026-04-05",
    readTime: 8,
    relatedContract: "/buat",
    metaDescription:
      "7 klausul wajib dalam kontrak sewa rumah: identitas, jangka waktu, harga, deposit, hak kewajiban, pengakhiran, penyelesaian sengketa. Buat kontrak yang aman di LegalKan.",
    content: `
<h2>Kenapa Kontrak Sewa Itu Wajib, Bukan Opsional</h2>
<p>Banyak yang masih menganggap kontrak sewa hanya formalitas — terutama kalau menyewa dari keluarga atau kenalan. Padahal, justru di situlah masalah sering muncul.</p>
<p>Cerita seperti ini sering terjadi: Pak Andi menyewa rumah selama 2 tahun dari tetangganya. Tidak ada kontrak tertulis, hanya kesepakatan lisan. Setahun kemudian, si pemilik rumah memutuskan untuk menjual propertinya. Pak Andi tiba-tiba harus keluar dalam waktu 1 bulan — tanpa kompensasi, tanpa kepastian hukum untuk mempertahankan haknya.</p>
<p>Dengan kontrak yang jelas, situasi seperti itu bisa dihindari. Kontrak sewa bukan soal tidak percaya — ini soal <strong>melindungi semua pihak</strong>, termasuk pemilik rumah.</p>

<h2>7 Klausul Wajib dalam Kontrak Sewa Rumah</h2>

<h3>1. Identitas Lengkap Para Pihak</h3>
<p>Kontrak harus mencantumkan:</p>
<ul>
  <li>Nama lengkap dan NIK pemilik (pihak yang menyewakan)</li>
  <li>Nama lengkap dan NIK penyewa</li>
  <li>Alamat masing-masing pihak</li>
  <li>Nomor telepon yang bisa dihubungi</li>
</ul>
<p>Kenapa NIK penting? Karena ini memastikan identitas seseorang bisa diverifikasi secara hukum.</p>

<h3>2. Deskripsi Properti yang Disewakan</h3>
<p>Jelaskan dengan detail propertinya:</p>
<ul>
  <li>Alamat lengkap properti</li>
  <li>Luas bangunan dan tanah</li>
  <li>Kondisi properti saat ditandatangani kontrak</li>
  <li>Fasilitas yang termasuk (furnitur, AC, water heater, dll.)</li>
</ul>

<h3>3. Jangka Waktu Sewa yang Jelas</h3>
<p>Cantumkan tanggal mulai dan berakhirnya sewa secara eksplisit. Misalnya: "1 Januari 2025 sampai dengan 31 Desember 2026." Jangan hanya tulis "1 tahun" tanpa menyebutkan tanggal pasti, karena ini sering menimbulkan perbedaan tafsir.</p>

<h3>4. Harga Sewa dan Cara Pembayaran</h3>
<p>Ini harus sangat jelas:</p>
<ul>
  <li>Besaran uang sewa per bulan/tahun</li>
  <li>Tanggal jatuh tempo pembayaran</li>
  <li>Metode pembayaran (transfer ke rekening tertentu, tunai, dll.)</li>
  <li>Denda keterlambatan (jika ada)</li>
  <li>Klausul kenaikan sewa di tahun berikutnya (jika sewa multi-tahun)</li>
</ul>

<h3>5. Deposit dan Ketentuan Pengembaliannya</h3>
<p>Deposit sering jadi sumber sengketa. Pastikan kontrak menyebutkan:</p>
<ul>
  <li>Besaran deposit (biasanya 1-3 bulan sewa)</li>
  <li>Kondisi di mana deposit bisa dipotong (kerusakan, tunggakan, dll.)</li>
  <li>Berapa lama deposit dikembalikan setelah sewa berakhir (biasanya 7-30 hari)</li>
  <li>Mekanisme perhitungan kerusakan</li>
</ul>

<h3>6. Hak dan Kewajiban Masing-Masing Pihak</h3>
<p><strong>Penyewa berhak:</strong> mendapat akses penuh ke properti, privasi, dan perbaikan kerusakan bukan akibat kelalaiannya.</p>
<p><strong>Penyewa berkewajiban:</strong> membayar tepat waktu, merawat properti, tidak mengubah struktur tanpa izin, tidak menyewakan kembali (sublet) tanpa persetujuan.</p>
<p><strong>Pemilik berhak:</strong> menerima pembayaran tepat waktu, inspeksi berkala dengan pemberitahuan terlebih dahulu.</p>
<p><strong>Pemilik berkewajiban:</strong> memperbaiki kerusakan yang bukan akibat penyewa, memberikan lingkungan yang layak huni.</p>

<h3>7. Klausul Pengakhiran dan Penyelesaian Sengketa</h3>
<p>Kontrak harus menjelaskan:</p>
<ul>
  <li>Berapa lama notifikasi sebelum sewa berakhir (biasanya 30-60 hari)</li>
  <li>Kondisi di mana kontrak bisa diakhiri lebih awal (wanprestasi, force majeure)</li>
  <li>Konsekuensi pengakhiran sepihak</li>
  <li>Mekanisme penyelesaian sengketa: musyawarah dulu, baru ke Pengadilan Negeri setempat</li>
</ul>

<h2>Kesalahan Umum dalam Kontrak Sewa Rumah</h2>
<ul>
  <li>Tidak mendokumentasikan kondisi awal properti dengan foto</li>
  <li>Tidak menyebutkan siapa yang bayar listrik, air, dan internet</li>
  <li>Tidak ada klausul untuk renovasi atau modifikasi</li>
  <li>Lupa mencantumkan klausul untuk pemeliharaan (siapa yang bertanggung jawab untuk perbaikan apa)</li>
</ul>

<h2>Buat Kontrak Sewa yang Aman di LegalKan</h2>
<p>Tidak perlu bingung mulai dari mana. LegalKan menyediakan kontrak sewa properti yang sudah mencakup semua 7 klausul wajib di atas, sesuai KUHPerdata Indonesia, dan bisa dikustomisasi sesuai kesepakatan kamu.</p>
<p>👉 <a href="/buat">Buat Kontrak Sewa Properti di LegalKan</a> — mulai dari Rp 19.000, selesai dalam 5 menit, langsung dapat PDF.</p>
    `,
  },
  {
    slug: "kontrak-freelance-indonesia-panduan",
    title: "Kontrak Freelance Indonesia — Kenapa Penting dan Apa yang Harus Ada",
    excerpt:
      "Kerja freelance tanpa kontrak itu seperti main judi — kadang berhasil, tapi sering berakhir tidak dibayar atau scope-nya kebablasan. Ini panduan lengkap kontrak freelance untuk kreator Indonesia.",
    category: "Freelancer",
    date: "2026-03-28",
    readTime: 7,
    relatedContract: "/buat/freelancer",
    metaDescription:
      "Panduan kontrak freelance Indonesia: apa yang wajib ada, perbedaan PKWT vs kontrak jasa lepas, dan tips negosiasi dengan klien. Buat kontrak freelance di LegalKan.",
    content: `
<h2>Realita Freelancer Tanpa Kontrak</h2>
<p>Hampir setiap freelancer punya cerita pahit tentang klien bermasalah. Skenario paling umum:</p>
<ul>
  <li>"Tolong tambahin fitur ini ya, sebentar kok" — padahal itu pekerjaan tambahan 20 jam</li>
  <li>Invoice sudah dikirim, tapi klien menghilang atau terus-menerus menunda bayar</li>
  <li>Desain/kode yang sudah kamu buat dipakai bertahun-tahun tanpa kompensasi tambahan</li>
  <li>Klien klaim bahwa hasil kerja kamu "tidak sesuai ekspektasi" padahal tidak ada brief yang jelas</li>
</ul>
<p>Semua masalah ini punya satu solusi: <strong>kontrak yang jelas sebelum kerja dimulai</strong>.</p>

<h2>Apa Bedanya PKWT dengan Kontrak Jasa Lepas?</h2>
<p>Ini penting dipahami karena berdampak pada status hukum dan kewajiban pajak kamu:</p>
<p><strong>PKWT (Perjanjian Kerja Waktu Tertentu)</strong> adalah kontrak kerja karyawan — ada hubungan kerja, jam kerja tetap, dan kamu berstatus sebagai pekerja perusahaan tersebut. Ini bukan yang cocok untuk freelancer.</p>
<p><strong>Kontrak Jasa Lepas (Perjanjian Pemberian Jasa)</strong> adalah kontrak antara dua pihak yang setara: kamu sebagai pemberi jasa dan klien sebagai penerima jasa. Tidak ada hubungan kerja — kamu adalah kontraktor independen. Ini yang sesuai untuk kebanyakan freelancer.</p>

<h2>7 Hal yang Wajib Ada di Kontrak Freelancemu</h2>

<h3>1. Identitas Kedua Pihak</h3>
<p>Nama lengkap, NIK (atau nomor NPWP untuk badan usaha), dan alamat. Jika klienmu adalah perusahaan, cantumkan nama perusahaan, nomor akta, dan nama representatif yang berwenang menandatangani.</p>

<h3>2. Ruang Lingkup Pekerjaan (Scope of Work) yang Spesifik</h3>
<p>Ini yang paling krusial. Jangan tulis "desain website" — tulis:</p>
<ul>
  <li>"Desain UI/UX untuk 5 halaman (homepage, about, produk, blog, kontak)"</li>
  <li>"Mockup dalam format Figma, dikirim dalam 2 tahap: wireframe dan final design"</li>
  <li>"Termasuk 2 putaran revisi per halaman"</li>
</ul>
<p>Semakin spesifik scope-nya, semakin kecil kemungkinan scope creep terjadi.</p>

<h3>3. Harga dan Jadwal Pembayaran</h3>
<p>Cantumkan:</p>
<ul>
  <li>Total harga proyek atau rate per jam/hari</li>
  <li>Struktur pembayaran: misalnya 50% di depan, 50% saat selesai</li>
  <li>Metode pembayaran yang diterima</li>
  <li>Denda keterlambatan pembayaran</li>
</ul>
<p>Tips: selalu minta DP minimal 30-50% sebelum mulai kerja. Ini melindungi kamu dari klien yang menghilang.</p>

<h3>4. Deadline dan Milestone</h3>
<p>Tentukan tanggal pengiriman yang realistis dan konsekuensi jika terlambat (dari kedua pihak). Jika klien lambat memberikan materi/feedback, apakah deadline ikut mundur? Atur ini sejak awal.</p>

<h3>5. Hak Kekayaan Intelektual (HKI)</h3>
<p>Ini sering dilupakan. Pertanyaannya: siapa yang memiliki hasil kerja kamu?</p>
<ul>
  <li>Apakah hak cipta langsung berpindah ke klien setelah lunas?</li>
  <li>Apakah kamu boleh memajang hasil kerja di portfolio?</li>
  <li>Apakah kamu boleh menggunakan kembali elemen desain untuk proyek lain?</li>
</ul>
<p>Tentukan ini dengan jelas. Normalnya, hak cipta berpindah ke klien setelah pembayaran lunas.</p>

<h3>6. Ketentuan Revisi</h3>
<p>Berapa putaran revisi yang termasuk dalam harga? Apa yang dihitung sebagai "revisi minor" vs "perubahan besar"? Bagaimana mekanisme request revisi (via email? Google Doc?)? Semua ini harus tertulis.</p>

<h3>7. Klausul Penghentian Kontrak</h3>
<p>Bagaimana jika proyek dibatalkan di tengah jalan? Tentukan:</p>
<ul>
  <li>Pembayaran proporsional berdasarkan pekerjaan yang sudah selesai</li>
  <li>Berapa lama notifikasi sebelum bisa membatalkan kontrak</li>
  <li>Siapa yang memiliki pekerjaan yang sudah diselesaikan jika kontrak batal</li>
</ul>

<h2>Tips Negosiasi Kontrak dengan Klien</h2>
<ul>
  <li><strong>Jangan minta maaf karena punya kontrak.</strong> Klien yang profesional justru akan menghargai ini.</li>
  <li><strong>Kirim kontrak sebelum mulai kerja,</strong> bukan setelahnya.</li>
  <li><strong>Bacakan poin-poin penting bersama klien</strong> agar tidak ada yang mengklaim "tidak tahu".</li>
  <li><strong>Simpan semua komunikasi tertulis</strong> — email, chat, adalah bukti yang sah.</li>
</ul>

<h2>Buat Kontrak Freelancemu Sekarang</h2>
<p>Tidak perlu hiring pengacara untuk punya kontrak yang profesional. LegalKan menyediakan kontrak freelance yang mencakup semua klausul penting, sesuai hukum Indonesia, dan siap pakai dalam 5 menit.</p>
<p>👉 <a href="/buat/freelancer">Buat Kontrak Freelance di LegalKan</a> — profesional, legal, dan klien pun lebih percaya.</p>
    `,
  },
  {
    slug: "surat-perjanjian-hutang-piutang-antar-individu",
    title: "Surat Perjanjian Hutang Piutang Antar Teman — Cara Buat yang Sah",
    excerpt:
      "Minjemin uang ke teman atau saudara tanpa surat itu berani banget. Karena kalau nanti bermasalah, kamu tidak punya bukti hukum apapun. Ini cara buat surat hutang piutang yang sah.",
    category: "Hukum Dasar",
    date: "2026-03-22",
    readTime: 6,
    relatedContract: "/buat/hutang-piutang",
    metaDescription:
      "Cara buat surat perjanjian hutang piutang yang sah secara hukum. Apa yang harus ada, apakah perlu notaris, dan bagaimana melindungi diri saat meminjamkan uang ke teman.",
    content: `
<h2>Mengapa Hutang ke Teman Sering Berakhir Masalah?</h2>
<p>Kita semua tahu ceritanya. Seorang teman minta pinjam uang dengan janji "paling lama 3 bulan balik." Enam bulan berlalu, tagihan diabaikan. Setahun kemudian, kalian mulai saling menghindari.</p>
<p>Bukan karena temanmu orang jahat — mungkin dia memang berniat bayar, tapi karena tidak ada komitmen tertulis, mudah sekali untuk terus menunda. Dan kamu? Tidak punya dasar hukum untuk menagih secara formal.</p>
<p>Ironisnya, justru karena yang kita pinjami adalah orang dekat, kita sering enggan membuat surat. Padahal <strong>surat perjanjian bukan soal tidak percaya</strong> — ini soal melindungi hubungan kalian agar uang tidak merusak persahabatan.</p>

<h2>Apa yang Membuat Surat Hutang Piutang Sah Secara Hukum?</h2>
<p>Berdasarkan Pasal 1313 KUHPerdata, suatu perjanjian adalah sah jika memenuhi syarat:</p>
<ul>
  <li><strong>Kesepakatan</strong> kedua belah pihak</li>
  <li><strong>Kecakapan</strong> (keduanya sudah dewasa dan tidak dalam perwalian)</li>
  <li><strong>Hal tertentu</strong> (objek yang jelas — jumlah uang)</li>
  <li><strong>Sebab yang halal</strong> (bukan untuk tujuan melanggar hukum)</li>
</ul>
<p>Surat perjanjian tertulis bukan syarat mutlak sahnya perjanjian (bisa lisan), tapi surat tertulis adalah <strong>bukti yang jauh lebih kuat</strong> jika terjadi sengketa.</p>

<h2>Apa yang Harus Ada dalam Surat Hutang Piutang?</h2>

<h3>Informasi Dasar</h3>
<ul>
  <li>Tanggal dan tempat pembuatan perjanjian</li>
  <li>Nama lengkap dan NIK pemberi pinjaman (kreditur)</li>
  <li>Nama lengkap dan NIK peminjam (debitur)</li>
  <li>Alamat masing-masing pihak</li>
</ul>

<h3>Klausul Pokok Pinjaman</h3>
<ul>
  <li>Jumlah uang yang dipinjam (angka dan huruf)</li>
  <li>Tanggal uang diberikan</li>
  <li>Cara penyerahan uang (tunai, transfer — cantumkan nomor rekening dan bukti transfer)</li>
</ul>

<h3>Klausul Bunga (Jika Ada)</h3>
<p>Boleh saja mengenakan bunga, tapi harus disepakati sejak awal dan dicantumkan secara jelas. Berapa persen per bulan/tahun, dan apakah bunga berbunga (compound) atau tidak. Tanpa klausul ini, perjanjian dianggap tanpa bunga.</p>

<h3>Jangka Waktu dan Cara Pelunasan</h3>
<ul>
  <li>Kapan pinjaman harus dilunasi (tanggal spesifik)</li>
  <li>Apakah bisa dicicil? Berapa besar cicilan per bulan?</li>
  <li>Tanggal jatuh tempo cicilan</li>
  <li>Konsekuensi keterlambatan (denda, percepatan jatuh tempo, dll.)</li>
</ul>

<h3>Jaminan (Opsional tapi Disarankan)</h3>
<p>Untuk pinjaman di atas Rp 5 juta, sebaiknya ada jaminan. Bisa berupa:</p>
<ul>
  <li>BPKB kendaraan</li>
  <li>Sertifikat tanah (aslinya tidak perlu diserahkan, cukup fotokopi)</li>
  <li>Barang berharga lainnya</li>
</ul>

<h3>Klausul Wanprestasi dan Penyelesaian Sengketa</h3>
<p>Apa yang terjadi jika peminjam gagal bayar? Apakah seluruh sisa pinjaman langsung jatuh tempo? Bagaimana cara penyelesaiannya — musyawarah dulu, atau langsung ke pengadilan?</p>

<h2>Apakah Perlu ke Notaris?</h2>
<p>Tidak wajib, tapi ada manfaatnya. Perjanjian di bawah tangan (tanpa notaris) tetap <strong>sah dan mengikat</strong> secara hukum, asalkan ditandatangani kedua pihak dan ada saksi.</p>
<p>Ke notaris disarankan jika:</p>
<ul>
  <li>Jumlah pinjaman besar (di atas Rp 50 juta)</li>
  <li>Ada aset sebagai jaminan yang perlu dieksekusi jika wanprestasi</li>
  <li>Salah satu pihak tinggal di luar kota atau luar negeri</li>
</ul>
<p>Untuk pinjaman antar individu dengan nilai wajar, surat di bawah tangan yang ditandatangani dengan 2 saksi sudah sangat cukup.</p>

<h2>Tips Agar Pinjaman Terlunasi dengan Baik</h2>
<ul>
  <li>Selalu bayar via transfer agar ada jejak digital</li>
  <li>Kirim tagihan lewat WhatsApp seminggu sebelum jatuh tempo — bukan untuk menekan, tapi sebagai pengingat</li>
  <li>Jika ada keterlambatan, diskusikan segera dan buat addendum kesepakatan baru</li>
</ul>

<h2>Buat Surat Hutang Piutangmu Sekarang</h2>
<p>LegalKan menyediakan template surat perjanjian hutang piutang yang lengkap, mengacu pada KUHPerdata, dan bisa dikustomisasi sesuai kesepakatan kamu.</p>
<p>👉 <a href="/buat/hutang-piutang">Buat Surat Perjanjian Hutang Piutang di LegalKan</a> — mulai Rp 19.000, selesai 5 menit.</p>
    `,
  },
  {
    slug: "apa-itu-nda-perjanjian-kerahasiaan",
    title: "Apa Itu NDA? Panduan Non-Disclosure Agreement untuk Bisnis Indonesia",
    excerpt:
      "NDA atau perjanjian kerahasiaan sering muncul di dunia bisnis, tapi banyak yang tidak tahu kapan harus pakai dan apa saja yang perlu ada. Ini panduan lengkapnya untuk konteks Indonesia.",
    category: "Hukum Dasar",
    date: "2026-03-15",
    readTime: 7,
    relatedContract: "/buat/nda",
    metaDescription:
      "Apa itu NDA (Non-Disclosure Agreement) dan kapan dibutuhkan bisnis Indonesia? Jenis NDA, klausul penting, apakah NDA wajib, dan cara buat NDA bilateral di LegalKan.",
    content: `
<h2>Apa Itu NDA?</h2>
<p>NDA (Non-Disclosure Agreement), atau dalam bahasa Indonesia sering disebut Perjanjian Kerahasiaan, adalah kontrak hukum yang mengatur agar informasi rahasia yang dibagikan antara dua pihak tidak bocor ke pihak ketiga.</p>
<p>Intinya sederhana: "Kamu boleh tahu rahasia bisnisku, tapi jangan cerita ke siapa-siapa." Dan ini diperkuat dengan konsekuensi hukum jika dilanggar.</p>
<p>NDA lazim digunakan sebelum:</p>
<ul>
  <li>Diskusi merger atau akuisisi</li>
  <li>Onboarding karyawan atau kontraktor yang akan akses data sensitif</li>
  <li>Presentasi pitch deck kepada investor</li>
  <li>Kerjasama bisnis dengan vendor atau mitra yang akan tahu detail internal</li>
  <li>Pengembangan produk bersama</li>
</ul>

<h2>Jenis NDA: Unilateral vs Bilateral</h2>

<h3>NDA Unilateral (Satu Arah)</h3>
<p>Hanya satu pihak yang berbagi informasi rahasia, dan hanya pihak penerima yang terikat kewajiban kerahasiaan. Contoh: startup yang meminta investor untuk tanda tangan NDA sebelum melihat pitch deck.</p>

<h3>NDA Bilateral (Dua Arah / Mutual NDA)</h3>
<p>Kedua pihak saling berbagi informasi rahasia, dan keduanya terikat kewajiban kerahasiaan. Contoh: dua perusahaan yang membahas kemungkinan kerjasama dan masing-masing berbagi data bisnis mereka.</p>
<p>NDA bilateral lebih umum dalam konteks B2B karena lebih adil — tidak ada pihak yang merasa diuntungkan sepihak.</p>

<h2>Klausul Penting yang Harus Ada dalam NDA</h2>

<h3>1. Definisi "Informasi Rahasia"</h3>
<p>Ini klausul paling kritis. Apa yang dimaksud dengan "informasi rahasia" harus didefinisikan dengan jelas. Apakah mencakup:</p>
<ul>
  <li>Data keuangan perusahaan?</li>
  <li>Daftar klien dan supplier?</li>
  <li>Kode sumber (source code) produk?</li>
  <li>Strategi bisnis dan roadmap produk?</li>
  <li>Formula atau resep produk?</li>
</ul>
<p>Tanpa definisi yang jelas, sulit untuk membuktikan pelanggaran.</p>

<h3>2. Pengecualian Informasi Rahasia</h3>
<p>Biasanya ada pengecualian untuk informasi yang:</p>
<ul>
  <li>Sudah menjadi pengetahuan umum/publik</li>
  <li>Sudah diketahui penerima sebelum penandatanganan NDA</li>
  <li>Diperoleh dari pihak ketiga secara legal</li>
  <li>Harus diungkapkan karena kewajiban hukum (misalnya perintah pengadilan)</li>
</ul>

<h3>3. Jangka Waktu Kerahasiaan</h3>
<p>NDA tidak bisa berlaku selamanya (setidaknya tidak efektif secara praktis). Tentukan berapa lama kewajiban kerahasiaan berlaku — biasanya 2-5 tahun. Untuk rahasia dagang (trade secret), bisa lebih lama.</p>

<h3>4. Kewajiban Para Pihak</h3>
<p>Apa yang boleh dan tidak boleh dilakukan dengan informasi rahasia tersebut? Apakah bisa dibagikan ke karyawan atau tim internal? Dengan batasan apa?</p>

<h3>5. Konsekuensi Pelanggaran</h3>
<p>Klausul ini yang memberi "gigi" pada NDA. Jika dilanggar, apa konsekuensinya? Ganti rugi? Besarannya berapa? Atau penghentian kerjasama?</p>

<h3>6. Pilihan Hukum dan Penyelesaian Sengketa</h3>
<p>Hukum negara mana yang berlaku? Pengadilan mana yang berwenang? Untuk bisnis Indonesia, biasanya menggunakan hukum Indonesia dan Pengadilan Negeri Jakarta Selatan atau tempat domisili pihak tergugat.</p>

<h2>Apakah NDA Wajib di Indonesia?</h2>
<p>Tidak ada kewajiban hukum yang mewajibkan pembuatan NDA. Tapi tanpa NDA, kamu hanya bisa mengandalkan kewajiban kerahasiaan umum yang diatur dalam KUHPerdata dan UU ITE — yang jauh lebih sulit dibuktikan dan ditegakkan.</p>
<p>Dengan NDA yang jelas, kamu punya dasar hukum yang spesifik dan konkret untuk menuntut ganti rugi jika terjadi kebocoran informasi.</p>

<h2>Kapan Sebaiknya Kamu Pakai NDA?</h2>
<p>Aturan sederhananya: jika kamu akan berbagi informasi yang bisa merugikan bisnismu jika tersebar, gunakan NDA. Lebih baik terlalu berhati-hati daripada menyesal kemudian.</p>
<p>Tapi jangan jadikan NDA sebagai pengganti penilaian karakter mitra. NDA adalah jaring pengaman hukum, bukan alat untuk memaksakan kepercayaan.</p>

<h2>Buat NDA Bilateral untuk Bisnismu</h2>
<p>LegalKan menyediakan template NDA bilateral yang komprehensif, sesuai hukum Indonesia, dan bisa dikustomisasi dalam hitungan menit.</p>
<p>👉 <a href="/buat/nda">Buat NDA Bilateral di LegalKan</a> — legal, profesional, dan langsung dapat PDF.</p>
    `,
  },
  {
    slug: "perjanjian-bagi-hasil-usaha-umkm",
    title: "Perjanjian Bagi Hasil Usaha — Cara Atur Kerjasama Bisnis yang Adil",
    excerpt:
      "Banyak kerjasama bisnis yang hancur bukan karena bisnisnya gagal, tapi karena tidak ada aturan jelas soal bagi hasilnya. Ini cara membuat perjanjian bagi hasil yang adil dan mengikat.",
    category: "KUR & UMKM",
    date: "2026-03-08",
    readTime: 7,
    relatedContract: "/buat/bagi-hasil",
    metaDescription:
      "Cara buat perjanjian bagi hasil usaha yang adil dan sah: apa yang harus diatur, perbedaan bagi hasil vs saham, dan tips atur pembagian yang fair untuk UMKM Indonesia.",
    content: `
<h2>Kenapa Banyak Kerjasama Bisnis Berakhir Sengketa?</h2>
<p>Dua orang sahabat memulai usaha bersama dengan semangat yang menggebu. Satu pihak menginvestasikan modal, satu pihak menjalankan operasional. Awalnya semua berjalan lancar.</p>
<p>Tapi enam bulan kemudian, mulai muncul pertanyaan: siapa yang berhak mengambil keputusan pembelian? Berapa persen keuntungan yang menjadi hak masing-masing? Bagaimana jika salah satu ingin keluar? Karena tidak ada perjanjian tertulis, pertanyaan-pertanyaan ini berubah jadi debat, lalu pertengkaran, lalu akhir dari persahabatan dan bisnis.</p>
<p>Bukan karena orangnya jahat. Tapi karena aturan mainnya tidak pernah dituliskan.</p>

<h2>Apa yang Harus Diatur dalam Perjanjian Bagi Hasil?</h2>

<h3>1. Modal Awal dan Kontribusi Masing-Masing Pihak</h3>
<p>Kontribusi tidak harus selalu uang. Bisa berupa:</p>
<ul>
  <li>Modal uang tunai</li>
  <li>Aset (kendaraan, peralatan, properti)</li>
  <li>Keahlian atau tenaga kerja (sweat equity)</li>
  <li>Jaringan atau relasi bisnis</li>
</ul>
<p>Semua kontribusi harus dinilai dan disepakati nilainya di awal. Ini yang menentukan porsi kepemilikan masing-masing pihak.</p>

<h3>2. Porsi Bagi Hasil</h3>
<p>Ini inti dari perjanjian. Berapa persen keuntungan bersih untuk masing-masing pihak? Apakah porsi ini tetap atau bisa berubah seiring waktu?</p>
<p>Penting: tentukan apakah bagi hasil diambil dari <strong>keuntungan bersih</strong> (setelah semua biaya operasional) atau dari <strong>pendapatan kotor</strong>. Ini bisa membuat perbedaan yang sangat signifikan.</p>

<h3>3. Mekanisme Pelaporan Keuangan</h3>
<p>Kapan laporan keuangan dibuat dan dibagikan? Bulanan? Kuartalan? Siapa yang bertanggung jawab membuatnya? Apakah ada akuntan atau software akuntansi yang digunakan?</p>
<p>Tanpa transparansi keuangan, mudah sekali bagi satu pihak untuk merasa dicurangi — meskipun kenyataannya tidak ada kecurangan.</p>

<h3>4. Pengambilan Keputusan</h3>
<p>Siapa yang berhak membuat keputusan operasional sehari-hari? Keputusan besar apa yang membutuhkan persetujuan semua pihak? Bagaimana jika ada kebuntuan (deadlock) dalam pengambilan keputusan?</p>
<p>Contoh: pembelian peralatan di bawah Rp 5 juta bisa diputuskan satu pihak, tapi di atas itu perlu persetujuan bersama.</p>

<h3>5. Gaji atau Kompensasi Pihak yang Menjalankan Operasional</h3>
<p>Jika salah satu mitra aktif menjalankan bisnis sehari-hari, apakah mereka mendapat gaji atau tunjangan operasional? Ini perlu dipisahkan dari bagi hasil supaya tidak ada konflik kepentingan.</p>

<h3>6. Mekanisme Keluar dari Kerjasama</h3>
<p>Ini yang paling sering dilupakan. Bagaimana jika salah satu pihak ingin keluar?</p>
<ul>
  <li>Berapa lama notifikasi yang diperlukan?</li>
  <li>Bagaimana nilai kontribusi dihitung saat exit?</li>
  <li>Apakah pihak lain punya hak pertama untuk membeli porsi yang dijual (right of first refusal)?</li>
  <li>Apa yang terjadi dengan aset bisnis jika kerjasama berakhir?</li>
</ul>

<h2>Bagi Hasil vs Saham — Apa Bedanya?</h2>
<p>Ini sering membingungkan. Perbedaan utamanya:</p>
<p><strong>Bagi Hasil (Profit Sharing)</strong>: Cocok untuk kerjasama yang lebih informal dan jangka pendek hingga menengah. Tidak ada badan hukum yang dibentuk. Kedua pihak berbagi keuntungan berdasarkan kesepakatan. Lebih fleksibel, tapi perlindungan hukumnya lebih lemah.</p>
<p><strong>Kepemilikan Saham</strong>: Membutuhkan pendirian badan hukum (PT atau CV). Setiap pemilik adalah pemegang saham dengan hak suara. Lebih formal, lebih terlindungi secara hukum, tapi prosesnya lebih panjang dan ada kewajiban administratif (laporan tahunan, rapat umum pemegang saham, dll.).</p>
<p>Untuk UMKM yang baru memulai kerjasama, perjanjian bagi hasil adalah pilihan yang lebih praktis. Tapi jika bisnis berkembang signifikan, pertimbangkan untuk membentuk badan hukum.</p>

<h2>Tips Atur Pembagian yang Fair</h2>
<ul>
  <li><strong>Hitung berdasarkan kontribusi nyata, bukan "keadilan" abstrak.</strong> Jika satu pihak modal 70% dan satu pihak kerja penuh waktu, porsi 50/50 mungkin tidak adil untuk keduanya.</li>
  <li><strong>Evaluasi ulang setiap tahun.</strong> Kontribusi bisa berubah seiring waktu — pastikan ada mekanisme review berkala.</li>
  <li><strong>Pisahkan modal dari keuntungan.</strong> Modal yang diinvestasikan harus dikembalikan dulu sebelum keuntungan dibagi — ini menghindari ketidakadilan jika bisnis baru mulai untung.</li>
</ul>

<h2>Buat Perjanjian Bagi Hasil yang Adil</h2>
<p>LegalKan menyediakan template perjanjian bagi hasil usaha yang komprehensif, mencakup semua poin penting di atas, dan bisa dikustomisasi sesuai kesepakatan kamu dan mitramu.</p>
<p>👉 <a href="/buat/bagi-hasil">Buat Perjanjian Bagi Hasil di LegalKan</a> — mulai dari Rp 29.000, selesai dalam 5 menit.</p>
    `,
  },
  {
    slug: "bank-penyalur-kur-terbaik-umkm",
    title: "Bank Penyalur KUR Terbaik untuk UMKM — BRI, BNI, Mandiri, atau BSI?",
    excerpt:
      "Ada belasan bank penyalur KUR di Indonesia, tapi BRI, BNI, Mandiri, dan BSI adalah yang paling banyak dipakai UMKM. Mana yang paling cocok untuk jenis usahamu?",
    category: "KUR & UMKM",
    date: "2026-03-01",
    readTime: 8,
    relatedContract: "/kur/wizard",
    metaDescription:
      "Perbandingan bank penyalur KUR terbaik: BRI vs BNI vs Mandiri vs BSI. Mana yang cocok untuk UMKM, pertanian, atau usaha syariah? Tips tingkatkan peluang approval KUR.",
    content: `
<h2>Program KUR 2024: Gambaran Umum</h2>
<p>Program KUR (Kredit Usaha Rakyat) 2024 kembali hadir dengan total alokasi dana yang signifikan dari pemerintah. Dengan bunga hanya 6% per tahun — jauh di bawah rata-rata kredit komersial yang bisa mencapai 12-24% — KUR menjadi salah satu instrumen pembiayaan terbaik untuk UMKM.</p>
<p>Ada tiga jenis KUR yang tersedia:</p>
<ul>
  <li><strong>KUR Mikro</strong>: sampai Rp 100 juta, tanpa agunan</li>
  <li><strong>KUR Kecil</strong>: Rp 100 juta – Rp 500 juta, perlu agunan</li>
  <li><strong>KUR Menengah</strong>: Rp 500 juta – Rp 10 miliar, persyaratan lebih ketat</li>
</ul>
<p>Kunci suksesnya bukan hanya bisnis yang bagus, tapi juga memilih bank yang tepat sesuai profil usahamu.</p>

<h2>Bank BRI — Raja KUR Mikro</h2>
<p>BRI adalah bank dengan jaringan penyaluran KUR terluas di Indonesia, terutama untuk segmen mikro dan pedesaan. Ini keunggulan BRI:</p>
<ul>
  <li><strong>Jaringan terluas</strong>: BRI Unit tersebar sampai ke kecamatan terpencil</li>
  <li><strong>Proses lebih cepat</strong>: Untuk KUR Mikro, keputusan bisa dalam 1-3 hari</li>
  <li><strong>Pengalaman terpanjang</strong> dalam penyaluran KUR</li>
  <li><strong>Program BRILink</strong>: Bisa apply KUR via agen BRILink terdekat</li>
</ul>
<p><strong>Cocok untuk</strong>: Pedagang pasar, warung, usaha pertanian, dan UMKM di daerah yang membutuhkan layanan tatap muka.</p>
<p><strong>Kekurangannya</strong>: Antrian pengajuan bisa panjang karena popularitasnya. Proses pengajuan yang lebih standar, kurang fleksibel untuk usaha unik.</p>

<h2>Bank BNI — Pilihan untuk Usaha yang Lebih Formal</h2>
<p>BNI dikenal dengan layanan KUR yang lebih berorientasi pada usaha yang sudah memiliki legalitas formal. Keunggulan BNI:</p>
<ul>
  <li><strong>Layanan digital yang baik</strong>: Bisa apply via BNI Mobile Banking</li>
  <li><strong>Cocok untuk KUR Kecil dan Menengah</strong> karena officer-nya terbiasa dengan analisa bisnis yang lebih kompleks</li>
  <li><strong>Program BNI UMKM</strong>: Ada mentoring dan pelatihan bisnis</li>
  <li><strong>Jaringan internasional</strong>: Cocok untuk UMKM yang sudah ekspor</li>
</ul>
<p><strong>Cocok untuk</strong>: Usaha manufaktur skala kecil, eksportir UMKM, dan bisnis dengan pembukuan yang sudah rapi.</p>
<p><strong>Kekurangannya</strong>: Persyaratan cenderung lebih ketat, kurang cocok untuk usaha yang baru mulai atau masih informal.</p>

<h2>Bank Mandiri — Untuk Usaha dengan Relasi Korporat</h2>
<p>Bank Mandiri punya program KUR yang menarik terutama untuk UMKM yang berada dalam ekosistem bisnis korporat (supplier/vendor perusahaan besar). Keunggulan Mandiri:</p>
<ul>
  <li><strong>KUR Linkage</strong>: Program khusus untuk UMKM yang menjadi mitra/vendor perusahaan Mandiri</li>
  <li><strong>Layanan digital terdepan</strong>: Livin by Mandiri memudahkan monitoring pinjaman</li>
  <li><strong>Plafon lebih tinggi</strong>: Lebih agresif di segmen KUR Kecil dan Menengah</li>
  <li><strong>Koneksi supply chain</strong>: Jika usahamu adalah supplier perusahaan, Mandiri punya program khusus</li>
</ul>
<p><strong>Cocok untuk</strong>: UMKM supplier perusahaan besar, usaha kuliner yang sudah punya lebih dari satu outlet, atau bisnis yang berkembang pesat dan butuh modal lebih besar.</p>

<h2>BSI (Bank Syariah Indonesia) — Untuk yang Ingin Pembiayaan Syariah</h2>
<p>BSI menyalurkan KUR dengan skema syariah menggunakan akad murabahah atau musyarakah. Keunggulan BSI:</p>
<ul>
  <li><strong>Prinsip syariah</strong>: Tanpa riba, cocok untuk pengusaha yang ingin sesuai prinsip Islam</li>
  <li><strong>Jaringan luas</strong>: BSI hasil merger Bank Syariah Mandiri, BNI Syariah, dan BRI Syariah</li>
  <li><strong>Program khusus</strong>: KUR untuk pesantren dan usaha halal</li>
  <li><strong>Fleksibel</strong>: Ada skema untuk berbagai jenis usaha</li>
</ul>
<p><strong>Cocok untuk</strong>: Pengusaha Muslim yang mengutamakan prinsip syariah, usaha berbasis pesantren, dan bisnis di sektor halal economy.</p>

<h2>Tips Tingkatkan Peluang Approval KUR</h2>
<ul>
  <li><strong>Jadilah nasabah bank tersebut terlebih dahulu.</strong> Memiliki rekening tabungan aktif minimal 6 bulan meningkatkan kepercayaan bank secara signifikan.</li>
  <li><strong>Rapikan laporan keuangan.</strong> Minimal catatan pemasukan dan pengeluaran bulanan selama 6 bulan terakhir.</li>
  <li><strong>Pastikan tidak ada kredit macet.</strong> Cek BI Checking / SLIK OJK kamu sebelum apply.</li>
  <li><strong>Siapkan dokumen lengkap.</strong> NIB, NPWP, KTP, KK, dan rekening koran siap semua.</li>
  <li><strong>Mulai dari plafon yang wajar.</strong> Jangan langsung minta plafon maksimal jika baru pertama apply. Bangun rekam jejak kredit yang baik dulu.</li>
</ul>

<h2>Siap Apply KUR? Mulai dari Sini</h2>
<p>Sebelum ke bank, pastikan semua dokumenmu sudah lengkap. LegalKan bisa membantu kamu menyiapkan dokumen legal yang dibutuhkan untuk pengajuan KUR — dari NIB sampai surat keterangan usaha.</p>
<p>👉 <a href="/kur/wizard">Cek Rekomendasi Bank + Siapkan Dokumen KUR di LegalKan</a> — gratis, langsung tahu bank mana yang paling cocok untuk usahamu.</p>
    `,
  },
  {
    slug: "perjanjian-konsinyasi-titip-jual-umkm",
    title: "Perjanjian Konsinyasi (Titip Jual) — Panduan untuk UMKM Indonesia",
    excerpt:
      "Konsinyasi atau titip jual adalah model bisnis yang populer di kalangan UMKM — tapi banyak yang melakukannya tanpa perjanjian tertulis. Ini cara atur konsinyasi yang aman untuk kedua pihak.",
    category: "KUR & UMKM",
    date: "2026-02-22",
    readTime: 7,
    relatedContract: "/buat/konsinyasi",
    metaDescription:
      "Panduan perjanjian konsinyasi (titip jual) untuk UMKM Indonesia: apa itu konsinyasi, keuntungan dan risiko, klausul penting dalam perjanjian, dan cara buat di LegalKan.",
    content: `
<h2>Apa Itu Konsinyasi dan Bedanya dengan Jual Beli Biasa?</h2>
<p>Konsinyasi adalah model bisnis di mana produsen atau pemasok (<em>consignor</em>) menitipkan barang kepada penjual (<em>consignee</em>) untuk dijual. Barang tetap menjadi milik pemasok sampai terjual, dan penjual mendapat komisi dari setiap penjualan.</p>
<p>Bedanya dengan jual beli biasa:</p>
<ul>
  <li><strong>Jual beli biasa</strong>: Penjual membeli barang, kepemilikan berpindah. Risiko barang tidak laku ditanggung penjual.</li>
  <li><strong>Konsinyasi</strong>: Penjual tidak membeli barang. Kepemilikan tetap di pemasok. Risiko barang tidak laku ditanggung pemasok (barang bisa diretur).</li>
</ul>
<p>Konsinyasi populer di kalangan UMKM karena penjual tidak perlu modal untuk beli stok, dan pemasok bisa memperluas distribusi tanpa membangun toko sendiri. Tapi tanpa perjanjian yang jelas, ini bisa bermasalah.</p>

<h2>Keuntungan dan Risiko Konsinyasi</h2>

<h3>Untuk Pemasok (yang Menitipkan Barang)</h3>
<p><strong>Keuntungan:</strong></p>
<ul>
  <li>Memperluas jangkauan distribusi tanpa biaya sewa toko</li>
  <li>Bisa test market di berbagai lokasi</li>
  <li>Barang yang tidak laku bisa ditarik kembali</li>
</ul>
<p><strong>Risiko:</strong></p>
<ul>
  <li>Barang rusak di tangan penjual</li>
  <li>Penjual tidak membayar hasil penjualan (atau lambat membayar)</li>
  <li>Barang hilang tanpa pertanggungjawaban yang jelas</li>

</ul>

<h3>Untuk Penjual (yang Menerima Titipan)</h3>
<p><strong>Keuntungan:</strong></p>
<ul>
  <li>Tidak perlu modal besar untuk stok barang</li>
  <li>Variasi produk yang lebih banyak tanpa risiko kerugian modal</li>
  <li>Pendapatan dari komisi penjualan</li>
</ul>
<p><strong>Risiko:</strong></p>
<ul>
  <li>Dituntut ganti rugi jika barang rusak atau hilang</li>
  <li>Ruang toko terpakai untuk barang yang mungkin tidak laku</li>
  <li>Pemasok bisa menarik barang kapan saja jika tidak ada perjanjian yang mengatur</li>
</ul>

<h2>Klausul Penting dalam Perjanjian Konsinyasi</h2>

<h3>1. Deskripsi Barang yang Dititipkan</h3>
<p>Daftar barang harus spesifik: nama produk, kode SKU (jika ada), jumlah, kondisi, dan harga per item. Lampirkan daftar ini sebagai bagian dari perjanjian. Ini juga berfungsi sebagai berita acara serah terima.</p>

<h3>2. Struktur Komisi</h3>
<p>Berapa persen komisi untuk penjual dari setiap item yang terjual? Apakah komisi dihitung dari harga jual (yang ditentukan siapa?) atau dari harga pokok?</p>
<p>Contoh: "Penjual mendapat komisi 25% dari harga jual yang disepakati. Harga jual minimum ditetapkan oleh pemasok."</p>

<h3>3. Laporan Penjualan</h3>
<p>Seberapa sering penjual harus melaporkan penjualan? Mingguan? Bulanan? Dalam format apa? Siapa yang memverifikasi laporan?</p>
<p>Ini krusial untuk menghindari selisih paham soal berapa item yang sudah terjual dan berapa yang belum.</p>

<h3>4. Jadwal Pembayaran</h3>
<p>Kapan penjual harus membayarkan hasil penjualan ke pemasok? Setelah setiap transaksi? Sebulan sekali? Bagaimana jika ada hutang?</p>

<h3>5. Ketentuan Retur Barang</h3>
<p>Kapan dan bagaimana barang yang tidak terjual bisa dikembalikan? Siapa yang menanggung biaya pengiriman retur? Berapa lama tenggat waktu penjualan sebelum barang diretur?</p>

<h3>6. Tanggung Jawab Atas Kerusakan</h3>
<p>Ini sering jadi sumber sengketa. Siapa yang bertanggung jawab jika:</p>
<ul>
  <li>Barang rusak saat di tangan penjual?</li>
  <li>Barang hilang (dicuri, tertukar)?</li>
  <li>Barang rusak akibat penyimpanan yang tidak tepat?</li>
</ul>
<p>Umumnya, risiko kerusakan di tangan penjual menjadi tanggung jawab penjual. Tapi ini harus ditulis jelas.</p>

<h3>7. Hak Pemasok untuk Audit Stok</h3>
<p>Apakah pemasok berhak melakukan pengecekan stok sewaktu-waktu? Dengan notifikasi berapa lama sebelumnya?</p>

<h2>Kasus Konsinyasi yang Sering Bermasalah</h2>
<p>Cerita nyata (dengan nama disamarkan): Ibu Sari menitipkan 100 produk kecantikan ke toko kelontong Bu Dewi. Tidak ada perjanjian tertulis. Tiga bulan kemudian, 60 produk sudah terjual tapi Bu Dewi belum membayar dengan alasan "belum ada uang." 40 produk yang tersisa kondisinya rusak terkena panas. Ibu Sari tidak bisa berbuat banyak karena tidak ada bukti tertulis soal nilai barang, tanggal penitipan, atau kewajiban pembayaran.</p>
<p>Dengan perjanjian konsinyasi yang jelas, situasi ini bisa dihindari — atau setidaknya ada dasar hukum untuk menuntut ganti rugi.</p>

<h2>Buat Perjanjian Konsinyasi di LegalKan</h2>
<p>LegalKan menyediakan template perjanjian konsinyasi yang lengkap, mencakup semua klausul penting di atas, dan bisa dikustomisasi sesuai kebutuhan bisnismu.</p>
<p>👉 <a href="/buat/konsinyasi">Buat Perjanjian Konsinyasi di LegalKan</a> — aman, legal, dan selesai dalam hitungan menit.</p>
    `,
  },
  {
    slug: "kesalahan-hukum-umum-umkm-indonesia",
    title: "5 Kesalahan Hukum yang Sering Dilakukan UMKM Indonesia (dan Cara Hindarinya)",
    excerpt:
      "Banyak UMKM baru sadar punya masalah hukum saat sudah terlambat. Ini 5 kesalahan legal paling umum yang dilakukan pelaku usaha kecil — dan cara menghindarinya sebelum jadi bencana.",
    category: "Tips Legal",
    date: "2026-02-15",
    readTime: 8,
    relatedContract: "/",
    metaDescription:
      "5 kesalahan hukum umum UMKM Indonesia: tanpa kontrak, tanpa NIB, masalah bagi hasil, hak karyawan, dan backup dokumen. Cara legal-kan usahamu dari sekarang.",
    content: `
<h2>Masalah Hukum Tidak Menunggu Bisnis Kamu Besar</h2>
<p>Ada mitos yang beredar di kalangan pengusaha kecil: "Urusan hukum itu nanti-nanti dulu, yang penting bisnis jalan." Sayangnya, masalah hukum tidak menunggu bisnismu siap. Dan ketika datang, biayanya bisa jauh lebih mahal dari biaya pencegahan.</p>
<p>Berikut 5 kesalahan hukum paling umum yang dilakukan UMKM Indonesia — dan yang lebih penting, cara menghindarinya.</p>

<h2>Kesalahan #1: Tidak Punya Kontrak Tertulis</h2>
<p>Ini kesalahan nomor satu. Banyak pengusaha mengandalkan kesepakatan lisan dengan klien, supplier, atau mitra bisnis karena dianggap lebih praktis dan "tanda percaya."</p>
<p>Masalahnya: ingatan manusia tidak sempurna, dan interpretasi "kesepakatan" bisa sangat berbeda di kemudian hari. Tanpa kontrak tertulis, tidak ada dasar hukum yang jelas untuk menagih pembayaran, menuntut ganti rugi, atau mempertahankan hak kamu.</p>
<p><strong>Cara hindarinya:</strong> Biasakan membuat kontrak tertulis untuk setiap transaksi bisnis yang signifikan — tidak peduli seberapa dekat hubungan kamu dengan pihak lain. Kontrak bukan soal tidak percaya, tapi soal kejelasan.</p>

<h2>Kesalahan #2: Operasi Tanpa NIB atau Legalitas Usaha</h2>
<p>Masih banyak UMKM yang beroperasi tanpa Nomor Induk Berusaha (NIB). Dampaknya:</p>
<ul>
  <li>Tidak bisa apply KUR atau pinjaman bank lainnya</li>
  <li>Tidak bisa ikut tender atau jadi vendor perusahaan besar</li>
  <li>Tidak dilindungi program bantuan pemerintah untuk UMKM</li>
  <li>Berisiko terkena penertiban atau penutupan usaha</li>
  <li>Sulit membuka rekening usaha terpisah</li>
</ul>
<p><strong>Cara hindarinya:</strong> Daftar NIB sekarang di oss.go.id — gratis, online, dan bisa selesai dalam 15 menit. Tidak ada alasan untuk menunda lagi. Setelah punya NIB, kamu sudah punya identitas hukum sebagai pelaku usaha.</p>

<h2>Kesalahan #3: Tidak Mengatur Pembagian Keuntungan dengan Mitra</h2>
<p>Kerjasama bisnis sering dimulai dengan semangat yang tinggi dan kepercayaan penuh. Tapi ketika uang mulai mengalir, muncul pertanyaan-pertanyaan yang tidak pernah didiskusikan sebelumnya:</p>
<ul>
  <li>Berapa persen keuntungan yang jadi hak masing-masing?</li>
  <li>Apakah "mitra yang kerja" berhak dapat lebih dari "mitra yang modal saja"?</li>
  <li>Siapa yang menanggung kerugian jika bisnis merugi?</li>
</ul>
<p>Tanpa perjanjian bagi hasil yang tertulis, pertanyaan-pertanyaan ini berpotensi menjadi sumber konflik besar.</p>
<p><strong>Cara hindarinya:</strong> Sebelum memulai bisnis bersama, duduk bersama dan buat perjanjian bagi hasil yang mengatur pembagian keuntungan, peran masing-masing, mekanisme pengambilan keputusan, dan bagaimana prosedur jika salah satu pihak ingin keluar.</p>

<h2>Kesalahan #4: Tidak Tahu Hak dan Kewajiban terhadap Karyawan</h2>
<p>Ketika bisnis sudah mulai berkembang dan mulai merekrut karyawan, banyak pengusaha yang tidak menyadari kewajiban hukum mereka. Beberapa yang sering dilanggar:</p>
<ul>
  <li><strong>Upah di bawah UMR/UMK</strong> — ini pelanggaran serius yang bisa berujung sanksi</li>
  <li><strong>Tidak mendaftarkan karyawan ke BPJS Ketenagakerjaan dan Kesehatan</strong> — wajib secara hukum bahkan untuk satu karyawan</li>
  <li><strong>Tidak punya kontrak kerja tertulis</strong> — membuat kamu rentan klaim pesangon yang tidak terduga</li>
  <li><strong>Tidak membayar THR</strong> — kewajiban yang diatur UU Ketenagakerjaan</li>
  <li><strong>Menggunakan status "freelancer" untuk menghindari kewajiban karyawan</strong> — jika hubungannya sebenarnya adalah hubungan kerja, ini bisa dianggap pelanggaran hukum</li>
</ul>
<p><strong>Cara hindarinya:</strong> Pelajari UU No. 13 Tahun 2003 tentang Ketenagakerjaan (atau ringkasannya). Buat perjanjian kerja yang jelas, daftarkan karyawan ke BPJS, dan pastikan gaji sesuai UMR daerahmu.</p>

<h2>Kesalahan #5: Tidak Backup dan Arsipkan Dokumen Penting</h2>
<p>Ini terdengar sepele, tapi dampaknya bisa sangat besar. Banyak pengusaha yang kehilangan:</p>
<ul>
  <li>Bukti pembayaran dari klien</li>
  <li>Kontrak yang sudah ditandatangani</li>
  <li>Dokumen legalitas usaha</li>
  <li>Nota dan invoice transaksi</li>
</ul>
<p>Ketika terjadi sengketa atau audit, tidak adanya bukti bisa membalikkan posisi hukum kamu — bahkan jika kamu yang sebenarnya benar.</p>
<p><strong>Cara hindarinya:</strong></p>
<ul>
  <li>Scan dan simpan semua dokumen penting di cloud (Google Drive, Dropbox)</li>
  <li>Buat folder terpisah untuk setiap klien/mitra</li>
  <li>Gunakan software akuntansi untuk menyimpan bukti transaksi</li>
  <li>Simpan semua komunikasi penting via email atau pesan teks — bukan hanya panggilan telepon</li>
</ul>

<h2>Mulai Legal-Kan Usahamu Hari Ini</h2>
<p>Tidak perlu menunggu bisnis besar untuk mulai peduli dengan legalitas. Justru di awal inilah fondasi hukum yang kuat paling dibutuhkan — karena di sinilah kebiasaan terbentuk.</p>
<p>Lima langkah sederhana untuk mulai:</p>
<ol>
  <li>Daftar NIB di oss.go.id (gratis, 15 menit)</li>
  <li>Buat kontrak untuk setiap transaksi bisnis penting</li>
  <li>Buat perjanjian bagi hasil jika punya mitra</li>
  <li>Daftarkan karyawan ke BPJS (jika sudah punya)</li>
  <li>Arsipkan semua dokumen dengan rapi</li>
</ol>
<p>👉 <a href="/">Mulai Legal-Kan Usahamu di LegalKan</a> — 10 jenis kontrak legal, mulai Rp 19.000, selesai dalam 5 menit. Karena bisnis yang sehat butuh fondasi hukum yang kuat.</p>
    `,
  },
];

export const CATEGORIES = [
  "Semua",
  "KUR & UMKM",
  "Properti",
  "Freelancer",
  "Hukum Dasar",
  "Tips Legal",
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === post.category
  )
    .slice(0, limit)
    .concat(
      BLOG_POSTS.filter(
        (p) => p.slug !== slug && p.category !== post.category
      ).slice(0, Math.max(0, limit - BLOG_POSTS.filter(
        (p) => p.slug !== slug && p.category === post.category
      ).length))
    )
    .slice(0, limit);
}

export function getLatestPosts(limit = 3): BlogPost[] {
  return [...BLOG_POSTS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
