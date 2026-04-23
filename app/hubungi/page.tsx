"use client";
import { useState } from "react";
import { captureEvent } from "@/components/PostHogProvider";

const INTENT_OPTIONS = [
  { value: "revisi-dokumen", label: "📝 Revisi Dokumen" },
  { value: "pertanyaan-sebelum-beli", label: "❓ Pertanyaan Sebelum Beli" },
  { value: "masalah-pembayaran", label: "💳 Masalah Pembayaran" },
  { value: "dokumen-belum-terima", label: "📬 Dokumen Belum Diterima" },
  { value: "konsultasi-hukum", label: "⚖️ Konsultasi Hukum" },
  { value: "saran-produk", label: "💡 Saran Produk" },
  { value: "kerjasama", label: "🤝 Kerjasama / Partnership" },
  { value: "lainnya", label: "📌 Lainnya" },
];

const FAQS = [
  {
    q: "Apakah kontrak dari LegalKan sah secara hukum?",
    a: "Ya, 100% sah. Semua kontrak kami mengacu langsung pada KUHPerdata Indonesia dan mencakup klausul-klausul yang dibutuhkan agar perjanjian memiliki kekuatan hukum.",
  },
  {
    q: "Apakah perlu materai?",
    a: "Untuk kekuatan hukum penuh, tempelkan materai Rp 10.000 pada setiap kolom tanda tangan sesuai UU No. 10 Tahun 2021 tentang Bea Meterai. Tersedia di kantor pos atau minimarket.",
  },
  {
    q: "Berapa lama dokumen dikirim ke email?",
    a: "Dokumen dikirim ke email Anda setelah pembayaran dikonfirmasi tim LegalKan (maksimal 1×24 jam).",
  },
  {
    q: "Apakah data saya aman?",
    a: "Semua data dienkripsi dengan standar industri. Kami tidak menjual atau membagikan data Anda ke pihak mana pun.",
  },
  {
    q: "Bisa minta revisi pada dokumen yang sudah dibuat?",
    a: "Dokumen dibuat berdasarkan data yang Anda isi. Jika ada kesalahan input, hubungi kami dengan menyertakan Order ID dan kami akan bantu proses revisi.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Pembayaran dilakukan via transfer manual ke bank. Dokumen dikirim setelah konfirmasi tim LegalKan (maks. 1×24 jam).",
  },
  {
    q: "Dokumen tidak masuk ke email, apa yang harus dilakukan?",
    a: "Pertama, cek folder Spam/Junk di email Anda. Jika tidak ada, hubungi kami dengan menyertakan Order ID dan email yang digunakan saat checkout.",
  },
  {
    q: "Apakah bisa buat kontrak untuk dua WNI yang tinggal di luar negeri?",
    a: "Bisa. Kontrak kami berlaku berdasarkan hukum Indonesia (KUHPerdata). Anda cukup mencantumkan alamat dan NIK masing-masing pihak sesuai KTP Indonesia.",
  },
];

export default function HubungiKamiPage() {
  const [form, setForm] = useState({
    nama: "",
    kontakEmail: "",
    intent: "",
    orderId: "",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const needsOrderId = ["revisi-dokumen", "masalah-pembayaran", "dokumen-belum-terima"].includes(form.intent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) { setError("Nama wajib diisi"); return; }
    if (!form.kontakEmail.trim()) { setError("Email atau WhatsApp wajib diisi"); return; }
    if (!form.intent) { setError("Pilih topik pesan"); return; }
    if (!form.pesan.trim()) { setError("Pesan wajib diisi"); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan");
      setSubmitted(true);
      // Track contact form submitted
      captureEvent('contact_submitted', { intent: form.intent });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="badge inline-flex mb-3"
            style={{ background: "rgba(255,77,109,0.1)", color: "#FF4D6D" }}
          >
            📬 Hubungi Kami
          </span>
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Ada yang bisa kami bantu?
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Tim kami siap membantu. Biasanya kami balas dalam 1×24 jam.
          </p>
        </div>

        {/* Contact Form */}
        {submitted ? (
          <div
            className="rounded-3xl p-8 text-center mb-10"
            style={{ background: "white", border: "1px solid rgba(6,214,160,0.3)" }}
          >
            <div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl"
              style={{ background: "#D1FAF0" }}
            >
              ✅
            </div>
            <h2 className="font-jakarta text-2xl font-extrabold mb-2" style={{ color: "#0D1B3E" }}>
              Pesan Terkirim!
            </h2>
            <p className="text-sm" style={{ color: "#6B7FA8" }}>
              Terima kasih, <strong>{form.nama}</strong>! Kami akan menghubungi kamu melalui{" "}
              <strong>{form.kontakEmail}</strong> dalam 1×24 jam.
            </p>
            <button
              className="mt-6 btn-primary px-8 py-3"
              onClick={() => {
                setSubmitted(false);
                setForm({ nama: "", kontakEmail: "", intent: "", orderId: "", pesan: "" });
              }}
            >
              Kirim Pesan Lain
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card mb-10"
          >
            <div className="space-y-5">
              {/* Nama */}
              <div>
                <label className="form-label">
                  Nama <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="Nama lengkap kamu"
                  value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                />
              </div>

              {/* Email / WA */}
              <div>
                <label className="form-label">
                  Email atau WhatsApp <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="email@contoh.com atau 08xxxxxxxxxx"
                  value={form.kontakEmail}
                  onChange={(e) => setForm((f) => ({ ...f, kontakEmail: e.target.value }))}
                />
              </div>

              {/* Intent */}
              <div>
                <label className="form-label">
                  Topik Pesan <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <select
                  className="form-input"
                  value={form.intent}
                  onChange={(e) => setForm((f) => ({ ...f, intent: e.target.value }))}
                >
                  <option value="">— Pilih topik —</option>
                  {INTENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order ID — conditional */}
              {needsOrderId && (
                <div>
                  <label className="form-label">
                    Order ID
                    <span className="ml-1 text-xs font-normal" style={{ color: "#9BA3C4" }}>
                      (wajib untuk topik ini)
                    </span>
                  </label>
                  <input
                    className="form-input"
                    placeholder="Contoh: SS-1720000000-123"
                    value={form.orderId}
                    onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}
                  />
                  <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                    Order ID ada di email konfirmasi pembayaran kamu.
                  </p>
                </div>
              )}

              {/* Pesan */}
              <div>
                <label className="form-label">
                  Pesan <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Ceritakan detail pertanyaan atau masalahmu di sini..."
                  value={form.pesan}
                  onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="rounded-2xl px-4 py-3 text-sm font-semibold"
                  style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
                >
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-4 text-base font-extrabold"
                disabled={loading}
              >
                {loading ? "⏳ Mengirim..." : "📤 Kirim Pesan"}
              </button>
            </div>
          </form>
        )}

        {/* FAQ Accordion */}
        <div className="mb-10">
          <h2 className="font-jakarta text-2xl font-extrabold mb-6 text-center" style={{ color: "#0D1B3E" }}>
            Pertanyaan yang Sering Ditanya
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(13,27,62,0.08)", background: "white" }}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-jakarta font-bold text-sm pr-4" style={{ color: "#0D1B3E" }}>
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 text-sm font-bold transition-transform"
                    style={{
                      color: "#FF4D6D",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#6B7FA8" }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
