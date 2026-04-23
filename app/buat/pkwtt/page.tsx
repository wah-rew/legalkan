import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontrak Karyawan Tetap (PKWTT) — Segera Hadir | LegalKan",
  description:
    "Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) sesuai UU Ketenagakerjaan dan PP 35/2021. Segera hadir di LegalKan.",
};

export default function PKWTTPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "#F8F9FF" }}
    >
      <div className="mx-auto text-center" style={{ maxWidth: "520px" }}>
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex items-center justify-center rounded-3xl"
          style={{
            width: "5rem",
            height: "5rem",
            background: "rgba(245,158,11,0.12)",
            border: "2px solid rgba(245,158,11,0.3)",
            fontSize: "2.5rem",
          }}
        >
          📋
        </div>

        {/* Badge */}
        <span
          className="inline-flex items-center gap-1 mb-4 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: "rgba(245,158,11,0.12)",
            color: "#D97706",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          ⏳ Segera Hadir
        </span>

        {/* Title */}
        <h1
          className="font-jakarta font-extrabold mb-4"
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            color: "#0D1B3E",
            lineHeight: 1.2,
          }}
        >
          Kontrak Karyawan Tetap
          <br />
          <span style={{ color: "#F59E0B" }}>(PKWTT)</span>
        </h1>

        {/* Message */}
        <p
          className="text-sm mb-8"
          style={{ color: "#6B7FA8", lineHeight: 1.8, maxWidth: "420px", margin: "0 auto 2rem" }}
        >
          Segera hadir! Kami sedang menyiapkan template PKWTT yang sesuai{" "}
          <strong style={{ color: "#0D1B3E" }}>UU Ketenagakerjaan</strong> dan{" "}
          <strong style={{ color: "#0D1B3E" }}>PP 35/2021</strong>. Template ini
          akan mencakup seluruh klausul wajib untuk perjanjian kerja permanen
          yang sah secara hukum.
        </p>

        {/* Feature preview */}
        <div
          className="rounded-2xl p-5 mb-8 text-left"
          style={{
            background: "white",
            border: "1.5px solid rgba(13,27,62,0.08)",
            boxShadow: "0 2px 12px rgba(13,27,62,0.06)",
          }}
        >
          <p className="text-xs font-bold mb-3" style={{ color: "#9BA3C4", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Yang akan tersedia:
          </p>
          <ul className="space-y-2">
            {[
              "Identitas pihak pemberi & penerima kerja",
              "Jabatan, tugas & lingkup pekerjaan",
              "Gaji pokok + tunjangan sesuai UMP/UMK",
              "Hak cuti tahunan & cuti khusus",
              "Klausul PHK & pesangon sesuai PP 35/2021",
              "Masa percobaan (maks. 3 bulan)",
              "Kerahasiaan & larangan persaingan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#3D4F7C" }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "1.125rem",
                    height: "1.125rem",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "9999px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "0.1rem",
                    background: "rgba(245,158,11,0.12)",
                    color: "#D97706",
                  }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/buat/freelancer"
            className="block w-full rounded-2xl py-4 text-sm font-extrabold text-center transition-all"
            style={{
              background: "linear-gradient(135deg, #FF4D6D, #FF6B85)",
              color: "white",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(255,77,109,0.3)",
            }}
          >
            💼 Sementara itu, gunakan Kontrak Freelancer (PKWT) →
          </Link>
          <Link
            href="/"
            className="block w-full rounded-2xl py-3.5 text-sm font-semibold text-center"
            style={{
              background: "rgba(13,27,62,0.06)",
              color: "#6B7FA8",
              textDecoration: "none",
            }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Trust note */}
        <p className="mt-6 text-xs" style={{ color: "#9BA3C4" }}>
          ⚖️ Semua kontrak LegalKan sesuai hukum Indonesia · 🔒 Data terenkripsi
        </p>
      </div>
    </div>
  );
}
