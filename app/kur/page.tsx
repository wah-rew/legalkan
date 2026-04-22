import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paket Dokumen KUR UMKM | LegalKan",
  description:
    "Siapkan semua dokumen KUR kamu dalam 10 menit. Auto-detect dokumen yang kamu butuhkan berdasarkan profil usaha. Mulai Rp 59.000.",
  keywords: [
    "dokumen KUR",
    "syarat KUR UMKM",
    "cara apply KUR 2024",
    "persiapan KUR bank",
    "dokumen pengajuan KUR",
    "KUR Mikro",
    "KUR BRI",
    "KUR BNI",
    "UMKM legal",
  ],
  openGraph: {
    title: "Paket Dokumen KUR UMKM | LegalKan",
    description:
      "Siapkan semua dokumen KUR kamu dalam 10 menit. Auto-detect dokumen yang dibutuhkan. Mulai Rp 59.000.",
    url: "https://legal-kan.com/kur",
  },
};

const WHY_ITEMS = [
  {
    icon: "📋",
    title: "Dokumen Lengkap = Pengajuan Lancar",
    desc: "Bank menolak KUR paling sering karena dokumen tidak lengkap atau tidak sesuai format. Siapkan semuanya sebelum ke bank.",
  },
  {
    icon: "⚡",
    title: "Auto-Detect Kebutuhan Dokumen",
    desc: "Jawab 10 pertanyaan singkat. Sistem kami otomatis tahu dokumen apa yang kamu butuhkan berdasarkan profil usaha.",
  },
  {
    icon: "🏦",
    title: "Sesuai Standar Perbankan Indonesia",
    desc: "Semua dokumen menggunakan format yang diterima oleh BRI, BNI, BCA, Mandiri, dan bank penyalur KUR lainnya.",
  },
  {
    icon: "💸",
    title: "Hemat vs Beli Terpisah",
    desc: "Beli dalam bundle jauh lebih hemat. Paket mulai Rp 59.000 untuk 2 dokumen — tidak perlu bayar satuan.",
  },
];

const WHAT_IS_KUR = [
  "KUR (Kredit Usaha Rakyat) adalah program pinjaman bersubsidi pemerintah untuk pelaku UMKM.",
  "Bunga sangat rendah: 6% per tahun — jauh di bawah kredit konvensional.",
  "Tanpa agunan untuk KUR Mikro (< Rp 100 juta).",
  "Disalurkan melalui bank-bank nasional: BRI, BNI, BCA, Mandiri, dan lainnya.",
  "Bisa digunakan untuk modal kerja maupun investasi usaha.",
];

const BUNDLE_DOCS = [
  {
    icon: "📜",
    name: "Surat Pernyataan Usaha Aktif",
    desc: "Deklarasi bahwa usaha sedang beroperasi aktif.",
    tag: "Selalu ada",
    tagColor: "#06D6A0",
  },
  {
    icon: "📋",
    name: "Surat Keterangan Usaha",
    desc: "Dokumen formal menerangkan keberadaan usaha.",
    tag: "Selalu ada",
    tagColor: "#06D6A0",
  },
  {
    icon: "👔",
    name: "PKWT (Kontrak Karyawan)",
    desc: "Perjanjian kerja untuk karyawan tetap.",
    tag: "Jika punya karyawan",
    tagColor: "#FF4D6D",
  },
  {
    icon: "🤝",
    name: "Perjanjian Bagi Hasil Usaha",
    desc: "Dokumen kemitraan & profit sharing.",
    tag: "Jika punya mitra",
    tagColor: "#9B8AFB",
  },
  {
    icon: "💰",
    name: "Perjanjian Hutang Piutang",
    desc: "Dokumentasi modal dari pihak luar.",
    tag: "Jika ada pinjaman",
    tagColor: "#FFD166",
  },
  {
    icon: "📝",
    name: "Surat Kuasa Direksi/Pengurus",
    desc: "Kuasa pengurusan KUR untuk CV/PT.",
    tag: "Jika CV/PT",
    tagColor: "#60C6FF",
  },
];

