// ─── Surat Keterangan Usaha ────────────────────────────────────────────────────
// Dokumen keterangan usaha untuk keperluan KUR dan perbankan

import { formatTanggal, baseCSS, baseFooter } from "./helpers";

export interface SuratKeteranganUsahaData {
  nama_pemilik: string;
  nik_pemilik: string;
  tempat_lahir_pemilik?: string;
  tanggal_lahir_pemilik?: string;
  alamat_pemilik: string;
  nama_usaha: string;
  jenis_usaha: string;
  bidang_usaha: string;
  alamat_usaha: string;
  kota_usaha: string;
  lama_usaha: string; // "2 tahun", "6 bulan", etc.
  tanggal_surat: string;
  kota_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateSuratKeteranganUsahaHTML(d: SuratKeteranganUsahaData): string {
  const tglSurat = formatTanggal(d.tanggal_surat);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>
    ${baseCSS()}
    .kop { text-align: center; margin-bottom: 24px; }
    .kop h1 { font-size: 16pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .kop .nomor { font-size: 11pt; margin-top: 4px; }
    .intro { margin: 20px 0; text-align: justify; }
    .data-table { width: 100%; margin: 16px 0; border-collapse: collapse; }
    .data-table td { padding: 5px 8px; vertical-align: top; }
    .data-table td:first-child { width: 220px; font-weight: 600; }
    .data-table td:nth-child(2) { width: 16px; }
    .pernyataan-box { 
      border: 1px solid #333; 
      padding: 20px 24px; 
      margin: 20px 0; 
      border-radius: 4px;
      background: #f9f9f9;
    }
    .ttd-section { margin-top: 40px; }
    .ttd-block { display: inline-block; width: 220px; text-align: center; vertical-align: top; }
    .ttd-line { height: 70px; border-bottom: 1px solid #333; margin: 0 20px 6px; }
    .materai-box {
      display: inline-block;
      width: 80px; height: 60px;
      border: 1px dashed #888;
      border-radius: 4px;
      text-align: center;
      font-size: 8pt;
      color: #888;
      line-height: 60px;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="kop">
    <h1>Surat Keterangan Usaha</h1>
    <div class="nomor">Nomor: ${d.nomorKontrak}</div>
  </div>
  <hr class="divider" />

  <div class="intro">
    <p>Yang bertanda tangan di bawah ini:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama Lengkap</td><td>:</td><td><strong>${d.nama_pemilik}</strong></td></tr>
    <tr><td>NIK / KTP</td><td>:</td><td>${d.nik_pemilik}</td></tr>
    ${d.tempat_lahir_pemilik ? `<tr><td>Tempat / Tgl Lahir</td><td>:</td><td>${d.tempat_lahir_pemilik}${d.tanggal_lahir_pemilik ? `, ${formatTanggal(d.tanggal_lahir_pemilik)}` : ''}</td></tr>` : ''}
    <tr><td>Alamat</td><td>:</td><td>${d.alamat_pemilik}</td></tr>
  </table>

  <div class="intro">
    <p>Dengan ini menerangkan bahwa benar adanya usaha sebagai berikut:</p>
  </div>

  <div class="pernyataan-box">
    <table class="data-table" style="background: transparent;">
      <tr><td>Nama Usaha</td><td>:</td><td><strong>${d.nama_usaha}</strong></td></tr>
      <tr><td>Jenis / Bentuk Usaha</td><td>:</td><td>${d.jenis_usaha}</td></tr>
      <tr><td>Bidang Usaha</td><td>:</td><td>${d.bidang_usaha}</td></tr>
      <tr><td>Alamat Usaha</td><td>:</td><td>${d.alamat_usaha}, ${d.kota_usaha}</td></tr>
      <tr><td>Lama Usaha Berjalan</td><td>:</td><td>± ${d.lama_usaha}</td></tr>
    </table>
  </div>

  <div class="intro">
    <p>Surat Keterangan Usaha ini dibuat dengan sebenar-benarnya dan dapat digunakan sebagai salah satu syarat pengajuan Kredit Usaha Rakyat (KUR) atau keperluan perbankan lainnya.</p>
    <p style="margin-top: 12px;">Demikian Surat Keterangan Usaha ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
  </div>

  <div class="ttd-section">
    <p style="margin-bottom: 4px;">${d.kota_penandatanganan}, ${tglSurat}</p>
    <p style="margin-bottom: 20px;">Yang Membuat Pernyataan,</p>
    <table style="width: 100%;">
      <tr>
        <td style="width: 50%; text-align: center; vertical-align: top;">
          <div class="materai-box">Materai<br/>Rp 10.000</div>
          <div class="ttd-line"></div>
          <p><strong>${d.nama_pemilik}</strong></p>
          <p style="font-size: 10pt; color: #555;">${d.nik_pemilik}</p>
        </td>
        <td style="width: 50%;"></td>
      </tr>
    </table>
  </div>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
