"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ContractData } from "@/types";
import { captureEvent } from "@/components/PostHogProvider";

interface ResultData {
  orderId: string;
  contractHTML: string;
  contractData: ContractData;
}

export default function SuksesPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("kontrak_result");
    if (!raw) { router.replace("/buat"); return; }
    setResult(JSON.parse(raw));
  }, [router]);

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractData: result.contractData }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Perjanjian-Sewa-${result.contractData.nomorKontrak}.html`;
      a.click();
      URL.revokeObjectURL(url);
      // Track PDF download
      captureEvent('pdf_downloaded', { contractType: (result.contractData as unknown as Record<string, unknown>).contractType });
    } finally {
      setDownloading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!result || rating === 0) return;
    setFeedbackLoading(true);
    setFeedbackError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: result.orderId,
          rating,
          message: feedbackText,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengirim feedback");
      setFeedbackSubmitted(true);
      // Track feedback submitted
      captureEvent('feedback_submitted', { rating });
    } catch (e: unknown) {
      setFeedbackError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handlePrint = () => {
    if (!result) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(result.contractHTML);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-lg">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl"
            style={{ background: "#D1FAF0" }}
          >
            🎉
          </div>
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Kontrak Berhasil Dibuat!
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Pembayaran terkonfirmasi. Kontrakmu sudah siap.
          </p>
        </div>

        {/* Status card */}
        <div
          className="rounded-3xl overflow-hidden mb-5 shadow-sm"
          style={{ border: "1px solid rgba(6,214,160,0.3)" }}
        >
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, #06D6A0, #04B384)" }}
          >
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-white font-bold">Pembayaran Dikonfirmasi</p>
              <p className="text-xs text-white/80">Order: {result.orderId}</p>
            </div>
          </div>
          <div className="bg-white px-6 py-4 space-y-3">
            {[
              { label: "Nomor Kontrak", value: result.contractData.nomorKontrak },
              { label: "Penyewa", value: result.contractData.namaPihakKedua },
              { label: "Pemberi Sewa", value: result.contractData.namaPihakPertama },
              { label: "Durasi Sewa", value: `${result.contractData.durasiSewa} bulan` },
              { label: "Berlaku s/d", value: result.contractData.tanggalBerakhir },
            ].map((r) => (
              <div
                key={r.label}
                className="flex justify-between text-sm border-b pb-2"
                style={{ borderColor: "rgba(13,27,62,0.05)" }}
              >
                <span style={{ color: "#9BA3C4" }}>{r.label}</span>
                <span className="font-semibold" style={{ color: "#0D1B3E" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email notice */}
        <div
          className="rounded-2xl px-5 py-4 mb-4 flex gap-3 items-start"
          style={{ background: "rgba(255,209,102,0.12)", border: "1px solid rgba(255,209,102,0.4)" }}
        >
          <span className="text-xl shrink-0">📧</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "#9A6F00" }}>
              PDF dikirim ke email
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#7A5800" }}>
              Cek inbox{" "}
              <strong>{result.contractData.emailPembeli}</strong> — mungkin masuk folder Spam.
            </p>
          </div>
        </div>

        {/* Dokumen dikirim via email saja */}

        {/* Action buttons */}
        <div className="space-y-3 mb-6">
          <button
            className="btn-primary w-full py-4 text-base font-extrabold"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "⏳ Menyiapkan..." : "⬇️ Download Kontrak (HTML)"}
          </button>
          <button
            className="btn-ghost w-full py-4 text-base font-bold"
            onClick={handlePrint}
          >
            🖨️ Print / Simpan sebagai PDF
          </button>
        </div>

        {/* Star Rating / Feedback */}
        <div
          className="rounded-3xl p-6 mb-5"
          style={{ background: "white", border: "1px solid rgba(13,27,62,0.08)" }}
        >
          {feedbackSubmitted ? (
            <div className="text-center py-2">
              <div className="text-3xl mb-2">{rating >= 4 ? "🌟" : "🙏"}</div>
              <p className="font-jakarta font-bold" style={{ color: "#0D1B3E" }}>
                {rating >= 4 ? "Terima kasih! Ulasanmu sangat berarti 💛" : "Terima kasih atas feedbackmu!"}
              </p>
              <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                Kami terus belajar untuk memberikan yang terbaik.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold text-center mb-4" style={{ color: "#0D1B3E" }}>
                Puas dengan LegalKan? Beri rating di bawah ini 😊
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-transform hover:scale-125"
                    style={{
                      color: star <= (hoverRating || rating) ? "#FFD166" : "#E0E4F0",
                      filter: star <= (hoverRating || rating) ? "drop-shadow(0 0 4px #FFD166)" : "none",
                      transition: "color 0.15s ease, filter 0.15s ease",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Conditional: Google Review or Internal Feedback */}
              {rating >= 4 && (
                <div className="text-center">
                  <p className="text-xs mb-3" style={{ color: "#6B7FA8" }}>
                    Senang sekali kamu puas! Mau bantu kami dengan meninggalkan ulasan Google?
                  </p>
                  <a
                    href="https://g.page/r/placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold"
                    style={{ background: "#4285F4", color: "white" }}
                    onClick={handleFeedbackSubmit}
                  >
                    ⭐ Tulis Ulasan di Google
                  </a>
                </div>
              )}

              {rating > 0 && rating <= 3 && (
                <div className="space-y-3">
                  <p className="text-xs text-center" style={{ color: "#6B7FA8" }}>
                    Maaf pengalamanmu belum sempurna. Ceritakan apa yang bisa kami perbaiki:
                  </p>
                  <textarea
                    className="form-input w-full"
                    rows={3}
                    placeholder="Tuliskan saran atau keluhan kamu di sini..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                  {feedbackError && (
                    <p className="text-xs font-semibold" style={{ color: "#E63558" }}>⚠️ {feedbackError}</p>
                  )}
                  <button
                    className="btn-primary w-full py-3"
                    onClick={handleFeedbackSubmit}
                    disabled={feedbackLoading}
                  >
                    {feedbackLoading ? "⏳ Mengirim..." : "📤 Kirim Feedback"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="card mb-5">
          <h3 className="font-jakarta font-bold text-sm mb-3" style={{ color: "#0D1B3E" }}>
            📋 Langkah Selanjutnya
          </h3>
          <ol className="space-y-2 text-sm" style={{ color: "#3D4F7C" }}>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "#FF4D6D" }}>1.</span>
              Download atau print dokumen kontrak di atas
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "#FF4D6D" }}>2.</span>
              Print 2 rangkap — satu untuk pemberi sewa, satu untuk penyewa
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "#FF4D6D" }}>3.</span>
              Tempelkan materai Rp 10.000 pada bagian tanda tangan
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "#FF4D6D" }}>4.</span>
              Kedua pihak tanda tangan — kontrak resmi berlaku!
            </li>
          </ol>
        </div>

        {/* Materai note */}
        <div
          className="rounded-2xl px-5 py-4 mb-8 text-xs"
          style={{ background: "rgba(13,27,62,0.04)", border: "1px solid rgba(13,27,62,0.06)" }}
        >
          <p className="font-bold mb-1" style={{ color: "#0D1B3E" }}>💡 Tentang Materai</p>
          <p style={{ color: "#6B7FA8" }}>
            Untuk kekuatan hukum penuh, tempelkan materai Rp 10.000 (sesuai UU No. 10 Tahun 2021
            tentang Bea Meterai) pada setiap kolom tanda tangan. Materai tersedia di kantor pos
            atau minimarket terdekat.
          </p>
        </div>

        {/* New contract CTA */}
        <div className="text-center">
          <p className="text-xs mb-3" style={{ color: "#9BA3C4" }}>
            Butuh kontrak lain?
          </p>
          <Link href="/buat" className="btn-amber px-8 py-3 text-sm font-bold">
            📝 Buat Kontrak Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
