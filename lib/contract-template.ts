import { ContractData } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatTanggal(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function terbilang(n: number): string {
  const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas",
    "enam belas", "tujuh belas", "delapan belas", "sembilan belas"];
  const puluhan = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh",
    "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"];

  if (n < 20) return satuan[n];
  if (n < 100) return puluhan[Math.floor(n / 10)] + (n % 10 ? " " + satuan[n % 10] : "");
  if (n < 1000) return (n === 100 ? "seratus" : satuan[Math.floor(n / 100)] + " ratus") + (n % 100 ? " " + terbilang(n % 100) : "");
  if (n < 1000000) return (n < 2000 ? "seribu" : terbilang(Math.floor(n / 1000)) + " ribu") + (n % 1000 ? " " + terbilang(n % 1000) : "");
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " juta" + (n % 1000000 ? " " + terbilang(n % 1000000) : "");
  return n.toString();
}

function labelPenggunaan(p?: string): string {
  if (p === "hunian") return "hunian/tempat tinggal";
  if (p === "komersial") return "komersial/usaha";
  if (p === "campuran") return "hunian sekaligus usaha (campuran)";
  return "hunian/tempat tinggal";
}

function labelUtilitas(v?: string): string {
  if (v === "pemberi_sewa") return "ditanggung oleh PIHAK PERTAMA";
  if (v === "dibagi") return "ditanggung bersama oleh Para Pihak sesuai kesepakatan";
  return "ditanggung oleh PIHAK KEDUA";
}

function labelFrekuensiCicilan(v?: string): string {
  if (v === "triwulan") return "setiap 3 (tiga) bulan sekali";
  if (v === "semesteran") return "setiap 6 (enam) bulan sekali";
  if (v === "tahunan") return "setiap 12 (dua belas) bulan sekali";
  return "setiap bulan";
}

// ─── Pasal Builder ────────────────────────────────────────────────────────────

let _pasalCounter = 0;

