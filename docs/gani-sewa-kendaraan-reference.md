# Gani.ai Sewa Kendaraan Reference

## Parameters
- AGREEMENT NUMBER, AGREEMENT LOCATION
- PEMILIK: name, NIK, address, phone
- PENYEWA: name, NIK, address, phone
- VEHICLE: merek, model, tahun, warna, no.polisi, no.rangka, no.mesin
- RENTAL: start date, end date, tarif/hari, total, DP %, security deposit
- DENDA keterlambatan: Rp 200.000/jam

## 16 Pasal (terbanyak sejauh ini!)
1. Dasar Hukum — KUHPerdata 1548-1600, UU 22/2009 LLAJ, UU 8/1999 Perlindungan Konsumen
2. Objek Sewa — spesifikasi + kelengkapan (STNK, kunci, toolkit, ban serep, asuransi) + berita acara
3. Jangka Waktu — jam penyerahan/pengembalian spesifik, perpanjangan 24 jam notif
4. Biaya Sewa dan Pembayaran — tarif, DP, jaminan (uang atau KTP/SIM)
5. Hak dan Kewajiban Pemilik
6. Hak dan Kewajiban Penyewa — tangki BBM penuh saat kembali
7. Tanggung Jawab Kerusakan — 4 kondisi: pemakaian normal, kelalaian, total loss, prosedur laporan 2 jam
8. Biaya Operasional — BBM (tangki penuh pp), parkir/tol, perawatan rutin
9. Denda dan Sanksi — Rp 200.000/jam keterlambatan, tilang = penyewa, pelanggaran ilegal 100-200% denda
10. Prosedur Kecelakaan — tindakan segera, laporan 24 jam, klaim asuransi, tanggung jawab hukum penyewa
11. Larangan Penggunaan — balapan, barang berbahaya, merokok, hewan peliharaan, modifikasi, meminjamkan
12. Pengakhiran Perjanjian — normal, sebelum waktunya (tanpa refund), berita acara
13. Wanprestasi dan Sanksi — 3 tahap
14. Penyelesaian Sengketa — musyawarah 14 hari → mediasi 30 hari → PN domisili Pemilik
15. Ketentuan Lain-lain — force majeure 24 jam notif, perubahan tertulis, hukum RI
16. Ketentuan Penutup — bermaterai, itikad baik

## GAP ANALYSIS vs LegalKan `lib/contracts/sewa-kendaraan.ts`

### Yang ADA di Gani, cek LegalKan:
1. **Nomor telepon** para pihak
2. **Dasar hukum**: UU 22/2009 LLAJ + UU Perlindungan Konsumen
3. **Kelengkapan kendaraan** saat serah: toolkit, ban serep, asuransi, buku manual
4. **Berita acara serah terima** — kondisi kendaraan didokumentasikan
5. **Jam penyerahan/pengembalian** spesifik (08.00/18.00 WIB)
6. **Perpanjangan 24 jam** notif sebelum berakhir
7. **Jaminan**: uang ATAU fotokopi KTP/SIM (opsional)
8. **Tarif sudah termasuk asuransi** — disebutkan eksplisit
9. **BBM tangki penuh** saat penyerahan dan pengembalian
10. **Biaya parkir + tol** = penyewa
11. **Prosedur laporan kerusakan 2 jam** setelah kejadian
12. **Prosedur kecelakaan** (Pasal 10) — detail sangat lengkap
13. **Larangan merokok** + hewan peliharaan + modifikasi + balapan
14. **Denda tilang** = penyewa, jaminan ditahan sampai tilang selesai
15. **Early termination tanpa refund** untuk penyewa
16. **Force majeure 24 jam** notif (bukan 7 hari)
17. **NIK + alamat saksi** di signature

### Priority HIGH:
- Pasal Prosedur Kecelakaan (Pasal 10) — belum ada di LegalKan
- Denda tilang + prosedur (Pasal 9.2)
- BBM tangki penuh aturan (Pasal 8.1)
- Berita acara serah terima
