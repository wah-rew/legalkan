"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnduhContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState<"loading" | "found" | "not_found">("loading");
  const [contractHTML, setContractHTML] = useState("");
  const [contractTitle, setContractTitle] = useState("Kontrak");

  useEffect(() => {
    if (!orderId) { setStatus("not_found"); return; }
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.contractData?.nomorKontrak === orderId) {
          setContractHTML(parsed.contractData?.contractHTML || "");
          setContractTitle(parsed.contractData?.contractTitle || "Kontrak");
          setStatus("found");
          return;
        }
      }
    } catch {}
    fetch(`/api/get-contract?orderId=${encodeURIComponent(orderId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.contractHTML) {
          setContractHTML(data.contractHTML);
          setContractTitle(data.contractTitle || "Kontrak");
          setStatus("found");
        } else { setStatus("not_found"); }
      })
      .catch(() => setStatus("not_found"));
  }, [orderId]);

  function printAsPDF() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Add print CSS to suppress browser header/footer
    const printCSS = `<style>
      @page { margin: 15mm 20mm; size: A4; }
      @media print {
        @page { margin: 15mm 20mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>`;

    // Inject CSS into contractHTML
    const htmlWithCSS = contractHTML.replace('</head>', printCSS + '</head>');

    printWindow.document.write(htmlWithCSS);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => { printWindow.print(); };
    setTimeout(() => { try { printWindow.print(); } catch {} }, 1000);
  }

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FF" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</p>
        <p style={{ color: "#6B7FA8" }}>Memuat dokumenmu...</p>
      </div>
    </div>
  );

  if (status === "not_found") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FF", padding: "1rem" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "2.5rem 2rem", maxWidth: "480px", width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(13,27,62,0.08)" }}>
        <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📄</p>
        <h1 style={{ color: "#0D1B3E", fontWeight: 800, fontSize: "1.3rem", marginBottom: "0.75rem" }}>Dokumen tidak ditemukan</h1>
        <p style={{ color: "#6B7FA8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Dokumen untuk Order ID <strong>{orderId}</strong> tidak ditemukan. Cek email kamu — dokumen sudah dikirim langsung ke inbox.
        </p>
        <Link href="/hubungi" style={{ display: "inline-block", background: "#FF4D6D", color: "white", padding: "0.75rem 1.5rem", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}>
          Hubungi Kami
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FF", padding: "1rem" }}>
      <div style={{ background: "white", borderRadius: "20px", padding: "2.5rem 2rem", maxWidth: "480px", width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(13,27,62,0.08)" }}>
        <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</p>
        <h1 style={{ color: "#0D1B3E", fontWeight: 800, fontSize: "1.3rem", marginBottom: "0.5rem" }}>Dokumenmu siap!</h1>
        <p style={{ color: "#6B7FA8", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{contractTitle}</p>
        <p style={{ color: "#9BA3C4", fontSize: "0.75rem", marginBottom: "1.5rem" }}>Order: {orderId}</p>
        <button onClick={printAsPDF}
          style={{ display: "block", width: "100%", background: "#FF4D6D", color: "white", padding: "1rem", borderRadius: "14px", border: "none", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginBottom: "0.75rem" }}>
          ⬇️ Download PDF (Cetak)
        </button>
        <p style={{ color: "#9BA3C4", fontSize: "0.75rem", lineHeight: 1.6 }}>
          Pilih &apos;Simpan sebagai PDF&apos; di dialog cetak yang muncul. Tanda tangani dan tempelkan materai Rp 10.000.
        </p>
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(13,27,62,0.06)" }}>
          <Link href="/" style={{ color: "#FF4D6D", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>← Kembali ke LegalKan</Link>
        </div>
      </div>
    </div>
  );
}

export default function UnduhPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FF" }}>
        <p style={{ color: "#6B7FA8" }}>⏳ Memuat...</p>
      </div>
    }>
      <UnduhContent />
    </Suspense>
  );
}