const FAQS = [
  {
    q: "Apa itu Paket KUR-Ready?",
    a: "Paket KUR-Ready adalah layanan pembuatan dokumen lengkap yang kamu butuhkan sebelum mengajukan KUR ke bank. Sistem kami otomatis mendeteksi dokumen yang relevan berdasarkan profil usahamu.",
  },
  {
    q: "Berapa lama prosesnya?",
    a: "Sekitar 10 menit. Isi wizard 3 langkah → lihat rekomendasi → bayar → semua dokumen langsung bisa diunduh.",
  },
  {
    q: "Apakah dokumennya diterima oleh bank?",
    a: "Dokumen kami menggunakan format standar yang umum diterima perbankan Indonesia. Namun, setiap bank bisa punya persyaratan tambahan — kami sarankan konfirmasi dulu ke petugas KUR bank kamu.",
  },
  {
    q: "Apakah saya perlu datang ke kantor?",
    a: "Tidak perlu. Semua proses online. Dokumen langsung dikirim ke email dan WhatsApp kamu.",
  },
  {
    q: "Saya sudah punya NIB, apakah tetap perlu dokumen ini?",
    a: "NIB (Nomor Induk Berusaha) bagus, tapi bank biasanya minta dokumen pendukung tambahan seperti Surat Pernyataan Usaha Aktif dan Surat Keterangan Usaha untuk memverifikasi kondisi usaha saat ini.",
  },
  {
    q: "Berapa harga paketan vs beli terpisah?",
    a: "Paket mulai Rp 59.000 untuk 2 dokumen dasar. Setiap dokumen tambahan +Rp 25.000. Maksimal Rp 199.000 berapapun dokumennya. Kalau beli satuan bisa 2–3x lebih mahal.",
  },
];

