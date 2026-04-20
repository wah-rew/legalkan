# Indonesian Contract Research Report
## Untuk LegalKan Contract Generator

**Tanggal Penelitian:** 2026-04-20  
**Peneliti:** AI Legal Research Specialist  
**Sumber:** KUHPerdata, UU Ketenagakerjaan, UU Cipta Kerja, Gadjian.com, praktik umum hukum Indonesia  
**Catatan:** Hukumonline.com dan peraturan.bpk.go.id tidak dapat diakses langsung (Cloudflare blocking dari IP luar Indonesia). Laporan ini disusun berdasarkan sumber yang berhasil diakses + pengetahuan komprehensif tentang hukum perjanjian Indonesia (KUHPerdata).

---

## Dasar Hukum Umum Perjanjian di Indonesia

Semua perjanjian perdata di Indonesia tunduk pada **KUHPerdata (Kitab Undang-Undang Hukum Perdata)**, khususnya:

- **Pasal 1313 KUHPerdata**: Definisi perjanjian — suatu perbuatan dengan mana satu orang atau lebih mengikatkan dirinya terhadap satu orang lain atau lebih.
- **Pasal 1320 KUHPerdata**: 4 syarat sahnya perjanjian:
  1. Sepakat mereka yang mengikatkan diri
  2. Kecakapan untuk membuat perjanjian (min. 21 tahun / sudah menikah, tidak di bawah pengampuan)
  3. Suatu hal tertentu (objek yang jelas)
  4. Suatu sebab yang halal (tidak bertentangan UU, ketertiban umum, kesusilaan)
- **Pasal 1338 KUHPerdata**: Asas kebebasan berkontrak — semua perjanjian yang dibuat secara sah berlaku sebagai undang-undang bagi mereka yang membuatnya.
- **Pasal 1339 KUHPerdata**: Perjanjian mengikat tidak hanya isi yang tersurat, tapi juga kepatutan, kebiasaan, dan undang-undang.

**Syarat formal perjanjian tertulis yang kuat di Indonesia:**
- Tanggal dan tempat pembuatan
- Identitas lengkap para pihak (nama, NIK/KTP, alamat)
- Pernyataan bahwa kedua pihak membuat perjanjian atas kehendak bebas
- Meterai (Bea Meterai: Rp 10.000 per UU No. 10/2020)
- Tanda tangan para pihak dan saksi
- Untuk nilai besar: sebaiknya di hadapan Notaris (akta notariil)

---

## 1. Perjanjian Hutang Piutang (Loan Agreement)

**Dasar hukum utama:** KUHPerdata Pasal 1754–1773 (Pinjam-Meminjam)

### Form Fields Required:

**Identitas Para Pihak:**
- `nama_pemberi_pinjaman`: Nama lengkap sesuai KTP (type: text)
- `nik_pemberi_pinjaman`: NIK / Nomor KTP pemberi pinjaman (type: text, 16 digit)
- `alamat_pemberi_pinjaman`: Alamat lengkap pemberi pinjaman (type: textarea)
- `nomor_telepon_pemberi`: Nomor HP pemberi pinjaman (type: text)
- `nama_penerima_pinjaman`: Nama lengkap penerima pinjaman (type: text)
- `nik_penerima_pinjaman`: NIK / Nomor KTP penerima pinjaman (type: text, 16 digit)
- `alamat_penerima_pinjaman`: Alamat lengkap penerima pinjaman (type: textarea)
- `nomor_telepon_penerima`: Nomor HP penerima pinjaman (type: text)

**Detail Pinjaman:**
- `jumlah_pinjaman`: Jumlah uang yang dipinjamkan (type: number, dalam Rupiah)
- `jumlah_pinjaman_terbilang`: Jumlah pinjaman dalam huruf (type: text, auto-generated)
- `tanggal_pinjaman`: Tanggal penyerahan uang (type: date)
- `tanggal_jatuh_tempo`: Tanggal harus dikembalikan (type: date)
- `cara_pembayaran_kembali`: Cara pengembalian (type: select: sekaligus/cicilan bulanan/cicilan mingguan)
- `jumlah_cicilan`: Jumlah cicilan per periode jika dicicil (type: number)
- `jumlah_angsuran`: Besaran setiap cicilan (type: number)

**Bunga:**
- `ada_bunga`: Apakah ada bunga? (type: checkbox/boolean)
- `persentase_bunga`: Persentase bunga per bulan/tahun (type: number)
- `jenis_bunga`: Jenis perhitungan bunga (type: select: flat/efektif/majemuk)

**Jaminan (Agunan):**
- `ada_jaminan`: Apakah ada jaminan? (type: checkbox/boolean)
- `jenis_jaminan`: Jenis barang jaminan (type: text, e.g. BPKB motor, sertifikat tanah)
- `deskripsi_jaminan`: Deskripsi lengkap barang jaminan (type: textarea)
- `nilai_jaminan`: Estimasi nilai jaminan (type: number)

**Saksi:**
- `nama_saksi_1`: Nama saksi pertama (type: text)
- `nik_saksi_1`: NIK saksi pertama (type: text)
- `nama_saksi_2`: Nama saksi kedua (type: text, optional)
- `nik_saksi_2`: NIK saksi kedua (type: text, optional)

**Dokumen:**
- `kota_penandatanganan`: Kota tempat perjanjian ditandatangani (type: text)
- `tanggal_penandatanganan`: Tanggal penandatanganan (type: date)

### Key Clauses (must-have):

1. **Klausul Pembukaan / Recital**: Pernyataan bahwa kedua pihak sepakat membuat perjanjian hutang piutang, menyebutkan identitas lengkap para pihak.

2. **Klausul Pokok Perjanjian (Jumlah Hutang)**: Menyatakan jumlah uang yang dipinjamkan secara angka dan huruf, tanggal penyerahan uang, dan konfirmasi bahwa uang telah diterima oleh penerima pinjaman.

3. **Klausul Jangka Waktu dan Tanggal Jatuh Tempo**: Kapan uang harus dikembalikan. Jika cicilan, jadwal angsuran harus jelas.

4. **Klausul Cara Pengembalian**: Metode pengembalian (transfer bank, tunai), rekening tujuan, mata uang.

5. **Klausul Bunga** (jika ada): Besaran bunga, cara perhitungan, kapan mulai berlaku. Catatan: KUHPerdata Pasal 1765 membolehkan bunga asal disepakati tertulis. Pasal 1767 mengatur bunga maksimal mengacu pada bunga legal.

6. **Klausul Jaminan/Agunan** (jika ada): Deskripsi jaminan, siapa yang memegang, kapan dikembalikan, apa yang terjadi jika wanprestasi.

7. **Klausul Wanprestasi (Cidera Janji)**: Konsekuensi jika pembayaran terlambat atau gagal — denda keterlambatan, hak kreditur untuk menagih sekaligus, hak atas jaminan.

8. **Klausul Denda Keterlambatan**: Besaran denda jika pembayaran terlambat (biasanya % per hari atau per bulan dari tunggakan).

9. **Klausul Penyelesaian Sengketa**: Mediasi terlebih dahulu, jika gagal → Pengadilan Negeri setempat.

10. **Klausul Domisili Hukum**: Kedua pihak memilih domisili hukum di Kantor Panitera Pengadilan Negeri yang disepakati.

11. **Klausul Penutup**: Perjanjian dibuat rangkap 2, masing-masing bermeterai cukup, ditandatangani para pihak dan saksi.

