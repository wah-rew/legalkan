"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface WAStatus {
  status: "initializing" | "qr" | "ready" | "disconnected";
  qr?: string;
}

export default function WAStatusPage() {
  const [data, setData] = useState<WAStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/wa-qr");
      const json: WAStatus = await res.json();
      setData(json);
    } catch {
      setData({ status: "disconnected" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 5 seconds while not yet ready
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      if (data?.status !== "ready") fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus, data?.status]);

  const statusLabel: Record<WAStatus["status"], string> = {
    initializing: "⏳ Menginisialisasi...",
    qr: "📱 Menunggu scan QR",
    ready: "✅ WhatsApp Terhubung",
    disconnected: "❌ Terputus",
  };

  const statusColor: Record<WAStatus["status"], string> = {
    initializing: "#FFD166",
    qr: "#0096FF",
    ready: "#06D6A0",
    disconnected: "#FF4D6D",
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            WhatsApp Status
          </h1>
          <p className="text-sm mt-2" style={{ color: "#6B7FA8" }}>
            Status koneksi WhatsApp untuk pengiriman kontrak
          </p>
        </div>

        {/* Status card */}
        <div
          className="rounded-3xl overflow-hidden mb-6 shadow-sm"
          style={{ border: "1px solid rgba(13,27,62,0.08)" }}
        >
          <div
            className="px-6 py-5 text-center"
            style={{
              background: loading ? "#e8ecf4" : statusColor[data?.status ?? "disconnected"] + "22",
            }}
          >
            <p
              className="text-2xl font-extrabold font-jakarta"
              style={{ color: loading ? "#9BA3C4" : statusColor[data?.status ?? "disconnected"] }}
            >
              {loading ? "⏳ Memuat..." : statusLabel[data?.status ?? "disconnected"]}
            </p>
            {!loading && data?.status !== "ready" && data?.status !== "initializing" && (
              <p className="text-xs mt-2" style={{ color: "#6B7FA8" }}>
                Halaman ini auto-refresh setiap 5 detik
              </p>
            )}
          </div>

          {/* QR Code display */}
          {data?.status === "qr" && data.qr && (
            <div className="bg-white px-6 py-6 flex flex-col items-center gap-4">
              <p className="text-sm font-semibold text-center" style={{ color: "#0D1B3E" }}>
                Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat
              </p>
              {/* Show QR as text-based fallback (terminal QR is in server logs) */}
              <div
                className="rounded-2xl p-4 text-center text-xs"
                style={{ background: "rgba(0,150,255,0.06)", border: "1px solid rgba(0,150,255,0.2)" }}
              >
                <p className="font-semibold mb-2" style={{ color: "#0060CC" }}>
                  💡 QR tersedia di terminal server
                </p>
                <p style={{ color: "#6B7FA8" }}>
                  Cek log terminal tempat <code>npm run dev</code> berjalan.<br />
                  QR code ASCII tercetak di sana.
                </p>
              </div>
              <button
                onClick={fetchStatus}
                className="btn-primary px-6 py-2 text-sm"
              >
                🔄 Refresh Status
              </button>
            </div>
          )}

          {data?.status === "ready" && (
            <div className="bg-white px-6 py-5 text-center">
              <p className="text-sm" style={{ color: "#6B7FA8" }}>
                WhatsApp terhubung dan siap mengirim kontrak PDF 🎉
              </p>
            </div>
          )}

          {data?.status === "disconnected" && (
            <div className="bg-white px-6 py-5 text-center">
              <p className="text-sm mb-3" style={{ color: "#6B7FA8" }}>
                Koneksi terputus. Cek terminal server untuk detail error.
              </p>
              <button onClick={fetchStatus} className="btn-ghost px-6 py-2 text-sm">
                🔄 Coba Lagi
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="card mb-6">
          <h3 className="font-jakarta font-bold text-sm mb-3" style={{ color: "#0D1B3E" }}>
            📋 Cara Menghubungkan WhatsApp
          </h3>
          <ol className="space-y-2 text-sm" style={{ color: "#3D4F7C" }}>
            {[
              "Jalankan server: npm run dev",
              "Cek terminal — QR code ASCII akan muncul",
              "Buka WhatsApp di HP → Titik tiga → Perangkat Tertaut",
              "Tap \"Tautkan Perangkat\" lalu scan QR",
              "Tunggu status di halaman ini berubah jadi ✅",
            ].map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold shrink-0" style={{ color: "#FF4D6D" }}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="text-center">
          <Link href="/" className="btn-ghost px-6 py-2 text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
