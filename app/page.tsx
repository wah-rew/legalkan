"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CONTRACT_PRICES } from "@/types";
import { JsonLd } from "@/components/JsonLd";

const ANIMATED_WORDS = [
  "Sewa Properti",
  "Hutang Piutang",
  "Kontrak Freelance",
  "Bagi Hasil Usaha",
];

interface ContractType {
  icon: string;
  name: string;
  desc: string;
  href: string;
  badge?: string;
  key: string;
  accentColor: string;
  special?: boolean;
  comingSoon?: boolean;
}

const CONTRACT_TYPES: ContractType[] = [
  {
    icon: "🏠",
    name: "Sewa Properti",
    desc: "Rumah, kos, ruko, villa",
    href: "/buat",
    badge: "Populer",
    key: "sewa-properti",
    accentColor: "#FF4D6D",
  },
  {
    icon: "💰",
    name: "Hutang Piutang",
    desc: "Pinjam uang antar individu",
    href: "/buat/hutang-piutang",
    key: "hutang-piutang",
    accentColor: "#FFD166",
  },
  {
    icon: "💼",
    name: "Kontrak Freelancer",
    desc: "Jasa desain, dev, konten",
    href: "/buat/freelancer",
    key: "freelancer",
    accentColor: "#06D6A0",
  },
  {
    icon: "🤝",
    name: "Titip Jual",
    desc: "Konsinyasi produk UMKM",
    href: "/buat/konsinyasi",
    key: "konsinyasi",
    accentColor: "#9B8AFB",
  },
  {
    icon: "📊",
    name: "Bagi Hasil Usaha",
    desc: "Partnership & profit sharing",
    href: "/buat/bagi-hasil",
    key: "bagi-hasil",
    accentColor: "#60C6FF",
  },
  {
    icon: "🚗",
    name: "Sewa Kendaraan",
    desc: "Rental mobil/motor",
    href: "/buat/sewa-kendaraan",
    key: "sewa-kendaraan",
    accentColor: "#FF9A3C",
  },
  {
    icon: "🛍️",
    name: "Jual Beli Secondhand",
    desc: "Motor, HP, elektronik",
    href: "/buat/jual-beli",
    key: "jual-beli",
    accentColor: "#FF6B9D",
  },
  {
    icon: "📸",
    name: "Kontrak EO/Fotografer",
    desc: "Event & photography",
    href: "/buat/event-organizer",
    key: "event-organizer",
    accentColor: "#4FC3F7",
  },
  {
    icon: "🤝",
    name: "NDA / Perjanjian Kerahasiaan",
    desc: "Bilateral NDA antar perusahaan",
    href: "/buat/nda",
    key: "nda",
    accentColor: "#06D6A0",
  },
  {
    icon: "🏦",
    name: "Paket KUR-Ready",
    desc: "Siap apply KUR dalam 10 menit",
    href: "/kur",
    badge: "BARU",
    key: "kur-bundle",
    accentColor: "#FFD166",
    special: true,
  },
  {
    icon: "📋",
    name: "Kontrak Karyawan Tetap (PKWTT)",
    desc: "Perjanjian kerja permanen sesuai UU",
    href: "/buat/pkwtt",
    key: "pkwtt",
    badge: "Segera",
    accentColor: "#F59E0B",
    comingSoon: true,
  },
];

const STATS = [
  { value: "10", label: "Jenis Kontrak", icon: "📄" },
  { value: "100%", label: "Sesuai KUHPerdata", icon: "⚖️" },
  { value: "1.000+", label: "Pengguna Aktif", icon: "👥" },
  { value: "< 5 mnt", label: "Langsung Jadi", icon: "⚡" },
];

const HOW_STEPS = [
  {
    num: "01",
    icon: "📋",
    title: "Pilih jenis kontrak",
    desc: "Pilih dari 8 jenis kontrak yang tersedia sesuai kebutuhanmu.",
  },
  {
    num: "02",
    icon: "✍️",
    title: "Isi data perjanjian",
    desc: "Isi formulir lengkap — identitas, detail, dan ketentuan khusus.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Bayar & terima dokumen",
    desc: "Bayar via VA bank. PDF langsung dikirim ke email kamu.",
  },
];

