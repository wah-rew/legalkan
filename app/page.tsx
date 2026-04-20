"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CONTRACT_PRICES } from "@/types";

const ANIMATED_WORDS = ["Sewa Properti", "Hutang Piutang", "Kontrak Freelance", "Bagi Hasil Usaha"];

const CONTRACT_TYPES = [
  { emoji: "🏠", name: "Sewa Properti", desc: "Rumah, kos, ruko, villa", href: "/buat", badge: "Populer", key: "sewa-properti" },
  { emoji: "💰", name: "Hutang Piutang", desc: "Pinjam uang antar individu", href: "/buat/hutang-piutang", key: "hutang-piutang" },
  { emoji: "💼", name: "Kontrak Freelancer", desc: "Jasa desain, dev, konten", href: "/buat/freelancer", key: "freelancer" },
  { emoji: "🤝", name: "Titip Jual", desc: "Konsinyasi produk UMKM", href: "/buat/konsinyasi", key: "konsinyasi" },
  { emoji: "📊", name: "Bagi Hasil Usaha", desc: "Partnership & profit sharing", href: "/buat/bagi-hasil", key: "bagi-hasil" },
  { emoji: "🚗", name: "Sewa Kendaraan", desc: "Rental mobil/motor", href: "/buat/sewa-kendaraan", key: "sewa-kendaraan" },
  { emoji: "🛍️", name: "Jual Beli Secondhand", desc: "Motor, HP, elektronik", href: "/buat/jual-beli", key: "jual-beli" },
  { emoji: "📸", name: "Kontrak EO/Fotografer", desc: "Event & photography", href: "/buat/event-organizer", key: "event-organizer" },
];

const TRUST_ITEMS = [
  { icon: "⚖️", text: "Dibuat sesuai KUHPerdata Indonesia" },
  { icon: "📱", text: "Dokumen dikirim via WhatsApp & Email" },
  { icon: "👥", text: "Digunakan oleh 1.000+ pengguna" },
  { icon: "🔒", text: "Pembayaran aman via Xendit" },
];

const HOW_STEPS = [
  { num: "1", emoji: "📋", title: "Pilih jenis kontrak", desc: "Pilih dari 8 jenis kontrak yang tersedia sesuai kebutuhanmu." },
  { num: "2", emoji: "✍️", title: "Isi data perjanjian", desc: "Isi formulir lengkap — identitas, detail, dan ketentuan khusus." },
  { num: "3", emoji: "💳", title: "Bayar & terima dokumen", desc: "Bayar Rp 29.000 via VA bank. PDF langsung dikirim ke email & WA." },
];

