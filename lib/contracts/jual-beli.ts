// ─── Surat Perjanjian Jual Beli Barang Secondhand ────────────────────────────
// Dasar hukum: KUHPerdata Pasal 1457–1540

import { formatRupiah, formatTanggal, terbilang, baseCSS, PasalBuilder, disclaimerPasal, baseFooter } from "./helpers";

export interface JualBeliData {
  // Para Pihak
  nama_penjual: string;
  nik_penjual: string;
  alamat_penjual: string;
  nomor_telepon_penjual: string;
  nomor_rekening_penjual?: string;
  nama_bank_penjual?: string;
  nama_pembeli: string;
  nik_pembeli: string;
  alamat_pembeli: string;
  nomor_telepon_pembeli: string;
  // Detail Barang
  jenis_barang: "kendaraan_bermotor" | "elektronik" | "furnitur" | "perhiasan" | "mesin" | "lainnya";
  nama_barang: string;
  merek: string;
  model_tipe: string;
  tahun_pembuatan?: number;
  warna?: string;
  kondisi_barang: "sangat_baik" | "baik" | "cukup_baik" | "perlu_perbaikan";
  deskripsi_kondisi: string;
  // Untuk Kendaraan
  nomor_polisi?: string;
  nomor_rangka?: string;
  nomor_mesin?: string;
  km_odometer?: number;
  nomorBPKB?: string;
  stnkBerlakuHingga?: string;
  // Untuk Elektronik
  nomor_seri?: string;
  // Harga
  harga_jual: number;
  cara_pembayaran: "tunai" | "transfer" | "dp_pelunasan";
  jumlah_dp?: number;
  tanggal_pembayaran_dp?: string;
  tanggal_pelunasan?: string;
  // Serah Terima
  tanggal_serah_terima: string;
  lokasi_serah_terima: string;
  // Saksi
  saksi_nama: string;
  saksi_nik?: string;
  saksi1Alamat?: string;
  saksi2Alamat?: string;
  // Penandatanganan
  lokasiPembuatan?: string;
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp?: string;
  nomorKontrak: string;
  tanggalPembuatan: string;
  contractType: string;
  contractTitle: string;
}

