"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PaymentData, BANK_LABELS } from "@/types";
import { captureEvent } from "@/components/PostHogProvider";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function Countdown({ expiryTime }: { expiryTime: string }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const expiry = new Date(expiryTime).getTime();
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { setRemaining("Kadaluarsa"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [expiryTime]);
  return <span className="font-mono font-bold" style={{ color: "#FF4D6D" }}>{remaining}</span>;
}

const BANK_COLORS: Record<string, string> = {
  BCA:     "#005EA6",
  BNI:     "#F15A22",
  BRI:     "#00529C",
  MANDIRI: "#003D79",
};

const BANK_STEPS: Record<string, string[]> = {
  BCA: [
    "Buka aplikasi BCA Mobile / Klik BCA",
    "Pilih Transfer → ke BCA Virtual Account",
    "Masukkan nomor VA di bawah",
    "Masukkan jumlah: Rp 29.000",
    "Konfirmasi & selesaikan pembayaran",
  ],
  BNI: [
    "Buka aplikasi BNI Mobile Banking",
    "Pilih Transfer → Virtual Account Billing",
    "Masukkan nomor VA di bawah",
    "Periksa nominal & konfirmasi",
    "Selesaikan transaksi",
  ],
  BRI: [
    "Buka BRImo atau Internet Banking BRI",
    "Pilih Pembayaran → BRIVA",
    "Masukkan nomor VA di bawah",
    "Cek rincian & konfirmasi",
    "Transaksi selesai",
  ],
  MANDIRI: [
    "Buka Livin' by Mandiri",
    "Pilih Pembayaran → Multipayment",
    "Cari 'Mandiri Virtual Account'",
    "Masukkan nomor VA di bawah",
    "Konfirmasi pembayaran",
  ],
};

export default function BayarPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const vaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("kontrak_payment");
    if (!raw) { router.replace("/buat"); return; }
    setPaymentData(JSON.parse(raw));
  }, [router]);

  const copyVA = () => {
    if (!paymentData) return;
    navigator.clipboard.writeText(paymentData.vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!paymentData) return;
    setConfirming(true);
    setError("");
    try {
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Konfirmasi gagal");
      // Track payment confirmed
      captureEvent('payment_confirmed', {
        contractType: (paymentData?.contractData as unknown as Record<string, unknown>)?.contractType,
        amount: paymentData?.amount,
      });
      const contractType = (paymentData?.contractData as unknown as Record<string, unknown>)?.contractType;
      if (contractType === 'kur-bundle') {
        const bundleHtmlsRaw = sessionStorage.getItem('kur_bundle_htmls');
        const bundleHtmls = bundleHtmlsRaw ? JSON.parse(bundleHtmlsRaw) : [];
        sessionStorage.setItem('kur_bundle_result', JSON.stringify({ ...data, bundleHtmls }));
        router.push('/kur/sukses');
      } else {
        sessionStorage.setItem('kontrak_result', JSON.stringify(data));
        router.push('/sukses');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setConfirming(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-4xl">⏳</div>
      </div>
    );
  }

  const bankColor = BANK_COLORS[paymentData.bank] || "#0D1B3E";
  const steps = BANK_STEPS[paymentData.bank] || [];

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Selesaikan Pembayaran
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Transfer ke nomor VA di bawah ini
          </p>
        </div>

        {/* VA Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-lg mb-5"
          style={{ border: `2px solid ${bankColor}20` }}
        >
          {/* Bank header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ background: bankColor }}
          >
            <div>
              <p className="text-xs text-white/70 font-medium">Virtual Account</p>
              <p className="font-jakarta text-xl font-extrabold text-white">
                {BANK_LABELS[paymentData.bank]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">Berlaku sampai</p>
              <Countdown expiryTime={paymentData.expiryTime} />
            </div>
          </div>

          {/* VA details */}
          <div className="bg-white px-6 py-5">
            <p className="text-xs font-semibold mb-1" style={{ color: "#9BA3C4" }}>
              Nomor Virtual Account
            </p>
            <div className="flex items-center gap-3">
              <span
                className="font-jakarta text-2xl font-extrabold tracking-widest"
                style={{ color: "#0D1B3E", letterSpacing: "0.1em" }}
              >
                {paymentData.vaNumber}
              </span>
              <button
                ref={vaRef}
                onClick={copyVA}
                className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: copied ? "#D1FAF0" : "rgba(13,27,62,0.07)",
                  color: copied ? "#028A66" : "#6B7FA8",
                }}
              >
                {copied ? "✓ Tersalin!" : "Salin"}
              </button>
            </div>

            <div
              className="mt-4 pt-4 border-t flex justify-between items-center"
              style={{ borderColor: "rgba(13,27,62,0.06)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "#9BA3C4" }}>Total Transfer</p>
                <p className="font-jakarta text-2xl font-extrabold" style={{ color: "#FF4D6D" }}>
                  {formatRp(paymentData.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: "#9BA3C4" }}>Order ID</p>
                <p className="text-xs font-mono font-semibold" style={{ color: "#6B7FA8" }}>
                  {paymentData.orderId.slice(0, 20)}
                </p>
              </div>
            </div>

            {/* Important note */}
            <div
              className="mt-4 rounded-2xl px-4 py-3"
              style={{ background: "#FFF5D6" }}
            >
              <p className="text-xs font-bold" style={{ color: "#9A6F00" }}>
                ⚠️ Transfer tepat{" "}
                <span className="underline">
                  {formatRp(paymentData.amount)}
                </span>{" "}
                — jangan lebih atau kurang
              </p>
            </div>
          </div>
        </div>

        {/* How to pay */}
        <div className="card mb-5">
          <h3 className="font-jakarta font-bold mb-4 text-sm" style={{ color: "#0D1B3E" }}>
            📱 Cara Transfer via {BANK_LABELS[paymentData.bank]}
          </h3>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 items-start text-sm">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0"
                  style={{ background: bankColor, color: "white" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "#3D4F7C" }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Contract info */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 text-xs"
          style={{ background: "rgba(13,27,62,0.04)", border: "1px solid rgba(13,27,62,0.06)" }}
        >
          <p className="font-bold mb-1" style={{ color: "#0D1B3E" }}>Detail Kontrak</p>
          <p style={{ color: "#6B7FA8" }}>
            {paymentData.contractData.nomorKontrak}
            {(paymentData.contractData as unknown as Record<string, unknown>)?.contractType !== 'kur-bundle' && (
              <> · Sewa {paymentData.contractData.durasiSewa} bulan · {paymentData.contractData.namaPihakKedua}</>
            )}
            {(paymentData.contractData as unknown as Record<string, unknown>)?.contractType === 'kur-bundle' && (
              <> · Paket KUR-Ready · {(paymentData.contractData as unknown as Record<string, unknown>).namaPihakKedua as string}</>
            )}
          </p>
          <p className="mt-1" style={{ color: "#6B7FA8" }}>
            PDF dikirim ke: <strong>{paymentData.contractData.emailPembeli}</strong>
          </p>
        </div>

        {error && (
          <div
            className="rounded-2xl px-4 py-3 mb-4 text-sm font-semibold"
            style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Confirm button */}
        <button
          className="btn-primary w-full py-4 text-base font-extrabold"
          onClick={handleConfirm}
          disabled={confirming}
        >
          {confirming ? "⏳ Mengkonfirmasi..." : "✅ Saya Sudah Transfer"}
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "#9BA3C4" }}>
          Konfirmasi manual untuk demo MVP. Pada versi live, konfirmasi otomatis via webhook Xendit.
        </p>
      </div>
    </div>
  );
}
