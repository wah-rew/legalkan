"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContractFormData, CONTRACT_PRICES } from "@/types";

const STEPS = ["Data Pihak", "Properti & Sewa", "Review & Kirim"];

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
      if (form.nomorWhatsapp && !/^(\+?62|0)8[0-9]{8,12}$/.test(form.nomorWhatsapp.replace(/\s/g, "")))
        return "Format nomor WhatsApp tidak valid (contoh: 08123456789)";
    }
    if (step === 1) {
      if (!form.alamatProperti.trim()) return "Alamat properti wajib diisi";
      if (!form.hargaSewa || form.hargaSewa < 100000)
        return "Harga sewa minimal Rp 100.000";
      if (!form.durasiSewa || form.durasiSewa < 1) return "Durasi minimal 1 bulan";
      if (!form.tanggalMulai) return "Tanggal mulai wajib diisi";
    }
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
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

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Buat Kontrak Sewa
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
            Isi data di bawah — kontrak langsung jadi otomatis
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  background: i < step ? "#06D6A0" : i === step ? "#FF4D6D" : "rgba(13,27,62,0.1)",
                  color: i <= step ? "white" : "#9BA3C4",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className="hidden text-xs font-semibold sm:block"
                style={{ color: i === step ? "#0D1B3E" : "#9BA3C4" }}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px w-8 sm:w-12"
                  style={{ background: i < step ? "#06D6A0" : "rgba(13,27,62,0.12)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card">
          {/* STEP 0: Data Para Pihak */}
          {step === 0 && (
            <div className="space-y-5">
              <div
                className="rounded-2xl p-4 mb-2"
                style={{ background: "rgba(255,77,109,0.06)", borderLeft: "3px solid #FF4D6D" }}
              >
                <p className="text-xs font-semibold" style={{ color: "#FF4D6D" }}>
                  💡 Langkah 1 dari 3 — Data Para Pihak
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7FA8" }}>
                  Masukkan nama lengkap kedua belah pihak sesuai KTP dan email penerima kontrak.
                </p>
              </div>

              <div>
                <label className="form-label">
                  Nama Pihak Pertama <span style={{ color: "#FF4D6D" }}>*</span>
                  <span className="ml-1 text-xs font-normal" style={{ color: "#9BA3C4" }}>(Pemberi Sewa / Landlord)</span>
                </label>
                <input
                  className="form-input"
                  placeholder="Contoh: Budi Santoso"
                  value={form.namaPihakPertama}
                  onChange={(e) => set("namaPihakPertama", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  Nama Pihak Kedua <span style={{ color: "#FF4D6D" }}>*</span>
                  <span className="ml-1 text-xs font-normal" style={{ color: "#9BA3C4" }}>(Penyewa / Tenant)</span>
                </label>
                <input
                  className="form-input"
                  placeholder="Contoh: Dewi Rahayu"
                  value={form.namaPihakKedua}
                  onChange={(e) => set("namaPihakKedua", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  Email Penerima Kontrak <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.emailPembeli}
                  onChange={(e) => set("emailPembeli", e.target.value)}
                />
                <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                  PDF kontrak akan dikirim ke email ini setelah pembayaran.
                </p>
              </div>

              <div>
                <label className="form-label">
                  Nomor WhatsApp
                  <span className="ml-1 text-xs font-normal" style={{ color: "#9BA3C4" }}>(opsional, untuk pengiriman PDF)</span>
                </label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.nomorWhatsapp ?? ""}
                  onChange={(e) => set("nomorWhatsapp", e.target.value)}
                />
                <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                  📱 PDF kontrak juga akan dikirim ke WhatsApp ini.
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: Properti & Sewa */}
          {step === 1 && (
            <div className="space-y-5">
              <div
                className="rounded-2xl p-4 mb-2"
                style={{ background: "rgba(255,209,102,0.10)", borderLeft: "3px solid #FFD166" }}
              >
                <p className="text-xs font-semibold" style={{ color: "#9A6F00" }}>
                  🏠 Langkah 2 dari 3 — Detail Properti & Sewa
                </p>
              </div>

              <div>
                <label className="form-label">
                  Alamat Properti <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Contoh: Jl. Mawar No. 12, RT 05/RW 03, Kel. Menteng, Kec. Menteng, Jakarta Pusat 10310"
                  value={form.alamatProperti}
                  onChange={(e) => set("alamatProperti", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">
                    Harga Sewa / Bulan <span style={{ color: "#FF4D6D" }}>*</span>
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                      style={{ color: "#6B7FA8" }}
                    >
                      Rp
                    </span>
                    <input
                      className="form-input pl-10"
                      type="text"
                      inputMode="numeric"
                      placeholder="2.500.000"
                      value={formatRp(form.hargaSewa)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        set("hargaSewa", raw ? parseInt(raw) : 0);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">
                    Durasi Sewa <span style={{ color: "#FF4D6D" }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="form-input appearance-none pr-10"
                      value={form.durasiSewa}
                      onChange={(e) => set("durasiSewa", parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 6, 12, 18, 24, 36].map((m) => (
                        <option key={m} value={m}>
                          {m} bulan{m >= 12 ? ` (${m / 12} tahun)` : ""}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#9BA3C4" }}>
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">
                  Tanggal Mulai Sewa <span style={{ color: "#FF4D6D" }}>*</span>
                </label>
                <input
                  className="form-input"
                  type="date"
                  value={form.tanggalMulai}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("tanggalMulai", e.target.value)}
                />
              </div>

              {/* Total preview */}
              {form.hargaSewa > 0 && form.durasiSewa > 0 && (
                <div
                  className="rounded-2xl p-4 flex justify-between items-center"
                  style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.3)" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#028A66" }}>
                    Total nilai sewa ({form.durasiSewa} bulan)
                  </span>
                  <span className="font-jakarta font-extrabold" style={{ color: "#028A66" }}>
                    Rp {new Intl.NumberFormat("id-ID").format(form.hargaSewa * form.durasiSewa)}
                  </span>
                </div>
              )}

              <div>
                <label className="form-label">
                  Ketentuan Tambahan
                  <span className="ml-1 text-xs font-normal" style={{ color: "#9BA3C4" }}>(opsional)</span>
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Contoh: Penyewa wajib menjaga kebersihan area bersama. Tidak diperkenankan memelihara hewan peliharaan..."
                  value={form.ketentuanTambahan}
                  onChange={(e) => set("ketentuanTambahan", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 2 && (
            <div className="space-y-4">
              <div
                className="rounded-2xl p-4 mb-2"
                style={{ background: "rgba(6,214,160,0.08)", borderLeft: "3px solid #06D6A0" }}
              >
                <p className="text-xs font-semibold" style={{ color: "#028A66" }}>
                  ✅ Langkah 3 dari 3 — Review & Konfirmasi
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7FA8" }}>
                  Pastikan semua data sudah benar sebelum kontrak di-generate.
                </p>
              </div>

              {[
                { label: "Pemberi Sewa", value: form.namaPihakPertama },
                { label: "Penyewa", value: form.namaPihakKedua },
                { label: "Email Kontrak", value: form.emailPembeli },
                ...(form.nomorWhatsapp ? [{ label: "WhatsApp", value: form.nomorWhatsapp }] : []),
                { label: "Alamat Properti", value: form.alamatProperti },
                {
                  label: "Harga Sewa",
                  value: `Rp ${new Intl.NumberFormat("id-ID").format(form.hargaSewa)} / bulan`,
                },
                { label: "Durasi", value: `${form.durasiSewa} bulan` },
                { label: "Mulai Sewa", value: form.tanggalMulai },
                ...(form.ketentuanTambahan
                  ? [{ label: "Ketentuan Tambahan", value: form.ketentuanTambahan }]
                  : []),
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-start gap-4 py-3 border-b text-sm"
                  style={{ borderColor: "rgba(13,27,62,0.06)" }}
                >
                  <span className="font-semibold shrink-0 w-40" style={{ color: "#6B7FA8" }}>
                    {row.label}
                  </span>
                  <span className="text-right font-medium" style={{ color: "#0D1B3E" }}>
                    {row.value}
                  </span>
                </div>
              ))}

              <div
                className="rounded-2xl p-4 mt-2"
                style={{ background: "rgba(255,77,109,0.06)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold" style={{ color: "#0D1B3E" }}>
                    Biaya Pembuatan Kontrak
                  </span>
                  <span className="font-jakarta font-extrabold text-lg" style={{ color: "#FF4D6D" }}>
                    Rp {new Intl.NumberFormat('id-ID').format(CONTRACT_PRICES['sewa-properti'])}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
                  Bayar 1x via Virtual Account Bank. Kontrak langsung jadi.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="mt-4 rounded-2xl px-4 py-3 text-sm font-semibold"
              style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                className="btn-ghost flex-1"
                onClick={() => { setError(""); setStep((s) => s - 1); }}
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
                className="btn-amber flex-1 py-4 text-base font-extrabold"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "⏳ Membuat kontrak..." : "✨ Generate Kontrak"}
              </button>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs mt-6" style={{ color: "#9BA3C4" }}>
          🔒 Data kamu dienkripsi & aman · Tidak perlu buat akun
        </p>
      </div>
    </div>
  );
}
