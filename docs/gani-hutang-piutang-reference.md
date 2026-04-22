# Gani.ai Hutang Piutang Reference

## Parameters
- AGREEMENT NUMBER, AGREEMENT LOCATION
- LENDER: NAME, ID NUMBER, ADDRESS, BANK NAME, ACCOUNT NUMBER, ACCOUNT HOLDER
- BORROWER: NAME, ID NUMBER, ADDRESS
- LOAN AMOUNT, LOAN DATE, INTEREST RATE (% per bulan)
- LOAN DURATION (months), MONTHLY INSTALLMENT
- FIRST PAYMENT DATE, PAYMENT DUE DATE
- COLLATERAL DESCRIPTION, COLLATERAL VALUE
- LATE PENALTY RATE (% per hari)

## 12 Pasal Structure
1. Dasar Hukum — KUHPerdata 1754-1773, 1320, 1338
2. Objek Perjanjian — jumlah + konfirmasi penerimaan
3. Bunga Pinjaman — % per bulan, proporsional atas saldo
4. Jangka Waktu dan Cara Pembayaran — cicilan bulanan, rekening, early repayment tanpa penalti
5. Jaminan — deskripsi, nilai taksiran, eksekusi jika wanprestasi, tidak bisa dipindahtangan
6. Kewajiban Peminjam — 5 poin
7. Hak Pemberi Pinjaman — 5 poin
8. Wanprestasi dan Konsekuensi — 5 kondisi + 5 konsekuensi (termasuk denda %/hari, seluruh hutang jatuh tempo)
9. Force Majeure — notif 14 hari (berbeda dari yang lain: 14 bukan 7)
10. Pengalihan Hak dan Kewajiban — borrower tidak bisa alihkan, lender bisa
11. Penyelesaian Sengketa — musyawarah 30 hari → mediasi ATAU PN domisili lender
12. Ketentuan Penutup — 2 rangkap, severability clause

## Signature Block
- NIK dicantumkan di bawah nama (berbeda dari sewa yang tidak ada)
- Saksi: nama + NIK + alamat (sama seperti jual beli kendaraan)

## GAP ANALYSIS vs LegalKan `lib/contracts/hutang-piutang.ts`

### Yang ADA di Gani, perlu dicek di LegalKan:
1. **Dasar hukum eksplisit** (Pasal 1) — KUHPerdata pasal spesifik
2. **Konfirmasi penerimaan uang** — "Peminjam mengakui telah menerima uang" (Pasal 2.3) — penting untuk bukti hukum
3. **Bunga proporsional atas saldo** — bukan flat amount
4. **Rekening bank pemberi pinjaman** — untuk pembayaran yang jelas
5. **Early repayment tanpa penalti** (Pasal 4.5) — pro-borrower, perlu ada
6. **Nilai taksiran jaminan** (Pasal 5.2) — field terpisah
7. **Larangan gadaikan jaminan** (Pasal 5.5)
8. **Pasal Pengalihan Hak** (Pasal 10) — lender bisa alihkan ke pihak lain
9. **Denda %/hari** (bukan %/bulan) — Pasal 8.2.a
10. **Seluruh hutang jatuh tempo** saat wanprestasi (Pasal 8.2.b) — acceleration clause
11. **Force majeure 14 hari** (bukan 7 hari)
12. **Severability clause** (Pasal 12.5)
13. **NIK di signature block**
14. **Alamat saksi** di signature block
15. **Lokasi pembuatan** (Dibuat di)
