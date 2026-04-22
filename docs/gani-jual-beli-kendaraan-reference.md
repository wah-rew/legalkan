# Gani.ai Jual Beli Kendaraan Reference

## Parameters (20+ fields)
- AGREEMENT NUMBER, AGREEMENT LOCATION, AGREEMENT DATE
- SELLER: NAME, ID NUMBER, ADDRESS, PHONE
- BUYER: NAME, ID NUMBER, ADDRESS, PHONE
- VEHICLE: BRAND, TYPE, YEAR, COLOR, PLATE NUMBER, ENGINE NUMBER, CHASSIS NUMBER
- BPKB NUMBER, STNK VALID UNTIL
- SALE PRICE, PAYMENT METHOD

## 7 Pasal Structure
1. Objek Jual Beli — spesifikasi lengkap kendaraan (merek, tahun, warna, no.polisi, no.mesin, no.rangka, BPKB, STNK)
2. Harga dan Cara Pembayaran — hak kepemilikan beralih saat pembayaran diterima
3. Pernyataan Penjual — 4 jaminan: milik sah, tidak dijaminkan, bebas sengketa, dokumen asli
4. Kondisi Kendaraan "AS-IS" — kendaraan dijual sebagaimana adanya, tidak ada klaim setelah serah terima
5. Penyerahan dan Balik Nama — biaya balik nama = pembeli, penjual wajib bantu dokumen
6. Pajak dan Kewajiban — pajak sebelum serah = penjual, sesudah = pembeli
7. Penutup — 2 rangkap, musyawarah untuk hal yang belum diatur

## Signature
- 2 kolom: Penjual | Pembeli
- Dibuat di [location], tanggal

## GAP ANALYSIS vs LegalKan Current (lib/contracts/jual-beli.ts)

### Yang ADA di Gani, perlu dicek di LegalKan:
1. **No. Telepon** para pihak — mungkin belum ada di form
2. **Nomor BPKB** — field spesifik untuk kendaraan
3. **STNK Berlaku Hingga** — tanggal kadaluarsa STNK
4. **Nomor Mesin + Nomor Rangka** — dua field terpisah
5. **Pernyataan Penjual 4 poin** — jaminan no.3 (bebas sengketa hukum, sitaan) mungkin kurang detail di LegalKan
6. **AS-IS clause** — pastikan sudah ada dan cukup kuat
7. **Pembagian pajak** (sebelum/sesudah serah terima) — Pasal 6 ini penting, mungkin belum ada
8. **Lokasi pembuatan** (dibuat di [city]) — sudah ada atau belum?
9. **Balik nama** — biaya BBNKB eksplisit disebutkan

### Priority Updates:
1. Tambah no. telepon para pihak di form
2. Tambah field STNK berlaku hingga
3. Pastikan pembagian pajak (Pasal 6) ada di template
4. Pastikan AS-IS clause cukup kuat
5. Tambah nomor BPKB sebagai field terpisah

## Signature Block (more complete than sewa)
- 2 kolom: Penjual | Pembeli + tanggal masing-masing
- Saksi 1 | Saksi 2 dengan:
  - Nama
  - KTP
  - **Alamat** ← lebih lengkap dari sewa (sewa hanya nama+KTP)
  - Tanggal per saksi

## Additional gap noted:
- Saksi di jual beli kendaraan perlu field ALAMAT saksi (tidak hanya nama+NIK)
- Update form saksi kendaraan untuk tambah field alamat