const faqs = [
  { q: "Kontrak ini sah secara hukum?", a: "Iya, 100%. Semua kontrak mengacu langsung pada KUHPerdata Indonesia dengan pasal-pasal yang relevan. Sah dipakai sebagai bukti hukum." },
  { q: "Ada berapa jenis kontrak?", a: "Ada 8 jenis kontrak: Sewa Properti, Hutang Piutang, Freelancer, Titip Jual (Konsinyasi), Bagi Hasil Usaha, Sewa Kendaraan, Jual Beli Secondhand, dan Kontrak EO/Fotografer." },
  { q: "Bayarnya gimana?", a: "Pakai Virtual Account — pilih BCA, BNI, BRI, atau Mandiri. Transfer biasa, langsung terkonfirmasi otomatis via Xendit." },
  { q: "Berapa lama kontrak jadinya?", a: "Instan. Begitu pembayaran masuk, PDF langsung bisa diunduh dan dikirim ke email & WhatsApp kamu." },
  { q: "Data saya aman?", a: "Aman. Semua data dienkripsi. Kami tidak jual atau bagi data ke siapapun." },
];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ANIMATED_WORDS.length);
        setFadeIn(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-4 py-20 sm:py-28"
        style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1a2f5e 60%, #2d1b69 100%)" }}
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-20" style={{ background: "#FF4D6D", filter: "blur(80px)" }} />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-15" style={{ background: "#FFD166", filter: "blur(60px)" }} />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="badge badge-coral inline-flex mb-5 text-sm" style={{ background: "rgba(255,77,109,0.18)", color: "#FF4D6D" }}>
            ✅ Dipercaya 1.000+ pengguna di Indonesia
          </span>

          <h1 className="font-jakarta text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            Legal-kan
          </h1>
          <h1 className="font-jakarta text-4xl font-extrabold leading-tight sm:text-6xl" style={{ color: "#FFD166", minHeight: "1.2em" }}>
            <span
              style={{
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? "translateY(0)" : "translateY(-8px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                display: "inline-block",
              }}
            >
              {ANIMATED_WORDS[wordIndex]}
            </span>
          </h1>
          <h1 className="font-jakarta text-4xl font-extrabold sm:text-6xl mt-1">
            <span style={{ color: "#FF4D6D" }}>sekarang.</span>
          </h1>

          <p className="mt-4 text-lg font-semibold" style={{ color: "#FFD166" }}>
            7 jenis kontrak legal, dibuat dalam 5 menit
          </p>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "#94A3CB" }}>
            Dari sewa properti sampai bagi hasil usaha — buat perjanjian resmi, sah, dan siap tanda tangan tanpa notaris, tanpa ribet.{" "}
            <span className="font-bold text-white">Mulai Rp 29.000</span>.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="#contract-types"
              className="btn-amber text-base px-8 py-4 w-full sm:w-auto rounded-2xl font-extrabold"
            >
              📝 Pilih Jenis Kontrak
            </Link>
            <div className="text-sm" style={{ color: "#94A3CB" }}>
              ⚡ Jadi dalam 5 menit · 💳 VA BCA/BNI/BRI/Mandiri
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs" style={{ color: "#6B7FA8" }}>
            <span>🔒 Pembayaran via Xendit</span>
            <span>📧 PDF ke Email & WA</span>
            <span>📱 Mobile-First</span>
            <span>🇮🇩 Hukum Indonesia</span>
          </div>
        </div>
      </section>

      {/* ── CONTRACT TYPE SELECTOR ── */}
      <section id="contract-types" className="px-4 py-16" style={{ background: "#F8F9FF" }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <span className="badge badge-coral">8 Jenis Kontrak</span>
            <h2 className="font-jakarta text-3xl font-extrabold mt-3" style={{ color: "#0D1B3E" }}>
              Pilih kontrak yang kamu butuhkan
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
              Semua sesuai KUHPerdata Indonesia. Klik kartu untuk mulai.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {CONTRACT_TYPES.map((ct) => (
              <Link
                key={ct.href}
                href={ct.href}
                className="group relative block rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 bg-white"
                style={{
                  borderColor: "rgba(13,27,62,0.08)",
                  boxShadow: "0 2px 8px rgba(13,27,62,0.04)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = "#FF4D6D";
                  el.style.boxShadow = "0 8px 24px rgba(255,77,109,0.15)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(13,27,62,0.08)";
                  el.style.boxShadow = "0 2px 8px rgba(13,27,62,0.04)";
                }}
              >
                {ct.badge && (
                  <span
                    className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,77,109,0.12)", color: "#FF4D6D" }}
                  >
                    {ct.badge}
                  </span>
                )}
                <div className="text-3xl mb-3">{ct.emoji}</div>
                <h3
                  className="font-jakarta font-bold text-sm leading-tight mb-1"
                  style={{ color: "#0D1B3E" }}
                >
                  {ct.name}
                </h3>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "#9BA3C4" }}>
                  {ct.desc}
                </p>
                <p className="text-xs font-bold mb-3" style={{ color: "#06D6A0" }}>
                  mulai Rp {new Intl.NumberFormat('id-ID').format(CONTRACT_PRICES[ct.key])}
                </p>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#FF4D6D" }}
                >
                  Buat Sekarang →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST INDICATORS ── */}
      <section className="px-4 py-10" style={{ background: "white" }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {TRUST_ITEMS.map((t) => (
              <div key={t.text} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(13,27,62,0.03)" }}>
                <span className="text-2xl shrink-0">{t.icon}</span>
                <p className="text-xs font-semibold leading-snug" style={{ color: "#0D1B3E" }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="px-4 py-16"
        style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1a2f5e 100%)" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="badge text-sm" style={{ background: "rgba(255,209,102,0.18)", color: "#FFD166" }}>
              Cara Kerja
            </span>
            <h2 className="font-jakarta text-3xl font-extrabold mt-3 text-white">
              3 langkah, 5 menit, beres.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_STEPS.map((s, i) => (
              <div key={s.num} className="text-center relative">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  {s.emoji}
                </div>
                {i < HOW_STEPS.length - 1 && (
                  <div
                    className="hidden sm:block absolute top-8 left-[calc(50%+36px)] right-0 h-px"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                )}
                <div className="font-jakarta text-xs font-bold mb-1" style={{ color: "#FF4D6D" }}>
                  LANGKAH {s.num}
                </div>
                <h3 className="font-jakarta font-bold text-white mb-1">{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#94A3CB" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="#contract-types" className="btn-amber px-8 py-4 text-base font-extrabold">
              Mulai Sekarang — Rp 29.000
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTRACT PREVIEW TEASER ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 items-center sm:grid-cols-2">
            <div>
              <span className="badge badge-mint">Isi Kontrak Lengkap</span>
              <h2 className="font-jakarta text-3xl font-extrabold mt-3 mb-4" style={{ color: "#0D1B3E" }}>
                Semua klausul penting,
                <br />sudah ada.
              </h2>
              <p className="text-sm mb-5" style={{ color: "#6B7FA8" }}>
                Setiap kontrak mencakup semua klausul yang dibutuhkan sesuai KUHPerdata:
              </p>
              <ul className="space-y-2 text-sm" style={{ color: "#0D1B3E" }}>
                {[
                  "Identitas lengkap para pihak (NIK)",
                  "Klausul wanprestasi & denda",
                  "Penyelesaian sengketa (Pengadilan Negeri)",
                  "Force majeure",
                  "Hak & kewajiban masing-masing pihak",
                  "Disclaimer & ketentuan platform",
                  "Kolom tanda tangan + meterai",
                  "Nomor referensi kontrak unik",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shrink-0" style={{ background: "#D1FAF0", color: "#028A66" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card overflow-hidden" style={{ borderColor: "rgba(255,77,109,0.15)", background: "#FFFBFC" }}>
              <div className="text-center py-2 mb-3 rounded-xl text-xs font-bold tracking-widest uppercase" style={{ background: "#FFE0E6", color: "#FF4D6D" }}>
                Contoh Dokumen
              </div>
              <div className="bg-white rounded-xl p-4 max-h-64 overflow-hidden relative text-xs" style={{ boxShadow: "inset 0 0 0 1px rgba(13,27,62,0.06)" }}>
                <p style={{ textAlign: "center", fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem" }}>PERJANJIAN HUTANG PIUTANG</p>
                <p style={{ textAlign: "center", fontSize: "0.65rem", color: "#888" }}>Nomor: LK-202601-4829</p>
                <hr style={{ margin: "8px 0", borderColor: "#ccc" }} />
                <p style={{ fontSize: "0.65rem" }}>Perjanjian ini dibuat pada hari ini oleh dan antara pihak-pihak berikut:</p>
                <p style={{ fontWeight: 700, marginTop: 6, fontSize: "0.65rem" }}>PASAL 1 — PARA PIHAK</p>
                <p style={{ fontSize: "0.65rem" }}><strong>PIHAK PERTAMA</strong> (Pemberi Pinjaman): Budi Santoso, NIK: 317171xxxxx...</p>
                <p style={{ fontWeight: 700, marginTop: 6, fontSize: "0.65rem" }}>PASAL 2 — POKOK PINJAMAN</p>
                <p style={{ fontSize: "0.65rem" }}>Jumlah Pinjaman: Rp 5.000.000 (lima juta rupiah)...</p>
                <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center pb-3" style={{ background: "linear-gradient(to top, #FFFBFC 60%, transparent)" }}>
                  <Link href="#contract-types" className="text-xs font-bold hover:underline" style={{ color: "#FF4D6D" }}>
                    Buat kontrakmu sendiri →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16" style={{ background: "#F0F2FF" }}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="badge badge-coral">FAQ</span>
            <h2 className="font-jakarta text-3xl font-extrabold mt-3" style={{ color: "#0D1B3E" }}>
              Ada yang mau ditanya?
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-jakarta font-bold text-sm mb-2" style={{ color: "#0D1B3E" }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7FA8" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="px-4 py-20 text-center relative overflow-hidden"
        style={{ background: "#FF4D6D" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-20" style={{ background: "#FFD166", filter: "blur(60px)" }} />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-jakarta text-4xl font-extrabold text-white mb-3">
            Udah siap bikin kontrak?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Rp 29.000. 5 menit. Legal. Langsung jadi.
          </p>
          <Link
            href="#contract-types"
            className="inline-flex items-center gap-2 rounded-2xl px-10 py-5 text-lg font-extrabold transition-all hover:-translate-y-1"
            style={{ background: "#0D1B3E", color: "#FFD166", boxShadow: "0 8px 30px rgba(13,27,62,0.4)" }}
          >
            📝 Pilih Jenis Kontrak
          </Link>
          <p className="mt-4 text-sm text-white/60">
            Tidak perlu daftar akun. Bayar, langsung dapat PDF.
          </p>
        </div>
      </section>
    </div>
  );
}