### Optional Clauses:
- Klausul percepatan (acceleration clause): Jika wanprestasi, seluruh sisa hutang jatuh tempo seketika
- Klausul asuransi: Pinjaman wajib diasuransikan jiwa peminjam
- Klausul larangan alih hutang: Penerima pinjaman tidak boleh mengalihkan kewajiban ke pihak lain tanpa persetujuan
- Klausul notariil: Perjanjian dibuat di hadapan Notaris untuk kekuatan eksekutorial
- Klausul fidusia: Untuk jaminan kendaraan/barang bergerak, perlu didaftarkan ke Kantor Fidusia

### Legal References:
- KUHPerdata Pasal 1313 (definisi perjanjian)
- KUHPerdata Pasal 1320 (syarat sah perjanjian)
- KUHPerdata Pasal 1338 (kekuatan mengikat perjanjian)
- KUHPerdata Pasal 1754–1773 (pinjam meminjam)
- KUHPerdata Pasal 1765–1767 (bunga dalam pinjam meminjam)
- KUHPerdata Pasal 1243–1252 (wanprestasi dan ganti rugi)
- UU No. 42/1999 tentang Jaminan Fidusia (untuk jaminan barang bergerak)
- UU No. 10/2020 tentang Bea Meterai (meterai Rp 10.000)

### Common Pitfalls / Things Often Missed:
- **Tidak mencantumkan tanggal penyerahan uang aktual** — penting untuk menentukan kapan hutang mulai berjalan
- **Jumlah tidak ditulis dalam huruf** — rentan manipulasi angka
- **Bunga tidak disebutkan eksplisit** — jika tidak ada klausul bunga, dianggap tanpa bunga (Pasal 1765)
- **Tidak ada saksi atau saksi tidak netral** — melemahkan kekuatan pembuktian
- **Jaminan tidak terdaftar fidusia** — jaminan barang bergerak harus didaftarkan ke Kemenkumham agar eksekutorial
- **Tidak ada klausul denda keterlambatan** — membuat penagihan sulit
- **Tidak bermeterai** — surat tanpa meterai sah tapi lemah secara hukum acara (tidak dapat dijadikan alat bukti di pengadilan)
- **Tidak ada klausul domisili hukum** — pengadilan mana yang berwenang tidak jelas
- **Tidak menyebutkan rekening tujuan transfer** — bisa menimbulkan sengketa apakah pembayaran sudah dilakukan

---

## 2. Kontrak Kerja Freelancer / Perjanjian Jasa (Freelance Service Contract)

**Dasar hukum utama:** KUHPerdata Pasal 1601–1617 (Perjanjian Kerja), UU No. 13/2003 tentang Ketenagakerjaan, UU No. 6/2023 tentang Cipta Kerja (Perppu No. 2/2022)

*Sumber tambahan: Gadjian.com — "Komponen & Contoh Kontrak Kerja Freelance" (2025)*

### Form Fields Required:

**Identitas Para Pihak:**
- `nama_pemberi_kerja`: Nama perorangan atau nama perusahaan (type: text)
- `jabatan_pemberi_kerja`: Jabatan dalam perusahaan jika badan usaha (type: text, optional)
- `nama_perusahaan`: Nama PT/CV/UD jika ada (type: text, optional)
- `npwp_pemberi_kerja`: NPWP pemberi kerja (type: text, optional)
- `alamat_pemberi_kerja`: Alamat lengkap (type: textarea)
- `nama_freelancer`: Nama lengkap freelancer (type: text)
- `nik_freelancer`: NIK / KTP freelancer (type: text, 16 digit)
- `alamat_freelancer`: Alamat lengkap freelancer (type: textarea)
- `nomor_rekening_freelancer`: Nomor rekening untuk pembayaran (type: text)
- `nama_bank_freelancer`: Nama bank (type: select: BCA/BNI/BRI/Mandiri/dll)
- `atas_nama_rekening`: Nama pemilik rekening (type: text)

**Detail Pekerjaan:**
- `nomor_kontrak`: Nomor identifikasi kontrak (type: text, auto-generated)
- `judul_pekerjaan`: Nama/judul pekerjaan (type: text, e.g. "Desain Logo", "Pembuatan Konten")
- `deskripsi_pekerjaan`: Deskripsi rinci scope pekerjaan (type: textarea)
- `deliverable`: Apa yang harus diserahkan (type: textarea, e.g. "3 konsep logo dalam format PNG dan AI")
- `jumlah_revisi`: Berapa kali revisi yang termasuk (type: number)
- `tanggal_mulai`: Tanggal mulai pekerjaan (type: date)
- `tanggal_selesai`: Deadline/tanggal selesai pekerjaan (type: date)
- `lokasi_kerja`: Remote / on-site / hybrid (type: select)

**Kompensasi:**
- `jumlah_imbalan`: Total nilai kontrak (type: number, Rupiah)
- `jumlah_imbalan_terbilang`: Dalam huruf (type: text, auto-generated)
- `skema_pembayaran`: Cara pembayaran (type: select: sekaligus/DP 50%+pelunasan/bertahap/per milestone)
- `dp_persen`: Persentase DP jika ada (type: number, e.g. 50)
- `dp_jumlah`: Jumlah DP dalam Rupiah (type: number, auto-calculated)
- `tanggal_pembayaran_dp`: Kapan DP dibayar (type: date)
- `tanggal_pembayaran_lunas`: Kapan pelunasan dibayar (type: date)
- `kena_pajak`: Apakah freelancer kena PPh 21/23? (type: checkbox)

**Hak Cipta:**
- `kepemilikan_hak_cipta`: Siapa pemilik hasil karya setelah lunas? (type: select: pemberi_kerja/freelancer/bersama)
- `hak_portofolio`: Apakah freelancer boleh menampilkan karya di portofolio? (type: checkbox)

**Kerahasiaan:**
- `ada_nda`: Apakah ada klausul kerahasiaan (NDA)? (type: checkbox)
- `masa_kerahasiaan`: Berapa lama kewajiban kerahasiaan berlaku setelah kontrak berakhir (type: select: 1tahun/2tahun/5tahun/selamanya)

**Penandatanganan:**
- `kota_penandatanganan`: Kota (type: text)
- `tanggal_penandatanganan`: Tanggal (type: date)

### Key Clauses (must-have):

1. **Klausul Pembukaan / Recital**: Identitas para pihak dan latar belakang kesepakatan.

2. **Klausul Objek Pekerjaan (Scope of Work)**: Deskripsi rinci pekerjaan, deliverables yang diharapkan, standar kualitas, jumlah revisi yang termasuk dalam harga.

3. **Klausul Jangka Waktu**: Tanggal mulai dan deadline. Jika bertahap, jadwal milestone harus dicantumkan.

4. **Klausul Hak dan Kewajiban Para Pihak**:
   - Freelancer: menyerahkan pekerjaan tepat waktu sesuai spesifikasi, menjaga kerahasiaan
   - Pemberi kerja: membayar sesuai jadwal, memberikan brief yang jelas, memberikan feedback tepat waktu

5. **Klausul Kompensasi dan Pembayaran**: Jumlah total, skema pembayaran, nomor rekening, cara transfer, kapan dianggap lunas.

6. **Klausul Hak Kekayaan Intelektual (HKI)**: Kepemilikan hak cipta, hak moral, lisensi penggunaan. Penting: hak cipta otomatis milik pencipta (UU No. 28/2014 tentang Hak Cipta) kecuali dialihkan secara tertulis.

