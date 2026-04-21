"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContractFormData, CONTRACT_PRICES } from "@/types";

const STEPS = [
  { label: "Data Para Pihak", icon: "👥", desc: "Identitas kedua belah pihak" },
  { label: "Properti & Sewa", icon: "🏠", desc: "Detail properti dan ketentuan" },
  { label: "Review & Kirim", icon: "✅", desc: "Konfirmasi dan generate kontrak" },
];

export default function BuatPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ContractFormData>({
    namaPihakPertama: "",
    namaPihakKedua: "",
    alamatProperti: "",
    hargaSewa: 0,
    durasiSewa: 12,
    tanggalMulai: "",
    ketentuanTambahan: "",
    emailPembeli: "",
    nomorWhatsapp: "",
  });

  const set = (field: keyof ContractFormData, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.namaPihakPertama.trim()) return "Nama Pemberi Sewa wajib diisi";
      if (!form.namaPihakKedua.trim()) return "Nama Penyewa wajib diisi";
      if (!form.emailPembeli.trim() || !form.emailPembeli.includes("@"))
        return "Email tidak valid";
      if (
        form.nomorWhatsapp &&
        !/^(\+?62|0)8[0-9]{8,12}$/.test(
          form.nomorWhatsapp.replace(/\s/g, "")
        )
      )
        return "Format nomor WhatsApp tidak valid (contoh: 08123456789)";
    }
    if (step === 1) {
      if (!form.alamatProperti.trim()) return "Alamat properti wajib diisi";
      if (!form.hargaSewa || form.hargaSewa < 100000)
        return "Harga sewa minimal Rp 100.000";
      if (!form.durasiSewa || form.durasiSewa < 1)
        return "Durasi minimal 1 bulan";
      if (!form.tanggalMulai) return "Tanggal mulai wajib diisi";
    }
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify(data));
      router.push("/preview");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const formatRp = (n: number) =>
    n ? new Intl.NumberFormat("id-ID").format(n) : "";

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: "linear-gradient(180deg, #F0F2FF 0%, #F8F9FF 100%)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "42rem" }}>
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <span
            className="badge badge-coral mb-4"
            style={{ fontSize: "0.7rem" }}
          >
            🏠 Kontrak Sewa Properti
          </span>
          <h1
            className="font-jakarta font-extrabold"
            style={{ color: "#0D1B3E", fontSize: "1.875rem" }}
          >
            Buat Kontrak Sewa
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Isi data di bawah — kontrak langsung jadi otomatis
          </p>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-8">
          {/* Bar */}
          <div className="step-progress-track">
            <div
              className="step-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Step indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            {STEPS.map((s, i) => {
              const isDone = i < step;
              const isActive = i === step;
              return (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  {/* Circle */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isDone ? "0.875rem" : isActive ? "1.125rem" : "0.875rem",
                        fontWeight: 800,
                        transition: "all 0.3s ease",
                        background: isDone
                          ? "#06D6A0"
                          : isActive
                          ? "linear-gradient(135deg, #FF4D6D, #E63558)"
                          : "rgba(13,27,62,0.08)",
                        color: isDone || isActive ? "white" : "#9BA3C4",
                        boxShadow: isActive
                          ? "0 4px 14px rgba(255,77,109,0.35)"
                          : isDone
                          ? "0 4px 14px rgba(6,214,160,0.25)"
                          : "none",
                        transform: isActive ? "scale(1.08)" : "scale(1)",
                      }}
                    >
                      {isDone ? "✓" : s.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? "#0D1B3E"
                        : isDone
                        ? "#028A66"
                        : "#9BA3C4",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Form Card ── */}
        <div
          className="card"
          style={{
            boxShadow: "0 4px 24px rgba(13,27,62,0.08), 0 1px 4px rgba(13,27,62,0.04)",
          }}
        >
          {/* ── STEP 0: Data Para Pihak ── */}
          {step === 0 && (
            <div className="space-y-5">
              {/* Step hint */}
              <div
                style={{
                  background: "rgba(255,77,109,0.06)",
                  borderLeft: "3px solid #FF4D6D",
                  borderRadius: "0 12px 12px 0",
                  padding: "0.875rem 1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#FF4D6D",
                    marginBottom: "0.25rem",
                  }}
                >
                  👥 Langkah 1 — Data Para Pihak
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6B7FA8" }}>
                  Masukkan nama lengkap kedua belah pihak sesuai KTP dan email
                  penerima kontrak.
                </p>
              </div>

              <div>
                <label className="form-label">
                  Nama Pihak Pertama{" "}
                  <span style={{ color: "#FF4D6D" }}>*</span>
                  <span
                    style={{
                      marginLeft: "0.375rem",
                      fontSize: "0.72rem",
                      fontWeight: 400,
                      color: "#9BA3C4",
                    }}
                  >
                    (Pemberi Sewa / Landlord)
                  </span>
                </label>
                <input
                  className="form-input"
                  placeholder="Contoh: Budi Santoso"
                  value={form.namaPihakPertama}
                  onChange={(e) => set("namaPihakPertama", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem" }}
                />
              </div>

              <div>
                <label className="form-label">
                  Nama Pihak Kedua{" "}
                  <span style={{ color: "#FF4D6D" }}>*</span>
                  <span
                    style={{
                      marginLeft: "0.375rem",
                      fontSize: "0.72rem",
                      fontWeight: 400,
                      color: "#9BA3C4",
                    }}
                  >
                    (Penyewa / Tenant)
                  </span>
                </label>
                <input
                  className="form-input"
                  placeholder="Contoh: Dewi Rahayu"
                  value={form.namaPihakKedua}
                  onChange={(e) => set("namaPihakKedua", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem" }}
                />
              </div>

              <div>
                <label className="form-label">
                  Email Penerima Kontrak{" "}
                  <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.emailPembeli}
                  onChange={(e) => set("emailPembeli", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem" }}
                />
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#9BA3C4",
                    marginTop: "0.375rem",
                  }}
                >
                  📧 PDF kontrak akan dikirim ke email ini setelah pembayaran.
                </p>
              </div>

              <div>
                <label className="form-label">
                  Nomor WhatsApp
                  <span
                    style={{
                      marginLeft: "0.375rem",
                      fontSize: "0.72rem",
                      fontWeight: 400,
                      color: "#9BA3C4",
                    }}
                  >
                    (opsional)
                  </span>
                </label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.nomorWhatsapp ?? ""}
                  onChange={(e) => set("nomorWhatsapp", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem" }}
                />
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#9BA3C4",
                    marginTop: "0.375rem",
                  }}
                >
                  📱 PDF kontrak juga akan dikirim ke WhatsApp ini.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 1: Properti & Sewa ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div
                style={{
                  background: "rgba(255,209,102,0.08)",
                  borderLeft: "3px solid #FFD166",
                  borderRadius: "0 12px 12px 0",
                  padding: "0.875rem 1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9A6F00",
                  }}
                >
                  🏠 Langkah 2 — Detail Properti & Sewa
                </p>
              </div>

              <div>
                <label className="form-label">
                  Alamat Properti{" "}
                  <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Contoh: Jl. Mawar No. 12, RT 05/RW 03, Kel. Menteng, Kec. Menteng, Jakarta Pusat 10310"
                  value={form.alamatProperti}
                  onChange={(e) => set("alamatProperti", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem", resize: "vertical" }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .form-row-2 { grid-template-columns: 1fr 1fr !important; }
                  }
                `}</style>
                <div
                  className="form-row-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label className="form-label">
                      Harga Sewa / Bulan{" "}
                      <span style={{ color: "#FF4D6D" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#6B7FA8",
                          pointerEvents: "none",
                        }}
                      >
                        Rp
                      </span>
                      <input
                        className="form-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="2.500.000"
                        value={formatRp(form.hargaSewa)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          set("hargaSewa", raw ? parseInt(raw) : 0);
                        }}
                        style={{
                          paddingLeft: "2.75rem",
                          fontSize: "0.95rem",
                          padding: "0.875rem 1rem 0.875rem 2.75rem",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">
                      Durasi Sewa{" "}
                      <span style={{ color: "#FF4D6D" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="form-input appearance-none"
                        value={form.durasiSewa}
                        onChange={(e) =>
                          set("durasiSewa", parseInt(e.target.value))
                        }
                        style={{
                          paddingRight: "2.5rem",
                          fontSize: "0.95rem",
                          padding: "0.875rem 2.5rem 0.875rem 1rem",
                        }}
                      >
                        {[1, 2, 3, 6, 12, 18, 24, 36].map((m) => (
                          <option key={m} value={m}>
                            {m} bulan{m >= 12 ? ` (${m / 12} tahun)` : ""}
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          pointerEvents: "none",
                          position: "absolute",
                          right: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "0.7rem",
                          color: "#9BA3C4",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">
                  Tanggal Mulai Sewa{" "}
                  <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <input
                  className="form-input"
                  type="date"
                  value={form.tanggalMulai}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("tanggalMulai", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem" }}
                />
              </div>

              {/* Total preview */}
              {form.hargaSewa > 0 && form.durasiSewa > 0 && (
                <div
                  style={{
                    borderRadius: "14px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(6,214,160,0.07)",
                    border: "1px solid rgba(6,214,160,0.25)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#028A66",
                        marginBottom: "0.125rem",
                      }}
                    >
                      Total nilai sewa
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#6B7FA8" }}>
                      {form.durasiSewa} bulan × Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(form.hargaSewa)}
                    </div>
                  </div>
                  <div
                    className="font-jakarta font-extrabold"
                    style={{ color: "#028A66", fontSize: "1.1rem" }}
                  >
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      form.hargaSewa * form.durasiSewa
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="form-label">
                  Ketentuan Tambahan
                  <span
                    style={{
                      marginLeft: "0.375rem",
                      fontSize: "0.72rem",
                      fontWeight: 400,
                      color: "#9BA3C4",
                    }}
                  >
                    (opsional)
                  </span>
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Contoh: Penyewa wajib menjaga kebersihan area bersama. Tidak diperkenankan memelihara hewan peliharaan..."
                  value={form.ketentuanTambahan}
                  onChange={(e) => set("ketentuanTambahan", e.target.value)}
                  style={{ fontSize: "0.95rem", padding: "0.875rem 1rem", resize: "vertical" }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Review ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div
                style={{
                  background: "rgba(6,214,160,0.07)",
                  borderLeft: "3px solid #06D6A0",
                  borderRadius: "0 12px 12px 0",
                  padding: "0.875rem 1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#028A66",
                    marginBottom: "0.25rem",
                  }}
                >
                  ✅ Langkah 3 — Review & Konfirmasi
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6B7FA8" }}>
                  Pastikan semua data sudah benar sebelum kontrak di-generate.
                </p>
              </div>

              {[
                { label: "Pemberi Sewa", value: form.namaPihakPertama },
                { label: "Penyewa", value: form.namaPihakKedua },
                { label: "Email Kontrak", value: form.emailPembeli },
                ...(form.nomorWhatsapp
                  ? [{ label: "WhatsApp", value: form.nomorWhatsapp }]
                  : []),
                { label: "Alamat Properti", value: form.alamatProperti },
                {
                  label: "Harga Sewa",
                  value: `Rp ${new Intl.NumberFormat("id-ID").format(
                    form.hargaSewa
                  )} / bulan`,
                },
                { label: "Durasi", value: `${form.durasiSewa} bulan` },
                { label: "Mulai Sewa", value: form.tanggalMulai },
                ...(form.ketentuanTambahan
                  ? [
                      {
                        label: "Ketentuan Tambahan",
                        value: form.ketentuanTambahan,
                      },
                    ]
                  : []),
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid rgba(13,27,62,0.06)",
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      flexShrink: 0,
                      width: "10rem",
                      color: "#6B7FA8",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      textAlign: "right",
                      fontWeight: 500,
                      color: "#0D1B3E",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Price box */}
              <div
                style={{
                  borderRadius: "16px",
                  padding: "1.125rem",
                  background:
                    "linear-gradient(135deg, rgba(255,77,109,0.06), rgba(255,77,109,0.03))",
                  border: "1px solid rgba(255,77,109,0.15)",
                  marginTop: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.375rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#0D1B3E",
                    }}
                  >
                    Biaya Pembuatan Kontrak
                  </span>
                  <span
                    className="font-jakarta font-extrabold"
                    style={{ color: "#FF4D6D", fontSize: "1.25rem" }}
                  >
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      CONTRACT_PRICES["sewa-properti"]
                    )}
                  </span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "#9BA3C4" }}>
                  Bayar 1x via Virtual Account Bank · Kontrak langsung jadi
                </p>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div
              style={{
                marginTop: "1rem",
                borderRadius: "14px",
                padding: "0.875rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                background: "rgba(255,77,109,0.08)",
                color: "#E63558",
                border: "1px solid rgba(255,77,109,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}
          >
            {step > 0 && (
              <button
                className="btn-ghost flex-1"
                onClick={() => {
                  setError("");
                  setStep((s) => s - 1);
                }}
                disabled={loading}
              >
                ← Kembali
              </button>
            )}
            {step < 2 ? (
              <button className="btn-primary flex-1" onClick={next}>
                Lanjut →
              </button>
            ) : (
              <button
                className="btn-amber flex-1"
                onClick={handleSubmit}
                disabled={loading}
                style={{ padding: "1rem", fontSize: "1rem", fontWeight: 800 }}
              >
                {loading ? "⏳ Membuat kontrak..." : "✨ Generate Kontrak"}
              </button>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "#9BA3C4", lineHeight: 1.7 }}
        >
          🔒 Data kamu dienkripsi &amp; aman · Tidak perlu buat akun
        </p>
      </div>
    </div>
  );
}
