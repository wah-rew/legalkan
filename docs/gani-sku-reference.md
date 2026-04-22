# Gani.ai SKU Reference — Surat Keterangan Usaha

## Key Insight
Gani menggunakan format SKU yang ditandatangani oleh RT/RW/Lurah — 
ini adalah format RESMI yang dikeluarkan oleh pejabat setempat.

LegalKan saat ini generate SKU sebagai surat pernyataan MANDIRI dari pemilik usaha.
Ini dua format yang BERBEDA dan keduanya valid untuk kebutuhan berbeda.

## Parameters Gani (20 fields)
- LETTER NUMBER
- RT HEAD NAME, RT NUMBER, RW NUMBER
- KELURAHAN, KECAMATAN, CITY, PROVINCE
- BUSINESS OWNER NAME, BUSINESS OWNER ID NUMBER
- BUSINESS ADDRESS, BUSINESS POSTAL CODE
- Nama Usaha, Jenis Usaha (hardcoded "Warung Sembako" — perlu dynamic)
- BUSINESS DURATION YEARS
- RW HEAD NAME, LURAH NAME
- RT SIGNATURE DATE, RW SIGNATURE DATE, LURAH SIGNATURE DATE

## Format Structure
- Kop surat dari RT (bukan dari pemilik usaha)
- "Yang bertanda tangan di bawah ini" = Ketua RT
- Menerangkan bahwa PEMILIK USAHA adalah warga + punya usaha
- Tanda tangan 3 pihak: RT + RW + Lurah
- Dibuat di [CITY], tanggal

## Gap vs LegalKan Current:
### LegalKan SKU format sekarang (surat mandiri):
- Pemilik usaha yang membuat pernyataan sendiri
- Tidak ada tanda tangan RT/RW/Lurah
- Lebih simpel tapi kurang "official"

### Gani SKU format (surat dari RT):
- Dikeluarkan oleh Ketua RT → lebih resmi
- Ada 3 tanda tangan (RT + RW + Lurah)
- Lebih kuat untuk syarat KUR bank
- Butuh data: nama RT, RW, Lurah, nomor RT/RW, kelurahan, kecamatan

## Recommendation:
Buat DUA varian SKU di LegalKan:
1. "SKU Mandiri" (yang sudah ada) — untuk kebutuhan informal, tidak butuh aparat
2. "SKU RT/Lurah" (format Gani) — untuk KUR bank, lebih kuat secara hukum

Atau: Update form KUR wizard untuk gunakan format RT/Lurah
dan tambahkan field: nama RT, nama RW, nama Lurah, nomor RT/RW, kelurahan, kecamatan, kode pos

## Additional fields needed in LegalKan form for this format:
- Nomor RT, Nomor RW
- Nama Ketua RT
- Nama Ketua RW  
- Nama Lurah
- Kelurahan, Kecamatan, Kode Pos
- Jenis usaha (lebih specific — bukan hanya bidang)
- Nama usaha (distinct from owner name)