7. **Klausul Kerahasiaan (NDA)**: Informasi apa yang wajib dirahasiakan, berapa lama, konsekuensi pelanggaran.

8. **Klausul Pemutusan Kontrak**: Kondisi yang membolehkan pemutusan (wanprestasi, force majeure), prosedur pemberitahuan, konsekuensi pemutusan (apakah DP dikembalikan?).

9. **Klausul Force Majeure**: Definisi kejadian di luar kendali (bencana alam, pandemi, dll), apa yang terjadi pada kontrak jika force majeure terjadi.

10. **Klausul Penyelesaian Sengketa**: Musyawarah terlebih dahulu, jika gagal → Pengadilan Negeri atau mediasi/arbitrase.

11. **Klausul Status Hubungan Kerja**: Menyatakan bahwa freelancer bukan karyawan tetap, tidak mendapat BPJS, tidak ada hubungan kerja permanen — penting untuk menghindari klaim PKWTT (Perjanjian Kerja Waktu Tidak Tertentu).

### Optional Clauses:
- Klausul non-kompetisi (non-compete): Freelancer tidak mengerjakan proyek sejenis untuk kompetitor dalam jangka waktu tertentu
- Klausul non-solisitasi: Freelancer tidak boleh merekrut karyawan pemberi kerja
- Klausul penalti keterlambatan: Pengurangan pembayaran jika pekerjaan terlambat
- Klausul perubahan scope (change order): Prosedur jika scope pekerjaan berubah
- Klausul perpanjangan kontrak: Kondisi dan prosedur perpanjangan

### Legal References:
- KUHPerdata Pasal 1601–1617 (perjanjian kerja dan pemborongan pekerjaan)
- KUHPerdata Pasal 1320 (syarat sah perjanjian)
- UU No. 13/2003 tentang Ketenagakerjaan (Pasal 50–66 untuk PKWT)
- UU No. 6/2023 tentang Cipta Kerja (pembaruan aturan PKWT, maksimal 5 tahun termasuk perpanjangan)
- UU No. 28/2014 tentang Hak Cipta (kepemilikan hak cipta)
- UU No. 36/2008 tentang PPh (kewajiban pajak penghasilan freelancer)
- PP No. 35/2021 tentang PKWT (aturan teknis kontrak kerja waktu tertentu)

### Common Pitfalls / Things Often Missed:
- **Scope of work tidak spesifik** — paling sering menjadi sumber sengketa ("revisi tidak terbatas" vs. "2x revisi")
- **Hak cipta tidak diatur** — secara default UU Hak Cipta, karya milik pencipta (freelancer), bukan pemberi kerja
- **Tidak ada klausul jika pekerjaan ditolak** — apa yang terjadi jika pemberi kerja tidak puas tapi pekerjaan sudah dilakukan?
- **Tidak ada klausul pembayaran parsial** — jika proyek dibatalkan di tengah jalan, berapa yang dibayar?
- **Status hubungan kerja tidak dijelaskan** — risiko freelancer menuntut PKWTT / karyawan tetap
- **Tidak mencantumkan deadline feedback** — freelancer terlambat karena menunggu feedback, tapi disalahkan

---

## 3. Perjanjian Titip Jual / Konsinyasi (Consignment Agreement)

**Dasar hukum utama:** KUHPerdata Pasal 1694–1739 (Penitipan Barang), KUHD (Kitab Undang-Undang Hukum Dagang) Pasal 76–85 (Makelar/Agen), KUHPerdata Pasal 1792–1819 (Pemberian Kuasa)

### Form Fields Required:

**Identitas Para Pihak:**
- `nama_konsinyor`: Nama pemilik barang (pihak yang menitipkan) (type: text)
- `nik_konsinyor`: NIK / KTP konsinyor (type: text)
- `alamat_konsinyor`: Alamat lengkap konsinyor (type: textarea)
- `nomor_telepon_konsinyor`: Nomor HP (type: text)
- `nama_bank_konsinyor`: Bank untuk penerimaan hasil penjualan (type: text)
- `nomor_rekening_konsinyor`: Nomor rekening (type: text)
- `nama_konsinyee`: Nama penjual/agen (pihak yang menjualkan) (type: text)
- `nik_konsinyee`: NIK / KTP konsinyee (type: text)
- `alamat_toko_konsinyee`: Alamat toko/lokasi penjualan (type: textarea)
- `nomor_telepon_konsinyee`: Nomor HP (type: text)

**Detail Barang Konsinyasi:**
- `nama_produk`: Nama/jenis produk yang dititipkan (type: text)
- `deskripsi_produk`: Deskripsi lengkap produk (type: textarea)
- `jumlah_unit_awal`: Jumlah unit yang dititipkan (type: number)
- `harga_pokok`: Harga pokok per unit (type: number, Rupiah)
- `harga_jual_ditetapkan`: Harga jual yang ditetapkan konsinyor (type: number)
- `boleh_diskon`: Apakah boleh memberikan diskon? (type: checkbox)
- `diskon_maks`: Maksimal diskon yang boleh diberikan (type: number, persen)

**Komisi:**
- `jenis_komisi`: Cara hitung komisi (type: select: persentase_dari_harga_jual/flat_per_unit/selisih_harga)
- `persentase_komisi`: Persentase komisi per unit terjual (type: number)
- `komisi_flat`: Komisi flat per unit (type: number, jika model flat)

**Periode dan Pelaporan:**
- `tanggal_mulai`: Tanggal mulai konsinyasi (type: date)
- `tanggal_berakhir`: Tanggal berakhirnya konsinyasi (type: date)
- `periode_laporan`: Seberapa sering laporan penjualan diberikan (type: select: mingguan/dua_mingguan/bulanan)
- `tanggal_setor_hasil`: Kapan hasil penjualan harus disetor (type: select: setiap_minggu/setiap_2minggu/setiap_bulan)

**Pengambilan Barang:**
- `batas_pengambilan_barang_tidak_laku`: Kapan barang yang tidak laku harus dikembalikan (type: text)
- `kondisi_barang_kembali`: Kondisi barang saat dikembalikan (type: select: harus_baru/boleh_terdisplay)

**Penandatanganan:**
- `kota_penandatanganan`: Kota (type: text)
- `tanggal_penandatanganan`: Tanggal (type: date)

### Key Clauses (must-have):

1. **Klausul Pembukaan**: Identitas para pihak, penjelasan bahwa ini adalah perjanjian konsinyasi (titip jual).

2. **Klausul Daftar Barang Konsinyasi**: Jenis barang, jumlah, spesifikasi, harga pokok, harga jual yang ditetapkan. Sebaiknya dilampirkan dalam Berita Acara Serah Terima Barang yang ditandatangani saat penyerahan.

3. **Klausul Kepemilikan Barang**: Barang tetap milik konsinyor sampai terjual. Konsinyee hanya pemegang titipan, bukan pemilik. Penting untuk menghindari penyalahgunaan.

4. **Klausul Harga Jual dan Komisi**: Harga jual yang ditetapkan, apakah boleh ada diskon, besaran komisi konsinyee, cara perhitungan.

5. **Klausul Pelaporan Penjualan**: Frekuensi laporan, format laporan (minimal: jumlah terjual, stok tersisa, uang yang harus disetor), sanksi jika laporan terlambat.

