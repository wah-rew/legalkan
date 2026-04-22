"use client";
import { useState } from "react";
import Link from "next/link";

const KBLI_MAP: Record<string, { code: string; name: string }> = {
  warung: { code: "47110", name: "Perdagangan Eceran Berbagai Macam Barang" },
  kuliner: { code: "56101", name: "Restoran dan Rumah Makan" },
  jasa: { code: "96090", name: "Aktivitas Jasa Perorangan Lainnya" },
  pertanian: { code: "01110", name: "Pertanian Tanaman Semusim" },
  peternakan: { code: "01410", name: "Peternakan Sapi dan Kerbau" },
  online: { code: "47919", name: "Perdagangan Eceran Melalui Media Internet" },
  konveksi: { code: "14111", name: "Industri Pakaian Jadi dari Tekstil" },
  bengkel: { code: "45201", name: "Reparasi Mobil" },
  konstruksi: { code: "41010", name: "Konstruksi Gedung Hunian" },
  lainnya: { code: "99000", name: "Cek panduan lengkap KBLI di oss.go.id" },
};

const USAHA_OPTIONS = [
  { value: "warung", label: "🛒 Warung / Toko" },
  { value: "jasa", label: "✂️ Jasa (salon, laundry, dll)" },
  { value: "kuliner", label: "🍜 Kuliner / Makanan" },
  { value: "pertanian", label: "🌾 Pertanian" },
  { value: "peternakan", label: "🐄 Peternakan" },
  { value: "online", label: "🛍️ Perdagangan Online" },
  { value: "konveksi", label: "🧵 Konveksi / Jahit" },
  { value: "bengkel", label: "🔧 Bengkel / Otomotif" },
  { value: "konstruksi", label: "🏗️ Konstruksi / Bangunan" },
  { value: "lainnya", label: "📁 Lainnya" },
];

const STEPS = [
  {
    num: "01",
    icon: "🌐",
    title: "Buka oss.go.id dan daftar akun",
    desc: "Kunjungi oss.go.id dan buat akun baru. Siapkan email aktif dan nomor HP.",
  },
  {
    num: "02",
    icon: "🔑",
    title: 'Login dan pilih "Perizinan Berusaha"',
    desc: 'Setelah login, klik menu "Perizinan Berusaha" di dashboard OSS.',
  },
  {
    num: "03",
    icon: "🏢",
    title: "Pilih jenis usaha",
    desc: "Pilih antara Usaha Perseorangan (untuk individu) atau Badan Usaha (CV, PT, dll).",
  },
  {
    num: "04",
    icon: "📋",
    title: "Isi data usaha",
    desc: "Lengkapi nama usaha, alamat, dan info dasar. Siapkan KTP dan NPWP jika ada.",
  },
  {
    num: "05",
    icon: "🔍",
    title: "Pilih KBLI yang sesuai",
    desc: "KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah kode jenis usahamu. Ini bagian yang paling banyak bikin bingung — gunakan KBLI Finder di bawah!",
    highlight: true,
  },
  {
    num: "06",
    icon: "✅",
    title: "Submit → NIB langsung terbit",
    desc: "Setelah submit, NIB langsung terbit dan bisa diunduh dalam format PDF. Gratis!",
  },
];

const FAQS = [
  {
    q: "Apakah NIB benar-benar gratis?",
    a: "Ya, 100% gratis. NIB diterbitkan pemerintah melalui sistem OSS (Online Single Submission) tanpa biaya apapun.",
  },
  {
    q: "Berapa lama NIB berlaku?",
    a: "NIB berlaku seumur hidup selama usahamu masih aktif dan tidak ada perubahan data yang signifikan.",
  },
  {
    q: "Apakah NIB bisa dipakai untuk apply KUR di semua bank?",
    a: "Ya. NIB adalah syarat wajib di hampir semua bank penyalur KUR termasuk BRI, BNI, Mandiri, dan BSI.",
  },
  {
    q: "Dokumen apa saja yang dibutuhkan untuk daftar NIB?",
    a: "Minimal hanya KTP (NIK). Untuk badan usaha seperti CV atau PT, dibutuhkan akta pendirian. NPWP dianjurkan tapi tidak selalu wajib untuk usaha mikro.",
  },
  {
    q: "NIB menggantikan dokumen apa saja?",
    a: "NIB menggantikan SIUP (Surat Izin Usaha Perdagangan), TDP (Tanda Daftar Perusahaan), dan API (Angka Pengenal Importir). Satu NIB untuk semuanya.",
  },
  {
    q: "Kalau salah pilih KBLI, apakah bisa diubah?",
    a: "Bisa. Kamu bisa mengajukan perubahan KBLI melalui sistem OSS, tapi prosesnya butuh waktu. Sebaiknya pilih KBLI yang tepat sejak awal menggunakan KBLI Finder kami.",
  },
];

