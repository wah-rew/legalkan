// ─── Surat Kuasa ──────────────────────────────────────────────────────────────
// Surat Kuasa untuk Direksi/Pengurus CV/PT dalam keperluan pengajuan KUR

import { formatTanggal, baseCSS, baseFooter } from "./helpers";

export interface SuratKuasaData {
  // Pemberi Kuasa
  nama_pemberi_kuasa: string;
  jabatan_pemberi_kuasa: string; // "Direktur Utama", "Direktur", "Pengurus"
  nama_perusahaan: string;
  bentuk_perusahaan: string; // "CV", "PT", "Koperasi"
  alamat_perusahaan: string;
  kota_perusahaan: string;
  nik_pemberi_kuasa?: string;
  // Penerima Kuasa
  nama_penerima_kuasa: string;
  jabatan_penerima_kuasa: string; // "Manajer Keuangan", "Wakil Direktur", etc.
  nik_penerima_kuasa?: string;
  alamat_penerima_kuasa?: string;
  // Keperluan
  keperluan_kuasa: string; // e.g., "pengajuan KUR di Bank BRI"
  nama_bank?: string;
  // Tanggal
  tanggal_surat: string;
  masa_berlaku?: string; // e.g., "3 bulan sejak tanggal surat"
  kota_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateSuratKuasaHTML(d: SuratKuasaData): string {
  const tglSurat = formatTanggal(d.tanggal_surat);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>
    ${baseCSS()}
    .kop { text-align: center; margin-bottom: 24px; }
    .kop h1 { font-size: 16pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .kop .subtitle-doc { font-size: 11pt; margin-top: 4px; }
    .kop .nomor { font-size: 11pt; margin-top: 2px; }
    .intro { margin: 16px 0; text-align: justify; }
    .data-table { width: 100%; margin: 12px 0; border-collapse: collapse; }
    .data-table td { padding: 5px 8px; vertical-align: top; }
    .data-table td:first-child { width: 200px; font-weight: 600; }
    .data-table td:nth-child(2) { width: 16px; }
    .kuasa-body { 
      margin: 20px 0;
      padding: 16px 20px;
      border: 1px solid #333;
      border-radius: 4px;
      background: #f9f9f9;
    }
    .kuasa-body p { margin-bottom: 10px; line-height: 1.8; }
    .ttd-section { margin-top: 40px; }
    .ttd-table { width: 100%; border-collapse: collapse; }
    .ttd-table td { width: 50%; padding: 8px; text-align: center; vertical-align: top; }
    .ttd-line { height: 70px; border-bottom: 1px solid #333; margin: 0 30px 6px; }
    .materai-box {
      display: block;
      width: 80px; height: 60px;
      border: 1px dashed #888;
      border-radius: 4px;
      text-align: center;
      font-size: 8pt;
      color: #888;
      line-height: 60px;
      margin: 0 auto 8px;
    }
  </style>
</head>
<body>
  <div class="kop">
    <h1>Surat Kuasa</h1>
    <div class="subtitle-doc">Untuk Keperluan Pengajuan Kredit Usaha Rakyat (KUR)</div>
    <div class="nomor">Nomor: ${d.nomorKontrak}</div>
  </div>
  <hr class="divider" />

  <div class="intro">
    <p>Yang bertanda tangan di bawah ini:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama</td><td>:</td><td><strong>${d.nama_pemberi_kuasa}</strong></td></tr>
    <tr><td>Jabatan</td><td>:</td><td>${d.jabatan_pemberi_kuasa}</td></tr>
    ${d.nik_pemberi_kuasa ? `<tr><td>NIK / KTP</td><td>:</td><td>${d.nik_pemberi_kuasa}</td></tr>` : ''}
    <tr><td>Bertindak untuk dan atas nama</td><td>:</td><td><strong>${d.bentuk_perusahaan} ${d.nama_perusahaan}</strong></td></tr>
    <tr><td>Alamat Perusahaan</td><td>:</td><td>${d.alamat_perusahaan}, ${d.kota_perusahaan}</td></tr>
  </table>

  <div class="intro">
    <p>Selanjutnya disebut sebagai <strong>PEMBERI KUASA</strong>.</p>
    <p style="margin-top: 12px;">Dengan ini memberikan kuasa kepada:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama</td><td>:</td><td><strong>${d.nama_penerima_kuasa}</strong></td></tr>
    <tr><td>Jabatan</td><td>:</td><td>${d.jabatan_penerima_kuasa}</td></tr>
    ${d.nik_penerima_kuasa ? `<tr><td>NIK / KTP</td><td>:</td><td>${d.nik_penerima_kuasa}</td></tr>` : ''}
    ${d.alamat_penerima_kuasa ? `<tr><td>Alamat</td><td>:</td><td>${d.alamat_penerima_kuasa}</td></tr>` : ''}
  </table>

  <div class="intro">
    <p>Selanjutnya disebut sebagai <strong>PENERIMA KUASA</strong>.</p>
  </div>

  <div class="kuasa-body">
    <p><strong>UNTUK DAN ATAS NAMA</strong> PEMBERI KUASA, melakukan tindakan-tindakan hukum sebagai berikut:</p>
    <ol style="padding-left: 20px;">
      <li>
        Mewakili ${d.bentuk_perusahaan} ${d.nama_perusahaan} dalam rangka <strong>${d.keperluan_kuasa}${d.nama_bank ? ` di ${d.nama_bank}` : ''}</strong>.
      </li>
      <li>
        Menandatangani formulir, dokumen, surat permohonan, dan segala berkas yang diperlukan dalam proses pengajuan Kredit Usaha Rakyat (KUR).
      </li>
      <li>
        Memberikan keterangan, informasi, dan klarifikasi yang dibutuhkan oleh pihak bank/lembaga keuangan terkait profil dan kondisi usaha.
      </li>
      <li>
        Menerima dan menandatangani akad kredit serta dokumen perjanjian lainnya yang timbul dari proses pengajuan KUR tersebut.
      </li>
    </ol>
    <p style="margin-top: 12px;">
      Surat kuasa ini berlaku sejak tanggal ditandatangani${d.masa_berlaku ? ` sampai dengan <strong>${d.masa_berlaku}</strong>` : ' dan dapat dicabut sewaktu-waktu oleh Pemberi Kuasa'}.
    </p>
  </div>

  <div class="intro">
    <p>Demikian Surat Kuasa ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
  </div>

  <div class="ttd-section">
    <p style="text-align: center; margin-bottom: 20px;">${d.kota_penandatanganan}, ${tglSurat}</p>
    <table class="ttd-table">
      <tr>
        <td>
          <p>Penerima Kuasa</p>
          <div class="ttd-line"></div>
          <p><strong>${d.nama_penerima_kuasa}</strong></p>
          <p style="font-size: 10pt; color: #555;">${d.jabatan_penerima_kuasa}</p>
        </td>
        <td>
          <p>Pemberi Kuasa</p>
          <div class="materai-box">Materai<br/>Rp 10.000</div>
          <div class="ttd-line"></div>
          <p><strong>${d.nama_pemberi_kuasa}</strong></p>
          <p style="font-size: 10pt; color: #555;">${d.jabatan_pemberi_kuasa}, ${d.bentuk_perusahaan} ${d.nama_perusahaan}</p>
        </td>
      </tr>
    </table>
  </div>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
