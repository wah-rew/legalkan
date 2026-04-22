# Gani.ai Bagi Hasil Usaha Reference

## Parameters
- AGREEMENT NUMBER, AGREEMENT LOCATION
- PARTY A: name, NIK, address, phone (penyedia modal)
- PARTY B: name, NIK, address, phone (pengelola usaha)
- BUSINESS NAME, BUSINESS ADDRESS, EFFECTIVE DATE, CONTRACT DURATION
- Modal Pihak A (hardcoded Rp 30jt — perlu dynamic)
- Proporsi bagi hasil: A 60%, B 40%
- Tanggal pembagian keuntungan (hardcoded tgl 10)
- Batas keputusan strategis: Rp 5 juta (tambahan modal), Rp 2 juta (investasi)
- Masa pemberitahuan keluar: 3 bulan
- Radius larangan persaingan: 500 meter, durasi 1 tahun setelah berakhir
- Denda wanprestasi: 1% omzet bulanan

## 13 Pasal Structure (paling lengkap!)
1. Dasar Hukum — KUHPerdata 1618-1652 (Persekutuan), 1320, 1338, UU 8/1997 Dokumen Perusahaan
2. Objek Kerjasama — nama usaha, alamat, jangka waktu
3. Kontribusi Para Pihak — modal vs tenaga/manajemen
4. Pembagian Keuntungan dan Kerugian — proporsi, tanggal, cara hitung keuntungan bersih
5. Tata Cara Pelaporan Keuangan — pencatatan harian, laporan bulanan tgl 5, verifikasi, simpan 5 tahun
6. Mekanisme Pengambilan Keputusan — operasional harian vs strategis, batas nilai, dokumentasi
7. Hak dan Kewajiban Para Pihak
8. Prosedur Keluar dari Usaha — 3 bulan notif, audit, penilaian aset, 4 opsi keluar, masa transisi
9. Larangan dan Pembatasan — non-compete 500m 1 tahun, kerahasiaan, penggunaan aset
10. Wanprestasi dan Sanksi — 3 tahap (teguran → denda → pemutusan), ganti rugi nyata + lost profit
11. Penyelesaian Sengketa — musyawarah 30 hari → mediasi 60 hari → BANI atau PN
12. Force Majeure — 5 kondisi termasuk pandemi + pemadaman listrik, kerugian dibagi proporsional
13. Ketentuan Penutup — berlaku, perubahan, severability, 2 rangkap, itikad baik

## Signature Block
- NIK di bawah nama + tanggal per pihak
- Saksi: NIK + alamat

## GAP ANALYSIS vs LegalKan `lib/contracts/bagi-hasil.ts`

### Yang ADA di Gani, perlu dicek/ditambahkan di LegalKan:
1. **Nomor telepon** para pihak
2. **Dasar hukum eksplisit** — KUHPerdata 1618-1652 (Persekutuan) + UU 8/1997
3. **Konfirmasi penggunaan modal** (bahan baku, peralatan, modal kerja)
4. **Tanggal pembagian keuntungan** spesifik (tgl 10 tiap bulan)
5. **Cara hitung keuntungan bersih** — setelah biaya op, penyusutan, cadangan
6. **Laporan keuangan lengkap** — laba rugi, neraca, arus kas; tgl 5 tiap bulan; bukti transaksi
7. **Batas keputusan strategis** — nilai Rp yang memerlukan persetujuan bersama
8. **Dokumentasi keputusan** tertulis ditandatangani
9. **Prosedur keluar komprehensif** — 4 opsi, audit, penilaian aset, masa transisi
10. **Non-compete clause** — radius + durasi setelah berakhir
11. **Sanksi bertingkat** — teguran → denda % omzet → pengurangan keuntungan → pemutusan
12. **Kerugian force majeure** dibagi proporsional
13. **Yurisdiksi** pengadilan tempat kedudukan usaha (bukan domisili pihak)
14. **NIK + alamat saksi** di signature block
15. **Lokasi pembuatan**

### Priority updates (HIGH):
- Laporan keuangan requirements (Pasal 5) — sangat detail dan penting
- Prosedur keluar (Pasal 8) — LegalKan kemungkinan kurang detail
- Non-compete clause (Pasal 9)
- Sanksi bertingkat (Pasal 10)
