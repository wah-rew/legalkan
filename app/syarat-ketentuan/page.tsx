import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — LegalKan",
  description:
    "Baca syarat dan ketentuan penggunaan layanan LegalKan. LegalKan adalah platform penyedia template dokumen, bukan firma hukum.",
};

const LAST_UPDATED = "21 April 2026";

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F8F9FF" }}>
      {/* Hero Header */}
      <div
        style={{
          background: "#0D1B3E",
          padding: "4rem 1rem 3rem",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.3rem 0.875rem",
            borderRadius: "9999px",
            background: "rgba(255,77,109,0.15)",
            color: "#FF4D6D",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          ⚖️ Dokumen Legal
        </span>
        <h1
          className="font-jakarta"
          style={{
            color: "white",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Syarat &amp; Ketentuan
        </h1>
        <p style={{ color: "#6B7FA8", fontSize: "0.875rem" }}>
          Terakhir diperbarui: {LAST_UPDATED}
        </p>
      </div>

      {/* Content */}
      <div
        className="mx-auto px-4 py-12"
        style={{ maxWidth: "52rem" }}
      >
        {/* ── DISCLAIMER BOX (Most Important) ── */}
        <div
          style={{
            background: "rgba(255,77,109,0.06)",
            border: "2px solid rgba(255,77,109,0.35)",
            borderRadius: "1rem",
            padding: "1.75rem 2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <h2
              className="font-jakarta"
              style={{
                color: "#CC2244",
                fontWeight: 800,
                fontSize: "1.05rem",
                margin: 0,
              }}
            >
              PERHATIAN PENTING — BACA SEBELUM MENGGUNAKAN LAYANAN
            </h2>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {[
              "LegalKan adalah platform penyedia template dokumen, BUKAN firma hukum, kantor advokat, maupun pengacara.",
              "LegalKan tidak memberikan nasihat hukum (legal advice) dalam bentuk apapun.",
              "LegalKan tidak bertanggung jawab atas segala konsekuensi hukum, sengketa, litigasi, kerugian finansial, atau masalah hukum apapun yang timbul dari penggunaan dokumen yang dihasilkan melalui platform ini.",
              "Pengguna sepenuhnya bertanggung jawab atas keabsahan, kelengkapan, dan kebenaran informasi yang diinput ke dalam sistem.",
              "Dokumen yang dihasilkan adalah template yang telah disesuaikan dengan data yang Anda masukkan. Pengguna wajib memastikan kesesuaian dokumen dengan situasi hukum spesifik mereka.",
              "Untuk urusan hukum yang kompleks, bernilai tinggi, atau memerlukan interpretasi mendalam, pengguna sangat disarankan untuk berkonsultasi dengan pengacara atau konsultan hukum berlisensi.",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "0.625rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "#7A1030",
                  fontWeight: 500,
                }}
              >
                <span style={{ flexShrink: 0, marginTop: "0.05rem", color: "#FF4D6D" }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* 1. Tentang LegalKan */}
          <Section number="1" title="Tentang LegalKan">
            <p>
              LegalKan (<strong>legalkan.id</strong>) adalah platform teknologi yang menyediakan layanan
              pembuatan template dokumen perjanjian dan kontrak dalam Bahasa Indonesia, yang mengacu
              pada ketentuan Kitab Undang-Undang Hukum Perdata (KUHPerdata) Republik Indonesia.
            </p>
            <p>
              Kami menyediakan template untuk berbagai jenis perjanjian umum, termasuk namun tidak
              terbatas pada: perjanjian sewa properti, perjanjian hutang piutang, kontrak freelancer,
              perjanjian bagi hasil usaha, perjanjian sewa kendaraan, dan perjanjian jual beli.
            </p>
            <p>
              Dengan mengakses dan menggunakan layanan LegalKan, Anda dianggap telah membaca,
              memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku dalam dokumen ini.
            </p>
          </Section>

          {/* 2. Penggunaan Layanan */}
          <Section number="2" title="Penggunaan Layanan">
            <p>Dengan menggunakan layanan LegalKan, Anda menyatakan bahwa:</p>
            <ul className="prose-list">
              <li>Anda telah berusia minimal 18 tahun atau telah mendapat persetujuan wali yang sah.</li>
              <li>Anda menggunakan layanan ini untuk keperluan yang sah dan tidak melanggar hukum.</li>
              <li>
                Seluruh informasi yang Anda masukkan adalah benar, akurat, dan lengkap sesuai
                pengetahuan Anda.
              </li>
              <li>
                Anda tidak akan menggunakan dokumen yang dihasilkan untuk tujuan penipuan,
                pemalsuan, atau aktivitas ilegal lainnya.
              </li>
              <li>
                Anda memahami bahwa dokumen yang dihasilkan adalah template dan mungkin perlu
                disesuaikan dengan kebutuhan spesifik Anda.
              </li>
            </ul>
            <p>
              LegalKan berhak menolak, membatalkan, atau menghentikan akses layanan kepada pengguna
              yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.
            </p>
          </Section>

          {/* 3. Pembatasan Tanggung Jawab */}
          <Section number="3" title="Pembatasan Tanggung Jawab" highlight>
            <p>
              <strong>
                BAGIAN INI MERUPAKAN KLAUSUL PEMBATASAN TANGGUNG JAWAB YANG PENTING. HARAP DIBACA
                DENGAN SEKSAMA.
              </strong>
            </p>
            <p>
              <strong>
                LegalKan TIDAK bertanggung jawab atas kerugian, kehilangan, atau kerusakan dalam
                bentuk apapun — baik langsung maupun tidak langsung — yang timbul dari:
              </strong>
            </p>
            <ul className="prose-list">
              <li>
                <strong>Ketidaksesuaian hukum:</strong> dokumen yang dibuat tidak memenuhi persyaratan
                hukum khusus dalam situasi atau yurisdiksi tertentu;
              </li>
              <li>
                <strong>Kesalahan input:</strong> informasi yang salah, tidak lengkap, atau menyesatkan
                yang dimasukkan oleh pengguna;
              </li>
              <li>
                <strong>Penggunaan tidak tepat:</strong> penggunaan dokumen tanpa memperhatikan
                konteks hukum yang berlaku;
              </li>
              <li>
                <strong>Sengketa hukum:</strong> perselisihan, gugatan, atau proses hukum apapun yang
                melibatkan dokumen yang dibuat melalui platform ini;
              </li>
              <li>
                <strong>Kerugian finansial:</strong> kehilangan uang, aset, atau nilai ekonomi apapun
                yang berkaitan dengan penggunaan dokumen;
              </li>
              <li>
                <strong>Perubahan regulasi:</strong> dokumen menjadi tidak sesuai akibat perubahan
                peraturan perundang-undangan setelah dokumen dibuat.
              </li>
            </ul>
            <p>
              Dalam keadaan apapun, total kewajiban LegalKan kepada pengguna tidak melebihi jumlah
              yang dibayarkan oleh pengguna untuk transaksi yang bersangkutan.
            </p>
            <p>
              <strong>
                Apabila Anda memerlukan kepastian hukum yang tinggi, kami dengan tegas menyarankan
                untuk berkonsultasi dengan pengacara atau konsultan hukum berlisensi sebelum
                menandatangani atau menggunakan dokumen apapun.
              </strong>
            </p>
          </Section>

          {/* 4. Pembayaran & Refund */}
          <Section number="4" title="Pembayaran & Refund">
            <p>
              Layanan LegalKan menggunakan sistem pembayaran digital yang diproses melalui gateway
              pembayaran terpercaya (Xendit). Pembayaran dianggap sah setelah dikonfirmasi oleh
              sistem secara otomatis.
            </p>
            <p>
              <strong>Kebijakan Refund:</strong>
            </p>
            <ul className="prose-list">
              <li>
                <strong>
                  Tidak ada pengembalian dana (refund) setelah dokumen berhasil di-generate dan
                  dikirimkan ke email pengguna.
                </strong>{" "}
                Hal ini dikarenakan layanan kami bersifat digital dan dokumen langsung dapat diakses
                setelah pembayaran.
              </li>
              <li>
                Jika dokumen tidak terkirim ke email karena kesalahan sistem kami, pengguna berhak
                menghubungi kami untuk mendapatkan pengiriman ulang dokumen.
              </li>
              <li>
                Jika terjadi kesalahan teknis yang menyebabkan pembayaran berhasil namun dokumen
                tidak dapat dibuat, kami akan menyelesaikan masalah tersebut atau memberikan
                kompensasi yang sesuai.
              </li>
              <li>
                Pastikan data yang Anda isi sudah benar sebelum melakukan pembayaran, karena
                revisi isi dokumen mungkin memerlukan biaya tambahan.
              </li>
            </ul>
          </Section>

          {/* 5. Hak Kekayaan Intelektual */}
          <Section number="5" title="Hak Kekayaan Intelektual">
            <p>
              Seluruh konten platform LegalKan — termasuk namun tidak terbatas pada desain antarmuka,
              logo, template dokumen, teks, dan kode perangkat lunak — merupakan kekayaan intelektual
              LegalKan yang dilindungi oleh hukum Hak Cipta Republik Indonesia.
            </p>
            <p>
              Dengan menggunakan layanan LegalKan, Anda mendapatkan lisensi terbatas, tidak eksklusif,
              dan tidak dapat dipindahtangankan untuk:
            </p>
            <ul className="prose-list">
              <li>
                Menggunakan dokumen yang dihasilkan untuk keperluan pribadi atau bisnis Anda sendiri.
              </li>
              <li>Mencetak dan menandatangani dokumen untuk keperluan perjanjian yang sah.</li>
            </ul>
            <p>
              Anda <strong>tidak diizinkan</strong> untuk menjual kembali, mendistribusikan ulang,
              atau mengklaim kepemilikan atas template atau dokumen yang dihasilkan oleh platform ini
              untuk tujuan komersial tanpa izin tertulis dari LegalKan.
            </p>
          </Section>

          {/* 6. Privasi Data */}
          <Section number="6" title="Privasi Data">
            <p>
              Penggunaan data pribadi Anda diatur dalam{" "}
              <a
                href="/kebijakan-privasi"
                style={{ color: "#FF4D6D", textDecoration: "underline" }}
              >
                Kebijakan Privasi
              </a>{" "}
              kami yang merupakan bagian tidak terpisahkan dari Syarat &amp; Ketentuan ini.
            </p>
            <p>
              Secara ringkas: kami mengumpulkan data yang diperlukan untuk menghasilkan dokumen dan
              mengirimkannya kepada Anda, menyimpannya dengan aman, dan tidak menjualnya kepada
              pihak ketiga.
            </p>
          </Section>

          {/* 7. Perubahan Layanan */}
          <Section number="7" title="Perubahan Layanan">
            <p>
              LegalKan berhak untuk sewaktu-waktu mengubah, menambah, atau menghentikan bagian dari
              layanan kami, termasuk harga, jenis dokumen yang tersedia, dan fitur platform, dengan
              atau tanpa pemberitahuan sebelumnya.
            </p>
            <p>
              Perubahan pada Syarat &amp; Ketentuan ini akan diinformasikan melalui pembaruan
              tanggal &ldquo;Terakhir diperbarui&rdquo; di bagian atas halaman ini. Penggunaan
              layanan secara berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap
              syarat yang baru.
            </p>
          </Section>

          {/* 8. Hukum yang Berlaku */}
          <Section number="8" title="Hukum yang Berlaku">
            <p>
              Syarat &amp; Ketentuan ini tunduk pada dan ditafsirkan berdasarkan{" "}
              <strong>Hukum Republik Indonesia</strong>, khususnya Kitab Undang-Undang Hukum Perdata
              (KUHPerdata) dan peraturan perundang-undangan yang berlaku.
            </p>
            <p>
              Segala perselisihan yang timbul dari penggunaan layanan LegalKan yang tidak dapat
              diselesaikan secara musyawarah akan diselesaikan melalui lembaga penyelesaian sengketa
              yang berwenang di Republik Indonesia.
            </p>
          </Section>

          {/* 9. Kontak */}
          <Section number="9" title="Kontak">
            <p>
              Jika Anda memiliki pertanyaan, masukan, atau keluhan terkait Syarat &amp; Ketentuan
              ini, silakan hubungi kami melalui:
            </p>
            <ul className="prose-list">
              <li>
                <strong>Halaman Hubungi Kami:</strong>{" "}
                <a
                  href="/hubungi"
                  style={{ color: "#FF4D6D", textDecoration: "underline" }}
                >
                  legalkan.id/hubungi
                </a>
              </li>
              <li>
                <strong>Email:</strong> halo@legalkan.id
              </li>
            </ul>
            <p>
              Kami berusaha merespons setiap pertanyaan dalam waktu 1×24 jam pada hari kerja.
            </p>
          </Section>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(13,27,62,0.08)" }}>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#FF4D6D",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← Kembali ke Beranda
          </a>
          <p style={{ fontSize: "0.75rem", color: "#9BA3C4", marginTop: "0.75rem" }}>
            © {new Date().getFullYear()} LegalKan · Semua hak dilindungi.
          </p>
        </div>
      </div>

      <style>{`
        .prose-list {
          list-style: none;
          padding: 0;
          margin: 0.75rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .prose-list li {
          display: flex;
          gap: 0.625rem;
          font-size: 0.9rem;
          line-height: 1.65;
          color: #3D4A6B;
        }
        .prose-list li::before {
          content: "•";
          color: #FF4D6D;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }
      `}</style>
    </div>
  );
}

function Section({
  number,
  title,
  children,
  highlight = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      style={{
        background: highlight ? "rgba(255,77,109,0.03)" : "white",
        border: highlight
          ? "1.5px solid rgba(255,77,109,0.2)"
          : "1px solid rgba(13,27,62,0.07)",
        borderRadius: "1rem",
        padding: "1.75rem 2rem",
      }}
    >
      <h2
        className="font-jakarta"
        style={{
          color: "#0D1B3E",
          fontWeight: 800,
          fontSize: "1.05rem",
          marginBottom: "1.125rem",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "50%",
            background: highlight ? "#FF4D6D" : "#0D1B3E",
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {number}
        </span>
        {title}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.875rem",
          fontSize: "0.9rem",
          lineHeight: 1.75,
          color: "#3D4A6B",
        }}
      >
        {children}
      </div>
    </section>
  );
}