function pasal(title: string, content: string): string {
  _pasalCounter++;
  return `
  <div class="pasal">
    <p class="pasal-title">Pasal ${_pasalCounter} — ${title}</p>
    ${content}
  </div>`;
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateContractHTML(data: ContractData): string {
  // Reset counter for each generation
  _pasalCounter = 0;

  const tanggalMulaiFormatted = formatTanggal(data.tanggalMulai);
  const tanggalBerakhirFormatted = formatTanggal(data.tanggalBerakhir);
  const tanggalPembuatanFormatted = formatTanggal(data.tanggalPembuatan);
  const hargaFormatted = formatRupiah(data.hargaSewa);
  const totalNilai = data.hargaSewa * data.durasiSewa;
  const totalFormatted = formatRupiah(totalNilai);
  const totalTerbilang = terbilang(totalNilai);

  const noticePeriod = data.noticePeriodHari ?? 30;

  // ── Build conditional sections ─────────────────────────────────────────────

  const pasalParaPihak = pasal("Para Pihak", `
    <div class="pihak-box">
      <p><strong>PIHAK PERTAMA</strong> (Pemberi Sewa / Landlord)</p>
      <p><strong>Nama:</strong> ${data.namaPihakPertama}</p>
      <p>Selanjutnya disebut sebagai <strong>"PIHAK PERTAMA"</strong> atau <strong>"Pemberi Sewa"</strong>.</p>
    </div>
    <div class="pihak-box">
      <p><strong>PIHAK KEDUA</strong> (Penyewa / Tenant)</p>
      <p><strong>Nama:</strong> ${data.namaPihakKedua}</p>
      <p>Selanjutnya disebut sebagai <strong>"PIHAK KEDUA"</strong> atau <strong>"Penyewa"</strong>.</p>
    </div>
    <p>PIHAK PERTAMA dan PIHAK KEDUA, secara bersama-sama, selanjutnya disebut <strong>"Para Pihak"</strong>.</p>
  `);

  const pasalObjekSewa = pasal("Objek Sewa", `
    <p>Atas dasar kesepakatan bersama, PIHAK PERTAMA menyewakan kepada PIHAK KEDUA dan PIHAK KEDUA menerima sewa dari PIHAK PERTAMA atas properti berupa:</p>
    <div class="pihak-box">
      <p><strong>Alamat Properti:</strong> ${data.alamatProperti}</p>
      ${data.penggunaanProperti ? `<p><strong>Peruntukan:</strong> ${labelPenggunaan(data.penggunaanProperti)}</p>` : ""}
      ${(data.jenisSertifikat && data.jenisSertifikat !== "Tidak ada / Tidak diketahui")
        ? `<p><strong>Status Sertifikat:</strong> ${data.jenisSertifikat}${data.nomorSertifikat ? ` — Nomor: ${data.nomorSertifikat}` : ""}</p>`
        : ""}
    </div>
    <p>Selanjutnya disebut sebagai <strong>"Objek Sewa"</strong>, beserta seluruh fasilitas dan perlengkapan yang melekat padanya sebagaimana disepakati bersama oleh Para Pihak.</p>
    ${(data.jenisSertifikat && data.jenisSertifikat !== "Tidak ada / Tidak diketahui")
      ? `<p>Properti tersebut berstatus <strong>${data.jenisSertifikat}</strong>${data.nomorSertifikat ? ` dengan Nomor Sertifikat <strong>${data.nomorSertifikat}</strong>` : ""}.</p>`
      : ""}
    ${data.penggunaanProperti ? `<p>Objek Sewa disepakati untuk digunakan semata-mata sebagai <strong>${labelPenggunaan(data.penggunaanProperti)}</strong> dan tidak boleh digunakan untuk tujuan lain tanpa persetujuan tertulis PIHAK PERTAMA.</p>` : ""}
  `);

  const pasalKondisi = data.kondisiProperti ? pasal("Kondisi Properti Saat Serah Terima", `
    <p>${_pasalCounter}.1. PIHAK PERTAMA menyerahkan Objek Sewa kepada PIHAK KEDUA pada tanggal <strong>${tanggalMulaiFormatted}</strong> dalam kondisi yang telah diperiksa dan disepakati bersama.</p>
    <p>${_pasalCounter}.2. Catatan kondisi properti saat serah terima:</p>
    <div class="pihak-box">
      <p>${data.kondisiProperti.replace(/\n/g, "<br/>")}</p>
    </div>
    <p>${_pasalCounter}.3. Penyerahan Objek Sewa dilakukan dengan pembuatan Berita Acara Serah Terima yang ditandatangani oleh kedua belah pihak.</p>
    <p>${_pasalCounter}.4. PIHAK KEDUA wajib mengembalikan Objek Sewa pada akhir masa sewa dalam kondisi yang tidak lebih buruk dari kondisi serah terima, dengan mempertimbangkan keausan wajar akibat penggunaan normal. Pengembalian Objek Sewa dilakukan paling lambat 7 (tujuh) hari setelah berakhirnya masa sewa.</p>
    <p>${_pasalCounter}.5. Selisih kondisi di luar keausan wajar menjadi tanggung jawab PIHAK KEDUA dan dapat dikompensasi dari uang jaminan (bila ada).</p>
  `) : "";

  const pasalJangkaWaktu = pasal("Jangka Waktu Sewa", `
    <p>${_pasalCounter}.1. Masa berlaku Perjanjian ini adalah <strong>${data.durasiSewa} (${terbilang(data.durasiSewa)}) bulan</strong>, dimulai sejak tanggal <strong>${tanggalMulaiFormatted}</strong> hingga tanggal <strong>${tanggalBerakhirFormatted}</strong>.</p>
    <p>${_pasalCounter}.2. PIHAK KEDUA wajib memberitahukan kepada PIHAK PERTAMA secara tertulis paling lambat <strong>${noticePeriod} (${terbilang(noticePeriod)}) hari</strong> sebelum berakhirnya masa sewa apabila bermaksud tidak memperpanjang atau mengakhiri perjanjian.</p>
    ${data.perpanjanganOtomatis
      ? `<p>${_pasalCounter}.3. Apabila tidak ada pemberitahuan dari PIHAK KEDUA dalam batas waktu sebagaimana dimaksud ayat (2), maka Perjanjian ini akan <strong>diperpanjang secara otomatis</strong> untuk jangka waktu yang sama dengan syarat dan ketentuan yang disepakati bersama, termasuk kemungkinan penyesuaian harga sewa.</p>`
      : `<p>${_pasalCounter}.3. Perjanjian ini <strong>tidak diperpanjang secara otomatis</strong>. Apabila Para Pihak menghendaki perpanjangan, wajib dibuat perjanjian tertulis baru sebelum tanggal berakhirnya masa sewa.</p>`
    }
    ${data.eskalasHargaPersen && data.eskalasHargaPersen > 0
      ? `<p>${_pasalCounter}.4. Apabila masa sewa diperpanjang, harga sewa dapat disesuaikan dengan kenaikan maksimal sebesar <strong>${data.eskalasHargaPersen}% (${terbilang(data.eskalasHargaPersen)} persen)</strong> dari harga sewa periode sebelumnya, dan wajib disepakati secara tertulis oleh Para Pihak.</p>`
      : ""
    }
  `);

  // Payment section — build payment terms text
  let paymentTermsHTML = "";
  const metode = data.metodePembayaran ?? "lunas";

  if (metode === "lunas") {
    paymentTermsHTML = `
      <p>${_pasalCounter + 1}.3. Pembayaran harga sewa dilakukan secara <strong>lunas di muka</strong> untuk seluruh periode sewa sebesar <strong>${totalFormatted} (${totalTerbilang} rupiah)</strong>, paling lambat pada tanggal mulai sewa <strong>${tanggalMulaiFormatted}</strong>.</p>
    `;
  } else if (metode === "cicilan") {
    const frekLabel = labelFrekuensiCicilan(data.frekuensiCicilan);
    const jmlCicilan = data.jumlahPerCicilan ? formatRupiah(data.jumlahPerCicilan) : hargaFormatted;
    paymentTermsHTML = `
      <p>${_pasalCounter + 1}.3. Pembayaran harga sewa dilakukan secara <strong>cicilan berkala</strong>, yaitu ${frekLabel}, sebesar <strong>${jmlCicilan}</strong> per periode, mulai tanggal <strong>${tanggalMulaiFormatted}</strong>.</p>
      <p>${_pasalCounter + 1}.4. Pembayaran cicilan dilakukan paling lambat pada tanggal 5 (lima) setiap periode pembayaran yang telah disepakati.</p>
    `;
  } else if (metode === "dp_cicilan") {
    const dpFormatted = data.jumlahDP ? formatRupiah(data.jumlahDP) : "-";
    const frekLabel = labelFrekuensiCicilan(data.frekuensiCicilan);
    const jmlCicilan = data.jumlahPerCicilan ? formatRupiah(data.jumlahPerCicilan) : "-";
    const sisaNilai = totalNilai - (data.jumlahDP ?? 0);
    const sisaFormatted = formatRupiah(sisaNilai);
    paymentTermsHTML = `
      <p>${_pasalCounter + 1}.3. Pembayaran harga sewa dilakukan dengan mekanisme <strong>Uang Muka (DP) ditambah Cicilan</strong>, dengan rincian:</p>
      <ul>
        <li>Uang Muka (DP): <strong>${dpFormatted}</strong>, dibayarkan paling lambat pada tanggal mulai sewa <strong>${tanggalMulaiFormatted}</strong>.</li>
        <li>Sisa Pembayaran: <strong>${sisaFormatted}</strong>, dicicil ${frekLabel} sebesar <strong>${jmlCicilan}</strong> per periode.</li>
      </ul>
      <p>${_pasalCounter + 1}.4. Pembayaran cicilan dilakukan paling lambat pada tanggal 5 (lima) setiap periode pembayaran yang telah disepakati.</p>
    `;
  }

  const pasalHargaSewa = pasal("Harga Sewa dan Pembayaran", `
    <p>${_pasalCounter}.1. Harga sewa yang disepakati adalah sebesar <strong>${hargaFormatted} (${terbilang(data.hargaSewa)} rupiah)</strong> per bulan.</p>
    <p>${_pasalCounter}.2. Total nilai sewa untuk seluruh periode adalah sebesar <strong>${totalFormatted} (${totalTerbilang} rupiah)</strong>.</p>
    ${paymentTermsHTML.replace(/\$\{_pasalCounter \+ 1\}/g, String(_pasalCounter))}
    <p>${_pasalCounter}.5. Keterlambatan pembayaran sewa dikenakan denda sebesar 2% (dua persen) per hari dari jumlah sewa yang seharusnya dibayar, terhitung sejak tanggal jatuh tempo hingga tanggal pembayaran dilunasi, kecuali diperjanjikan lain secara tertulis oleh Para Pihak.</p>
    <p>${_pasalCounter}.6. Seluruh pembayaran dilakukan melalui mekanisme yang disepakati Para Pihak dan disertai bukti transfer/kwitansi yang sah.</p>
    ${data.namaBank
      ? `<p>${_pasalCounter}.7. Pembayaran dilakukan melalui transfer ke rekening: Bank <strong>${data.namaBank}</strong>, No. Rekening: <strong>${data.nomorRekening || "-"}</strong> atas nama PIHAK PERTAMA.</p>`
      : ""}
  `);

  const pasalDeposit = (data.adaDeposit && data.jumlahDeposit)
    ? pasal("Deposit / Uang Jaminan", (() => {
        const depositFormatted = formatRupiah(data.jumlahDeposit!);
        const depositTerbilang = terbilang(data.jumlahDeposit!);
        const waktuKembali = data.waktuPengembalianDepositHari ?? 14;

        let kondisiText = "dikembalikan secara penuh kepada PIHAK KEDUA";
        if (data.kondisiPengembalianDeposit === "setelah_kerusakan") {
          kondisiText = "dikembalikan kepada PIHAK KEDUA setelah dikurangi biaya perbaikan kerusakan yang disebabkan oleh PIHAK KEDUA di luar keausan wajar";
        } else if (data.kondisiPengembalianDeposit === "tidak_dikembalikan") {
          kondisiText = "tidak dikembalikan kepada PIHAK KEDUA dan menjadi hak PIHAK PERTAMA";
        }

        return `
          <p>${_pasalCounter}.1. PIHAK KEDUA wajib membayar uang jaminan (deposit) kepada PIHAK PERTAMA sebesar <strong>${depositFormatted} (${depositTerbilang} rupiah)</strong> paling lambat pada tanggal mulai sewa.</p>
          <p>${_pasalCounter}.2. Uang jaminan dimaksudkan sebagai jaminan atas kerusakan properti, tunggakan sewa, atau kewajiban lain yang belum dipenuhi oleh PIHAK KEDUA.</p>
          <p>${_pasalCounter}.3. Pada akhir masa sewa, uang jaminan akan <strong>${kondisiText}</strong>.</p>
          <p>${_pasalCounter}.4. Pengembalian uang jaminan (apabila ada) dilakukan paling lambat <strong>${waktuKembali} (${terbilang(waktuKembali)}) hari kerja</strong> setelah berakhirnya masa sewa dan setelah Objek Sewa dikembalikan dalam kondisi yang disepakati.</p>
          <p>${_pasalCounter}.5. Uang jaminan tidak dapat diperhitungkan sebagai pembayaran sewa bulan terakhir kecuali atas persetujuan tertulis PIHAK PERTAMA.</p>
        `;
      })())
    : "";

  // Larangan section
  const laranganList: string[] = [];
  if (data.laranganSubletting !== false) {
    laranganList.push("Mengalihkan atau menyewakan kembali Objek Sewa kepada pihak ketiga (subletting) tanpa persetujuan tertulis PIHAK PERTAMA.");
  }
  if (data.laranganRenovasi !== false) {
    laranganList.push("Melakukan perubahan struktural, renovasi, atau modifikasi permanen pada Objek Sewa tanpa izin tertulis PIHAK PERTAMA.");
  }
  if (data.laranganHewan) {
    laranganList.push("Memelihara hewan peliharaan di dalam atau di area Objek Sewa tanpa persetujuan tertulis PIHAK PERTAMA.");
  }
  if (data.laranganMerokok) {
    laranganList.push("Merokok di dalam Objek Sewa atau area tertutup yang menjadi bagian dari Objek Sewa.");
  }
  if (data.laranganUsaha) {
    laranganList.push("Menjalankan kegiatan usaha, bisnis, atau komersial apapun di dalam Objek Sewa tanpa persetujuan tertulis PIHAK PERTAMA.");
  }
  laranganList.push("Menyimpan, menggunakan, atau memperjualbelikan narkotika, zat terlarang, atau bahan berbahaya di Objek Sewa.");
  laranganList.push("Melakukan kegiatan yang mengganggu ketertiban umum, keamanan lingkungan, atau melanggar hukum yang berlaku.");

  const pasalLarangan = pasal("Larangan-Larangan", `
    <p>${_pasalCounter}.1. Sepanjang masa sewa berjalan, PIHAK KEDUA tidak diperkenankan untuk:</p>
    <ul>
      ${laranganList.map((l) => `<li>${l}</li>`).join("\n      ")}
    </ul>
    <p>${_pasalCounter}.2. Pelanggaran terhadap ketentuan larangan dalam pasal ini dapat menjadi dasar pengakhiran Perjanjian secara sepihak oleh PIHAK PERTAMA setelah pemberitahuan tertulis sebagaimana diatur dalam Pasal tentang Pengakhiran Perjanjian.</p>
  `);

  // Utilitas section (only if any utilitas field is set)
  const hasUtilitas = data.utilitasListrik || data.utilitasAir || data.utilitasInternet;
  const pasalUtilitas = hasUtilitas ? pasal("Utilitas dan Biaya Operasional", `
    <p>${_pasalCounter}.1. Pembagian tanggung jawab atas biaya utilitas selama masa sewa adalah sebagai berikut:</p>
    <ul>
      ${data.utilitasListrik ? `<li><strong>Listrik:</strong> ${labelUtilitas(data.utilitasListrik)}.</li>` : "<li><strong>Listrik:</strong> ditanggung oleh PIHAK KEDUA.</li>"}
      ${data.utilitasAir ? `<li><strong>Air (PAM/PDAM):</strong> ${labelUtilitas(data.utilitasAir)}.</li>` : "<li><strong>Air (PAM/PDAM):</strong> ditanggung oleh PIHAK KEDUA.</li>"}
      ${data.utilitasInternet !== "tidak_ada"
        ? `<li><strong>Internet/Telekomunikasi:</strong> ${labelUtilitas(data.utilitasInternet)}.</li>`
        : "<li><strong>Internet/Telekomunikasi:</strong> tidak termasuk dalam lingkup Perjanjian ini dan menjadi tanggung jawab PIHAK KEDUA secara mandiri.</li>"
      }
    </ul>
    <p>${_pasalCounter}.2. Biaya utilitas yang menjadi tanggung jawab PIHAK KEDUA wajib dibayarkan langsung kepada penyedia layanan dan tidak boleh menunggak hingga menyebabkan pemutusan layanan.</p>
    <p>${_pasalCounter}.3. Apabila terdapat tunggakan utilitas yang menjadi tanggung jawab PIHAK KEDUA pada akhir masa sewa, PIHAK PERTAMA berhak memotong dari uang jaminan (bila ada).</p>
  `) : "";

  const pasalKewajibanPihakDua = pasal("Kewajiban Pihak Kedua (Penyewa)", `
    <p>${_pasalCounter}.1. Dalam melaksanakan Perjanjian ini, PIHAK KEDUA berkewajiban:</p>
    <ul>
      <li>Membayar harga sewa tepat waktu sesuai ketentuan Pasal tentang Harga Sewa dan Pembayaran.</li>
      <li>Menjaga dan merawat Objek Sewa beserta seluruh fasilitas yang ada dengan baik dan penuh tanggung jawab.</li>
      <li>Menggunakan Objek Sewa sesuai peruntukan yang telah disepakati.</li>
      <li>Mematuhi seluruh larangan sebagaimana tercantum dalam Perjanjian ini.</li>
      <li>Memberitahukan PIHAK PERTAMA secara tertulis apabila terjadi kerusakan pada Objek Sewa.</li>
      <li>Menyerahkan kembali Objek Sewa dalam kondisi baik (dengan mempertimbangkan keausan wajar) kepada PIHAK PERTAMA pada saat berakhirnya masa sewa.</li>
      <li>Mematuhi peraturan lingkungan, peraturan RT/RW, peraturan daerah, dan ketentuan hukum yang berlaku.</li>
      <li>Memberikan akses kepada PIHAK PERTAMA untuk melakukan inspeksi dengan pemberitahuan terlebih dahulu, kecuali dalam keadaan darurat.</li>
    </ul>
    <p>${_pasalCounter}.2. Kerusakan yang disebabkan oleh kelalaian, kesengajaan, atau penggunaan yang tidak wajar oleh PIHAK KEDUA menjadi tanggung jawab PIHAK KEDUA sepenuhnya.</p>
  `);

  const pasalKewajibanPihakSatu = pasal("Kewajiban Pihak Pertama (Pemberi Sewa)", `
    <p>${_pasalCounter}.1. Sebagai Pemberi Sewa, PIHAK PERTAMA berkewajiban:</p>
    <ul>
      <li>Menyerahkan Objek Sewa kepada PIHAK KEDUA dalam kondisi baik dan layak digunakan sesuai peruntukan pada tanggal mulai sewa.</li>
      <li>Menjamin PIHAK KEDUA dapat menikmati Objek Sewa secara tenang selama masa sewa berlaku.</li>
      <li>Melakukan perbaikan atas kerusakan struktural atau kerusakan besar yang bukan disebabkan oleh kelalaian PIHAK KEDUA.</li>
      <li>Memberitahukan PIHAK KEDUA secara tertulis minimal 14 (empat belas) hari sebelumnya jika akan memasuki Objek Sewa untuk inspeksi atau perbaikan, kecuali dalam keadaan darurat.</li>
      <li>Mengembalikan uang jaminan sesuai ketentuan yang berlaku dalam Perjanjian ini.</li>
      <li>Menjamin bahwa PIHAK PERTAMA memiliki hak dan kewenangan penuh untuk menyewakan Objek Sewa.</li>
    </ul>
  `);

  const pasalPengakhiran = pasal("Pengakhiran Perjanjian", `
    <p>${_pasalCounter}.1. Demi hukum, Perjanjian ini berakhir dengan sendirinya pada tanggal <strong>${tanggalBerakhirFormatted}</strong> sebagaimana telah disepakati, tanpa memerlukan pemberitahuan lebih lanjut dari masing-masing Pihak.</p>
    <p>${_pasalCounter}.2. Perjanjian ini dapat diakhiri lebih awal apabila:</p>
    <ul>
      <li>Salah satu pihak melanggar ketentuan Perjanjian ini dan tidak memperbaiki pelanggaran tersebut dalam waktu 14 (empat belas) hari setelah menerima pemberitahuan tertulis dari pihak lainnya.</li>
      <li>PIHAK KEDUA tidak membayar harga sewa selama 2 (dua) periode pembayaran berturut-turut.</li>
      <li>Terjadi force majeure yang mengakibatkan Objek Sewa tidak dapat digunakan untuk jangka waktu lebih dari 30 (tiga puluh) hari.</li>
      <li>Disepakati bersama secara tertulis oleh Para Pihak.</li>
    </ul>
    <p>${_pasalCounter}.3. PIHAK KEDUA yang berkeinginan mengakhiri Perjanjian sebelum waktunya wajib memberikan pemberitahuan tertulis kepada PIHAK PERTAMA paling lambat <strong>${noticePeriod} (${terbilang(noticePeriod)}) hari</strong> sebelumnya dan menyelesaikan seluruh kewajiban yang belum dipenuhi.</p>
    <p>${_pasalCounter}.4. Apabila PIHAK KEDUA bermaksud mengakhiri perjanjian sebelum berakhirnya jangka waktu sewa, PIHAK KEDUA wajib memberitahukan secara tertulis kepada PIHAK PERTAMA paling lambat 60 (enam puluh) hari sebelumnya. Dalam hal demikian, uang jaminan (deposit) tidak dapat dikembalikan kepada PIHAK KEDUA.</p>
    <p>${_pasalCounter}.5. Dalam hal pengakhiran karena kelalaian PIHAK KEDUA, PIHAK KEDUA wajib meninggalkan Objek Sewa paling lambat 14 (empat belas) hari sejak tanggal pemberitahuan pengakhiran, dan tidak berhak mendapat pengembalian harga sewa yang telah dibayarkan.</p>
  `);

  const pasalForce = pasal("Keadaan Kahar (Force Majeure)", `
    <p>${_pasalCounter}.1. Yang dimaksud dengan keadaan kahar dalam Perjanjian ini adalah kejadian yang berada di luar kendali wajar Para Pihak, termasuk namun tidak terbatas pada: bencana alam, gempa bumi, banjir, kebakaran akibat faktor eksternal, huru-hara, perang, pandemi, atau kebijakan pemerintah yang secara langsung dan material mempengaruhi pelaksanaan Perjanjian ini.</p>
    <p>${_pasalCounter}.2. Pihak yang mengalami atau terdampak keadaan kahar wajib menyampaikan pemberitahuan tertulis kepada Pihak lainnya dalam waktu 7 (tujuh) hari sejak terjadinya keadaan kahar, dilengkapi dengan bukti-bukti yang dapat diverifikasi.</p>
    <p>${_pasalCounter}.3. Para Pihak akan berunding dengan itikad baik untuk menentukan langkah selanjutnya apabila keadaan kahar berlangsung lebih dari 30 (tiga puluh) hari.</p>
    <p>${_pasalCounter}.4. Kewajiban pembayaran sewa yang telah jatuh tempo sebelum terjadinya keadaan kahar tetap menjadi kewajiban Para Pihak dan tidak hapus karenanya.</p>
  `);

  const pasalAsuransi = pasal("Asuransi", `
    <p>${_pasalCounter}.1. PIHAK PERTAMA bertanggung jawab atas asuransi bangunan terhadap risiko kebakaran dan bencana alam.</p>
    <p>${_pasalCounter}.2. PIHAK KEDUA bertanggung jawab atas asuransi barang-barang miliknya yang berada di dalam Objek Sewa.</p>
    <p>${_pasalCounter}.3. Masing-masing Pihak wajib memberitahukan pihak lainnya apabila terdapat klaim asuransi yang berkaitan dengan Objek Sewa.</p>
  `);

  const pasalSengketa = pasal("Penyelesaian Sengketa", `
    <p>${_pasalCounter}.1. Setiap perselisihan yang timbul dari atau terkait dengan Perjanjian ini diselesaikan terlebih dahulu melalui musyawarah mufakat dalam batas waktu 30 (tiga puluh) hari kerja sejak perselisihan diajukan secara tertulis.</p>
    <p>${_pasalCounter}.2. Apabila penyelesaian secara musyawarah tidak tercapai dalam jangka waktu tersebut, Para Pihak sepakat untuk menyelesaikan sengketa melalui <strong>Pengadilan Negeri yang berwenang</strong> sesuai dengan wilayah hukum Objek Sewa berada, berdasarkan hukum Negara Republik Indonesia.</p>
    <p>${_pasalCounter}.3. Para Pihak memilih domisili hukum yang tetap dan tidak berubah di kantor Pengadilan Negeri setempat.</p>
  `);

  const pasalKetentuanTambahan = data.ketentuanTambahan ? pasal("Ketentuan Tambahan", `
    <p>${data.ketentuanTambahan.replace(/\n/g, "<br/>")}</p>
  `) : "";

  const pasalKetentuan = pasal("Ketentuan Umum", `
    <p>${_pasalCounter}.1. Perjanjian ini memuat keseluruhan kesepakatan Para Pihak atas pokok yang diatur di dalamnya, serta menggantikan seluruh negosiasi, pernyataan, dan perjanjian sebelumnya yang berhubungan dengan hal yang sama.</p>
    <p>${_pasalCounter}.2. Setiap perubahan atau penambahan terhadap Perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak.</p>
    <p>${_pasalCounter}.3. Apabila terdapat ketentuan dalam Perjanjian ini yang dinyatakan tidak sah atau tidak dapat dilaksanakan oleh pengadilan atau instansi yang berwenang, maka ketentuan lainnya tetap berlaku dan mengikat Para Pihak.</p>
    <p>${_pasalCounter}.4. Perjanjian ini tunduk pada dan ditafsirkan sesuai dengan <strong>Hukum Negara Republik Indonesia</strong>, termasuk namun tidak terbatas pada Kitab Undang-Undang Hukum Perdata (KUHPerdata) Pasal 1548–1600.</p>
    <p>${_pasalCounter}.5. Perjanjian ini dibuat dalam 2 (dua) rangkap asli, masing-masing bermaterai cukup, dan mempunyai kekuatan hukum yang sama bagi masing-masing pihak.</p>
  `);

  const pasalDisclaimer = pasal("Disclaimer dan Ketentuan Platform", `
    <p>${_pasalCounter}.1. <strong>Status Platform.</strong> Perjanjian ini dibuat menggunakan platform pembuatan dokumen <strong>LegalKan</strong>. LegalKan adalah platform teknologi pembuatan dokumen hukum secara mandiri (<em>self-service document generation platform</em>) dan <strong>bukan merupakan kantor hukum, firma hukum, maupun konsultan hukum</strong>. LegalKan tidak memberikan nasihat hukum (<em>legal advice</em>) dalam bentuk apapun.</p>
    <p>${_pasalCounter}.2. <strong>Batasan Tanggung Jawab Platform.</strong> LegalKan, para pemilik, pengelola, karyawan, mitra, dan seluruh pihak yang terkait dengan platform LegalKan <strong>tidak dapat dimintai pertanggungjawaban</strong>, digugat, atau dijadikan pihak dalam sengketa yang timbul dari, berkaitan dengan, atau sebagai akibat dari penggunaan dokumen yang dibuat melalui platform ini. Tanggung jawab atas isi, kebenaran data, dan pelaksanaan Perjanjian sepenuhnya berada pada Para Pihak yang menandatangani Perjanjian ini.</p>
    <p>${_pasalCounter}.3. <strong>Kebenaran Data.</strong> Para Pihak menyatakan dan menjamin bahwa seluruh data dan informasi yang dimasukkan ke dalam Perjanjian ini adalah benar, akurat, dan sah. LegalKan tidak bertanggung jawab atas kerugian yang timbul akibat data yang tidak benar, tidak lengkap, atau menyesatkan yang dimasukkan oleh pengguna.</p>
    <p>${_pasalCounter}.4. <strong>Dokumen sebagai Template.</strong> Perjanjian ini merupakan dokumen yang dibuat berdasarkan template standar. Untuk kasus-kasus yang bersifat kompleks, memiliki nilai sewa yang tinggi, atau melibatkan aset berharga, Para Pihak <strong>dianjurkan untuk berkonsultasi dengan advokat atau konsultan hukum yang berwenang</strong> sebelum menandatangani Perjanjian ini.</p>
    <p>${_pasalCounter}.5. <strong>Penyelesaian Mandiri.</strong> Dengan menggunakan layanan LegalKan dan menandatangani Perjanjian ini, Para Pihak sepakat untuk menyelesaikan setiap sengketa yang timbul dari Perjanjian ini secara mandiri, sebagaimana diatur dalam Pasal tentang Penyelesaian Sengketa, tanpa melibatkan LegalKan sebagai mediator, wasit, atau pihak dalam sengketa.</p>
    <p>${_pasalCounter}.6. <strong>Hukum yang Berlaku.</strong> Perjanjian ini tunduk pada Hukum Republik Indonesia. Setiap ketentuan dalam Perjanjian ini yang bertentangan dengan hukum yang berlaku dianggap tidak berlaku, sementara ketentuan lainnya tetap mengikat.</p>
    <p>${_pasalCounter}.7. <strong>Keadaan Kahar Platform.</strong> LegalKan tidak bertanggung jawab atas kegagalan penyampaian atau pemrosesan dokumen yang disebabkan oleh gangguan teknis, pemadaman server, bencana alam, atau keadaan di luar kendali platform.</p>
  `);

  // ── Assemble HTML ──────────────────────────────────────────────────────────

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <style>
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
    .divider-thin { border: none; border-top: 1px solid #ccc; margin: 12px 0; }
    .pasal { margin-top: 20px; }
    .pasal-title { font-size: 12pt; font-weight: 700; text-transform: uppercase; text-align: center; margin-bottom: 8px; }
    p { text-align: justify; margin-bottom: 6px; }
    .indent { padding-left: 24px; }
    .pihak-box {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 12px 16px;
      margin: 10px 0;
      background: #fafafa;
    }
    .pihak-box strong { display: inline-block; }
    table.tanda-tangan { width: 100%; border-collapse: collapse; margin-top: 20px; }
    table.tanda-tangan td { width: 50%; padding: 8px; text-align: center; vertical-align: top; }
    .ttd-area { height: 80px; border-bottom: 1px solid #333; margin: 8px 20px 4px; }
    @page {
      size: A4;
      margin: 20mm 25mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .disclaimer-box { display: none !important; }
    }
    .disclaimer-box {
      margin-top: 24px;
      padding: 14px 16px;
      border: 1px dashed #aaa;
      border-radius: 4px;
      background: #f9f9f9;
      font-size: 10pt;
      color: #555;
    }
    .footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 9pt;
      color: #888;
    }
    ul { padding-left: 24px; margin-bottom: 8px; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>

  <h1>PERJANJIAN SEWA MENYEWA</h1>
  <p class="subtitle">Berdasarkan KUHPerdata Indonesia Pasal 1548–1600</p>
  <p class="nomor">Nomor: ${data.nomorKontrak}</p>
  <hr class="divider" />

  ${pasalParaPihak}
  ${pasalObjekSewa}
  ${pasalKondisi}
  ${pasalJangkaWaktu}
  ${pasalHargaSewa}
  ${pasalDeposit}
  ${pasalLarangan}
  ${pasalUtilitas}
  ${pasalKewajibanPihakDua}
  ${pasalKewajibanPihakSatu}
  ${pasalAsuransi}
  ${pasalPengakhiran}
  ${pasalForce}
  ${pasalSengketa}
  ${pasalKetentuanTambahan}
  ${pasalKetentuan}
  ${pasalDisclaimer}

  <hr class="divider" style="margin-top: 32px;" />

  <p style="text-align: center; margin-bottom: 12px;">
    Demikianlah Perjanjian ini dibuat dan ditandatangani oleh Para Pihak${data.lokasiPembuatan ? ' di <strong>' + data.lokasiPembuatan + '</strong>' : ''}
    pada tanggal <strong>${tanggalPembuatanFormatted}</strong>.
  </p>

  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>PIHAK PERTAMA</strong></p>
        <p>(Pemberi Sewa)</p>
        <div class="ttd-area"></div>
        <p><strong>${data.namaPihakPertama}</strong></p>
      </td>
      <td>
        <p><strong>PIHAK KEDUA</strong></p>
        <p>(Penyewa)</p>
        <div class="ttd-area"></div>
        <p><strong>${data.namaPihakKedua}</strong></p>
      </td>
    </tr>
  </table>

  ${data.saksiEnabled ? `
  <hr class="divider-thin" style="margin-top: 28px;" />
  <p style="text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; margin-top: 16px;">SAKSI-SAKSI</p>
  <p style="text-align: center; font-size: 10pt; color: #555; margin-bottom: 16px;">Para saksi menyatakan bahwa perjanjian ini ditandatangani dengan sukarela dan tanpa paksaan.</p>
  <table class="tanda-tangan">
    <tr>
      <td>
        <p><strong>Saksi 1</strong></p>
        <p>Nama: <strong>${data.saksi1Nama || "_______________"}</strong></p>
        <p>NIK: ${data.saksi1NIK || "_______________"}</p>
        <div class="ttd-area"></div>
        <p>Tanda Tangan</p>
      </td>
      <td>
        <p><strong>Saksi 2</strong> <em>(jika ada)</em></p>
        <p>Nama: <strong>${data.saksi2Nama || "_______________"}</strong></p>
        <p>NIK: ${data.saksi2NIK || "_______________"}</p>
        <div class="ttd-area"></div>
        <p>Tanda Tangan</p>
      </td>
    </tr>
  </table>
  ` : ""}





</body>
</html>
`;
}

export function generateContractNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `LK-${year}${month}-${random}`;
}

export function calculateEndDate(startDate: string, durasiMonths: number): string {
  const start = new Date(startDate);
  start.setMonth(start.getMonth() + durasiMonths);
  start.setDate(start.getDate() - 1);
  return start.toISOString().split("T")[0];
}
