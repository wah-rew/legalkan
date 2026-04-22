"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BundleDoc {
  id: string;
  title: string;
  html: string;
  nomorKontrak: string;
}

interface BundleResult {
  orderId: string;
  contractData: {
    nomorKontrak: string;
    namaUsaha?: string;
    emailPembeli?: string;
    namaPihakKedua?: string;
  };
  bundleHtmls: BundleDoc[];
}

export default function KURSuksesPage() {
  const router = useRouter();
  const [result, setResult] = useState<BundleResult | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("kur_bundle_result");
    if (!raw) {
      // Try regular kontrak_result as fallback
      const regularRaw = sessionStorage.getItem("kontrak_result");
      if (regularRaw) {
        const regularResult = JSON.parse(regularRaw);
        if ((regularResult.contractData as Record<string, unknown>)?.contractType === "kur-bundle") {
          const bundleHtmlsRaw = sessionStorage.getItem("kur_bundle_htmls");
          const bundleHtmls = bundleHtmlsRaw ? JSON.parse(bundleHtmlsRaw) : [];
          setResult({ ...regularResult, bundleHtmls });
          return;
        }
      }
      router.replace("/kur");
      return;
    }
    setResult(JSON.parse(raw));
  }, [router]);

  const downloadDoc = (doc: BundleDoc) => {
    setDownloading(doc.id);
    try {
      const blob = new Blob([doc.html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title.replace(/\s+/g, "-")}-${doc.nomorKontrak}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloading(null), 800);
    }
  };

  const downloadAll = () => {
    if (!result?.bundleHtmls) return;
    result.bundleHtmls.forEach((doc, i) => {
      setTimeout(() => downloadDoc(doc), i * 400);
    });
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto" style={{ maxWidth: "600px" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Paket KUR-Ready Siap!
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Semua dokumenmu sudah dibuat. Unduh, isi data yang belum lengkap, lalu bawa ke bank!
          </p>
        </div>

        {/* Order info */}
        <div
          className="rounded-2xl p-4 mb-5 text-sm"
          style={{
            background: "rgba(6,214,160,0.08)",
            border: "1px solid rgba(6,214,160,0.2)",
          }}
        >
          <p className="font-bold mb-1" style={{ color: "#0D1B3E" }}>
            ✅ Pembayaran Dikonfirmasi
          </p>
          <p style={{ color: "#6B7FA8" }}>
            Order: {result.contractData?.nomorKontrak} ·{" "}
            {result.bundleHtmls?.length || 0} dokumen siap diunduh
          </p>
          {result.contractData?.emailPembeli && (
            <p className="mt-1" style={{ color: "#6B7FA8" }}>
              Dokumen dikirim ke: <strong>{result.contractData.emailPembeli}</strong>
            </p>
          )}
        </div>

        {/* Download all */}
        <button
          onClick={downloadAll}
          className="btn-amber w-full py-4 text-base font-extrabold mb-5"
        >
          📥 Unduh Semua Dokumen ({result.bundleHtmls?.length || 0} file)
        </button>

        {/* Individual documents */}
        <div className="space-y-3 mb-8">
          {result.bundleHtmls?.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl p-4"
              style={{
                background: "white",
                border: "1px solid rgba(13,27,62,0.08)",
                boxShadow: "0 2px 8px rgba(13,27,62,0.04)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-sm"
                    style={{ color: "#0D1B3E" }}
                  >
                    {doc.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#9BA3C4" }}>
                    No: {doc.nomorKontrak}
                  </p>
                </div>
                <button
                  onClick={() => downloadDoc(doc)}
                  disabled={downloading === doc.id}
                  className="rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0"
                  style={{
                    background:
                      downloading === doc.id
                        ? "rgba(6,214,160,0.12)"
                        : "rgba(255,77,109,0.1)",
                    color:
                      downloading === doc.id ? "#028A66" : "#FF4D6D",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {downloading === doc.id ? "✓ Mengunduh..." : "⬇ Unduh"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next steps */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(135deg, #0D1B3E, #162348)",
          }}
        >
          <h3
            className="font-jakarta font-bold text-white mb-4"
            style={{ fontSize: "0.95rem" }}
          >
            🗂 Langkah Selanjutnya
          </h3>
          <ol className="space-y-4">
            {[
              "Unduh semua dokumen di atas",
              "Buka setiap file HTML dan cetak (Ctrl+P) atau simpan sebagai PDF",
              "Isi data yang masih kosong (contoh: NIK karyawan, nama mitra)",
              "Tandatangani setiap dokumen, tempel meterai Rp 10.000",
              "Bawa ke bank penyalur KUR (BRI, BNI, BCA, Mandiri, dll)",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: "#FFD166", color: "#0D1B3E", fontSize: "0.75rem" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "#94A3CB", fontSize: "0.9rem", lineHeight: 1.7 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Rating placeholder */}
        <div
          className="rounded-2xl p-5 mb-6 text-center"
          style={{ background: "white", border: "1px solid rgba(13,27,62,0.08)" }}
        >
          <p className="font-jakarta font-bold mb-2" style={{ color: "#0D1B3E" }}>
            Seberapa membantu Paket KUR-Ready ini?
          </p>
          <div className="flex justify-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: "1.75rem",
                  cursor: "pointer",
                  filter: "grayscale(0.5)",
                }}
                title={`${star} bintang`}
              >
                ⭐
              </span>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "#9BA3C4" }}>
            Feedback kamu bantu kami terus berkembang
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm font-semibold" style={{ color: "#FF4D6D" }}>
            ← Kembali ke Beranda
          </Link>
          <span className="mx-3" style={{ color: "#ccc" }}>|</span>
          <Link href="/kur" className="text-sm font-semibold" style={{ color: "#6B7FA8" }}>
            Tentang Paket KUR-Ready
          </Link>
        </div>
      </div>
    </div>
  );
}
