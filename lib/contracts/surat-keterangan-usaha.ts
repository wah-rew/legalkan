// ─── Surat Keterangan Usaha (Format Resmi RT/Lurah) ────────────────────────────
// Format resmi yang dikeluarkan oleh Ketua RT — digunakan untuk pengajuan KUR bank

import { formatTanggal, baseCSS, baseFooter } from "./helpers";

export interface SuratKeteranganUsahaData {
  // Business info
  namaUsaha: string;
  jenisUsaha: string;
  alamatUsaha: string;
  lamaUsaha: string; // angka tahun, e.g. "2", "3"

  // Owner
  namaPemilik: string;
  nikPemilik: string;

  // RT/Lurah info
  nomorRT: string;
  nomorRW: string;
  kelurahan: string;
  kecamatan: string;
  kodePos: string;
  kota: string;
  provinsi: string;
  namaKetuaRT: string;
  namaKetuaRW: string;
  namaLurah: string;
  nomorSurat: string; // auto-generated = nomorKontrak
  tanggalSurat: string;

  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateSuratKeteranganUsahaHTML(d: SuratKeteranganUsahaData): string {
  const tglSurat = formatTanggal(d.tanggalSurat || d.tanggalPembuatan);

  const rt = d.nomorRT || "___";
  const rw = d.nomorRW || "___";
  const kelurahan = d.kelurahan || "___________________";
  const kecamatan = d.kecamatan || "___________________";
  const kota = d.kota || "___________________";
  const provinsi = d.provinsi || "___________________";
  const kodePos = d.kodePos || "_____";
  const namaKetuaRT = d.namaKetuaRT || "___________________";
  const namaKetuaRW = d.namaKetuaRW || "___________________";
  const namaLurah = d.namaLurah || "___________________";
  const nomorSurat = d.nomorSurat || d.nomorKontrak;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>
    ${baseCSS()}
    .kop { text-align: center; margin-bottom: 24px; }
    .kop h1 { font-size: 16pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .kop .nomor { font-size: 11pt; margin-top: 4px; }
    .intro { margin: 16px 0; text-align: justify; }
    .data-table { width: 100%; margin: 10px 0; border-collapse: collapse; }
    .data-table td { padding: 4px 8px; vertical-align: top; }
    .data-table td:first-child { width: 200px; font-weight: 600; }
    .data-table td:nth-child(2) { width: 16px; }
    .ttd-table { width: 100%; border-collapse: collapse; margin-top: 40px; }
    .ttd-table td { text-align: center; vertical-align: top; padding: 0 6px; width: 33.33%; }
    .ttd-header { font-weight: 700; font-size: 10pt; margin-bottom: 4px; }
    .ttd-line { height: 70px; border-bottom: 1px solid #333; margin: 4px 12px 6px; }
    .ttd-name { font-weight: 700; font-size: 10pt; }
    .ttd-date { font-size: 9pt; color: #555; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="kop">
    <h1>Surat Keterangan Usaha</h1>
    <div class="nomor">Nomor: ${nomorSurat}</div>
  </div>
  <hr class="divider" />

  <div class="intro">
    <p>Yang bertanda tangan di bawah ini:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama</td><td>:</td><td><strong>${namaKetuaRT}</strong></td></tr>
    <tr><td>Jabatan</td><td>:</td><td>Ketua RT ${rt}</td></tr>
    <tr><td>Alamat</td><td>:</td><td>RT ${rt}/RW ${rw}, Kelurahan ${kelurahan}, Kecamatan ${kecamatan}, ${kota}, ${provinsi}</td></tr>
  </table>

  <div class="intro">
    <p>Dengan ini menerangkan bahwa:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama</td><td>:</td><td><strong>${d.namaPemilik}</strong></td></tr>
    <tr><td>No. KTP</td><td>:</td><td>${d.nikPemilik}</td></tr>
    <tr><td>Alamat</td><td>:</td><td>${d.alamatUsaha}, RT ${rt}/RW ${rw}, Kelurahan ${kelurahan}, Kecamatan ${kecamatan}, ${kota}, ${provinsi} ${kodePos}</td></tr>
  </table>

  <div class="intro">
    <p>Adalah benar-benar warga yang berdomisili di wilayah RT ${rt}/RW ${rw} dan memiliki usaha dengan keterangan sebagai berikut:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama Usaha</td><td>:</td><td><strong>${d.namaUsaha}</strong></td></tr>
    <tr><td>Jenis Usaha</td><td>:</td><td>${d.jenisUsaha}</td></tr>
    <tr><td>Alamat Usaha</td><td>:</td><td>${d.alamatUsaha}, ${kelurahan}, ${kecamatan}, ${kota}</td></tr>
    <tr><td>Lama Usaha</td><td>:</td><td>${d.lamaUsaha} tahun</td></tr>
  </table>

  <div class="intro">
    <p>Usaha tersebut telah berjalan dengan baik dan merupakan mata pencaharian utama yang bersangkutan.</p>
    <p style="margin-top: 12px;">Surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagai salah satu syarat pengajuan Kredit Usaha Rakyat (KUR) di bank.</p>
    <p style="margin-top: 12px;">Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
  </div>

  <p style="margin-top: 32px; margin-bottom: 4px;">${kota}, ${tglSurat}</p>

  <p style="font-weight: 700; margin: 20px 0 8px; text-transform: uppercase; font-size: 10pt; letter-spacing: 1px;">Mengetahui:</p>

  <table class="ttd-table">
    <tr>
      <td>
        <div class="ttd-header">KETUA RT ${rt}</div>
        <div class="ttd-line"></div>
        <div class="ttd-name">${namaKetuaRT}</div>
        <div class="ttd-date">Tanggal: ___________________</div>
      </td>
      <td>
        <div class="ttd-header">KETUA RW ${rw}</div>
        <div class="ttd-line"></div>
        <div class="ttd-name">${namaKetuaRW}</div>
        <div class="ttd-date">Tanggal: ___________________</div>
      </td>
      <td>
        <div class="ttd-header">LURAH ${kelurahan.toUpperCase()}</div>
        <div class="ttd-line"></div>
        <div class="ttd-name">${namaLurah}</div>
        <div class="ttd-date">Tanggal: ___________________</div>
      </td>
    </tr>
  </table>

  ${baseFooter(nomorSurat, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
