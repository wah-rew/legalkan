// ─── Surat Pernyataan Usaha Aktif ─────────────────────────────────────────────
// Self-declaration bahwa usaha sedang aktif beroperasi, digunakan untuk KUR

import { formatTanggal, baseCSS, baseFooter } from "./helpers";

export interface PernyataanUsahaAktifData {
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
  lama_usaha: string;
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

export function generatePernyataanUsahaAktifHTML(d: PernyataanUsahaAktifData): string {
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
    .intro { margin: 16px 0; text-align: justify; }
    .data-table { width: 100%; margin: 12px 0; border-collapse: collapse; }
    .data-table td { padding: 5px 8px; vertical-align: top; }
    .data-table td:first-child { width: 220px; font-weight: 600; }
    .data-table td:nth-child(2) { width: 16px; }
    .pernyataan-list { margin: 16px 0; }
    .pernyataan-list li { margin-bottom: 10px; text-align: justify; line-height: 1.8; }
    .materai-info { 
      margin: 24px 0 12px; 
      padding: 12px 16px; 
      border: 1px dashed #999; 
      border-radius: 4px;
      font-size: 10pt;
      color: #555;
      background: #fffde7;
    }
    .ttd-section { margin-top: 32px; }
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
    <h1>Surat Pernyataan Usaha Aktif</h1>
    <div class="nomor">Nomor: ${d.nomorKontrak}</div>
  </div>
  <hr class="divider" />

  <div class="intro">
    <p>Saya yang bertanda tangan di bawah ini:</p>
  </div>

  <table class="data-table">
    <tr><td>Nama Lengkap</td><td>:</td><td><strong>${d.nama_pemilik}</strong></td></tr>
    <tr><td>NIK / KTP</td><td>:</td><td>${d.nik_pemilik}</td></tr>
    ${d.tempat_lahir_pemilik ? `<tr><td>Tempat / Tgl Lahir</td><td>:</td><td>${d.tempat_lahir_pemilik}${d.tanggal_lahir_pemilik ? `, ${formatTanggal(d.tanggal_lahir_pemilik)}` : ''}</td></tr>` : ''}
    <tr><td>Alamat</td><td>:</td><td>${d.alamat_pemilik}</td></tr>
    <tr><td>Selaku Pemilik Usaha</td><td>:</td><td><strong>${d.nama_usaha}</strong></td></tr>
    <tr><td>Jenis / Bentuk Usaha</td><td>:</td><td>${d.jenis_usaha}</td></tr>
    <tr><td>Bidang Usaha</td><td>:</td><td>${d.bidang_usaha}</td></tr>
    <tr><td>Alamat Usaha</td><td>:</td><td>${d.alamat_usaha}, ${d.kota_usaha}</td></tr>
    <tr><td>Lama Usaha Berjalan</td><td>:</td><td>± ${d.lama_usaha}</td></tr>
  </table>

  <div class="intro">
    <p>Dengan ini menyatakan dengan sesungguhnya bahwa:</p>
  </div>

  <ol class="pernyataan-list">
    <li>
      Usaha saya tersebut di atas <strong>sedang aktif beroperasi</strong> sebagaimana mestinya pada saat surat pernyataan ini dibuat dan tidak dalam kondisi berhenti, tutup, atau dalam proses likuidasi.
    </li>
    <li>
      Saya <strong>tidak sedang dalam kondisi gagal bayar (default)</strong> kepada pihak kreditur manapun, baik bank, lembaga keuangan, maupun kreditur perorangan, pada saat surat pernyataan ini dibuat.
    </li>
    <li>
      Seluruh kegiatan usaha yang saya jalankan <strong>sesuai dengan ketentuan hukum dan peraturan perundang-undangan</strong> yang berlaku di Negara Kesatuan Republik Indonesia.
    </li>
    <li>
      Data dan informasi yang saya sampaikan kepada pihak bank/lembaga keuangan dalam rangka pengajuan Kredit Usaha Rakyat (KUR) adalah <strong>benar, akurat, dan tidak menyesatkan</strong>.
    </li>
    <li>
      Saya bersedia dan sanggup untuk mempergunakan dana KUR yang diperoleh <strong>semata-mata untuk keperluan usaha</strong> sebagaimana yang saya sampaikan dalam pengajuan.
    </li>
    <li>
      Saya bersedia dikenakan <strong>sanksi hukum sesuai peraturan perundang-undangan</strong> yang berlaku apabila pernyataan ini tidak benar.
    </li>
  </ol>

  <div class="materai-info">
    ⚠️ <strong>Perhatian Meterai:</strong> Surat Pernyataan ini wajib dilekati Meterai Rp 10.000 (sesuai UU No. 10/2020 tentang Bea Meterai) pada kolom tanda tangan agar memiliki kekuatan pembuktian sempurna.
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
          <p style="font-size: 10pt; color: #555;">NIK: ${d.nik_pemilik}</p>
        </td>
        <td style="width: 50%;"></td>
      </tr>
    </table>
  </div>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
