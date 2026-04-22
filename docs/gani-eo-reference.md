# Gani.ai EO Pernikahan Reference

## Parameters
- AGREEMENT NUMBER, AGREEMENT LOCATION
- EO: company name (CV Meriah Jaya), representative, title, NIK, address, phone, email, bank name, account number, account holder
- CLIENT: groom name, bride name, NIK (salah satu), address, phone, email
- EVENT: date, time, venue, jumlah tamu (200)
- Total: Rp 75 juta, DP 40% Rp 30 juta, sisa H-14
- Cancellation tiers: >90 hari, 60-90 hari, 30-60 hari, <30 hari (% masing-masing)

## 15 Pasal Structure
1. Dasar Hukum — KUHPerdata 1601b-1617 (Pemborongan), 1320, 1338, UU 8/1999, UU 28/2014 Hak Cipta
2. Objek Perjanjian — tanggal, waktu, venue, jumlah tamu, rundown
3. Ruang Lingkup Layanan — 5 kategori: dekorasi, catering, dokumentasi, koordinasi, tambahan
4. Nilai Kontrak dan Pembayaran — total, DP, sisa H-14, rekening, ketentuan
5. Hak dan Kewajiban EO — termasuk hak portofolio foto
6. Hak dan Kewajiban Klien — akses venue, konfirmasi H-7, contact person
7. Kebijakan Pembatalan Bertingkat (4 TIER)
8. Force Majeure — 6 kondisi, penundaan/pembatalan, pembagian kerugian proporsional, max 6 bulan
9. Hak Cipta Foto dan Video — kepemilikan bersama, hak personal klien, hak komersial terbatas EO
10. Perubahan dan Tambahan Layanan — minor (H-14), major (H-30), tambahan, pengurangan
11. Tanggung Jawab dan Asuransi — batas tanggung jawab max = nilai kontrak
12. Koordinasi dan Komunikasi — meeting H-60/H-30/H-7, hotline darurat, WA group
13. Penyelesaian Sengketa — musyawarah 14 hari → mediasi 30 hari → BANI → PN
14. Ketentuan Lain-lain — kerahasiaan, subkontrak, HKI konsep, compliance perizinan
15. Ketentuan Penutup — bermaterai, adendum, itikad baik win-win

## GAP ANALYSIS vs LegalKan `lib/contracts/event-organizer.ts`

### Yang ADA di Gani, cek LegalKan:
1. **Email** para pihak (EO + klien)
2. **Nama mempelai pria + wanita** sebagai field terpisah
3. **Dasar hukum**: KUHPerdata 1601b-1617 (Pemborongan), UU 28/2014 Hak Cipta
4. **Drone photography** — disebutkan eksplisit
5. **Menu tasting** — max 2 kali, perlu ada di scope
6. **Meeting schedule**: H-60, H-30, H-7, H-3 final meeting
7. **Hotline darurat** H-1 dan hari H
8. **WhatsApp group** untuk komunikasi tim
9. **Contact person 24/7** H-7 sampai selesai
10. **Force majeure max 6 bulan** — batas waktu spesifik
11. **Penundaan vs pembatalan** force majeure — opsi rescheduling tanpa penalti
12. **Hak cipta bersama** — klien punya hak personal, EO hak komersial terbatas (bukan semua milik EO)
13. **Kewajiban credit EO** saat klien share di medsos
14. **Subkontrak**: EO boleh pakai subkontrak tapi tetap tanggung jawab penuh
15. **Batas tanggung jawab finansial** = maks nilai kontrak
16. **Asuransi EO** — pertanggungjawaban umum + equipment
17. **Perubahan minor H-14** vs **major H-30** — distingi jelas
18. **Pengurangan layanan H-21** — tidak otomatis refund
19. **Compliance perizinan** — tanggung jawab EO
20. **NIK + alamat saksi**

### Priority HIGH:
- Hak cipta bersama (Pasal 9) — LegalKan mungkin semua milik EO, perlu diupdate
- Meeting schedule (Pasal 12) — belum ada di LegalKan
- Batas tanggung jawab finansial (Pasal 11.2.d)
- Subkontrak clause (Pasal 14.2)
- Force majeure penundaan vs pembatalan (Pasal 8.3)
