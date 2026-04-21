import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CrispChat from "@/components/CrispChat";
import { PostHogProvider } from "@/components/PostHogProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LegalKan — Legal-kan sekarang.",
  description:
    "LegalKan — buat dokumen legal Indonesia dalam 5 menit. Sewa properti, hutang piutang, freelancer, dan 5 jenis kontrak lainnya.",
  keywords:
    "perjanjian sewa, kontrak sewa rumah, sewa menyewa, hukum properti Indonesia, kontrak online",
  openGraph: {
    title: "LegalKan — Legal-kan sekarang.",
    description: "Dokumen legal dalam 5 menit. Mulai dari Rp 19.000.",
    type: "website",
  },
};

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  return (
    <span
      className={`font-extrabold ${sizes[size]} tracking-tight leading-none`}
      style={{ fontFamily: "var(--font-jakarta)" }}
    >
      <span style={{ color: "#FF4D6D" }}>Legal</span>
      <span style={{ color: "#0D1B3E" }}>Kan</span>
    </span>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body style={{ background: "#F8F9FF", fontFamily: "var(--font-inter)" }}>
        {/* ── Navbar ── */}
        <nav
          className="sticky top-0 z-50"
          style={{
            background: "rgba(248,249,255,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(13,27,62,0.07)",
          }}
        >
          <div
            className="mx-auto flex items-center justify-between px-4"
            style={{ maxWidth: "72rem", height: "3.75rem" }}
          >
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-1"
              style={{ textDecoration: "none" }}
            >
              <Logo size="md" />

            </a>

            {/* Nav links + CTA */}
            <div className="flex items-center gap-2">
              {/* Desktop links */}
              <div className="hidden sm:flex items-center gap-1">
                <a href="/" className="nav-link">
                  Beranda
                </a>
                <a href="/buat" className="nav-link">
                  Kontrak
                </a>
                <a href="/hubungi" className="nav-link">
                  Hubungi
                </a>
              </div>

              {/* Divider */}
              <div
                className="hidden sm:block"
                style={{
                  width: "1px",
                  height: "1.25rem",
                  background: "rgba(13,27,62,0.12)",
                  margin: "0 0.25rem",
                }}
              />

              {/* CTA button */}
              <a
                href="/buat"
                className="btn-primary"
                style={{ padding: "0.5rem 1.125rem", fontSize: "0.8rem" }}
              >
                Buat Kontrak
              </a>
            </div>
          </div>
        </nav>

        <PostHogProvider>
          <main>{children}</main>
          <CrispChat />

          {/* ── Footer ── */}
          <footer
            style={{
              background: "#0D1B3E",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Main footer content */}
            <div
              className="mx-auto px-4 py-12"
              style={{ maxWidth: "72rem" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "2.5rem",
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .footer-grid {
                      grid-template-columns: 1.5fr 1fr 1fr 1fr !important;
                      gap: 3rem !important;
                    }
                  }
                `}</style>
                <div
                  className="footer-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "2.5rem",
                  }}
                >
                  {/* Brand column */}
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-jakarta)",
                          fontWeight: 800,
                          fontSize: "1.25rem",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <span style={{ color: "#FF4D6D" }}>Legal</span>
                        <span style={{ color: "white" }}>Kan</span>
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#6B7FA8",
                        lineHeight: 1.7,
                        maxWidth: "22rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      Platform pembuatan perjanjian legal online. Cepat, sah,
                      dan sesuai KUHPerdata Indonesia.
                    </p>
                    {/* Trust indicators */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {["⚖️ KUHPerdata", "🔒 Terenkripsi"].map(
                        (t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 600,
                              padding: "0.25rem 0.625rem",
                              borderRadius: "9999px",
                              background: "rgba(255,255,255,0.06)",
                              color: "#6B7FA8",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {t}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Kontrak */}
                  <div>
                    <h4
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "1rem",
                      }}
                    >
                      Kontrak
                    </h4>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                      }}
                    >
                      {[
                        { label: "Sewa Properti", href: "/buat" },
                        { label: "Hutang Piutang", href: "/buat/hutang-piutang" },
                        { label: "Kontrak Freelancer", href: "/buat/freelancer" },
                        { label: "Bagi Hasil Usaha", href: "/buat/bagi-hasil" },
                        { label: "Sewa Kendaraan", href: "/buat/sewa-kendaraan" },
                        { label: "Jual Beli", href: "/buat/jual-beli" },
                      ].map((link) => (
                        <li key={link.href}>
                          <a href={link.href} className="footer-link">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Perusahaan */}
                  <div>
                    <h4
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "1rem",
                      }}
                    >
                      Perusahaan
                    </h4>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                      }}
                    >
                      {[
                        { label: "Beranda", href: "/" },
                        { label: "Hubungi Kami", href: "/hubungi" },
                        { label: "Syarat & Ketentuan", href: "#" },
                        { label: "Kebijakan Privasi", href: "#" },
                      ].map((link) => (
                        <li key={link.label}>
                          <a href={link.href} className="footer-link">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>


                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="mx-auto px-4 py-5"
                style={{
                  maxWidth: "72rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#394B6B",
                  }}
                >
                  © {new Date().getFullYear()} LegalKan · Semua hak dilindungi.
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#394B6B",
                    fontStyle: "italic",
                  }}
                >
                  Legal-kan sekarang. ⚖️
                </p>
              </div>
            </div>
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
