"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function downloadOrderPDF(orderId: string) {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Bukti Order ${orderId}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; color: #0D1B3E; }
  .logo { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
  .logo span { color: #FF4D6D; }
  .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
  .label { font-size: 0.75rem; color: #9BA3C4; margin-bottom: 4px; }
  .value { font-size: 1rem; font-weight: 700; }
  .order-id { font-family: monospace; font-size: 1.2rem; font-weight: 800; color: #0D1B3E; }
  .note { font-size: 0.8rem; color: #6B7FA8; margin-top: 24px; }
  .footer { margin-top: 40px; font-size: 0.75rem; color: #9BA3C4; text-align: center; }
</style>
</head>
<body>
<div class="logo"><span>Legal</span>Kan</div>
<p style="font-size:0.85rem;color:#6B7FA8;">legal-kan.com — Legal-kan sekarang!</p>
<hr class="divider">
<h2 style="font-size:1rem;margin-bottom:16px;">Bukti Pesanan</h2>
<div class="label">Order ID</div>
<div class="order-id">${orderId}</div>
<hr class="divider">
<p class="note">Dokumen kamu sedang dalam proses verifikasi pembayaran.<br>Setelah dikonfirmasi, dokumen akan dikirim ke email kamu dalam 1×24 jam.</p>
<p class="note">Simpan Order ID ini sebagai referensi jika kamu perlu menghubungi tim LegalKan.</p>
<div class="footer">© LegalKan — legal-kan.com</div>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LegalKan-Order-${orderId}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MenungguPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [contractType, setContractType] = useState("");
  const [checkCount, setCheckCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("menunggu_order_id") || "";
    const ct = sessionStorage.getItem("menunggu_contract_type") || "";
    setOrderId(id);
    setContractType(ct);
  }, []);

  // Poll status every 60 seconds
  useEffect(() => {
    if (!orderId) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/order-status?orderId=${encodeURIComponent(orderId)}`);
        if (res.ok) {
          const data = await res.json();
          setLastChecked(new Date());
          setCheckCount((c) => c + 1);
          if (data.status === "paid" || data.status === "delivered") {
            // Redirect to appropriate success page
            if (contractType === "kur-bundle") {
              router.push("/kur/sukses");
            } else {
              router.push("/sukses");
            }
          }
        }
      } catch {
        // Silently fail — don't alarm the user
      }
    };

    // First check immediately after 5s
    const initialTimer = setTimeout(checkStatus, 5000);
    // Then every 60 seconds
    const interval = setInterval(checkStatus, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [orderId, contractType, router]);

  return (
    <div className="min-h-screen px-4 py-10 flex items-center justify-center" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ background: "rgba(6,214,160,0.12)" }}
          >
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="font-jakarta text-3xl font-extrabold mb-3" style={{ color: "#0D1B3E" }}>
            Notifikasi Diterima!
          </h1>
          <p className="text-base" style={{ color: "#6B7FA8" }}>
            Tim kami sedang memverifikasi transfermu.
          </p>
        </div>

        {/* Order ID Card */}
        {orderId && (
          <div
            className="rounded-2xl px-6 py-5 mb-5 text-center"
            style={{ background: "white", border: "2px solid rgba(6,214,160,0.3)", boxShadow: "0 2px 12px rgba(13,27,62,0.06)" }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: "#9BA3C4" }}>Order ID kamu</p>
            <p className="font-mono text-lg font-extrabold" style={{ color: "#0D1B3E" }}>
              {orderId}
            </p>
            <p className="text-xs mt-2" style={{ color: "#9BA3C4" }}>
              Simpan ini sebagai referensi
            </p>
            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                onClick={() => { navigator.clipboard.writeText(orderId); }}
                style={{
                  flex: 1, padding: "0.6rem", borderRadius: "10px",
                  border: "1px solid rgba(13,27,62,0.12)", background: "white",
                  fontSize: "0.78rem", fontWeight: 600, color: "#0D1B3E", cursor: "pointer"
                }}
              >
                📋 Salin Order ID
              </button>
              <button
                onClick={() => downloadOrderPDF(orderId)}
                style={{
                  flex: 1, padding: "0.6rem", borderRadius: "10px",
                  border: "1px solid rgba(255,77,109,0.3)", background: "rgba(255,77,109,0.06)",
                  fontSize: "0.78rem", fontWeight: 600, color: "#FF4D6D", cursor: "pointer"
                }}
              >
                ⬇️ Unduh Bukti
              </button>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div
          className="rounded-2xl px-6 py-5 mb-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(13,27,62,0.06)" }}
        >
          <h2 className="font-jakarta font-bold mb-4" style={{ color: "#0D1B3E", fontSize: "1rem" }}>
            📋 Apa yang terjadi selanjutnya?
          </h2>
          <ol className="space-y-3">
            {[
              { emoji: "🔍", text: "Tim kami memeriksa mutasi rekening" },
              { emoji: "✅", text: "Setelah transfer terkonfirmasi, dokumen langsung dibuat" },
              { emoji: "📧", text: "Dokumen dikirim ke email kamu" },
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start text-sm">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm shrink-0"
                  style={{ background: "rgba(6,214,160,0.12)" }}
                >
                  {item.emoji}
                </span>
                <span style={{ color: "#3D4F7C", marginTop: "2px" }}>{item.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Time expectation */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 text-center"
          style={{ background: "#FFF5D6", border: "1px solid #FFD166" }}
        >
          <p className="font-bold text-sm" style={{ color: "#9A6F00" }}>
            ⏰ Maksimal 1×24 jam
          </p>
          <p className="text-xs mt-1" style={{ color: "#B8930A" }}>
            Dokumen akan dikirim ke email kamu setelah kami konfirmasi pembayaran.
          </p>
        </div>

        {/* Auto-check status indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-xs" style={{ color: "#B8BDD6" }}>
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                background: "#06D6A0",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span>
              Memeriksa status otomatis setiap 60 detik
              {checkCount > 0 && lastChecked && (
                <> · Terakhir: {lastChecked.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</>
              )}
            </span>
          </div>
        </div>

        {/* Contact Link */}
        <div className="text-center">
          <Link
            href="/hubungi"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-3 transition-all"
            style={{
              background: "rgba(13,27,62,0.05)",
              color: "#0D1B3E",
            }}
          >
            💬 Ada pertanyaan? Hubungi kami →
          </Link>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    </div>
  );
}