6. **Klausul Penyetoran Hasil Penjualan**: Jadwal penyetoran, rekening tujuan, cara transfer, maksimal hari keterlambatan yang ditoleransi.

7. **Klausul Tanggung Jawab atas Barang**: Konsinyee bertanggung jawab atas keamanan barang selama di tangannya. Jika barang hilang, rusak, atau dicuri, konsinyee wajib mengganti.

8. **Klausul Pengembalian Barang Tidak Laku**: Prosedur dan jadwal pengembalian barang yang tidak terjual, kondisi barang yang diterima kembali (harus dalam kondisi baik/layak jual).

9. **Klausul Larangan Penggunaan Lain**: Konsinyee dilarang menggunakan, menjaminkan, atau memindahkan barang konsinyasi untuk keperluan lain.

10. **Klausul Jangka Waktu dan Perpanjangan**: Durasi konsinyasi, prosedur perpanjangan, kondisi pengakhiran lebih awal.

11. **Klausul Penyelesaian Sengketa**: Musyawarah → Pengadilan Negeri.

### Optional Clauses:
- Klausul minimum penjualan: Target penjualan minimum per periode
- Klausul asuransi: Barang wajib diasuransikan oleh konsinyee
- Klausul eksklusivitas: Konsinyee menjadi satu-satunya penjual di wilayah tertentu
- Klausul promosi: Kewajiban konsinyee untuk mempromosikan produk

### Legal References:
- KUHPerdata Pasal 1694–1739 (Penitipan Barang / Bewaargeving)
- KUHPerdata Pasal 1792–1819 (Pemberian Kuasa / Lastgeving)
- KUHD Pasal 76–85 (Makelar)
- UU No. 8/1999 tentang Perlindungan Konsumen (untuk tanggung jawab produk)
- KUHPerdata Pasal 1320 (syarat sah perjanjian)

### Common Pitfalls / Things Often Missed:
- **Tidak ada Berita Acara Serah Terima Barang** — paling kritis. Tanpa BAST, sulit membuktikan berapa barang yang dititipkan
- **Tidak ada prosedur rekonsiliasi stok** — barang bisa "hilang" tanpa bisa dibuktikan
- **Harga jual tidak dikunci** — konsinyee bisa jual lebih murah dari harga yang ditentukan
- **Tidak ada batas waktu penyetoran hasil** — uang hasil penjualan bisa lama tidak disetor
- **Tanggung jawab kerusakan barang tidak diatur** — siapa tanggung jawab jika barang rusak saat display?
- **Tidak ada klausul retur** — apa yang terjadi jika barang cacat atau ada komplain konsumen akhir?

---

## 4. Perjanjian Bagi Hasil Usaha (Profit Sharing / Business Partnership)

**Dasar hukum utama:** KUHPerdata Pasal 1618–1652 (Maatschap / Persekutuan Perdata)

### Form Fields Required:

**Identitas Para Pihak:**
- `jumlah_pihak`: Berapa pihak yang terlibat (type: number, min 2)
- `nama_pihak_1`: Nama lengkap pihak pertama (type: text)
- `nik_pihak_1`: NIK pihak pertama (type: text)
- `alamat_pihak_1`: Alamat pihak pertama (type: textarea)
- `peran_pihak_1`: Peran/kontribusi pihak pertama (type: text, e.g. "modal uang")
- `nama_pihak_2`: Nama lengkap pihak kedua (type: text)
- `nik_pihak_2`: NIK pihak kedua (type: text)
- `alamat_pihak_2`: Alamat pihak kedua (type: textarea)
- `peran_pihak_2`: Peran/kontribusi pihak kedua (type: text, e.g. "tenaga/keahlian")
- *(repeat untuk pihak ke-3 dst jika ada)*

**Detail Usaha:**
- `nama_usaha`: Nama bisnis/usaha yang dijalankan (type: text)
- `jenis_usaha`: Jenis usaha (type: text, e.g. "warung makan", "toko online", "konter pulsa")
- `alamat_usaha`: Lokasi usaha (type: textarea)
- `tanggal_mulai_usaha`: Tanggal operasional dimulai (type: date)

**Kontribusi Modal:**
- `total_modal`: Total modal keseluruhan (type: number, Rupiah)
- `modal_pihak_1`: Kontribusi modal pihak pertama (type: number, Rupiah)
- `modal_pihak_2`: Kontribusi modal pihak kedua (type: number, Rupiah)
- `bentuk_kontribusi_pihak_1`: Jenis kontribusi (type: select: uang_tunai/aset/tenaga/keahlian/campuran)
- `deskripsi_aset_pihak_1`: Deskripsi aset jika kontribusi berupa aset (type: textarea, optional)

**Bagi Hasil:**
- `metode_bagi_hasil`: Cara bagi hasil (type: select: proporsional_modal/tetap_persentase/berbeda_profit_rugi)
- `persen_bagi_hasil_pihak_1`: Persentase bagi hasil pihak pertama (type: number)
- `persen_bagi_hasil_pihak_2`: Persentase bagi hasil pihak kedua (type: number)
- `periode_bagi_hasil`: Seberapa sering bagi hasil dilakukan (type: select: bulanan/triwulan/semesteran/tahunan)
- `tanggal_bagi_hasil`: Tanggal di mana bagi hasil dilakukan (type: number, tanggal dalam bulan)
- `apakah_ada_gaji_pengelola`: Apakah pihak pengelola mendapat gaji/honor selain bagi hasil? (type: checkbox)
- `gaji_pengelola`: Besaran gaji pengelola jika ada (type: number)

**Pengelolaan Usaha:**
- `siapa_yang_mengelola`: Siapa yang mengelola usaha sehari-hari (type: select: pihak_1/pihak_2/bersama/direktur_ditunjuk)
- `keputusan_besar_threshold`: Nilai transaksi di mana keputusan harus bersama (type: number, Rupiah)
- `hak_audit`: Apakah semua pihak berhak memeriksa pembukuan? (type: checkbox)
- `frekuensi_laporan_keuangan`: Frekuensi laporan keuangan (type: select: bulanan/triwulan/semesteran)

**Pengakhiran:**
- `jangka_waktu_perjanjian`: Durasi perjanjian (type: select: 1tahun/2tahun/3tahun/tidak_terbatas)
- `tanggal_berakhir`: Tanggal berakhir jika ada batas waktu (type: date, optional)
- `prosedur_keluar_pihak`: Bagaimana jika salah satu pihak ingin keluar (type: textarea)

**Penandatanganan:**
- `kota_penandatanganan`: Kota (type: text)
- `tanggal_penandatanganan`: Tanggal (type: date)
- `saksi_1`: Nama saksi 1 (type: text)
- `saksi_2`: Nama saksi 2 (type: text)

### Key Clauses (must-have):

1. **Klausul Pembukaan / Recital**: Identitas para pihak, latar belakang kemitraan, tujuan usaha.

2. **Klausul Nama dan Jenis Usaha**: Nama usaha, bidang usaha, lokasi operasional.

3. **Klausul Kontribusi Modal**: Siapa menyumbang berapa, dalam bentuk apa (uang tunai, aset, keahlian, tenaga), kapan disetor, penilaian aset jika bukan uang tunai.

4. **Klausul Pengelolaan Usaha**: Siapa yang mengelola sehari-hari, hak dan kewajiban manajer, batas kewenangan mengambil keputusan sendiri, kapan keputusan harus bersama.

