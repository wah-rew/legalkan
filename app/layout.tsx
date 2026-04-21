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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  title: "LegalKan — Legal-kan sekarang.",
  description:
    "LegalKan — buat dokumen legal Indonesia dalam 5 menit. Sewa properti, hutang piutang, freelancer, dan 5 jenis kontrak lainnya.",
  keywords: "perjanjian sewa, kontrak sewa rumah, sewa menyewa, hukum properti Indonesia, kontrak online",
  openGraph: {
    title: "LegalKan — Legal-kan sekarang.",
    description: "Dokumen legal dalam 5 menit. Mulai dari Rp 29.000.",
    type: "website",
  },
};

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  const iconSizes = { sm: 28, md: 32, lg: 48 };
  const s = iconSizes[size];
  return (
    <span className="inline-flex items-center gap-2">
      {/* LK icon: L pink, K dark */}
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#0D1B3E"/>
        {/* L — pink */}
        <text x="3" y="24" fontFamily="var(--font-jakarta), sans-serif" fontWeight="800" fontSize="20" fill="#FF4D6D">L</text>
        {/* K — white */}
        <text x="16" y="24" fontFamily="var(--font-jakarta), sans-serif" fontWeight="800" fontSize="20" fill="#FFFFFF">K</text>
      </svg>
      <span
        className={`font-extrabold ${sizes[size]} tracking-tight leading-none`}
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        <span style={{ color: "#FF4D6D" }}>Legal</span>
        <span style={{ color: "#0D1B3E" }}>Kan</span>
      </span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body style={{ background: "#F8F9FF", fontFamily: "var(--font-inter)" }}>
        {/* Navbar */}
        <nav
          className="sticky top-0 z-50 border-b"
          style={{
            background: "rgba(248,249,255,0.92)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(13,27,62,0.08)",
          }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-1">
              <Logo size="md" />
            </a>
            <div className="flex items-center gap-3">
              <a
                href="/hubungi"
                className="hidden sm:block text-sm font-semibold hover:underline"
                style={{ color: "#6B7FA8" }}
              >
                Hubungi Kami
              </a>
              <a href="/buat" className="btn-primary py-2.5 px-5 text-sm">
                Buat Kontrak
              </a>
            </div>
          </div>
        </nav>

        <PostHogProvider>
        <main>{children}</main>
        <CrispChat />

        {/* Footer */}
        <footer
          className="mt-20 border-t pt-10 pb-8"
          style={{ borderColor: "rgba(13,27,62,0.08)", background: "white" }}
        >
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <Logo size="md" />
              {/* Nav links */}
              <div className="flex gap-4 text-xs font-semibold" style={{ color: "#6B7FA8" }}>
                <a href="/" className="hover:underline" style={{ color: "#0D1B3E" }}>Beranda</a>
                <span>·</span>
                <a href="/buat" className="hover:underline" style={{ color: "#0D1B3E" }}>Buat Kontrak</a>
                <span>·</span>
                <a href="/hubungi" className="hover:underline" style={{ color: "#0D1B3E" }}>Hubungi Kami</a>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#0D1B3E" }}>
                Legal-kan sekarang.
              </p>
              <p className="text-xs max-w-sm" style={{ color: "#6B7FA8" }}>
                Platform pembuatan perjanjian sewa menyewa legal berbasis AI.
                Sesuai hukum Indonesia (KUHPerdata Pasal 1548–1600).
              </p>
              <div className="flex gap-4 text-xs" style={{ color: "#9BA3C4" }}>
                <a href="#" className="hover:underline">Syarat & Ketentuan</a>
                <span>·</span>
                <a href="#" className="hover:underline">Kebijakan Privasi</a>
                <span>·</span>
                <a href="/hubungi" className="hover:underline">Hubungi Kami</a>
              </div>
              <p className="text-xs" style={{ color: "#B8BDD6" }}>
                © {new Date().getFullYear()} LegalKan · Semua dokumen dienkripsi dan aman.
              </p>
            </div>
          </div>
        </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