const TESTIMONIALS = [
  {
    name: "Andi Wijaya",
    role: "Kontraktor, Jakarta",
    quote:
      "Gue udah lama cari solusi buat kontrak sewa yang beneran legal. LegalKan jawaban banget — 5 menit beres, langsung ada PDF-nya!",
    stars: 5,
    initial: "A",
    color: "#FF4D6D",
  },
  {
    name: "Dewi Kusuma",
    role: "Freelance Designer, Bandung",
    quote:
      "Kontrak freelancer-nya lengkap banget. Ada klausul revisi dan pembayaran. Klien langsung mau tanda tangan, profesional banget tampilannya.",
    stars: 5,
    initial: "D",
    color: "#06D6A0",
  },
  {
    name: "Rudi Hartono",
    role: "Owner UMKM, Surabaya",
    quote:
      "Buat kontrak konsinyasi sama supplier jadi gampang. Harganya worth it banget buat ketenangan pikiran dan legalitas usaha.",
    stars: 5,
    initial: "R",
    color: "#FFD166",
  },
];

const FAQS = [
  {
    q: "Kontrak ini sah secara hukum?",
    a: "Iya, 100%. Semua kontrak mengacu langsung pada KUHPerdata Indonesia dengan pasal-pasal yang relevan. Sah dipakai sebagai bukti hukum.",
  },
  {
    q: "Ada berapa jenis kontrak?",
    a: "Ada 8 jenis kontrak individual: Sewa Properti, Hutang Piutang, Freelancer, Titip Jual (Konsinyasi), Bagi Hasil Usaha, Sewa Kendaraan, Jual Beli Secondhand, dan Kontrak EO/Fotografer. Plus Paket KUR-Ready untuk UMKM yang mau apply KUR.",
  },
  {
    q: "Bayarnya gimana?",
    a: "Pakai Virtual Account — pilih BCA, BNI, BRI, atau Mandiri. Transfer biasa, langsung terkonfirmasi otomatis via Xendit.",
  },
  {
    q: "Berapa lama kontrak jadinya?",
    a: "Instan. Begitu pembayaran masuk, PDF langsung bisa diunduh dan dikirim ke email kamu.",
  },
  {
    q: "Data saya aman?",
    a: "Aman. Semua data dienkripsi. Kami tidak jual atau bagi data ke siapapun.",
  },
];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  /* ── Animated word cycling ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ANIMATED_WORDS.length);
        setFadeIn(true);
      }, 300);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  /* ── Scroll reveal (Intersection Observer) ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".animate-fade-up").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div>
      <JsonLd data={faqSchema} />
      {/* ════════════════════════════════════════
          HERO — Full-viewport, animated gradient
          ════════════════════════════════════════ */}
      <section className="hero-gradient-bg relative overflow-hidden min-h-screen flex items-center px-4 py-24">
        {/* Ambient light blobs */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-10%",
            right: "-8%",
            width: "480px",
            height: "480px",
            borderRadius: "9999px",
            background: "#FF4D6D",
            filter: "blur(120px)",
            opacity: 0.18,
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-8%",
            left: "-8%",
            width: "400px",
            height: "400px",
            borderRadius: "9999px",
            background: "#FFD166",
            filter: "blur(100px)",
            opacity: 0.14,
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "320px",
            height: "320px",
            borderRadius: "9999px",
            background: "#06D6A0",
            filter: "blur(100px)",
            opacity: 0.07,
          }}
        />

        <div
          className="relative mx-auto w-full hero-content-grid"
          style={{ maxWidth: "72rem" }}
        >
          {/* ── Left: Text ── */}
          <div className="hero-text-align">
            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(6,214,160,0.12)",
                color: "#06D6A0",
                border: "1px solid rgba(6,214,160,0.25)",
              }}
            >
              <span>✅</span>
              <span>Dipercaya 1.000+ pengguna di Indonesia</span>
            </div>

            {/* Headline */}
            <h1
              className="font-jakarta font-extrabold"
              style={{
                fontSize: "clamp(2.75rem, 6vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              <span className="text-white">Legal-kan</span>
              <span
                style={{ display: "block", minHeight: "1.2em", color: "#FFD166", marginTop: "0.15em" }}
              >
                <span
                  style={{
                    opacity: fadeIn ? 1 : 0,
                    transform: fadeIn ? "translateY(0)" : "translateY(-10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    display: "inline-block",
                  }}
                >
                  {ANIMATED_WORDS[wordIndex]}
                </span>
              </span>
              <span style={{ color: "#FF4D6D" }}>sekarang!</span>
            </h1>

            <p
              className="mt-8 text-base font-medium"
              style={{
                color: "#94A3CB",
                maxWidth: "34rem",
                lineHeight: 1.7,
              }}
            >
              9 jenis kontrak legal + Paket KUR-Ready. Dari sewa properti
              sampai siap apply KUR — tanpa notaris, tanpa ribet.{" "}
              <span
                className="font-bold"
                style={{ color: "white" }}
              >
                Mulai Rp 19.000.
              </span>
            </p>

            <div className="hero-cta-row mt-10">
              <Link
                href="#contract-types"
                className="btn-amber px-8 py-4 text-base font-extrabold"
                style={{ width: "fit-content" }}
              >
                📝 Pilih Jenis Kontrak
              </Link>
              <div
                className="text-sm font-medium"
                style={{ color: "#6B7FA8" }}
              >
                ⚡ 5 menit jadi · 💳 VA BCA / BNI / BRI / Mandiri
              </div>
            </div>

            <div className="hero-meta-row mt-10 text-xs" style={{ color: "#6B7FA8", gap: "1.5rem" }}>
              <span>📧 PDF ke Email</span>
              <span>🇮🇩 Hukum Indonesia</span>
              <span>🔒 Data Terenkripsi</span>
            </div>
          </div>

          {/* ── Right: Floating document card (desktop only) ── */}
          <div className="hero-doc-wrapper">
            <div style={{ position: "relative", padding: "2rem 1.5rem" }}>
              {/* Main card */}
              <div
                className="doc-card-float"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "28px",
                  backdropFilter: "blur(20px)",
                  padding: "2rem 1.75rem",
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
                  maxWidth: "360px",
                  margin: "0 auto",
                }}
              >
                {/* Doc header */}
                <div
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingBottom: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "10px",
                        background: "rgba(255,77,109,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        flexShrink: 0,
                      }}
                    >
                      📄
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          color: "white",
                          fontFamily: "var(--font-jakarta)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        Perjanjian Sewa
                      </div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "rgba(255,255,255,0.45)",
                          marginTop: "2px",
                        }}
                      >
                        LK-2026-0892 · Jl. Mawar No. 12
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "9999px",
                        background: "rgba(6,214,160,0.15)",
                        color: "#06D6A0",
                        flexShrink: 0,
                      }}
                    >
                      Draft
                    </div>
                  </div>
                </div>

                {/* Document lines */}
                {[100, 85, 70, 90, 55].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: "7px",
                      borderRadius: "9999px",
                      background: `rgba(255,255,255,${0.07 - i * 0.01})`,
                      marginBottom: "10px",
                      width: `${w}%`,
                    }}
                  />
                ))}

                {/* Section label */}
                <div
                  style={{
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "#FFD166",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Pasal 1 — Para Pihak
                </div>
                {[90, 75, 60].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: "7px",
                      borderRadius: "9999px",
                      background: `rgba(255,255,255,0.05)`,
                      marginBottom: "9px",
                      width: `${w}%`,
                    }}
                  />
                ))}

                {/* Signature strip */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginTop: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: "1rem",
                  }}
                >
                  {["Pemberi Sewa", "Penyewa"].map((label) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          height: "28px",
                          border: "1px dashed rgba(255,255,255,0.15)",
                          borderRadius: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "0.58rem",
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legal badge */}
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.6rem",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "9999px",
                      background: "rgba(255,77,109,0.12)",
                      color: "rgba(255,138,155,0.9)",
                      fontWeight: 600,
                    }}
                  >
                    ⚖️ Sesuai KUHPerdata Indonesia
                  </div>
                </div>
              </div>

              {/* Floating accent chips */}
              <div
                style={{
                  position: "absolute",
                  top: "8%",
                  right: "0",
                  background: "rgba(255,209,102,0.15)",
                  border: "1px solid rgba(255,209,102,0.3)",
                  borderRadius: "12px",
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#FFD166",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                ✨ Instan
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "12%",
                  left: "0",
                  background: "rgba(6,214,160,0.12)",
                  border: "1px solid rgba(6,214,160,0.3)",
                  borderRadius: "12px",
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#06D6A0",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                🔒 Terenkripsi
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute"
          style={{
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Gulir ke bawah
          </div>
          <div
            style={{
              width: "1px",
              height: "2rem",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
            }}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
          ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #0f1f4a 0%, #0D1B3E 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        className="px-4 py-10"
      >
        <div
          className="mx-auto animate-fade-up"
          style={{
            maxWidth: "64rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-card-dark delay-${(i + 1) * 100}`}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {stat.icon}
              </div>
              <div
                className="font-jakarta font-extrabold"
                style={{ fontSize: "1.75rem", color: "white", lineHeight: 1 }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7FA8",
                  marginTop: "0.25rem",
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTRACT CARDS
          ════════════════════════════════════════ */}
      <section
        id="contract-types"
        className="px-4 py-16"
        style={{
          background:
            "linear-gradient(180deg, #0D1B3E 0%, #162348 100%)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "72rem" }}>
          <div className="text-center mb-12 animate-fade-up">

            <h2
              className="font-jakarta font-extrabold mt-4 text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Pilih kontrak yang kamu butuhkan
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#94A3CB" }}>
              Semua sesuai KUHPerdata Indonesia. Klik kartu untuk mulai.
            </p>
          </div>

          <div className="contract-cards-grid">
            <style>{`
              .contract-cards-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
              }
              @media (min-width: 640px) {
                .contract-cards-grid { grid-template-columns: repeat(3, 1fr); }
              }
              @media (min-width: 1024px) {
                .contract-cards-grid { grid-template-columns: repeat(4, 1fr); }
              }
            `}</style>
            {CONTRACT_TYPES.map((ct, i) => (
              <Link
                key={ct.href}
                href={ct.href}
                className={`contract-card-premium animate-fade-up delay-${Math.min((i % 4 + 1) * 100, 400)}`}
                style={ct.special ? {
                  border: "2px solid rgba(255,209,102,0.5)",
                  background: "rgba(255,209,102,0.05)",
                  boxShadow: "0 0 20px rgba(255,209,102,0.15)",
                } : undefined}
              >
                {ct.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "9999px",
                      background: ct.special ? "rgba(255,209,102,0.25)" : ct.badge === "Segera" ? "rgba(245,158,11,0.2)" : "rgba(255,77,109,0.2)",
                      color: ct.special ? "#FFD166" : ct.badge === "Segera" ? "#F59E0B" : "#FF8A9B",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {ct.badge}
                  </span>
                )}

                {/* Icon */}
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.875rem",
                    display: "block",
                  }}
                >
                  {ct.icon}
                </div>

                {/* Name */}
                <h3
                  className="font-jakarta font-bold text-white"
                  style={{ fontSize: "0.9rem", lineHeight: 1.3, marginBottom: "0.375rem" }}
                >
                  {ct.name}
                </h3>

                {/* Desc */}
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#94A3CB",
                    lineHeight: 1.5,
                    marginBottom: "0.75rem",
                  }}
                >
                  {ct.desc}
                </p>

                {/* Price */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.625rem",
                    borderRadius: "9999px",
                    background: `rgba(${ct.accentColor === "#FFD166" ? "255,209,102" : ct.accentColor === "#06D6A0" ? "6,214,160" : ct.accentColor === "#4FC3F7" ? "79,195,247" : ct.accentColor === "#9B8AFB" ? "155,138,251" : ct.accentColor === "#60C6FF" ? "96,198,255" : ct.accentColor === "#FF9A3C" ? "255,154,60" : ct.accentColor === "#FF6B9D" ? "255,107,157" : ct.accentColor === "#F59E0B" ? "245,158,11" : "255,77,109"},0.12)`,
                    color: ct.accentColor,
                    marginBottom: "0.625rem",
                  }}
                >
                  {ct.comingSoon ? "Segera Hadir" : (
                    <>{ct.key === "kur-bundle" ? "Mulai " : ""}Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      CONTRACT_PRICES[ct.key] ?? 29000
                    )}</>
                  )}
                </div>

                <div
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#FF4D6D",
                  }}
                >
                  Buat sekarang →
                </div>
              </Link>
            ))}
          </div>

          {/* NIB Guide Banner */}
          <div className="mt-8 animate-fade-up delay-400">
            <Link
              href="/nib-guide"
              className="flex items-start gap-4 rounded-3xl p-5 transition-all"
              style={{
                background: "rgba(255,209,102,0.08)",
                border: "1.5px solid rgba(255,209,102,0.3)",
                boxShadow: "0 4px 20px rgba(255,209,102,0.08)",
              }}
            >
              <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>📋</span>
              <div className="flex-1 min-w-0">
                <p
                  className="font-jakarta font-bold text-sm mb-1"
                  style={{ color: "#FFD166" }}
                >
                  Belum punya NIB?
                </p>
                <p
                  className="text-xs"
                  style={{ color: "#94A3CB", lineHeight: 1.6 }}
                >
                  Panduan gratis cara daftar NIB online dalam 15 menit — syarat
                  wajib sebelum apply KUR.
                </p>
              </div>
              <span
                className="flex-shrink-0 text-xs font-bold rounded-xl px-3 py-1.5 self-center"
                style={{
                  background: "rgba(255,209,102,0.18)",
                  color: "#FFD166",
                  whiteSpace: "nowrap",
                }}
              >
                Baca Panduan →
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          BLOG PREVIEW
          ════════════════════════════════════════ */}
      <section
        className="px-4 py-16"
        style={{ background: "#F0F2FF" }}
      >
        <div className="mx-auto" style={{ maxWidth: "72rem" }}>
          <div className="animate-fade-up" style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span
                className="badge"
                style={{
                  background: "rgba(13,27,62,0.08)",
                  color: "#0D1B3E",
                  border: "1px solid rgba(13,27,62,0.12)",
                }}
              >
                📚 Tips &amp; Panduan Legal
              </span>
              <h2
                className="font-jakarta font-extrabold mt-4"
                style={{ color: "#0D1B3E", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
              >
                Baca panduan legal gratis
              </h2>
              <p className="mt-1 text-sm" style={{ color: "#6B7FA8" }}>
                Tips hukum praktis tanpa bahasa kaku — seperti ngobrol sama teman.
              </p>
            </div>
            <Link
              href="/blog"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#FF4D6D",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Lihat semua artikel →
            </Link>
          </div>

          <style>{`
            .blog-preview-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }
            @media (min-width: 640px) {
              .blog-preview-grid { grid-template-columns: repeat(3, 1fr); }
            }
          `}</style>
          <div className="blog-preview-grid">
            {[
              {
                slug: "syarat-dokumen-kur-umkm-2024",
                title: "Syarat Dokumen KUR untuk UMKM 2024 — Panduan Lengkap",
                category: "KUR & UMKM",
                readTime: 7,
                catColor: "#D4A017",
                catBg: "rgba(255,209,102,0.12)",
              },
              {
                slug: "tips-buat-kontrak-sewa-rumah-aman",
                title: "7 Hal Wajib Ada di Kontrak Sewa Rumah — Jangan Sampai Ketinggalan",
                category: "Properti",
                readTime: 8,
                catColor: "#FF4D6D",
                catBg: "rgba(255,77,109,0.10)",
              },
              {
                slug: "kontrak-freelance-indonesia-panduan",
                title: "Kontrak Freelance Indonesia — Kenapa Penting dan Apa yang Harus Ada",
                category: "Freelancer",
                readTime: 7,
                catColor: "#028A66",
                catBg: "rgba(6,214,160,0.10)",
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none" }}
                className="animate-fade-up delay-200"
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "9999px",
                      background: post.catBg,
                      color: post.catColor,
                      border: `1px solid ${post.catBg}`,
                      width: "fit-content",
                    }}
                  >
                    {post.category}
                  </span>
                  <h3
                    className="font-jakarta font-bold"
                    style={{ fontSize: "0.95rem", color: "#0D1B3E", lineHeight: 1.4, flex: 1 }}
                  >
                    {post.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "#FF4D6D",
                      fontWeight: 600,
                    }}
                  >
                    {post.readTime} mnt baca →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════ */}
      <section
        className="px-4 py-20"
        style={{
          background:
            "linear-gradient(135deg, #162348 0%, #0D1B3E 50%, #1a1040 100%)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "56rem" }}>
          <div className="text-center mb-14 animate-fade-up">
            <span
              className="badge"
              style={{
                background: "rgba(255,209,102,0.15)",
                color: "#FFD166",
                border: "1px solid rgba(255,209,102,0.2)",
              }}
            >
              Cara Kerja
            </span>
            <h2
              className="font-jakarta font-extrabold text-white mt-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              3 langkah.{" "}
              <span className="text-gradient-amber">5 menit.</span>{" "}
              Beres.
            </h2>
            <p className="mt-3 text-sm" style={{ color: "#94A3CB" }}>
              Tidak perlu notaris, tidak perlu daftar akun.
            </p>
          </div>

          {/* Steps */}
          <style>{`
            .how-steps-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 2rem;
              position: relative;
            }
            @media (min-width: 640px) {
              .how-steps-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 0;
              }
            }
          `}</style>
          <div>
            <div className="how-steps-grid">
              {HOW_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className={`text-center relative animate-fade-up delay-${(i + 1) * 200}`}
                >
                  {/* Step number */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div className="step-num-badge">{step.num}</div>
                  </div>

                  {/* Icon box */}
                  <div className="step-icon-lg">{step.icon}</div>

                  <h3
                    className="font-jakarta font-bold text-white"
                    style={{ fontSize: "1rem", marginBottom: "0.5rem" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#94A3CB",
                      lineHeight: 1.65,
                      maxWidth: "200px",
                      margin: "0 auto",
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Connector arrow (desktop only) */}
                  {i < HOW_STEPS.length - 1 && (
                    <div
                      className="how-step-connector"
                      style={{
                        display: "none",
                        position: "absolute",
                        top: "4.5rem",
                        left: "calc(50% + 44px)",
                        right: "-50%",
                        height: "2px",
                        background:
                          "linear-gradient(90deg, rgba(255,77,109,0.5), rgba(255,209,102,0.3))",
                      }}
                    />
                  )}
                  <style>{`
                    @media (min-width: 640px) {
                      .how-step-connector { display: block !important; }
                    }
                  `}</style>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14 animate-fade-up delay-400">
            <Link
              href="#contract-types"
              className="btn-amber px-10 py-4 text-base font-extrabold"
            >
              Mulai Sekarang ✨
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════ */}
      <section
        className="px-4 py-16"
        style={{
          background: "linear-gradient(180deg, #0D1B3E 0%, #0f1422 100%)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "64rem" }}>
          <div className="text-center mb-12 animate-fade-up">
            <span
              className="badge"
              style={{
                background: "rgba(255,77,109,0.12)",
                color: "#FF8A9B",
                border: "1px solid rgba(255,77,109,0.18)",
              }}
            >
              ⭐ Testimoni
            </span>
            <h2
              className="font-jakarta font-extrabold text-white mt-4"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
            >
              Dipercaya pengguna di seluruh Indonesia
            </h2>
          </div>

          <style>{`
            .testimonial-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }
            @media (min-width: 640px) {
              .testimonial-grid { grid-template-columns: repeat(3, 1fr); }
            }
          `}</style>
          <div>
            <div className="testimonial-grid">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className={`testimonial-card-dark animate-fade-up delay-${(i + 1) * 200}`}
                >
                  {/* Stars */}
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      marginBottom: "0.875rem",
                    }}
                  >
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <span key={j} style={{ fontSize: "0.875rem", color: "#FFD166" }}>
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.7,
                      marginBottom: "1.25rem",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                  >
                    <div
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "9999px",
                        background: t.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.875rem",
                        color: t.color === "#FFD166" ? "#0D1B3E" : "white",
                        flexShrink: 0,
                        fontFamily: "var(--font-jakarta)",
                      }}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#6B7FA8",
                        }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTRACT CONTENT PREVIEW
          ════════════════════════════════════════ */}
      <section className="px-4 py-16" style={{ background: "white" }}>
        <div className="mx-auto" style={{ maxWidth: "64rem" }}>
          <style>{`
            .content-preview-grid {
              display: grid;
              gap: 2.5rem;
              align-items: center;
              grid-template-columns: 1fr;
            }
            @media (min-width: 640px) {
              .content-preview-grid { grid-template-columns: 1fr 1fr; }
            }
          `}</style>
          <div>
            <div className="content-preview-grid">
              {/* Left */}
              <div className="animate-fade-up">
                <span className="badge badge-mint">Isi Kontrak Lengkap</span>
                <h2
                  className="font-jakarta font-extrabold mt-4 mb-4"
                  style={{
                    color: "#0D1B3E",
                    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                    lineHeight: 1.2,
                  }}
                >
                  Semua klausul penting,
                  <br />
                  sudah ada.
                </h2>
                <p
                  className="text-sm mb-5"
                  style={{ color: "#6B7FA8", lineHeight: 1.7 }}
                >
                  Setiap kontrak mencakup semua klausul yang dibutuhkan sesuai
                  KUHPerdata:
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
                      <span
                        style={{
                          display: "inline-flex",
                          height: "1.25rem",
                          width: "1.25rem",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "9999px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          flexShrink: 0,
                          background: "#D1FAF0",
                          color: "#028A66",
                        }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: sample doc */}
              <div
                className="card animate-fade-up delay-200"
                style={{
                  borderColor: "rgba(255,77,109,0.12)",
                  background: "#FFFBFC",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "0.5rem 1rem",
                    marginBottom: "0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "#FFE0E6",
                    color: "#FF4D6D",
                  }}
                >
                  Contoh Dokumen
                </div>
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1rem",
                    maxHeight: "16rem",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "inset 0 0 0 1px rgba(13,27,62,0.06)",
                    fontSize: "0.65rem",
                  }}
                >
                  <p style={{ textAlign: "center", fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem" }}>
                    PERJANJIAN HUTANG PIUTANG
                  </p>
                  <p style={{ textAlign: "center", color: "#888" }}>
                    Nomor: LK-202601-4829
                  </p>
                  <hr style={{ margin: "8px 0", borderColor: "#ccc" }} />
                  <p>Perjanjian ini dibuat pada hari ini oleh dan antara pihak-pihak berikut:</p>
                  <p style={{ fontWeight: 700, marginTop: 6 }}>PASAL 1 — PARA PIHAK</p>
                  <p>
                    <strong>PIHAK PERTAMA</strong> (Pemberi Pinjaman): Budi
                    Santoso, NIK: 317171xxxxx...
                  </p>
                  <p style={{ fontWeight: 700, marginTop: 6 }}>PASAL 2 — POKOK PINJAMAN</p>
                  <p>Jumlah Pinjaman: Rp 5.000.000 (lima juta rupiah)...</p>
                  <p style={{ fontWeight: 700, marginTop: 6 }}>PASAL 3 — BUNGA</p>
                  <p>Bunga pinjaman sebesar 2% per bulan...</p>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "5rem",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingBottom: "0.75rem",
                      background:
                        "linear-gradient(to top, #FFFBFC 55%, transparent)",
                    }}
                  >
                    <Link
                      href="#contract-types"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#FF4D6D",
                      }}
                    >
                      Buat kontrakmu sendiri →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
          ════════════════════════════════════════ */}
      <section className="px-4 py-16" style={{ background: "#F0F2FF" }}>
        <div className="mx-auto" style={{ maxWidth: "48rem" }}>
          <div className="text-center mb-10 animate-fade-up">
            <span className="badge badge-coral">FAQ</span>
            <h2
              className="font-jakarta font-extrabold mt-4"
              style={{
                color: "#0D1B3E",
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              }}
            >
              Ada yang mau ditanya?
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
              Pertanyaan yang sering ditanya pengguna LegalKan.
            </p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className={`faq-card animate-fade-up delay-${Math.min((i + 1) * 100, 400)}`}
              >
                <h3
                  className="font-jakarta font-bold text-sm mb-2"
                  style={{ color: "#0D1B3E" }}
                >
                  {faq.q}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6B7FA8" }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════ */}
      <section
        className="px-4 py-20 text-center relative overflow-hidden"
        style={{ background: "#FF4D6D" }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-5rem",
            right: "-5rem",
            width: "20rem",
            height: "20rem",
            borderRadius: "9999px",
            background: "#FFD166",
            filter: "blur(60px)",
            opacity: 0.25,
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-4rem",
            left: "-4rem",
            width: "16rem",
            height: "16rem",
            borderRadius: "9999px",
            background: "#0D1B3E",
            filter: "blur(60px)",
            opacity: 0.2,
          }}
        />
        <div
          className="relative mx-auto animate-fade-up"
          style={{ maxWidth: "42rem" }}
        >
          <h2
            className="font-jakarta font-extrabold text-white"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            Udah siap bikin kontrak?
          </h2>
          <p className="text-white/80 mt-3 mb-8 text-lg">
            5 menit. Legal. Langsung jadi.
          </p>
          <Link
            href="#contract-types"
            className="cta-final-btn inline-flex items-center gap-2 rounded-2xl font-extrabold transition-all"
            style={{
              background: "#0D1B3E",
              color: "#FFD166",
              boxShadow: "0 8px 30px rgba(13,27,62,0.4)",
              padding: "1.25rem 2.5rem",
              fontSize: "1.1rem",
            }}
          >
            📝 Pilih Jenis Kontrak
          </Link>
          <p className="mt-10 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Tidak perlu daftar akun · Bayar, langsung dapat PDF
          </p>
        </div>
      </section>
    </div>
  );
}
