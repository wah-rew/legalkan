"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ContractData, BankCode, CONTRACT_PRICES, PRICE } from "@/types";
import { captureEvent } from "@/components/PostHogProvider";


// ─── Watermark overlay (SVG tiled pattern) ────────────────────────────────────
function WatermarkOverlay() {
  // Build an SVG with repeated diagonal text, encoded as a data URI
  const text = "BELUM DIBAYAR · KONTRAK.IN";
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="200">
      <text
        x="50%" y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="28"
        font-weight="700"
        fill="#FF4D6D"
        opacity="0.18"
        transform="rotate(-35, 210, 100)"
        letter-spacing="2"
      >${text}</text>
    </svg>
  `.trim();
  const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `url("${encoded}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "420px 200px",
        zIndex: 10,
        borderRadius: "inherit",
      }}
    />
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease, transform 0.25s ease",
        background: "#0D1B3E",
        color: "white",
        padding: "12px 20px",
        borderRadius: "14px",
        fontSize: "13px",
        fontWeight: 600,
        boxShadow: "0 8px 32px rgba(13,27,62,0.25)",
        zIndex: 9999,
        maxWidth: "calc(100vw - 48px)",
        textAlign: "center",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      🔒 {message}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  const router = useRouter();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractHTML, setContractHTML] = useState("");
  const selectedBank: BankCode = "BCA";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(() => {
    setToastVisible(true);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToastVisible(false), 2800);
    setToastTimer(t);
  }, [toastTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (toastTimer) clearTimeout(toastTimer); };
  }, [toastTimer]);

  useEffect(() => {
    const raw = sessionStorage.getItem("kontrak_contract");
    if (!raw) { router.replace("/buat"); return; }
    const parsed = JSON.parse(raw);
    setContractData(parsed.contractData);
    setContractHTML(parsed.contractHTML);
    // Track contract generated
    captureEvent('contract_generated', {
      contractType: parsed.contractData?.contractType,
      price: Number(process.env.NEXT_PUBLIC_PRICE) || 29000,
    });
  }, [router]);

  const handlePay = async () => {
    if (!contractData) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractData, bank: selectedBank }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pembayaran");
      sessionStorage.setItem("kontrak_payment", JSON.stringify(data.paymentData));
      // Track payment initiated
      captureEvent('payment_initiated', {
        contractType: (contractData as unknown as Record<string, unknown>)?.contractType,
        amount: Number(process.env.NEXT_PUBLIC_PRICE) || 29000,
      });
      router.push("/bayar");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // ── Copy / context-menu guard handlers ──────────────────────────────────────
  const blockAndToast = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      showToast();
    },
    [showToast],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showToast();
    },
    [showToast],
  );

  if (!contractData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p style={{ color: "#6B7FA8" }}>Memuat kontrak...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <span
            className="badge inline-flex mb-3"
            style={{ background: "#D1FAF0", color: "#028A66" }}
          >
            ✅ Kontrak berhasil di-generate!
          </span>
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Preview Kontrakmu
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Cek dulu sebelum bayar — setelah bayar, PDF langsung dikirim ke emailmu.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Contract preview ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden p-0">
              {/* Top bar */}
              <div
                className="flex items-center justify-between px-5 py-3 text-xs font-bold"
                style={{ background: "#0D1B3E", color: "white" }}
              >
                <span>📄 {contractData.nomorKontrak}</span>
                <span style={{ color: "#94A3CB" }}>LegalKan</span>
              </div>

              {/* Preview wrapper — watermark + no-select guard */}
              <div
                style={{ position: "relative" }}
                // Block text selection & copy
                onCopy={blockAndToast}
                onCut={blockAndToast}
                onContextMenu={handleContextMenu}
                // Drag selection guard
                onDragStart={(e) => e.preventDefault()}
                onSelectCapture={(e) => e.preventDefault()}
              >
                {/* Watermark tiled overlay */}
                <WatermarkOverlay />

                {/* Contract body */}
                <div
                  className="overflow-y-auto"
                  style={{
                    maxHeight: "70vh",
                    padding: "24px",
                    // Prevent text selection via CSS
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    // Slight blur on content to deter screenshotting full text
                    // (subtle — does not affect readability for legitimate review)
                  }}
                  dangerouslySetInnerHTML={{ __html: contractHTML }}
                />
              </div>
            </div>

            {/* Below-preview nudge */}
            <div
              className="mt-3 rounded-2xl px-4 py-3 text-xs text-center font-semibold"
              style={{
                background: "rgba(255,77,109,0.07)",
                color: "#C73554",
                border: "1px solid rgba(255,77,109,0.18)",
              }}
            >
              🔒 Ini adalah preview. Dokumen lengkap (bisa di-copy & cetak) dikirim ke email setelah pembayaran.
            </div>
          </div>

          {/* ── Payment sidebar ──────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="card" style={{ background: "white", padding: "1.5rem" }}>
              <h3 className="font-jakarta font-bold mb-4" style={{ color: "#0D1B3E", fontSize: "1rem" }}>
                Ringkasan
              </h3>
              {[
                { label: "Dokumen", value: (contractData as unknown as Record<string, string>).contractTitle || "Perjanjian Sewa Menyewa" },
                { label: "Nomor", value: contractData.nomorKontrak },
                { label: "Dibuat", value: contractData.tanggalPembuatan },
              ].map((r) => (
                <div
                  key={r.label}
                  className="py-3 border-b"
                  style={{ borderColor: "rgba(13,27,62,0.06)" }}
                >
                  <p style={{ color: "#9BA3C4", fontSize: "0.7rem", marginBottom: "0.25rem" }}>{r.label}</p>
                  <p className="font-semibold" style={{ color: "#0D1B3E", fontSize: "0.85rem", lineHeight: 1.4 }}>
                    {r.value}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4" style={{ gap: "0.75rem" }}>
                <span className="text-sm font-bold" style={{ color: "#0D1B3E", whiteSpace: "nowrap" }}>Total Bayar</span>
                <span className="font-jakarta font-extrabold" style={{ color: "#FF4D6D", whiteSpace: "nowrap", fontSize: "1.25rem" }}>
                  Rp&nbsp;{new Intl.NumberFormat('id-ID').format(
                    (() => { const ct = (contractData as unknown as Record<string, string>).contractType; return ct && CONTRACT_PRICES[ct] ? CONTRACT_PRICES[ct] : PRICE; })()
                  )}
                </span>
              </div>
            </div>



            {error && (
              <div
                className="rounded-2xl px-4 py-3 text-xs font-semibold"
                style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn-primary w-full py-4 text-base font-extrabold"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? "⏳ Memproses..." : `💳 Lanjut ke Pembayaran — Rp ${new Intl.NumberFormat('id-ID').format((() => { const ct = (contractData as unknown as Record<string, string>).contractType; return ct && CONTRACT_PRICES[ct] ? CONTRACT_PRICES[ct] : PRICE; })())}`}
            </button>

            <p className="text-center text-xs" style={{ color: "#9BA3C4" }}>
              🔒 Pembayaran diverifikasi manual dalam 1×24 jam
            </p>

            <button
              className="w-full text-xs py-2 underline"
              style={{ color: "#9BA3C4" }}
              onClick={() => {
                const ct = (contractData as unknown as Record<string, string>).contractType;
                if (ct && ct !== "sewa-properti") router.push(`/buat/${ct}`);
                else router.push("/buat");
              }}
            >
              ← Edit data kontrak
            </button>
          </div>
        </div>
      </div>

      {/* Global toast notification */}
      <Toast
        message="Selesaikan pembayaran untuk mendapatkan dokumen lengkap"
        visible={toastVisible}
      />
    </div>
  );
}