export function generateJualBeliHTML(d: JualBeliData): string {
  const pb = new PasalBuilder();
  const tglTtd = formatTanggal(d.tanggal_penandatanganan);
  const tglSerahTerima = formatTanggal(d.tanggal_serah_terima);
  const hargaFormatted = formatRupiah(d.harga_jual);
  const hargaTerbilang = terbilang(d.harga_jual);

  const kondisiLabel = d.kondisi_barang === "sangat_baik" ? "Sangat Baik"
    : d.kondisi_barang === "baik" ? "Baik"
    : d.kondisi_barang === "cukup_baik" ? "Cukup Baik"
    : "Perlu Perbaikan";

  const isKendaraan = d.jenis_barang === "kendaraan_bermotor";

  const paraPihak = pb.pasal("Para Pihak", `
    <p>Di <strong>${d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>, Perjanjian Jual Beli ini dibuat dan ditandatangani oleh:</p>
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Penjual)</p>
      <p><strong>Nama :</strong> ${d.nama_penjual}</p>
      <p><strong>NIK :</strong> ${d.nik_penjual}</p>
      <p><strong>Alamat :</strong> ${d.alamat_penjual}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_penjual}</p>
      ${d.nomor_rekening_penjual ? `<p><strong>Rekening :</strong> ${d.nama_bank_penjual} – ${d.nomor_rekening_penjual}</p>` : ""}
      <p>Selanjutnya disebut <strong>"PIHAK PERTAMA"</strong> atau <strong>"Penjual"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Pembeli)</p>
      <p><strong>Nama :</strong> ${d.nama_pembeli}</p>
      <p><strong>NIK :</strong> ${d.nik_pembeli}</p>
      <p><strong>Alamat :</strong> ${d.alamat_pembeli}</p>
      <p><strong>Telepon :</strong> ${d.nomor_telepon_pembeli}</p>
      <p>Selanjutnya disebut <strong>"PIHAK KEDUA"</strong> atau <strong>"Pembeli"</strong>.</p>
    </div>
    <p>Para Pihak sepakat melakukan transaksi jual beli barang bekas (<em>secondhand</em>) atas kehendak bebas sesuai KUHPerdata Pasal 1320 dan Pasal 1457.</p>
  `);

  const deskripsiBarang = pb.pasal("Deskripsi Barang", `
    <p>1. PIHAK PERTAMA menjual kepada PIHAK KEDUA barang dengan spesifikasi sebagai berikut:</p>
    <div class="pihak-box">
      <p><strong>Nama Barang :</strong> ${d.nama_barang}</p>
      <p><strong>Jenis :</strong> ${d.jenis_barang.replace(/_/g, " ")}</p>
      <p><strong>Merek/Tipe :</strong> ${d.merek} ${d.model_tipe}</p>
      ${d.tahun_pembuatan ? `<p><strong>Tahun :</strong> ${d.tahun_pembuatan}</p>` : ""}
      ${d.warna ? `<p><strong>Warna :</strong> ${d.warna}</p>` : ""}
      <p><strong>Kondisi :</strong> ${kondisiLabel}</p>
      ${isKendaraan && d.nomor_polisi ? `<p><strong>Nomor Polisi :</strong> ${d.nomor_polisi}</p>` : ""}
      ${isKendaraan && d.nomor_rangka ? `<p><strong>Nomor Rangka :</strong> ${d.nomor_rangka}</p>` : ""}
      ${isKendaraan && d.nomor_mesin ? `<p><strong>Nomor Mesin :</strong> ${d.nomor_mesin}</p>` : ""}
      ${isKendaraan && d.km_odometer ? `<p><strong>KM Odometer :</strong> ${d.km_odometer.toLocaleString("id-ID")} km</p>` : ""}
      ${isKendaraan && d.nomorBPKB ? `<p><strong>Nomor BPKB :</strong> ${d.nomorBPKB}</p>` : ""}
      ${isKendaraan && d.stnkBerlakuHingga ? `<p><strong>STNK Berlaku Hingga :</strong> ${formatTanggal(d.stnkBerlakuHingga)}</p>` : ""}
      ${d.nomor_seri ? `<p><strong>Nomor Seri/IMEI :</strong> ${d.nomor_seri}</p>` : ""}
    </div>
    <p>2. <strong>Keterangan Kondisi:</strong> ${d.deskripsi_kondisi}</p>
    <p>3. Dengan menandatangani Perjanjian ini, PIHAK KEDUA menyatakan telah memeriksa kondisi barang secara langsung dan bersedia menerima barang dalam keadaan <strong>apa adanya ("as is")</strong>. Segala cacat atau kekurangan yang telah diketahui maupun yang seharusnya dapat diketahui saat pemeriksaan bukan merupakan tanggung jawab PIHAK PERTAMA.</p>
  `);

  const kepemilikanKeaslian = pb.pasal("Kepemilikan dan Keaslian Barang", `
    <p>1. Guna memberikan kepastian hukum kepada PIHAK KEDUA, PIHAK PERTAMA menyatakan dan memberikan jaminan bahwa:</p>
    <ul>
      <li>Barang yang dijual adalah <strong>milik sah PIHAK PERTAMA</strong> dan PIHAK PERTAMA memiliki hak penuh untuk menjualnya;</li>
      <li>Barang <strong>tidak sedang dalam sengketa hukum</strong> apapun;</li>
      <li>Barang <strong>tidak sedang dijaminkan</strong> kepada pihak manapun;</li>
      <li>Barang <strong>tidak diperoleh dari cara melanggar hukum</strong> (bukan curian, bukan hasil tindak pidana);</li>
      <li>Barang <strong>bebas dari beban hutang atau tanggungan</strong> pihak lain.</li>
    </ul>
    <p>2. Apabila pernyataan di atas terbukti tidak benar, PIHAK PERTAMA bertanggung jawab penuh atas segala kerugian yang diderita PIHAK KEDUA dan wajib mengembalikan harga jual beserta ganti rugi yang layak.</p>
    <p>3. Penjualan barang yang tidak dimiliki secara sah dapat berakibat pidana sesuai KUHP Pasal 372 (penggelapan) atau Pasal 480 (penadahan).</p>
  `);

  let pembayaranDetail = "";
  if (d.cara_pembayaran === "tunai") {
    pembayaranDetail = `<p>3. Pembayaran dilakukan secara <strong>tunai</strong> pada saat serah terima barang.</p>`;
  } else if (d.cara_pembayaran === "transfer") {
    pembayaranDetail = `<p>3. Pembayaran dilakukan melalui <strong>transfer bank</strong> ke rekening PIHAK PERTAMA: ${d.nama_bank_penjual} – ${d.nomor_rekening_penjual}.</p>`;
  } else {
    const dpAmt = d.jumlah_dp ? formatRupiah(d.jumlah_dp) : "-";
    const sisaAmt = d.jumlah_dp ? formatRupiah(d.harga_jual - d.jumlah_dp) : "-";
    pembayaranDetail = `
      <p>3. Pembayaran dilakukan dengan mekanisme DP dan Pelunasan:</p>
      <ul>
        <li><strong>Uang Muka (DP):</strong> ${dpAmt} dibayar pada ${d.tanggal_pembayaran_dp ? formatTanggal(d.tanggal_pembayaran_dp) : "tanggal disepakati"}.</li>
        <li><strong>Pelunasan:</strong> ${sisaAmt} dibayar pada ${d.tanggal_pelunasan ? formatTanggal(d.tanggal_pelunasan) : "tanggal disepakati"}.</li>
      </ul>
    `;
  }

  const harga = pb.pasal("Harga Jual dan Cara Pembayaran", `
    <p>1. Harga jual yang disepakati adalah:</p>
    <div class="pihak-box">
      <p><strong>Harga Jual : ${hargaFormatted}</strong></p>
      <p><strong>Terbilang :</strong> (${hargaTerbilang} rupiah)</p>
    </div>
    <p>2. Para Pihak menyatakan bahwa harga tersebut telah disepakati atas kehendak bebas tanpa paksaan.</p>
    ${pembayaranDetail}
    <p>4. <strong>Hak kepemilikan barang beralih kepada PIHAK KEDUA</strong> terhitung sejak diterimanya pembayaran lunas oleh PIHAK PERTAMA dan selesainya prosedur serah terima.</p>
  `);

  const serahTerima = pb.pasal("Serah Terima Barang", `
    <p>1. Serah terima barang dilakukan pada tanggal <strong>${tglSerahTerima}</strong> di <strong>${d.lokasi_serah_terima}</strong>.</p>
    <p>2. Saat serah terima, PIHAK PERTAMA menyerahkan barang beserta dokumen/aksesoris yang menjadi bagian dari transaksi ini.</p>
    ${isKendaraan ? `<p>3. Untuk kendaraan bermotor, PIHAK PERTAMA menyerahkan STNK asli. BPKB diserahkan setelah proses balik nama selesai atau sesuai kesepakatan tertulis Para Pihak.</p>` : ""}
    <p>${isKendaraan ? "4" : "3"}. Setelah serah terima, <strong>risiko kerusakan atau kehilangan barang berpindah sepenuhnya kepada PIHAK KEDUA</strong>.</p>
    ${isKendaraan ? `<p>5. Biaya balik nama STNK dan BPKB menjadi tanggung jawab <strong>PIHAK KEDUA</strong> kecuali disepakati lain secara tertulis.</p>` : ""}
  `);

  const pajakKewajiban = isKendaraan ? pb.pasal("Pajak dan Kewajiban", `
    <p>1. Segala pajak kendaraan yang jatuh tempo <strong>sebelum tanggal serah terima</strong> menjadi tanggung jawab sepenuhnya <strong>PIHAK PERTAMA</strong> (Penjual).</p>
    <p>2. Segala pajak kendaraan yang jatuh tempo <strong>setelah tanggal serah terima</strong>, termasuk PKB, BBNKB, dan pajak lain yang timbul, menjadi tanggung jawab sepenuhnya <strong>PIHAK KEDUA</strong> (Pembeli).</p>
    <p>3. Segala kewajiban hukum yang timbul setelah penyerahan kendaraan, termasuk namun tidak terbatas pada denda tilang, pelanggaran lalu lintas, dan tanggung jawab perdata/pidana atas penggunaan kendaraan, sepenuhnya menjadi tanggung jawab <strong>PIHAK KEDUA</strong>.</p>
  `) : "";

  const sengketa = pb.pasal("Penyelesaian Sengketa", `
    <p>1. Setiap perselisihan yang timbul dari Perjanjian ini diselesaikan terlebih dahulu melalui musyawarah dalam jangka waktu 14 (empat belas) hari.</p>
    <p>2. Apabila gagal, diselesaikan melalui <strong>Pengadilan Negeri ${d.kota_penandatanganan}</strong>.</p>
    <p>3. Perjanjian ini tunduk pada KUHPerdata Pasal 1457–1540 tentang Jual Beli.</p>
  `);

  const ketentuan = pb.pasal("Ketentuan Umum", `
    <p>1. Perjanjian ini disusun dalam <strong>2 (dua) rangkap</strong> bermaterai cukup sesuai ketentuan perundang-undangan yang berlaku.</p>
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
  <h1>SURAT PERJANJIAN JUAL BELI</h1>
  <p class="subtitle">Barang Bekas / Secondhand — KUHPerdata Pasal 1457–1540</p>
  <p class="nomor">Nomor: ${d.nomorKontrak}</p>
  <hr class="divider" />

  ${paraPihak}
  ${deskripsiBarang}
  ${kepemilikanKeaslian}
  ${harga}
  ${serahTerima}
  ${pajakKewajiban}
  ${sengketa}
  ${ketentuan}
  ${disclaimer}

  <hr class="divider" style="margin-top: 32px;" />
  <p style="text-align: center; margin-bottom: 16px;">
    Demikianlah Perjanjian ini dibuat di <strong>${d.lokasiPembuatan || d.kota_penandatanganan}</strong> pada tanggal <strong>${tglTtd}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Penjual)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_penjual}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Pembeli)</p>
        <div class="ttd-area"></div>
        <p><strong>${d.nama_pembeli}</strong></p>
      </td>
    </tr>
  </table>

  <p style="text-align: center; margin-top: 24px; font-weight: 700;">SAKSI:</p>
  <table class="tanda-tangan">
    <tr>
      <td colspan="2" style="text-align: center;">
        <div class="ttd-area" style="margin: 8px 200px 4px;"></div>
        <p><strong>${d.saksi_nama}</strong></p>
        ${d.saksi_nik ? `<p style="font-size: 10pt;">NIK: ${d.saksi_nik}</p>` : ""}
        ${d.saksi1Alamat ? `<p style="font-size: 10pt;">Alamat: ${d.saksi1Alamat}</p>` : ""}
      </td>
    </tr>
  </table>

  ${baseFooter(d.nomorKontrak, formatTanggal(d.tanggalPembuatan))}
</body>
</html>`;
}