5. **Klausul Rekening Bersama / Keuangan Usaha**: Rekening usaha atas nama siapa, siapa yang berhak menandatangani, batas penarikan tunai.

6. **Klausul Pembagian Keuntungan**: Persentase bagi hasil tiap pihak, kapan dihitung, kapan dibagikan, apakah ada "laba ditahan" untuk modal kerja.

7. **Klausul Pembagian Kerugian**: Bagaimana kerugian ditanggung (proporsional modal, atau berbeda dari bagi hasil). Catatan: KUHPerdata Pasal 1635 melarang klausul yang membebankan seluruh kerugian ke satu pihak saja (leonine clause).

8. **Klausul Laporan Keuangan dan Audit**: Frekuensi laporan, format laporan, hak semua pihak untuk memeriksa pembukuan.

9. **Klausul Larangan Bersaing**: Para pihak dilarang menjalankan usaha sejenis yang bersaing secara langsung.

10. **Klausul Penarikan Modal**: Prosedur jika salah satu pihak ingin menarik modal, berapa lama prosesnya, dampak terhadap perjanjian.

11. **Klausul Pengakhiran dan Likuidasi**: Kondisi pengakhiran (sepakat bersama, jangka waktu habis, salah satu pihak meninggal/bangkrut), prosedur likuidasi aset, pembagian sisa aset.

12. **Klausul Penyelesaian Sengketa**: Musyawarah → Mediasi → Pengadilan Negeri.

### Optional Clauses:
- Klausul penambahan modal: Prosedur jika perlu injeksi modal tambahan
- Klausul masuknya pihak baru: Syarat jika ingin mengajak mitra baru
- Klausul right of first refusal: Jika satu pihak menjual bagiannya, pihak lain punya hak beli pertama
- Klausul asuransi jiwa: Untuk melindungi usaha jika salah satu mitra meninggal

### Legal References:
- KUHPerdata Pasal 1618–1652 (Maatschap / Persekutuan Perdata)
- KUHPerdata Pasal 1635 (larangan klausul leonine)
- KUHPerdata Pasal 1643–1645 (tanggung jawab mitra terhadap pihak ketiga)
- UU No. 20/2008 tentang UMKM
- KUHPerdata Pasal 1320 (syarat sah perjanjian)

### Common Pitfalls / Things Often Missed:
- **Pembagian rugi tidak diatur** — hanya mengatur bagi untung tapi tidak ada klausul kerugian
- **Kewenangan pengelola tidak dibatasi** — manajer bisa membuat keputusan besar tanpa persetujuan mitra
- **Tidak ada rekening usaha terpisah** — keuangan usaha bercampur dengan keuangan pribadi
- **Prosedur keluar mitra tidak jelas** — konflik sering terjadi saat salah satu ingin keluar
- **Penilaian aset non-tunai tidak ada** — kontribusi berupa aset/keahlian tidak dinilai secara objektif
- **Tidak ada klausul jika mitra meninggal** — usaha bisa terhenti tiba-tiba
- **Klausul leonine** — membebankan semua kerugian ke satu pihak → batal demi hukum (Pasal 1635)

---

## 5. Kontrak Sewa Kendaraan (Vehicle Rental Agreement)

**Dasar hukum utama:** KUHPerdata Pasal 1548–1600 (Sewa-Menyewa)

### Form Fields Required:

**Identitas Para Pihak:**
- `nama_pemilik_kendaraan`: Nama lengkap pemilik/penyewa (lessor) (type: text)
- `nik_pemilik`: NIK / KTP pemilik (type: text, 16 digit)
- `alamat_pemilik`: Alamat lengkap pemilik (type: textarea)
- `nomor_telepon_pemilik`: Nomor HP (type: text)
- `nomor_rekening_pemilik`: Rekening untuk menerima pembayaran sewa (type: text)
- `nama_bank_pemilik`: Bank (type: text)
- `nama_penyewa`: Nama lengkap penyewa (lessee) (type: text)
- `nik_penyewa`: NIK / KTP penyewa (type: text, 16 digit)
- `alamat_penyewa`: Alamat lengkap penyewa (type: textarea)
- `nomor_telepon_penyewa`: Nomor HP (type: text)
- `nomor_sim`: Nomor SIM penyewa (type: text)
- `jenis_sim`: Jenis SIM (type: select: A/B1/B2/C/D)

**Detail Kendaraan:**
- `jenis_kendaraan`: Motor / Mobil / Truk / dll (type: select)
- `merek_kendaraan`: Merek (type: text, e.g. Honda, Toyota)
- `model_kendaraan`: Model/tipe (type: text, e.g. Beat, Avanza)
- `tahun_kendaraan`: Tahun produksi (type: number)
- `warna_kendaraan`: Warna (type: text)
- `nomor_polisi`: Plat nomor (type: text)
- `nomor_rangka`: Nomor rangka/VIN (type: text)
- `nomor_mesin`: Nomor mesin (type: text)
- `kondisi_awal_kendaraan`: Deskripsi kondisi kendaraan saat diserahkan (type: textarea)
- `km_awal`: KM odometer saat diserahkan (type: number)
- `kelengkapan_dokumen`: Dokumen yang diserahkan bersama kendaraan (type: checkbox-group: STNK/BPKB/KIR)
- `apakah_ada_asuransi`: Apakah kendaraan diasuransikan? (type: checkbox)
- `nomor_polis_asuransi`: Nomor polis asuransi (type: text, optional)

**Detail Sewa:**
- `tanggal_mulai_sewa`: Tanggal mulai sewa (type: date)
- `tanggal_selesai_sewa`: Tanggal berakhir sewa (type: date)
- `durasi_sewa`: Durasi dalam hari/minggu/bulan (type: number, auto-calculated)
- `harga_sewa_per_hari`: Harga sewa per hari (type: number, Rupiah)
- `harga_sewa_per_bulan`: Harga sewa per bulan jika bulanan (type: number, Rupiah)
- `total_harga_sewa`: Total harga (type: number, auto-calculated)
- `batas_km_per_hari`: Batas km per hari (type: number, 0 = tidak dibatasi)
- `biaya_km_lebih`: Biaya per km jika melebihi batas (type: number, optional)

**Deposit:**
- `jumlah_deposit`: Jumlah uang jaminan/deposit (type: number, Rupiah)
- `kapan_deposit_dikembalikan`: Kapan deposit dikembalikan (type: text, e.g. "7 hari setelah kendaraan dikembalikan")

**Pembayaran:**
- `skema_pembayaran`: (type: select: lunas_di_muka/cicilan/DP_lunas_saat_kembali)
- `tanggal_pembayaran`: Kapan pembayaran dilakukan (type: date)

**Ketentuan Penggunaan:**
- `area_penggunaan`: Wilayah boleh dibawa (type: select: dalam_kota/dalam_provinsi/seluruh_Indonesia/luar_negeri)
- `boleh_disewakan_kembali`: Apakah boleh disewakan ke pihak lain? (type: checkbox, default: tidak)
- `boleh_dimodifikasi`: Apakah boleh dimodifikasi sementara? (type: checkbox, default: tidak)

**Penandatanganan:**
- `kota_penandatanganan`: Kota (type: text)
- `tanggal_penandatanganan`: Tanggal (type: date)
- `saksi_1_nama`: Nama saksi (type: text)

### Key Clauses (must-have):

1. **Klausul Pembukaan**: Identitas para pihak, deskripsi kendaraan yang disewakan.

