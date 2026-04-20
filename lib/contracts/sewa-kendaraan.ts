// ─── Kontrak Sewa Kendaraan ──────────────────────────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1548–1600

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface SewaKendaraanData {
  // Para Pihak
  nama_pemilik_kendaraan: string;
  nik_pemilik: string;
  alamat_pemilik: string;
  nomor_telepon_pemilik: string;
  nomor_rekening_pemilik: string;
  nama_bank_pemilik: string;
  nama_penyewa: string;
  nik_penyewa: string;
  alamat_penyewa: string;
  nomor_telepon_penyewa: string;
  nomor_sim: string;
  jenis_sim: "A" | "B1" | "B2" | "C" | "D";
  // Detail Kendaraan
  jenis_kendaraan: "motor" | "mobil" | "truk" | "lainnya";
  merek_kendaraan: string;
  model_kendaraan: string;
  tahun_kendaraan: number;
  warna_kendaraan: string;
  nomor_polisi: string;
  nomor_rangka: string;
  nomor_mesin: string;
  kondisi_awal_kendaraan: string;
  km_awal: number;
  // Detail Sewa
  tanggal_mulai_sewa: string;
  tanggal_selesai_sewa: string;
  harga_sewa_per_hari?: number;
  harga_sewa_per_bulan?: number;
  total_harga_sewa: number;
  batas_km_per_hari?: number;
  biaya_km_lebih?: number;
  // Deposit
  jumlah_deposit: number;
  kapan_deposit_dikembalikan: string;
  // Pembayaran
  skema_pembayaran: "lunas_di_muka" | "dp_lunas_saat_kembali";
  // Ketentuan
  area_penggunaan: "dalam_kota" | "dalam_provinsi" | "seluruh_Indonesia";
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  saksi_1_nama?: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateSewaKendaraanHTML(d: SewaKendaraanData): string {
  const pb = new PasalBuilder();
  const tglMulai = formatTanggal(d.tanggal_mulai_sewa);
  const tglSelesai = formatTanggal(d.tanggal_selesai_sewa);
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const totalFormatted = formatRupiah(d.total_harga_sewa);
  const depositFormatted = formatRupiah(d.jumlah_deposit);

  const areaLabel = d.area_penggunaan === "dalam_kota" ? "dalam kota tempat penyewaan"
    : d.area_penggunaan === "dalam_provinsi" ? "dalam wilayah provinsi"
    : "seluruh wilayah Indonesia";

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Perjanjian ini dibuat di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>, oleh dan antara:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemilik / Pemberi Sewa Kendaraan)</p>
      <p><strong>Nama :</strong> ${d.nama_pemilik_kendaraan}</p>
      <p><strong>NIK :</strong> ${d.nik_pemilik}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pemilik}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_pemilik}</p>
      <p><strong>Rekening :</strong> ${d.nama_bank_pemilik} – ${d.nomor_rekening_pemilik}</p>
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Penyewa Kendaraan)</p>
      <p><strong>Nama :</strong> ${d.nama_penyewa}</p>
      <p><strong>NIK :</strong> ${d.nik_penyewa}</p>
      <p><strong>Alamat :</strong> ${d.alamat_penyewa}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_penyewa}</p>
      <p><strong>Nomor SIM :</strong> ${d.nomor_sim} (SIM ${d.jenis_sim})</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong>.</p>
    </div>
  `);

  const objekSewa = pb.pasal("Objek Sewa (Kendaraan)", `
    <p>1. PIHAK PERTAMA menyewakan kepada PIHAK KEDUA kendaraan dengan spesifikasi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Jenis :</strong> ${d.jenis_kendaraan.charAt(0).toUpperCase() + d.jenis_kendaraan.slice(1)}</p>
      <p><strong>Merek/Model :</strong> ${d.merek_kendaraan} ${d.model_kendaraan}</p>
      <p><strong>Tahun :</strong> ${d.tahun_kendaraan}</p>
      <p><strong>Warna :</strong> ${d.warna_kendaraan}</p>
      <p><strong>Nomor Polisi :</strong> ${d.nomor_polisi}</p>
      <p><strong>Nomor Rangka :</strong> ${d.nomor_rangka}</p>
      <p><strong>Nomor Mesin :</strong> ${d.nomor_mesin}</p>
      <p><strong>KM Awal :</strong> ${d.km_awal.toLocaleString("id-ID")} km</p>
    </div>
    <p>2. Kondisi kendaraan saat serah terima: ${d.kondisi_awal_kendaraan}</p>
    <p>3. Penyerahan kendaraan wajib disertai <strong>Berita Acara Serah Terima (BAST)</strong> bermaterai yang ditandatangani Para Pihak, memuat kondisi kendaraan, KM odometer, dan kelengkapan dokumen saat itu. BPKB tetap dipegang oleh PIHAK PERTAMA.</p>
  `);

  const jangkaWaktu = pb.pasal("Jangka Waktu Sewa", `
    <p>1. Sewa kendaraan berlaku dari tanggal <strong>${tglMulai}</strong> sampai dengan <strong>${tglSelesai}</strong>.</p>
    <p>2. Pengembalian kendaraan dilakukan pada waktu dan tempat yang disepakati Para Pihak.</p>
    <p>3. Keterlambatan pengembalian kendaraan dikenakan <strong>denda Rp 50.000 per jam</strong> (atau sesuai kesepakatan) dari tarif sewa harian, terhitung sejak jam seharusnya kendaraan dikembalikan.</p>
    <p>4. Apabila kendaraan tidak dikembalikan lebih dari <strong>24 jam</strong> dari waktu yang disepakati tanpa pemberitahuan, PIHAK PERTAMA berhak melaporkan kepada pihak berwajib.</p>
  `);

  const harga = pb.pasal("Harga Sewa dan Pembayaran", `
    <p>1. Harga sewa yang disepakati:</p>
    <div class="pihak-box">
      ${d.harga_sewa_per_hari ? `<p><strong>Harga per hari :</strong> ${formatRupiah(d.harga_sewa_per_hari)}</p>` : ""}
      ${d.harga_sewa_per_bulan ? `<p><strong>Harga per bulan :</strong> ${formatRupiah(d.harga_sewa_per_bulan)}</p>` : ""}
      <p><strong>Total Harga Sewa :</strong> ${totalFormatted}</p>
      <p><strong>Terbilang :</strong> (${terbilang(d.total_harga_sewa)} rupiah)</p>
    </div>
    <p>2. Pembayaran dilakukan secara <strong>${d.skema_pembayaran === "lunas_di_muka" ? "lunas di muka sebelum kendaraan diserahkan" : "DP di muka, pelunasan saat kendaraan dikembalikan"}</strong> ke rekening PIHAK PERTAMA: ${d.nama_bank_pemilik} – ${d.nomor_rekening_pemilik}.</p>
    ${d.batas_km_per_hari && d.batas_km_per_hari > 0
      ? `<p>3. Batas penggunaan <strong>${d.batas_km_per_hari} km per hari</strong>. Kelebihan dikenakan biaya <strong>${d.biaya_km_lebih ? formatRupiah(d.biaya_km_lebih) + " per km" : "yang disepakati"}</strong>.</p>`
      : `<p>3. Tidak ada batas km harian.</p>`
    }
    <p>${d.batas_km_per_hari && d.batas_km_per_hari > 0 ? "4" : "3"}. BBM, tol, parkir, dan seluruh biaya operasional menjadi tanggung jawab PIHAK KEDUA.</p>
  `);

  const deposit = pb.pasal("Deposit / Uang Jaminan", `
    <p>1. PIHAK KEDUA wajib membayar deposit/uang jaminan sebesar <strong>${depositFormatted}</strong> sebelum kendaraan diserahkan.</p>
    <p>2. Deposit digunakan sebagai jaminan atas kerusakan kendaraan, keterlambatan pengembalian, atau biaya-biaya yang belum dibayarkan PIHAK KEDUA.</p>
    <p>3. Deposit dikembalikan <strong>${d.kapan_deposit_dikembalikan}</strong> setelah kendaraan dikembalikan dalam kondisi baik dan seluruh kewajiban PIHAK KEDUA dipenuhi.</p>
    <p>4. PIHAK PERTAMA berhak memotong deposit untuk biaya perbaikan kerusakan yang disebabkan PIHAK KEDUA, denda keterlambatan, atau tunggakan lainnya.</p>
  `);

  const kewajiban = pb.pasal("Kewajiban dan Larangan Penyewa", `
    <p>1. PIHAK KEDUA berkewajiban untuk:</p>
    <ul>
      <li>Menggunakan kendaraan dengan penuh tanggung jawab sesuai peraturan lalu lintas;</li>
      <li>Merawat kendaraan selama masa sewa seperti milik sendiri;</li>
      <li>Membayar BBM, tol, parkir, dan biaya operasional lainnya;</li>
      <li>Melaporkan kepada PIHAK PERTAMA dalam waktu <strong>2 jam</strong> apabila terjadi kecelakaan atau kerusakan;</li>
      <li>Mengembalikan kendaraan pada waktu yang disepakati dalam kondisi bersih dan tidak lebih buruk dari saat diserahkan.</li>
    </ul>
    <p>2. PIHAK KEDUA <strong>dilarang</strong>:</p>
    <ul>
      <li>Menyewakan kembali kendaraan kepada pihak lain;</li>
      <li>Menggunakan kendaraan untuk kegiatan ilegal, balapan, atau kegiatan yang merusak;</li>
      <li>Membawa kendaraan keluar dari wilayah <strong>${areaLabel}</strong> tanpa izin tertulis PIHAK PERTAMA;</li>
      <li>Memodifikasi kendaraan tanpa izin tertulis;</li>
      <li>Menggadaikan atau meminjamkan kendaraan kepada pihak lain.</li>
    </ul>
  `);

  const kerusakanKecelakaan = pb.pasal("Kerusakan dan Kecelakaan", `
    <p>1. Kerusakan ringan (ban bocor, goresan minor) akibat penggunaan normal menjadi tanggung jawab PIHAK KEDUA.</p>
    <p>2. Kerusakan akibat kecelakaan yang disebabkan oleh kelalaian PIHAK KEDUA sepenuhnya menjadi tanggung jawab PIHAK KEDUA, termasuk biaya perbaikan dan biaya sewa selama masa perbaikan.</p>
    <p>3. Jika kendaraan <strong>hilang atau tidak dapat ditemukan</strong> saat masa sewa, PIHAK KEDUA wajib mengganti kendaraan dengan kendaraan sejenis atau membayar nilai pasar kendaraan pada saat kehilangan, dikurangi nilai asuransi yang diterima (apabila ada).</p>
    <p>4. PIHAK KEDUA wajib segera membuat Laporan Polisi apabila terjadi kecelakaan atau kehilangan dan menyerahkan salinannya kepada PIHAK PERTAMA.</p>
    <p>5. Status asuransi: PIHAK PERTAMA menyatakan kendaraan ${d.jumlah_deposit > 0 ? "telah/belum diasuransikan (lihat informasi polis)." : "tidak diasuransikan. Risiko ditanggung Para Pihak sesuai ketentuan di atas."}</p>
  `);

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Sengketa diselesaikan secara musyawarah dalam 14 (empat belas) hari.</p>
    <p>2. Apabila gagal, diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong>.</p>
    <p>3. Perjanjian ini tunduk pada KUHPerdata Pasal 1548–1600 tentang Sewa-Menyewa.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini dibuat dalam <strong>2 (dua) rangkap</strong> bermaterai cukup, berlaku sejak ditandatangani.</p>
    <p>2. Perubahan hanya sah secara tertulis dan ditandatangani Para Pihak.</p>
  `);

  const disclaimer = disclaimerPasal(pb);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>${baseCSS()}</style>
</head>
<body>
  <h1>PERJANJIAN SEWA KENDARAAN</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Pasal 1548–1600 tentang Sewa-Menyewa</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${objekSewa}
  ${jangkaWaktu}
  ${harga}
  ${deposit}
  ${kewajiban}
  ${kerusakanKecelakaan}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Pemilik Kendaraan)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pemilik_kendaraan}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Penyewa)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_penyewa}</strong></p>
      </td>
    </tr>
  </table>

  ${d.saksi_1_nama ? `
  <p style="text-align: center; margin-top: 24px; font-weight: 700;">SAKSI:</p>
  <table class="tanda-tangan">
    <tr>
      <td colspan="2" style="text-align: center;">
        <p>Saksi</p>
        <div class="ttd-area" style="margin: 8px 200px 4px;"></div>
        <p><strong>${d.saksi_1_nama}</strong></p>
      </td>
    </tr>
  </table>
  ` : ""}

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
