import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — LegalKan",
  description:
    "Pelajari bagaimana LegalKan mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

const LAST_UPDATED = "21 April 2026";

export default function KebijakanPrivasiPage() {
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
          🔒 Privasi &amp; Data
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
          Kebijakan Privasi
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
        {/* Intro */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(13,27,62,0.07)",
            borderRadius: "1rem",
            padding: "1.75rem 2rem",
            marginBottom: "2.5rem",
          }}
        >
          <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "#3D4A6B" }}>
            LegalKan berkomitmen untuk melindungi privasi dan keamanan data pribadi pengguna.
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
            menyimpan, dan melindungi informasi Anda saat menggunakan layanan kami di{" "}
            <strong>legalkan.id</strong>.
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.75,
              color: "#3D4A6B",
              marginTop: "0.75rem",
            }}
          >
            Dengan menggunakan layanan LegalKan, Anda menyetujui pengumpulan dan penggunaan
            data sebagaimana diuraikan dalam kebijakan ini.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* 1. Data yang Dikumpulkan */}
          <PrivacySection number="1" title="Data yang Kami Kumpulkan">
            <p>
              Kami mengumpulkan data berikut untuk dapat memberikan layanan pembuatan dokumen
              kepada Anda:
            </p>

            <DataCategory icon="👤" label="Data Identitas">
              Nama lengkap Anda dan pihak lain yang tercantum dalam perjanjian (sesuai data yang
              Anda masukkan).
            </DataCategory>

            <DataCategory icon="📧" label="Data Kontak">
              Alamat email Anda untuk pengiriman dokumen yang telah dibuat. Nomor WhatsApp jika
              Anda memilih opsi pengiriman via WhatsApp.
            </DataCategory>

            <DataCategory icon="📄" label="Data Kontrak">
              Informasi yang Anda masukkan dalam formulir pembuatan dokumen, meliputi: detail
              pihak yang terlibat, objek perjanjian, nilai nominal (jika ada), jangka waktu,
              alamat properti/kendaraan, dan klausul-klausul yang dipilih.
            </DataCategory>

            <DataCategory icon="💳" label="Data Pembayaran">
              Kami <strong>tidak menyimpan</strong> detail kartu kredit atau data perbankan Anda.
              Pembayaran diproses langsung melalui Xendit (gateway pembayaran tersertifikasi PCI-DSS).
              Kami hanya menyimpan status transaksi dan Order ID untuk keperluan rekonsiliasi.
            </DataCategory>

            <DataCategory icon="🌐" label="Data Teknis">
              Alamat IP, jenis browser, sistem operasi, dan halaman yang dikunjungi — dikumpulkan
              secara otomatis untuk tujuan analitik dan keamanan layanan.
            </DataCategory>
          </PrivacySection>

          {/* 2. Penggunaan Data */}
          <PrivacySection number="2" title="Penggunaan Data">
            <p>Data yang kami kumpulkan digunakan untuk tujuan-tujuan berikut:</p>
            <ul className="prose-list">
              <li>
                <strong>Pembuatan dokumen:</strong> mengisi template perjanjian dengan informasi
                yang Anda berikan untuk menghasilkan dokumen yang dipersonalisasi.
              </li>
              <li>
                <strong>Pengiriman dokumen:</strong> mengirimkan dokumen yang telah dibuat ke
                email atau WhatsApp Anda.
              </li>
              <li>
                <strong>Konfirmasi transaksi:</strong> mengirimkan bukti pembayaran dan notifikasi
                terkait pesanan Anda.
              </li>
              <li>
                <strong>Dukungan pelanggan:</strong> membantu Anda jika ada pertanyaan, revisi,
                atau masalah teknis terkait dokumen yang dibuat.
              </li>
              <li>
                <strong>Peningkatan layanan:</strong> menganalisis pola penggunaan secara agregat
                (tanpa mengidentifikasi individu) untuk memperbaiki dan mengembangkan platform.
              </li>
              <li>
                <strong>Kepatuhan hukum:</strong> memenuhi kewajiban hukum dan regulasi yang
                berlaku di Indonesia.
              </li>
            </ul>
          </PrivacySection>

          {/* 3. Penyimpanan & Keamanan */}
          <PrivacySection number="3" title="Penyimpanan & Keamanan Data">
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai
              dengan standar industri untuk melindungi data Anda dari akses tidak sah, pengungkapan,
              perubahan, atau penghancuran.
            </p>
            <ul className="prose-list">
              <li>
                <strong>Enkripsi data:</strong> semua data yang ditransmisikan melalui platform
                dienkripsi menggunakan protokol TLS/HTTPS.
              </li>
              <li>
                <strong>Kontrol akses:</strong> hanya personel yang berwenang yang dapat mengakses
                data pengguna, dan hanya untuk tujuan operasional yang sah.
              </li>
              <li>
                <strong>Infrastruktur aman:</strong> data disimpan pada server yang berlokasi di
                wilayah dengan perlindungan data yang memadai.
              </li>
              <li>
                <strong>Retensi data:</strong> kami menyimpan data transaksi dan dokumen selama
                yang diperlukan untuk keperluan layanan dan kepatuhan hukum, umumnya hingga 5 tahun
                setelah tanggal pembuatan.
              </li>
            </ul>
            <p>
              Meskipun kami berupaya keras untuk melindungi data Anda, tidak ada sistem keamanan
              yang sepenuhnya sempurna. Kami menyarankan Anda untuk menjaga kerahasiaan informasi
              akun dan tidak membagikan dokumen yang berisi data sensitif kepada pihak yang
              tidak berkepentingan.
            </p>
          </PrivacySection>

          {/* 4. Tidak Menjual Data */}
          <PrivacySection number="4" title="Kami Tidak Menjual Data Anda">
            <div
              style={{
                background: "rgba(6,214,160,0.08)",
                border: "1.5px solid rgba(6,214,160,0.25)",
                borderRadius: "0.75rem",
                padding: "1.25rem 1.5rem",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>✅</span>
              <p style={{ margin: 0, fontWeight: 600, color: "#0A6B4B", fontSize: "0.9rem", lineHeight: 1.65 }}>
                LegalKan <strong>tidak pernah menjual, menyewakan, atau memperjualbelikan</strong>{" "}
                data pribadi pengguna kepada pihak ketiga manapun untuk tujuan komersial.
              </p>
            </div>
            <p>
              Data Anda hanya dibagikan kepada pihak ketiga dalam situasi yang sangat terbatas:
            </p>
            <ul className="prose-list">
              <li>
                <strong>Penyedia layanan:</strong> mitra teknis yang membantu operasional platform
                (seperti gateway pembayaran Xendit dan layanan pengiriman email), terikat pada
                perjanjian kerahasiaan yang ketat.
              </li>
              <li>
                <strong>Kewajiban hukum:</strong> jika diwajibkan oleh pengadilan, lembaga penegak
                hukum, atau otoritas regulasi berdasarkan hukum yang berlaku di Indonesia.
              </li>
            </ul>
          </PrivacySection>

          {/* 5. Cookies */}
          <PrivacySection number="5" title="Cookies & Teknologi Pelacakan">
            <p>
              LegalKan menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman
              pengguna dan menganalisis penggunaan layanan:
            </p>
            <ul className="prose-list">
              <li>
                <strong>Cookies fungsional:</strong> diperlukan untuk menjalankan platform,
                seperti menyimpan progres pengisian formulir sementara.
              </li>
              <li>
                <strong>Cookies analitik:</strong> kami menggunakan PostHog untuk memahami
                bagaimana pengguna berinteraksi dengan platform, guna memperbaiki layanan.
                Data ini dikumpulkan secara anonim.
              </li>
              <li>
                <strong>Cookies live chat:</strong> layanan live chat (Crisp) menggunakan cookies
                untuk mengidentifikasi sesi percakapan Anda.
              </li>
            </ul>
            <p>
              Anda dapat mengatur browser Anda untuk menolak cookies, namun beberapa fitur
              platform mungkin tidak berfungsi optimal tanpa cookies.
            </p>
          </PrivacySection>

          {/* 6. Hak Pengguna */}
          <PrivacySection number="6" title="Hak Anda sebagai Pengguna">
            <p>
              Sesuai dengan prinsip perlindungan data dan UU No. 27 Tahun 2022 tentang Perlindungan
              Data Pribadi (PDP) Republik Indonesia, Anda memiliki hak untuk:
            </p>
            <ul className="prose-list">
              <li>
                <strong>Akses:</strong> mengetahui data pribadi apa saja yang kami simpan tentang
                Anda.
              </li>
              <li>
                <strong>Koreksi:</strong> meminta perbaikan atas data yang tidak akurat atau
                tidak lengkap.
              </li>
              <li>
                <strong>Penghapusan:</strong> meminta penghapusan data Anda, kecuali jika kami
                diwajibkan menyimpannya berdasarkan hukum.
              </li>
              <li>
                <strong>Portabilitas:</strong> meminta salinan data Anda dalam format yang dapat
                dibaca.
              </li>
              <li>
                <strong>Keberatan:</strong> mengajukan keberatan atas pemrosesan data Anda untuk
                tujuan tertentu.
              </li>
            </ul>
            <p>
              Untuk mengajukan permintaan terkait data pribadi Anda, hubungi kami melalui halaman{" "}
              <a href="/hubungi" style={{ color: "#FF4D6D", textDecoration: "underline" }}>
                Hubungi Kami
              </a>{" "}
              dengan menyertakan bukti identitas yang sesuai. Kami akan merespons dalam waktu
              14 hari kerja.
            </p>
          </PrivacySection>

          {/* 7. Kontak */}
          <PrivacySection number="7" title="Kontak">
            <p>
              Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan
              Privasi ini atau penanganan data pribadi Anda, silakan hubungi kami:
            </p>
            <ul className="prose-list">
              <li>
                <strong>Halaman Hubungi Kami:</strong>{" "}
                <a href="/hubungi" style={{ color: "#FF4D6D", textDecoration: "underline" }}>
                  legal-kan.com/hubungi
                </a>
              </li>

            </ul>
            <p>
              Perubahan pada Kebijakan Privasi ini akan diinformasikan melalui pembaruan tanggal
              &ldquo;Terakhir diperbarui&rdquo; di bagian atas halaman ini. Penggunaan layanan
              secara berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap
              kebijakan yang baru.
            </p>
          </PrivacySection>
        </div>

        {/* Related link */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(13,27,62,0.07)",
            borderRadius: "1rem",
            padding: "1.25rem 1.75rem",
            marginTop: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <p
              className="font-jakarta"
              style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0D1B3E", margin: 0 }}
            >
              📋 Baca juga: Syarat &amp; Ketentuan
            </p>
            <p style={{ fontSize: "0.8rem", color: "#6B7FA8", margin: "0.25rem 0 0" }}>
              Termasuk disclaimer penting tentang batasan layanan kami.
            </p>
          </div>
          <a
            href="/syarat-ketentuan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "#0D1B3E",
              color: "white",
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "0.5rem 1.125rem",
              borderRadius: "9999px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Baca →
          </a>
        </div>

        {/* Back to Home */}
        <div
          style={{
            textAlign: "center",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(13,27,62,0.08)",
          }}
        >
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

function PrivacySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "white",
        border: "1px solid rgba(13,27,62,0.07)",
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
            background: "#0D1B3E",
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

function DataCategory({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#F8F9FF",
        border: "1px solid rgba(13,27,62,0.06)",
        borderRadius: "0.625rem",
        padding: "0.875rem 1.125rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.375rem",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{icon}</span>
        <strong style={{ fontSize: "0.85rem", color: "#0D1B3E" }}>{label}</strong>
      </div>
      <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.65, color: "#5A6A8A" }}>
        {children}
      </p>
    </div>
  );
}