2. **Klausul Objek Sewa**: Deskripsi lengkap kendaraan — merek, model, tahun, nomor polisi, nomor rangka, nomor mesin, warna, kondisi saat diserahkan.

3. **Klausul Jangka Waktu Sewa**: Tanggal mulai dan selesai, jam penyerahan dan pengembalian.

4. **Klausul Harga Sewa**: Harga sewa per hari/minggu/bulan, total, cara pembayaran.

5. **Klausul Deposit/Uang Jaminan**: Jumlah deposit, tujuan (jaminan kerusakan/kehilangan), kapan dikembalikan, kondisi pemotongan deposit.

6. **Klausul Berita Acara Serah Terima**: Kondisi kendaraan saat diserahkan (foto direkomendasikan), KM odometer, kelengkapan (kunci, STNK, dll). BAST harus ditandatangani saat penyerahan.

7. **Klausul Kewajiban Penyewa**:
   - Merawat kendaraan dengan baik
   - Tidak menyewakan ke pihak lain
   - Menggunakan sesuai peruntukan (bukan balapan, bukan kriminal)
   - Membayar BBM dan parkir
   - Melaporkan jika ada kerusakan/kecelakaan segera
   - Mengembalikan tepat waktu

8. **Klausul Tanggung Jawab Kerusakan**: Siapa yang menanggung biaya perbaikan jika kendaraan rusak saat sewa — kerusakan minor (penyewa), kerusakan akibat force majeure (negosiasi), kerusakan akibat kelalaian (penyewa wajib ganti).

9. **Klausul Kecelakaan dan Kehilangan**: Prosedur jika terjadi kecelakaan (lapor polisi, lapor pemilik dalam X jam), prosedur jika kendaraan hilang (lapor polisi, ganti rugi).

10. **Klausul Keterlambatan Pengembalian**: Denda per jam/hari jika kendaraan dikembalikan terlambat.

11. **Klausul Penggunaan yang Dilarang**: Tidak boleh digunakan untuk balap, tidak boleh dibawa ke luar wilayah yang disepakati, tidak boleh untuk kegiatan ilegal.

12. **Klausul Asuransi**: Status asuransi kendaraan, siapa menanggung jika tidak ada asuransi.

13. **Klausul Penyelesaian Sengketa**: Musyawarah → Pengadilan Negeri.

### Optional Clauses:
- Klausul sopir: Jika sewa termasuk sopir, aturan tentang sopir
- Klausul bahan bakar: Kondisi BBM saat diserahkan dan dikembalikan
- Klausul perawatan rutin: Kewajiban penyewa untuk service berkala jika sewa jangka panjang
- Klausul asuransi pihak ketiga: Tanggung jawab terhadap korban kecelakaan

### Legal References:
- KUHPerdata Pasal 1548–1600 (Sewa-Menyewa)
- KUHPerdata Pasal 1560 (kewajiban penyewa merawat barang sewaan)
- KUHPerdata Pasal 1563 (larangan menyewakan ulang tanpa izin)
- KUHPerdata Pasal 1564 (tanggung jawab atas kerusakan)
- UU No. 22/2009 tentang Lalu Lintas dan Angkutan Jalan
- UU No. 40/2014 tentang Perasuransian (kewajiban asuransi kendaraan)
- PP No. 74/2014 tentang Angkutan Jalan

### Common Pitfalls / Things Often Missed:
- **Tidak ada BAST (Berita Acara Serah Terima)** yang didokumentasikan — sulit membuktikan kondisi awal kendaraan
- **Tidak ada foto kondisi awal** — sengketa kerusakan paling umum
- **Batas wilayah tidak diatur** — kendaraan dibawa keluar kota/pulau tanpa izin
- **Tidak ada klausul kehilangan** — jika kendaraan hilang, penyewa harus ganti berapa?
- **Tidak ada denda keterlambatan** — sulit menagih jika kendaraan tidak dikembalikan tepat waktu
- **BPKB tidak dipegang pemilik** — pemilik harus tetap pegang BPKB, jangan diserahkan ke penyewa
- **Tidak ada klausul laporan kecelakaan** — berapa jam batas lapor kecelakaan ke pemilik

---

## 6. Surat Perjanjian Jual Beli Barang Secondhand (Second-hand Goods Sale Agreement)

**Dasar hukum utama:** KUHPerdata Pasal 1457–1540 (Jual Beli)

### Form Fields Required:

**Identitas Para Pihak:**
- `nama_penjual`: Nama lengkap penjual (type: text)
- `nik_penjual`: NIK / KTP penjual (type: text, 16 digit)
- `alamat_penjual`: Alamat lengkap penjual (type: textarea)
- `nomor_telepon_penjual`: Nomor HP (type: text)
- `nama_pembeli`: Nama lengkap pembeli (type: text)
- `nik_pembeli`: NIK / KTP pembeli (type: text, 16 digit)
- `alamat_pembeli`: Alamat lengkap pembeli (type: textarea)
- `nomor_telepon_pembeli`: Nomor HP (type: text)

**Detail Barang:**
- `jenis_barang`: Kategori barang (type: select: kendaraan_bermotor/elektronik/furnitur/perhiasan/mesin/lainnya)
- `nama_barang`: Nama/deskripsi barang (type: text, e.g. "Honda Beat 2020")
- `merek`: Merek (type: text)
- `model_tipe`: Model/tipe (type: text)
- `tahun_pembuatan`: Tahun (type: number)
- `warna`: Warna (type: text)
- `kondisi_barang`: Kondisi (type: select: sangat_baik/baik/cukup_baik/perlu_perbaikan)
- `deskripsi_kondisi`: Deskripsi detail kondisi termasuk cacat/kekurangan yang diketahui (type: textarea)

**Untuk Kendaraan Bermotor:**
- `nomor_polisi`: Nomor plat (type: text, optional)
- `nomor_rangka`: Nomor rangka/VIN (type: text, optional)
- `nomor_mesin`: Nomor mesin (type: text, optional)
- `km_odometer`: KM odometer saat jual beli (type: number, optional)
- `masa_berlaku_pajak`: Pajak kendaraan berlaku sampai (type: date, optional)
- `dokumen_disertakan`: Dokumen yang ikut diserahkan (type: checkbox-group: STNK/BPKB/Faktur/KIR)

**Untuk Elektronik:**
- `nomor_seri`: Nomor seri/IMEI (type: text, optional)
- `garansi_tersisa`: Sisa garansi dari produsen jika ada (type: text, optional)
- `aksesoris_disertakan`: Aksesoris yang disertakan (type: textarea, optional)

**Harga:**
- `harga_jual`: Harga jual yang disepakati (type: number, Rupiah)
- `harga_jual_terbilang`: Dalam huruf (type: text, auto-generated)
- `cara_pembayaran`: Metode pembayaran (type: select: tunai/transfer/DP_pelunasan)
- `jumlah_dp`: Jumlah DP jika ada (type: number, Rupiah)
- `tanggal_pembayaran_dp`: Tanggal DP dibayar (type: date)
- `tanggal_pelunasan`: Tanggal pelunasan (type: date)
- `nomor_rekening_penjual`: Rekening penjual untuk transfer (type: text)
- `nama_bank_penjual`: Bank penjual (type: text)

**Serah Terima:**
- `tanggal_serah_terima`: Tanggal penyerahan barang (type: date)
- `lokasi_serah_terima`: Tempat serah terima (type: text)

