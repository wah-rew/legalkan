// ─── Shared contract helpers ──────────────────────────────────────────────────

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatTanggal(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function terbilang(n: number): string {
  if (!n || n === 0) return "nol";
  const satuan = [
    "", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas",
    "enam belas", "tujuh belas", "delapan belas", "sembilan belas",
  ];
  const puluhan = [
    "", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh",
    "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh",
  ];
  if (n < 20) return satuan[n];
  if (n < 100) return puluhan[Math.floor(n / 10)] + (n % 10 ? " " + satuan[n % 10] : "");
  if (n < 1000) return (n === 100 ? "seratus" : satuan[Math.floor(n / 100)] + " ratus") + (n % 100 ? " " + terbilang(n % 100) : "");
  if (n < 1000000) return (n < 2000 ? "seribu" : terbilang(Math.floor(n / 1000)) + " ribu") + (n % 1000 ? " " + terbilang(n % 1000) : "");
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " juta" + (n % 1000000 ? " " + terbilang(n % 1000000) : "");
  if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + " miliar" + (n % 1000000000 ? " " + terbilang(n % 1000000000) : "");
  return n.toString();
}

export function generateContractNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `LK-${year}${month}-${random}`;
}

export function baseCSS(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.8;
      color: #111;
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 50px;
    }
    h1 { font-size: 14pt; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { text-align: center; font-size: 11pt; margin-bottom: 8px; }
    .nomor { text-align: center; font-size: 11pt; margin-bottom: 20px; }
    .divider { border: none; border-top: 2px solid #333; margin: 16px 0; }
    .pasal { margin-top: 20px; }
    .pasal-title { font-size: 12pt; font-weight: 700; text-transform: uppercase; text-align: center; margin-bottom: 8px; }
    p { text-align: justify; margin-bottom: 6px; }
    .pihak-box { border: 1px solid #ccc; border-radius: 4px; padding: 12px 16px; margin: 10px 0; background: #fafafa; }
    table.tanda-tangan { width: 100%; border-collapse: collapse; margin-top: 20px; }
    table.tanda-tangan td { width: 50%; padding: 8px; text-align: center; vertical-align: top; }
    .ttd-area { height: 80px; border-bottom: 1px solid #333; margin: 8px 20px 4px; }
    .disclaimer-box { margin-top: 24px; padding: 14px 16px; border: 1px dashed #aaa; border-radius: 4px; background: #f9f9f9; font-size: 10pt; color: #555; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #ddd; text-align: center; font-size: 9pt; color: #888; }
    ul { padding-left: 24px; margin-bottom: 8px; }
    li { margin-bottom: 4px; }
  `;
}

export class PasalBuilder {
  private counter = 0;
  pasal(title: string, content: string): string {
    this.counter++;
    const n = this.counter;
    return `
    <div class="pasal">
      <p class="pasal-title">Pasal ${n} — ${title}</p>
      ${content}
    </div>`;
  }
  get current() { return this.counter; }
}

export function disclaimerPasal(pb: PasalBuilder): string {
  return pb.pasal("Disclaimer dan Ketentuan Platform", `
    <p>1. <strong>Status Platform.</strong> Perjanjian ini dibuat menggunakan platform <strong>LegalKan</strong>, sebuah platform teknologi pembuatan dokumen hukum secara mandiri, dan <strong>bukan merupakan kantor hukum, firma hukum, maupun konsultan hukum</strong>. LegalKan tidak memberikan nasihat hukum (<em>legal advice</em>) dalam bentuk apapun.</p>
    <p>2. <strong>Batasan Tanggung Jawab.</strong> LegalKan, para pemilik, pengelola, karyawan, mitra, dan seluruh pihak terkait <strong>tidak dapat dimintai pertanggungjawaban</strong>, digugat, atau dijadikan pihak dalam sengketa yang timbul dari penggunaan dokumen ini. Tanggung jawab sepenuhnya berada pada Para Pihak yang menandatangani.</p>
    <p>3. <strong>Kebenaran Data.</strong> Para Pihak menjamin seluruh data yang dimasukkan adalah benar, akurat, dan sah. LegalKan tidak bertanggung jawab atas kerugian akibat data yang tidak benar atau menyesatkan.</p>
    <p>4. <strong>Rekomendasi.</strong> Untuk kasus kompleks atau bernilai besar, Para Pihak <strong>dianjurkan berkonsultasi dengan advokat atau notaris</strong> sebelum menandatangani Perjanjian ini.</p>
    <p>5. <strong>Meterai.</strong> Perjanjian ini wajib dilekati <strong>Meterai Rp 10.000</strong> (sesuai UU No. 10/2020 tentang Bea Meterai) pada setiap eksemplar yang ditandatangani agar memiliki kekuatan pembuktian sempurna di pengadilan.</p>
  `);
}

export function baseFooter(nomorKontrak: string, tanggalPembuatan: string): string {
  return `
  <div class="disclaimer-box">
    <strong>CATATAN PENTING:</strong> Dokumen ini dibuat menggunakan platform LegalKan. LegalKan bukan kantor hukum dan tidak memberikan nasihat hukum. LegalKan tidak bertanggung jawab atas sengketa yang timbul dari perjanjian ini. Tempelkan Meterai Rp 10.000 pada setiap eksemplar sebelum penandatanganan.
  </div>
  <div class="footer">
    <p>📜 Dokumen ini dibuat secara digital oleh <strong>LegalKan</strong></p>
    <p>Nomor Referensi: ${nomorKontrak} · Dibuat: ${tanggalPembuatan}</p>
    <p>www.legal-kan.com — Legal-kan sekarang.</p>
  </div>
  `;
}