export default function NIBGuidePage() {
  const [selectedUsaha, setSelectedUsaha] = useState("");
  const [kbliResult, setKbliResult] = useState<{ code: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleKBLIFind() {
    if (!selectedUsaha) return;
    setKbliResult(KBLI_MAP[selectedUsaha] ?? null);
    setCopied(false);
  }

  function handleCopy() {
    if (!kbliResult) return;
    navigator.clipboard.writeText(kbliResult.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ background: "#F8F9FF", minHeight: "100vh" }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="px-4 py-16 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D1B3E 0%, #162348 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-4rem",
            right: "-4rem",
            width: "20rem",
            height: "20rem",
            borderRadius: "9999px",
            background: "#FFD166",
            filter: "blur(80px)",
            opacity: 0.15,
          }}
        />
        <div className="relative mx-auto" style={{ maxWidth: "640px" }}>
          <Link
            href="/kur/wizard"
            className="text-xs font-semibold"
            style={{ color: "#6B7FA8" }}
          >
            ← Kembali ke Wizard KUR
          </Link>

          <div className="mt-4 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "rgba(255,209,102,0.15)",
                color: "#FFD166",
                border: "1px solid rgba(255,209,102,0.25)",
              }}
            >
              📋 Panduan Gratis
            </span>
          </div>

          <h1
            className="font-jakarta font-extrabold text-white mt-3"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", lineHeight: 1.15 }}
          >
            Cara Daftar NIB Online
            <br />
            <span style={{ color: "#FFD166" }}>Gratis, 15 Menit</span>
          </h1>

          <p
            className="mt-4 text-sm"
            style={{ color: "#94A3CB", lineHeight: 1.7, maxWidth: "480px", margin: "1rem auto 0" }}
          >
            NIB (Nomor Induk Berusaha) adalah syarat utama sebelum apply KUR.
            Ikuti panduan ini dan dapatkan NIB-mu hari ini.
          </p>

          <div className="mt-6">
            <a
              href="https://oss.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl font-extrabold text-sm px-6 py-3"
              style={{
                background: "#FFD166",
                color: "#0D1B3E",
                boxShadow: "0 4px 20px rgba(255,209,102,0.3)",
              }}
            >
              Mulai Daftar NIB di OSS →
            </a>
          </div>
        </div>
      </section>

      {/* ── What is NIB ─────────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="mx-auto" style={{ maxWidth: "640px" }}>
          <div
            className="rounded-3xl p-6"
            style={{
              background: "white",
              boxShadow: "0 2px 16px rgba(13,27,62,0.06)",
              border: "1px solid rgba(13,27,62,0.06)",
            }}
          >
            <h2
              className="font-jakarta font-extrabold mb-4"
              style={{ color: "#0D1B3E", fontSize: "1.1rem" }}
            >
              🪪 Apa itu NIB?
            </h2>
            <p className="text-sm mb-4" style={{ color: "#5A6A8A", lineHeight: 1.7 }}>
              NIB (Nomor Induk Berusaha) adalah <strong>identitas legal usahamu</strong> yang
              diterbitkan oleh pemerintah melalui sistem OSS (Online Single Submission).
            </p>
            <div className="space-y-2.5">
              {[
                { icon: "✅", text: "Gratis — tidak ada biaya apapun" },
                { icon: "♾️", text: "Berlaku seumur hidup selama usaha aktif" },
                { icon: "📄", text: "Menggantikan SIUP, TDP, dan API sekaligus" },
                { icon: "🏦", text: "Wajib untuk apply KUR di semua bank" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.icon}</span>
                  <span className="text-sm font-medium" style={{ color: "#0D1B3E" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Step by Step ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-12">
        <div className="mx-auto" style={{ maxWidth: "640px" }}>
          <h2
            className="font-jakarta font-extrabold mb-6"
            style={{ color: "#0D1B3E", fontSize: "1.2rem" }}
          >
            📋 Panduan Langkah Demi Langkah
          </h2>
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-4"
                style={{
                  background: step.highlight
                    ? "rgba(255,209,102,0.1)"
                    : "white",
                  border: step.highlight
                    ? "1.5px solid rgba(255,209,102,0.45)"
                    : "1px solid rgba(13,27,62,0.06)",
                  boxShadow: "0 2px 8px rgba(13,27,62,0.04)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full font-extrabold text-xs"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      background: step.highlight
                        ? "rgba(255,209,102,0.25)"
                        : "rgba(13,27,62,0.06)",
                      color: step.highlight ? "#9A7500" : "#0D1B3E",
                    }}
                  >
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: "1rem" }}>{step.icon}</span>
                      <p
                        className="font-bold text-sm"
                        style={{ color: step.highlight ? "#9A7500" : "#0D1B3E" }}
                      >
                        {step.title}
                      </p>
                      {step.highlight && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(255,209,102,0.25)",
                            color: "#9A7500",
                          }}
                        >
                          Sering bingung di sini
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "#5A6A8A", lineHeight: 1.6 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KBLI Finder ─────────────────────────────────────────────────── */}
      <section className="px-4 pb-12">
        <div className="mx-auto" style={{ maxWidth: "640px" }}>
          <div
            className="rounded-3xl p-6"
            style={{
              background: "linear-gradient(135deg, #0D1B3E 0%, #162348 100%)",
              boxShadow: "0 8px 32px rgba(13,27,62,0.2)",
            }}
          >
            <h2
              className="font-jakarta font-extrabold mb-1 text-white"
              style={{ fontSize: "1.1rem" }}
            >
              🔍 KBLI Finder
            </h2>
            <p className="text-xs mb-5" style={{ color: "#94A3CB" }}>
              Bingung pilih kode KBLI? Pilih jenis usahamu dan kami rekomendasikan kodenya.
            </p>

            <div className="mb-4">
              <label
                className="block text-xs font-bold mb-2"
                style={{ color: "#94A3CB" }}
              >
                Jenis usaha saya adalah...
              </label>
              <select
                value={selectedUsaha}
                onChange={(e) => setSelectedUsaha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "2px solid rgba(255,255,255,0.1)",
                  fontSize: "0.875rem",
                  color: "#0D1B3E",
                  background: "white",
                  outline: "none",
                }}
              >
                <option value="">-- Pilih jenis usaha --</option>
                {USAHA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleKBLIFind}
              disabled={!selectedUsaha}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "12px",
                background: selectedUsaha ? "#FFD166" : "rgba(255,255,255,0.1)",
                color: selectedUsaha ? "#0D1B3E" : "#6B7FA8",
                fontWeight: 800,
                fontSize: "0.875rem",
                border: "none",
                cursor: selectedUsaha ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Cari Kode KBLI →
            </button>

            {kbliResult && (
              <div
                className="mt-4 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: "#94A3CB" }}>
                  Rekomendasi KBLI:
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p
                      className="font-jakarta font-extrabold text-white"
                      style={{ fontSize: "1.5rem", letterSpacing: "0.05em" }}
                    >
                      {kbliResult.code}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#94A3CB" }}>
                      {kbliResult.name}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    style={{
                      flexShrink: 0,
                      padding: "0.5rem 1rem",
                      borderRadius: "10px",
                      background: copied
                        ? "rgba(6,214,160,0.2)"
                        : "rgba(255,255,255,0.12)",
                      color: copied ? "#06D6A0" : "white",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      border: copied
                        ? "1px solid rgba(6,214,160,0.4)"
                        : "1px solid rgba(255,255,255,0.15)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {copied ? "✓ Tersalin!" : "Salin Kode"}
                  </button>
                </div>
                {kbliResult.code === "99000" && (
                  <p className="text-xs mt-2" style={{ color: "#FFD166" }}>
                    💡 Untuk usaha jenis lain, cari kode yang paling sesuai di{" "}
                    <a
                      href="https://oss.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      oss.go.id
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── After NIB CTA ────────────────────────────────────────────────── */}
      <section className="px-4 pb-12">
        <div className="mx-auto" style={{ maxWidth: "640px" }}>
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              background: "rgba(6,214,160,0.08)",
              border: "1.5px solid rgba(6,214,160,0.25)",
            }}
          >
            <p
              className="font-jakarta font-extrabold mb-1"
              style={{ color: "#0D1B3E", fontSize: "1rem" }}
            >
              ✅ Sudah punya NIB?
            </p>
            <p className="text-sm mb-4" style={{ color: "#5A6A8A" }}>
              Sekarang siapkan dokumen KUR-mu →
            </p>
            <Link
              href="/kur/wizard"
              className="inline-flex items-center gap-2 rounded-2xl font-extrabold text-sm px-5 py-3"
              style={{
                background: "#06D6A0",
                color: "white",
              }}
            >
              Cek Kebutuhan Dokumen KUR →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="mx-auto" style={{ maxWidth: "640px" }}>
          <h2
            className="font-jakarta font-extrabold mb-5"
            style={{ color: "#0D1B3E", fontSize: "1.2rem" }}
          >
            ❓ Pertanyaan Seputar NIB
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl p-4"
                style={{
                  background: "white",
                  border: "1px solid rgba(13,27,62,0.06)",
                  boxShadow: "0 2px 8px rgba(13,27,62,0.04)",
                }}
              >
                <h3
                  className="font-bold text-sm mb-1.5"
                  style={{ color: "#0D1B3E" }}
                >
                  {faq.q}
                </h3>
                <p className="text-xs" style={{ color: "#5A6A8A", lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <section
        className="px-4 py-12 text-center"
        style={{ background: "#0D1B3E" }}
      >
        <div className="mx-auto" style={{ maxWidth: "480px" }}>
          <p
            className="font-jakarta font-extrabold text-white mb-2"
            style={{ fontSize: "1.1rem" }}
          >
            Siap mulai daftar NIB?
          </p>
          <p className="text-sm mb-5" style={{ color: "#94A3CB" }}>
            Gratis, online, 15 menit. Tidak perlu ke kantor.
          </p>
          <a
            href="https://oss.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl font-extrabold text-sm px-6 py-3"
            style={{
              background: "#FFD166",
              color: "#0D1B3E",
            }}
          >
            Daftar NIB di OSS →
          </a>
        </div>
      </section>
    </div>
  );
}