**Penandatanganan:**
- `kota_penandatanganan`: Kota (type: text)
- `tanggal_penandatanganan`: Tanggal (type: date)
- `saksi_nama`: Nama saksi (type: text)
- `saksi_nik`: NIK saksi (type: text)

### Key Clauses (must-have):

1. **Klausul Pembukaan**: Identitas penjual dan pembeli, pernyataan bahwa penjual memiliki hak untuk menjual barang.

2. **Klausul Deskripsi Barang**: Deskripsi lengkap barang termasuk spesifikasi, kondisi, cacat yang diketahui. Untuk kendaraan: merek, model, tahun, nomor polisi, nomor rangka, nomor mesin.

3. **Klausul Harga dan Cara Pembayaran**: Harga jual (angka dan huruf), cara pembayaran, jadwal jika cicilan.

4. **Klausul Kepemilikan dan Keaslian**: Pernyataan penjual bahwa barang adalah miliknya yang sah, tidak dalam sengketa, tidak dijaminkan, tidak dicuri. Ini sangat penting — penjualan barang bukan milik sendiri dapat berakibat pidana.

5. **Klausul Serah Terima Barang**: Kapan dan di mana barang diserahkan, dokumen apa yang ikut diserahkan, kondisi saat diserahkan.

6. **Klausul "As Is" / Sebagaimana Adanya**: Menyatakan bahwa pembeli menerima barang dalam kondisi seperti yang telah dilihat dan diperiksa, penjual tidak memberikan garansi tersembunyi. Penting untuk melindungi penjual.

7. **Klausul Pengalihan Hak**: Setelah pembayaran lunas dan serah terima, kepemilikan sepenuhnya berpindah ke pembeli. Untuk kendaraan, termasuk bantuan pengurusan balik nama.

8. **Klausul Risiko**: Risiko kerusakan atau kehilangan barang berpindah ke pembeli sejak serah terima.

9. **Klausul Balik Nama** (untuk kendaraan): Siapa yang bertanggung jawab dan menanggung biaya balik nama STNK dan BPKB, jangka waktu.

10. **Klausul Penyelesaian Sengketa**: Musyawarah → Pengadilan Negeri.

### Optional Clauses:
- Klausul garansi penjual: Jaminan bahwa barang berfungsi X hari setelah serah terima
- Klausul retur: Kondisi di mana pembeli boleh mengembalikan barang
- Klausul penalti gagal bayar: Denda jika pembeli gagal melunasi

### Legal References:
- KUHPerdata Pasal 1457–1540 (Jual Beli)
- KUHPerdata Pasal 1474 (kewajiban penjual: menyerahkan dan menjamin)
- KUHPerdata Pasal 1491–1512 (jaminan terhadap penguasaan barang oleh orang lain / vrijwaring)
- KUHPerdata Pasal 1504–1512 (cacat tersembunyi / vrijwaring terhadap cacat)
- UU No. 8/1999 tentang Perlindungan Konsumen (jika penjual adalah pelaku usaha)
- UU No. 22/2009 tentang LLAJ dan PP No. 55/2012 (khusus kendaraan bermotor)
- KUHP Pasal 372 (penggelapan), 480 (penadahan) — relevan untuk memastikan keaslian kepemilikan

### Common Pitfalls / Things Often Missed:
- **Tidak ada pernyataan kepemilikan sah** — pembeli bisa mendapat barang curian atau yang masih dalam kredit
- **Cacat barang tidak diungkapkan** — penjual menyembunyikan kerusakan → gugatan wanprestasi
- **Nomor rangka/mesin tidak dicatat** — sulit melacak jika ternyata barang palsu
- **Biaya balik nama tidak disepakati** — sering menjadi sengketa setelah transaksi
- **Pembayaran tidak tercatat dengan bukti** — sulit membuktikan sudah lunas
- **Untuk kendaraan: BPKB asli tidak diserahkan** — proses balik nama terhambat
- **Tidak ada saksi** — perjanjian jual beli secondhand tanpa saksi sangat lemah

---

## 7. Kontrak Event Organizer / Fotografer (Event/Photography Contract)

**Dasar hukum utama:** KUHPerdata Pasal 1601b (Pemborongan Pekerjaan), KUHPerdata Pasal 1313 dan 1320, UU No. 28/2014 tentang Hak Cipta

### Form Fields Required:

**Identitas Para Pihak:**
- `nama_klien`: Nama lengkap klien/pemberi kerja (type: text)
- `nik_klien`: NIK / KTP klien (type: text)
- `alamat_klien`: Alamat lengkap klien (type: textarea)
- `nomor_telepon_klien`: Nomor HP klien (type: text)
- `nama_eo_fotografer`: Nama EO / fotografer / vendor (type: text)
- `nama_usaha_vendor`: Nama usaha/brand vendor (type: text, optional)
- `nik_vendor`: NIK vendor jika perorangan (type: text)
- `alamat_vendor`: Alamat vendor (type: textarea)
- `nomor_telepon_vendor`: Nomor HP vendor (type: text)
- `nomor_rekening_vendor`: Nomor rekening (type: text)
- `nama_bank_vendor`: Bank (type: text)

**Detail Acara / Pekerjaan:**
- `jenis_layanan`: (type: select: event_organizer/fotografer/videografer/fotografer_videografer/dekorasi/catering/MC/band_hiburan)
- `nama_acara`: Nama acara (type: text, e.g. "Pernikahan Budi dan Ani")
- `jenis_acara`: (type: select: pernikahan/ulang_tahun/seminar/konferensi/pameran/launching_produk/lainnya)
- `tanggal_acara`: Tanggal acara (type: date)
- `hari_acara`: Hari dalam seminggu (type: text, auto-filled)
- `waktu_mulai_acara`: Jam mulai (type: time)
- `waktu_selesai_acara`: Jam selesai (type: time)
- `lokasi_acara`: Lokasi acara lengkap (type: textarea)
- `estimasi_tamu`: Estimasi jumlah tamu (type: number)

**Untuk Fotografer/Videografer:**
- `paket_dipilih`: Nama paket (type: text, e.g. "Paket Silver 8 jam")
- `durasi_pemotretan`: Berapa jam pemotretan (type: number)
- `jumlah_fotografer`: Jumlah fotografer yang diturunkan (type: number)
- `jumlah_foto_diedit`: Jumlah foto yang akan diedit (type: number)
- `format_file_foto`: Format file yang diserahkan (type: checkbox-group: JPG/RAW/PNG)
- `durasi_video`: Durasi video final (type: text, e.g. "10-15 menit highlight")
- `format_video`: Format video (type: select: MP4/MOV)
- `waktu_pengiriman_foto`: Berapa hari setelah acara foto diserahkan (type: number)
- `waktu_pengiriman_video`: Berapa minggu setelah acara video diserahkan (type: number)
- `media_penyerahan`: Cara file diserahkan (type: select: Google_Drive/Flashdisk/WeTransfer)

**Untuk Event Organizer:**
- `ruang_lingkup_eo`: Deskripsi detail apa yang ditangani EO (type: textarea)
- `vendor_yang_disediakan`: Daftar vendor/supplier yang disediakan EO (type: textarea)
- `vendor_yang_disediakan_klien`: Vendor yang disediakan klien sendiri (type: textarea)

