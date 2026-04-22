"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentData } from "@/types";
import { captureEvent } from "@/components/PostHogProvider";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function Countdown({ hours = 24 }: { hours?: number }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const expiry = Date.now() + hours * 60 * 60 * 1000;
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
  }, [hours]);
  return <span className="font-mono font-bold" style={{ color: "#FF4D6D" }}>{remaining}</span>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
      style={{
        background: copied ? "#D1FAF0" : "rgba(13,27,62,0.07)",
        color: copied ? "#028A66" : "#6B7FA8",
      }}
    >
      {copied ? "✓ Tersalin!" : "Salin"}
    </button>
  );
}

export default function BayarPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "BCA";
  const bankAccountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "1234567890";
  const bankAccountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "LegalKan";

  useEffect(() => {
    const raw = sessionStorage.getItem("kontrak_payment");
    if (!raw) { router.replace("/buat"); return; }
    setPaymentData(JSON.parse(raw));
  }, [router]);

  const handleSudahTransfer = async () => {
    if (!paymentData) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/transfer-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: paymentData.orderId, paymentData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim konfirmasi");

      captureEvent("transfer_confirmed_by_user", {
        contractType: (paymentData.contractData as unknown as Record<string, unknown>)?.contractType,
        amount: paymentData.amount,
        uniqueCode: paymentData.uniqueCode,
      });

      // Store orderId for waiting page
      sessionStorage.setItem("menunggu_order_id", paymentData.orderId);
      sessionStorage.setItem("menunggu_contract_type", (paymentData.contractData as unknown as Record<string, unknown>)?.contractType as string || "");
      router.push("/menunggu");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-4xl">⏳</div>
      </div>
    );
  }

  const amount = paymentData.amount;
  const uniqueCode = paymentData.uniqueCode ?? 0;
  const totalWithCode = paymentData.totalWithCode ?? amount;

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Selesaikan Pembayaran
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Transfer ke rekening di bawah dan klik konfirmasi
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            { n: 1, label: "Transfer" },
            { n: 2, label: "Konfirmasi" },
            { n: 3, label: "Dokumen" },
          ].map((step, i) => (
            <div key={step.n} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: step.n === 1 ? "#FF4D6D" : "rgba(13,27,62,0.1)",
                    color: step.n === 1 ? "white" : "#9BA3C4",
                  }}
                >
                  {step.n}
                </div>
                <p className="text-xs mt-1" style={{ color: step.n === 1 ? "#FF4D6D" : "#9BA3C4" }}>
                  {step.label}
                </p>
              </div>
              {i < 2 && (
                <div
                  className="w-8 h-px mb-4"
                  style={{ background: "rgba(13,27,62,0.15)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div
          className="rounded-2xl px-4 py-3 mb-5 text-center text-sm"
          style={{ background: "#FFF5D6", border: "1px solid #FFD166" }}
        >
          <p style={{ color: "#9A6F00" }}>
            ⏳ Konfirmasi payment dalam:{" "}
            <Countdown hours={24} />
          </p>
        </div>

        {/* Bank Transfer Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-lg mb-5"
          style={{ border: "2px solid rgba(13,27,62,0.1)" }}
        >
          {/* Header */}
          <div
            className="px-6 py-4"
            style={{ background: "#0D1B3E" }}
          >
            <p className="text-xs text-white/60 font-medium mb-1">💳 Transfer ke Rekening Berikut</p>
            <p className="font-jakarta text-xl font-extrabold text-white">
              Bank {bankName}
            </p>
          </div>

          {/* Details */}
          <div className="bg-white px-6 py-5 space-y-4">
            {/* Account Name */}
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "#9BA3C4" }}>Atas Nama</p>
              <p className="font-bold text-base" style={{ color: "#0D1B3E" }}>{bankAccountName}</p>
            </div>

            {/* Account Number */}
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "#9BA3C4" }}>Nomor Rekening</p>
              <div className="flex items-center gap-3">
                <span className="font-jakarta text-2xl font-extrabold tracking-widest" style={{ color: "#0D1B3E" }}>
                  {bankAccountNumber}
                </span>
                <CopyButton text={bankAccountNumber} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(13,27,62,0.06)" }} />

            {/* Total Transfer */}
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "#9BA3C4" }}>Total Transfer</p>
              <div className="flex items-center gap-3">
                <span className="font-jakarta text-3xl font-extrabold" style={{ color: "#FF4D6D" }}>
                  {formatRp(totalWithCode)}
                </span>
                <CopyButton text={totalWithCode.toString()} />
              </div>
              <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                ({formatRp(amount)} + kode unik {formatRp(uniqueCode)})
              </p>
            </div>

            {/* Important Note */}
            <div
              className="rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.2)" }}
            >
              <p className="text-xs font-bold" style={{ color: "#E63558" }}>
                ⚠️ PENTING: Transfer <span className="underline">tepat</span>{" "}
                {formatRp(totalWithCode)} — jangan lebih atau kurang!
              </p>
              <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                Kode unik membantu kami mengidentifikasi pembayaranmu.
              </p>
            </div>

            {/* Order info */}
            <div style={{ borderTop: "1px solid rgba(13,27,62,0.06)", paddingTop: "12px" }}>
              <p className="text-xs" style={{ color: "#9BA3C4" }}>
                Order ID: <span className="font-mono font-semibold" style={{ color: "#6B7FA8" }}>{paymentData.orderId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contract Info */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 text-xs"
          style={{ background: "rgba(13,27,62,0.04)", border: "1px solid rgba(13,27,62,0.06)" }}
        >
          <p className="font-bold mb-1" style={{ color: "#0D1B3E" }}>Detail Pesanan</p>
          <p style={{ color: "#6B7FA8" }}>
            {paymentData.contractData.nomorKontrak}
          </p>
          <p className="mt-1" style={{ color: "#6B7FA8" }}>
            PDF dikirim ke:{" "}
            <strong>{paymentData.contractData.emailPembeli}</strong>
          </p>
          {/* WA delivery removed — email only */}
        </div>

        {error && (
          <div
            className="rounded-2xl px-4 py-3 mb-4 text-sm font-semibold"
            style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="btn-primary w-full py-4 text-base font-extrabold"
          onClick={handleSudahTransfer}
          disabled={submitting}
          style={{ fontSize: "1rem" }}
        >
          {submitting ? "⏳ Mengirim notifikasi..." : "✅ Saya Sudah Transfer"}
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "#9BA3C4" }}>
          Setelah klik, tim kami akan memverifikasi transfermu dan mengirimkan dokumen dalam 1×24 jam.
        </p>
      </div>
    </div>
  );
}
