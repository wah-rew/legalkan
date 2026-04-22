# Gani.ai Konsinyasi Reference

## Parameters
- AGREEMENT NUMBER, AGREEMENT LOCATION
- PENITIP: name, NIK, address, phone
- PENERIMA TITIPAN: nama toko, pemilik, NIK, address, phone
- PRODUCT: name (keripik singkong), qty (200 pcs), HPP (Rp 12.000), selling price, expiry period (days)
- CONTRACT DURATION MONTHS, EFFECTIVE DATE, CONSIGNMENT DELIVERY DATE
- Komisi: 30%

## 14 Pasal (paling lengkap sejauh ini!)
1. Dasar Hukum — KUHPerdata 1792-1819 (Pemberian Kuasa), 1320, 1338, UU 8/1999 Perlindungan Konsumen, UU 20/2008 UMKM
2. Objek Konsinyasi — produk, HPP, harga jual, tanggal serah, masa kadaluarsa
3. Jangka Waktu — durasi, perpanjangan tertulis
4. Sistem Komisi dan Pembagian Hasil — komisi 30%, bagian penitip, perhitungan
5. Pelaporan dan Pembayaran — 14 hari periode, laporan + bukti, pembayaran 14 hari setelah laporan
6. Hak dan Kewajiban Penitip
7. Hak dan Kewajiban Penerima Titipan
8. Tanggung Jawab Kerusakan Barang — cacat produksi (penitip), kelalaian (penerima), force majeure (bersama), kadaluarsa (penitip)
9. Mekanisme Retur Barang — retur konsumen, retur ke penitip, prosedur + berita acara
10. Pengakhiran Kerjasama — normal, sebelum waktunya (30 hari notif), sepihak, pasca pengakhiran
11. Wanprestasi dan Sanksi — denda 2% nilai barang, teguran → denda → ganti rugi → pemutusan
12. Penyelesaian Sengketa — musyawarah 14 hari → mediasi 30 hari → PN domisili Penerima
13. Ketentuan Lain-lain — kerahasiaan, perubahan perjanjian, hukum berlaku
14. Ketentuan Penutup — bermaterai cukup, itikad baik

## GAP ANALYSIS vs LegalKan `lib/contracts/konsinyasi.ts`

### Yang ADA di Gani, cek di LegalKan:
1. **Nomor telepon** para pihak + nama toko (distinct dari nama pemilik)
2. **Dasar hukum** — UU Perlindungan Konsumen + UU UMKM (spesifik konsinyasi)
3. **Masa kadaluarsa produk** — field penting untuk produk makanan
4. **Perhitungan komisi per unit** (breakdown harga jual - komisi)
5. **Pelaporan 14 hari** (bukan bulanan) — lebih sering untuk barang FMCG
6. **Pembayaran 14 hari setelah laporan**
7. **Pasal Kerusakan Barang** — 4 kondisi: cacat produksi, kelalaian, force majeure 24 jam notif, kadaluarsa
8. **Berita acara retur** — prosedur formal
9. **Laporan akhir** 7 hari setelah pengakhiran
10. **Denda 2%** dari nilai barang (keterlambatan bayar)
11. **Bermaterai cukup** — disebutkan eksplisit
12. **NIK + alamat saksi**
13. **Nama toko** sebagai field tersendiri

### Priority HIGH:
- Pasal Kerusakan Barang (Pasal 8) — pembagian tanggung jawab sangat penting
- Mekanisme Retur (Pasal 9) — belum ada di LegalKan
- Masa kadaluarsa produk — krusial untuk makanan/UMKM