**Harga:**
- `total_harga`: Total harga layanan (type: number, Rupiah)
- `total_harga_terbilang`: Dalam huruf (type: text)
- `biaya_dp`: Jumlah DP (type: number, Rupiah)
- `persen_dp`: Persentase DP (type: number)
- `tanggal_dp`: Kapan DP dibayar (type: date)
- `biaya_pelunasan`: Jumlah pelunasan (type: number, auto-calculated)
- `tanggal_pelunasan`: Kapan pelunasan dibayar (type: date, biasanya H-7 atau H-3 acara)
- `biaya_transportasi`: Biaya transport jika ada (type: number, optional)
- `biaya_akomodasi`: Biaya menginap jika acara di luar kota (type: number, optional)

**Penandatanganan:**
- `kota_penandatanganan`: Kota (type: text)
- `tanggal_penandatanganan`: Tanggal (type: date)

### Key Clauses (must-have):

1. **Klausul Pembukaan**: Identitas para pihak, jenis layanan, nama dan tanggal acara.

2. **Klausul Lingkup Pekerjaan (Scope of Work)**: Deskripsi rinci apa yang akan dilakukan vendor — untuk fotografer: jumlah jam, jumlah fotografer, jumlah foto edited, format; untuk EO: detail apa yang ditangani dan tidak ditangani.

3. **Klausul Tanggal, Waktu, dan Lokasi Acara**: Tanggal, jam mulai-selesai, lokasi lengkap. Penting untuk kepastian booking dan mobilisasi.

4. **Klausul Harga dan Pembayaran**:
   - Total harga
   - DP (biasanya 30–50% untuk memesan/booking tanggal)
   - Jadwal pelunasan (biasanya H-7 atau H-3 sebelum acara)
   - Rekening penerima
   - Konsekuensi jika pembayaran terlambat

5. **Klausul Pembatalan oleh Klien**:
   - Lebih dari 30 hari sebelum acara: DP hangus
   - 14–30 hari: DP hangus + % dari sisa
   - Kurang dari 14 hari: DP hangus + % lebih besar / full payment
   *Ini adalah klausul paling krusial dalam kontrak EO/fotografer*

6. **Klausul Pembatalan oleh Vendor**: Jika vendor yang membatalkan, prosedur pengembalian uang, kewajiban menyediakan pengganti.

7. **Klausul Force Majeure**: Jika acara dibatalkan karena bencana/kondisi di luar kendali (cuaca ekstrem, bencana alam, pandemi, dll) — apakah DP dikembalikan, apakah bisa dijadwalkan ulang.

8. **Klausul Penjadwalan Ulang (Reschedule)**:
   - Kapan boleh reschedule
   - Apakah ada biaya reschedule
   - Berapa kali reschedule diizinkan
   - Ketersediaan tanggal baru tergantung vendor

9. **Klausul Hak Cipta dan Penggunaan Foto/Video**:
   - Hak cipta karya fotografer tetap milik fotografer (UU Hak Cipta)
   - Klien mendapat lisensi penggunaan untuk keperluan pribadi
   - Apakah vendor boleh menggunakan foto untuk portofolio/media sosial/promosi (biasanya ya, kecuali klien keberatan)
   - Apakah foto boleh diedit/diubah oleh klien?

10. **Klausul Deliverables dan Timeline Pengiriman**: Berapa foto yang diedit, dalam berapa hari diserahkan, format file, media pengiriman.

11. **Klausul Revisi**: Berapa kali revisi yang termasuk, apa yang dimaksud revisi (color grading vs. penambahan elemen), biaya revisi tambahan.

12. **Klausul Kondisi Kerja Vendor**: Makan/minum untuk tim vendor saat bertugas, area untuk menyimpan peralatan, akses ke lokasi.

13. **Klausul Penyelesaian Sengketa**: Musyawarah → Pengadilan Negeri.

### Optional Clauses:
- Klausul second shooter/videografer tambahan
- Klausul overtime: Biaya per jam jika acara melebihi jam yang disepakati
- Klausul drone photography: Penggunaan drone, biaya, izin penerbangan
- Klausul album fisik: Jika termasuk album cetak, spesifikasi dan timeline
- Klausul perlindungan data: Foto tidak disebarkan sebelum klien approve
- Klausul backup data: Kewajiban vendor menyimpan backup selama X bulan

### Legal References:
- KUHPerdata Pasal 1601b (perjanjian pemborongan pekerjaan)
- KUHPerdata Pasal 1320 (syarat sah perjanjian)
- KUHPerdata Pasal 1338 (kebebasan berkontrak)
- KUHPerdata Pasal 1244–1252 (wanprestasi dan force majeure)
- UU No. 28/2014 tentang Hak Cipta (Pasal 1 ayat 3: hak cipta foto/video milik pencipta)
- UU No. 19/2016 tentang ITE (relevan untuk pengiriman file digital)
- UU No. 27/2022 tentang Perlindungan Data Pribadi (jika foto mengandung data pribadi)

### Common Pitfalls / Things Often Missed:
- **Tidak ada klausul pembatalan** — paling sering menjadi sengketa di industri ini
- **DP tidak diatur sebagai hangus** — fotografer/EO sudah blokir tanggal tapi tidak ada kepastian kompensasi
- **Timeline pengiriman foto tidak ada** — klien terus menagih, vendor tidak ada komitmen
- **Jumlah foto edited tidak disebutkan** — ekspektasi klien vs realita vendor berbeda jauh
- **Hak cipta tidak diatur** — klien protes foto dipakai untuk portofolio vendor; atau vendor protes foto diedit klien
- **Overtime tidak dihargai** — acara molor 3 jam tapi vendor tidak dapat bayaran tambahan
- **Tidak ada klausul penggantian vendor** — jika fotografer sakit mendadak, siapa penggantinya?
- **Kondisi kerja vendor tidak diatur** — vendor tidak disediakan makan, area kerja sempit, dll
- **Reschedule tidak dibatasi** — klien bisa reschedule berkali-kali tanpa biaya, memblokir kalender vendor

---

## Ringkasan: Elemen Umum Semua Kontrak Indonesia

### Header Standar:
1. Judul perjanjian
2. Nomor perjanjian (optional tapi profesional)
3. Tanggal dan tempat pembuatan

### Identitas Para Pihak (selalu wajib):
- Nama lengkap sesuai KTP
- NIK / Nomor KTP
- Alamat lengkap
- Nomor telepon

### Penutup Standar:
- Pernyataan bahwa perjanjian dibuat atas kehendak bebas
- "Perjanjian ini dibuat dalam rangkap 2 (dua), masing-masing bermeterai cukup dan mempunyai kekuatan hukum yang sama"
- Tanda tangan para pihak
- Tanda tangan 2 orang saksi (nama lengkap, NIK)
- Meterai Rp 10.000 di setiap eksemplar

### Hierarki Kekuatan Hukum Dokumen:
1. **Akta Notariil** (paling kuat, dibuat di hadapan Notaris) → untuk nilai besar
2. **Akta di Bawah Tangan bermeterai + saksi** → standar umum
3. **Surat pernyataan tanpa saksi bermeterai** → lemah
4. **Perjanjian lisan** → sangat lemah, tidak dapat dibuktikan

---

*Laporan ini disusun untuk keperluan pengembangan perangkat lunak generator kontrak LegalKan. Semua referensi hukum mengacu pada perundang-undangan yang berlaku per 2026. Untuk perjanjian bernilai besar, selalu disarankan berkonsultasi dengan Notaris atau pengacara.*