export default function KURLandingPage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center px-4 py-24"
        style={{
          background: "linear-gradient(135deg, #0D1B3E 0%, #162348 50%, #1a1535 100%)",
        }}
      >
        {/* Amber blob */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-8%",
            right: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "9999px",
            background: "#FFD166",
            filter: "blur(100px)",
            opacity: 0.15,
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-5%",
            left: "-5%",
            width: "350px",
            height: "350px",
            borderRadius: "9999px",
            background: "#FF4D6D",
            filter: "blur(90px)",
            opacity: 0.12,
          }}
        />

        <div className="relative mx-auto w-full" style={{ maxWidth: "72rem" }}>
          <div className="text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(255,209,102,0.12)",
                color: "#FFD166",
                border: "1px solid rgba(255,209,102,0.25)",
              }}
            >
              <span>🏦</span>
              <span>Paket KUR-Ready — Khusus UMKM</span>
            </div>

            <h1
              className="font-jakarta font-extrabold text-white"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Siapkan Dokumen KUR
              <br />
              <span style={{ color: "#FFD166" }}>Kamu dalam 10 Menit</span>
            </h1>

            <p
              className="mt-6 text-base font-medium mx-auto"
              style={{ color: "#94A3CB", maxWidth: "42rem", lineHeight: 1.7 }}
            >
              Usaha lebih rapi, pengajuan lebih lancar. LegalKan bantu kamu siap
              sebelum ke bank — auto-detect dokumen yang dibutuhkan berdasarkan
              profil usahamu.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/kur/wizard"
                className="btn-amber px-10 py-4 text-base font-extrabold"
              >
                🚀 Mulai Cek Kebutuhan Dokumen
              </Link>
              <div
                className="text-sm font-medium"
                style={{ color: "#6B7FA8" }}
              >
                ⏱ 10 menit · 📱 Dokumen ke WA & Email · Mulai Rp 59.000
              </div>
            </div>

            {/* Trust strip */}
            <div
              className="mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(6,214,160,0.1)",
                color: "#06D6A0",
                border: "1px solid rgba(6,214,160,0.2)",
              }}
            >
              ✅ Dokumen sesuai standar perbankan Indonesia
            </div>
          </div>
        </div>
      </section>

      {/* ── APA ITU KUR ──────────────────────────────────────────────────────── */}
      <section
        className="px-4 py-20"
        style={{ background: "linear-gradient(180deg, #0D1B3E 0%, #162348 100%)" }}
      >
        <div className="mx-auto" style={{ maxWidth: "64rem" }}>
          <div className="text-center mb-12">
            <span
              className="badge"
              style={{
                background: "rgba(255,209,102,0.15)",
                color: "#FFD166",
                border: "1px solid rgba(255,209,102,0.2)",
              }}
            >
              Apa itu KUR?
            </span>
            <h2
              className="font-jakarta font-extrabold text-white mt-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Kredit Usaha Rakyat — Modal Murah untuk UMKM
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {WHAT_IS_KUR.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minHeight: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: "1.5rem",
                    height: "1.5rem",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "9999px",
                    background: "rgba(255,209,102,0.15)",
                    color: "#FFD166",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {i + 1}
                </span>
                <p className="text-sm" style={{ color: "#94A3CB", lineHeight: 1.7 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KENAPA DOKUMEN PENTING ───────────────────────────────────────────── */}
      <section
        className="px-4 py-20"
        style={{ background: "#F8F9FF" }}
      >
        <div className="mx-auto" style={{ maxWidth: "64rem" }}>
          <div className="text-center mb-12">
            <span className="badge badge-coral">Kenapa Dokumen Penting?</span>
            <h2
              className="font-jakarta font-extrabold mt-4"
              style={{ color: "#0D1B3E", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Persiapan yang baik = Pengajuan yang berhasil
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
              Bank menolak KUR paling sering bukan karena usaha tidak layak — tapi
              karena dokumen tidak lengkap.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {WHY_ITEMS.map((item, i) => (
              <div
                key={i}
                className="card"
                style={{ borderColor: "rgba(255,77,109,0.1)" }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.875rem",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-jakarta font-bold mb-2"
                  style={{ color: "#0D1B3E", fontSize: "0.95rem" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "#6B7FA8", lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOKUMEN DALAM BUNDLE ─────────────────────────────────────────────── */}
      <section
        className="px-4 py-20"
        style={{ background: "linear-gradient(180deg, #0D1B3E 0%, #162348 100%)" }}
      >
        <div className="mx-auto" style={{ maxWidth: "64rem" }}>
          <div className="text-center mb-12">
            <span
              className="badge"
              style={{
                background: "rgba(255,77,109,0.15)",
                color: "#FF4D6D",
                border: "1px solid rgba(255,77,109,0.2)",
              }}
            >
              6 Jenis Dokumen
            </span>
            <h2
              className="font-jakarta font-extrabold text-white mt-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Dokumen apa yang bisa kamu dapatkan?
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#94A3CB" }}>
              Sistem kami auto-detect mana yang kamu butuhkan. Tidak semua orang perlu
              semua dokumen.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {BUNDLE_DOCS.map((doc, i) => (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                  <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{doc.icon}</span>
                  <div>
                    <h3
                      className="font-jakarta font-bold text-white"
                      style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}
                    >
                      {doc.name}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "#6B7FA8", lineHeight: 1.6 }}>
                      {doc.desc}
                    </p>
                    <span
                      style={{
                        display: "inline-flex",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.625rem",
                        borderRadius: "9999px",
                        background: `${doc.tagColor}20`,
                        color: doc.tagColor,
                        border: `1px solid ${doc.tagColor}30`,
                      }}
                    >
                      {doc.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ───────────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ background: "white" }}>
        <div className="mx-auto text-center" style={{ maxWidth: "40rem" }}>
          <span className="badge badge-mint">Harga</span>
          <h2
            className="font-jakarta font-extrabold mt-4 mb-4"
            style={{ color: "#0D1B3E", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Transparan & Hemat
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6B7FA8", lineHeight: 1.7 }}>
            Harga dihitung otomatis berdasarkan jumlah dokumen yang kamu butuhkan.
            Tidak perlu bayar lebih untuk yang tidak kamu perlukan.
          </p>

          <div
            className="rounded-3xl p-8 text-left"
            style={{
              background: "linear-gradient(135deg, #0D1B3E, #162348)",
              boxShadow: "0 20px 60px rgba(13,27,62,0.2)",
            }}
          >
            <div className="text-center mb-6">
              <p className="text-xs font-semibold mb-2" style={{ color: "#6B7FA8" }}>
                Paket Dasar (2 dokumen)
              </p>
              <p
                className="font-jakarta font-extrabold text-white"
                style={{ fontSize: "2.5rem" }}
              >
                Rp 59.000
              </p>
              <div
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 mt-2"
                style={{ background: "rgba(255,209,102,0.15)", border: "1px solid rgba(255,209,102,0.3)" }}
              >
                <span className="text-xs font-bold" style={{ color: "#FFD166" }}>Hemat hingga 40% vs beli satuan</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                ["2 dokumen dasar", "Rp 59.000"],
                ["Setiap dokumen tambahan", "+Rp 25.000"],
                ["Maksimal (berapapun dokumen)", "Rp 199.000"],
              ].map(([label, price]) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-sm"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    paddingBottom: "0.625rem",
                  }}
                >
                  <span style={{ color: "#94A3CB" }}>{label}</span>
                  <span className="font-bold text-white">{price}</span>
                </div>
              ))}
            </div>

            <Link
              href="/kur/wizard"
              className="btn-amber w-full py-4 text-base font-extrabold text-center block"
            >
              Hitung Dokumen Kamu →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section
        className="px-4 py-20"
        style={{ background: "#F0F2FF" }}
      >
        <div className="mx-auto" style={{ maxWidth: "56rem" }}>
          <div className="text-center mb-14">
            <span className="badge badge-coral">Cara Kerja</span>
            <h2
              className="font-jakarta font-extrabold mt-4"
              style={{ color: "#0D1B3E", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              3 langkah. 10 menit. Dokumen jadi.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                num: "01",
                icon: "📋",
                title: "Isi Profil Usaha",
                desc: "Jawab 10 pertanyaan singkat soal usahamu — bentuk, skala, dan struktur.",
              },
              {
                num: "02",
                icon: "🔍",
                title: "Auto-Detect Dokumen",
                desc: "Sistem kami otomatis tentukan dokumen apa yang kamu butuhkan beserta harganya.",
              },
              {
                num: "03",
                icon: "📥",
                title: "Bayar & Unduh",
                desc: "Bayar via VA bank. Semua dokumen langsung dikirim ke email & WA kamu.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl font-jakarta font-extrabold text-sm mb-4"
                  style={{ background: "#FF4D6D", color: "white" }}
                >
                  {step.num}
                </div>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{step.icon}</div>
                <h3
                  className="font-jakarta font-bold mb-2"
                  style={{ color: "#0D1B3E", fontSize: "1rem" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: "#6B7FA8", lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/kur/wizard" className="btn-amber px-10 py-4 text-base font-extrabold">
              🚀 Mulai Cek Kebutuhan Dokumen
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ background: "white" }}>
        <div className="mx-auto" style={{ maxWidth: "48rem" }}>
          <div className="text-center mb-10">
            <span className="badge badge-mint">FAQ</span>
            <h2
              className="font-jakarta font-extrabold mt-4"
              style={{ color: "#0D1B3E", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
            >
              Pertanyaan soal KUR & Dokumen
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="faq-card">
                <h3
                  className="font-jakarta font-bold text-sm mb-2"
                  style={{ color: "#0D1B3E" }}
                >
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7FA8" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section
        className="px-4 py-20 text-center relative overflow-hidden"
        style={{ background: "#FFD166" }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-4rem",
            right: "-4rem",
            width: "18rem",
            height: "18rem",
            borderRadius: "9999px",
            background: "#FF4D6D",
            filter: "blur(60px)",
            opacity: 0.2,
          }}
        />
        <div className="relative mx-auto" style={{ maxWidth: "42rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏦</div>
          <h2
            className="font-jakarta font-extrabold"
            style={{
              color: "#0D1B3E",
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              lineHeight: 1.15,
            }}
          >
            Siap apply KUR?
          </h2>
          <p style={{ color: "#6B5000", marginTop: "0.75rem", marginBottom: "2rem" }}>
            10 menit. Semua dokumen jadi. Langsung ke bank.
          </p>
          <Link
            href="/kur/wizard"
            className="inline-flex items-center gap-2 rounded-2xl font-extrabold transition-all px-10 py-4 text-base"
            style={{
              background: "#0D1B3E",
              color: "#FFD166",
              boxShadow: "0 8px 30px rgba(13,27,62,0.3)",
            }}
          >
            🚀 Mulai Cek Kebutuhan Dokumen
          </Link>
          <p className="mt-12 text-sm" style={{ color: "rgba(13,27,62,0.5)" }}>
            Tidak perlu daftar akun · Bayar, langsung dapat semua dokumen
          </p>
        </div>
      </section>
    </div>
  );
}
