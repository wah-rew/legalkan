"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STEPS = ["Profil Usaha", "Skala Usaha", "Struktur Usaha", "Rekomendasi"];

interface WizardState {
  // Step 1
  namaUsaha: string;
  bentukUsaha: "Perorangan" | "CV" | "PT" | "UD" | "Koperasi" | "";
  bidangUsaha: string;
  lamaUsaha: "<6bln" | "6-12bln" | "1-2thn" | ">2thn" | "";
  alamatUsaha: string;
  kotaUsaha: string;
  // Step 2
  jumlahKaryawan: "0" | "1-5" | "6-20" | ">20" | "";
  omzetPerBulan: "<5jt" | "5-20jt" | "20-50jt" | ">50jt" | "";
  modalBerasalDari: "Sendiri" | "Keluarga/Teman" | "Investor" | "Campuran" | "";
  punyaNIB: boolean | null;
  adaAgunan: boolean | null;
  // Step 3
  adaKaryawanTetap: boolean | null;
  adaMitra: boolean | null;
  jumlahMitra: number;
  adaPinjamanLuar: boolean | null;
  pernahApplyKUR: boolean | null;
  // Contact
  namaPemilik: string;
  emailPembeli: string;
  nomorWhatsapp: string;
}

const INITIAL: WizardState = {
  namaUsaha: "",
  bentukUsaha: "",
  bidangUsaha: "",
  lamaUsaha: "",
  alamatUsaha: "",
  kotaUsaha: "",
  jumlahKaryawan: "",
  omzetPerBulan: "",
  modalBerasalDari: "",
  punyaNIB: null,
  adaAgunan: null,
  adaKaryawanTetap: null,
  adaMitra: null,
  jumlahMitra: 1,
  adaPinjamanLuar: null,
  pernahApplyKUR: null,
  namaPemilik: "",
  emailPembeli: "",
  nomorWhatsapp: "",
};

function calcPrice(docs: RecommendedDoc[]): number {
  const n = docs.length;
  if (n <= 2) return 59000;
  return Math.min(59000 + (n - 2) * 25000, 199000);
}

function calcSeparatePrice(docs: RecommendedDoc[]): number {
  return docs.length * 39000;
}

interface RecommendedDoc {
  id: string;
  icon: string;
  title: string;
  desc: string;
  description?: string;
  count?: number;
  html?: string;
  nomorKontrak?: string;
}

interface KURRecommendation {
  bank: string;
  logo: string;
  product: string;
  plafonMax: string;
  bunga: string;
  highlight: string;
  cocokUntuk: string;
  url: string;
  badge: string | null;
  badgeColor: string | null;
}

function getKURRecommendations(s: WizardState): KURRecommendation[] {
  const recommendations: KURRecommendation[] = [];

  // BRI — always include, best for micro
  recommendations.push({
    bank: "BRI",
    logo: "🏦",
    product: "KUR Mikro BRI",
    plafonMax: "Rp 100 juta",
    bunga: "6% per tahun",
    highlight: "Penyalur KUR terbesar Indonesia. Proses cepat, kantor di seluruh Indonesia.",
    cocokUntuk: "Semua jenis usaha mikro",
    url: "https://bri.co.id/kur",
    badge: "Terpopuler",
    badgeColor: "#06D6A0",
  });

  // BNI — good for agribusiness
  if (
    s.bidangUsaha === "Pertanian/Perkebunan" ||
    s.bidangUsaha === "Peternakan" ||
    s.bidangUsaha === "Perikanan"
  ) {
    recommendations.push({
      bank: "BNI",
      logo: "🏛️",
      product: "KUR BNI Agribisnis",
      plafonMax: "Rp 500 juta",
      bunga: "6% per tahun",
      highlight: "Spesialis agribisnis. Ada pendampingan usaha dari BNI.",
      cocokUntuk: "Pertanian, peternakan, perikanan",
      url: "https://bni.co.id/kur",
      badge: "Cocok untukmu",
      badgeColor: "#FF4D6D",
    });
  }

  // Mandiri — good for larger businesses
  if (
    s.omzetPerBulan === ">50jt" ||
    s.bentukUsaha === "PT" ||
    s.bentukUsaha === "CV"
  ) {
    recommendations.push({
      bank: "Mandiri",
      logo: "🏢",
      product: "KUR Kecil Mandiri",
      plafonMax: "Rp 500 juta",
      bunga: "6% per tahun",
      highlight: "Ideal untuk usaha yang sudah berkembang dengan omzet lebih besar.",
      cocokUntuk: "CV, PT, usaha omzet > Rp 20 juta/bulan",
      url: "https://bankmandiri.co.id/kur",
      badge: null,
      badgeColor: null,
    });
  }

  // BSI — syariah option
  recommendations.push({
    bank: "BSI",
    logo: "🕌",
    product: "KUR BSI (Syariah)",
    plafonMax: "Rp 500 juta",
    bunga: "Akad murabahah setara 6%",
    highlight: "Pilihan tepat jika kamu ingin pembiayaan sesuai prinsip syariah.",
    cocokUntuk: "Semua sektor, khususnya yang prefer syariah",
    url: "https://bankbsi.co.id/kur",
    badge: null,
    badgeColor: null,
  });

  return recommendations;
}

function getRecommendedDocs(s: WizardState): RecommendedDoc[] {
  const docs: RecommendedDoc[] = [];

  // Always
  docs.push({
    id: "pernyataan-usaha-aktif",
    icon: "📜",
    title: "Surat Pernyataan Usaha Aktif",
    desc: "Deklarasi bahwa usahamu sedang aktif beroperasi, tidak dalam gagal bayar, dan patuh hukum.",
  });
  docs.push({
    id: "surat-keterangan-usaha",
    icon: "📋",
    title: "Surat Keterangan Usaha",
    desc: "Dokumen formal yang menerangkan keberadaan, jenis, dan alamat usahamu.",
  });

  // PKWT if karyawan > 0
  const hasKaryawan =
    s.jumlahKaryawan !== "0" && s.jumlahKaryawan !== "" || s.adaKaryawanTetap === true;
  if (hasKaryawan) {
    let numPKWT = 1;
    if (s.jumlahKaryawan === "1-5") numPKWT = 3;
    else if (s.jumlahKaryawan === "6-20" || s.jumlahKaryawan === ">20") numPKWT = 5;
    docs.push({
      id: "pkwt",
      icon: "👔",
      title: `PKWT (Kontrak Karyawan)`,
      desc: `Perjanjian kerja waktu tertentu untuk karyawan tetap. Template siap isi untuk ${numPKWT} karyawan.`,
      count: numPKWT,
    });
  }

  // Bagi hasil if mitra
  if (s.adaMitra === true) {
    docs.push({
      id: "bagi-hasil",
      icon: "🤝",
      title: "Perjanjian Bagi Hasil Usaha",
      desc: "Dokumen kemitraan yang mengatur porsi keuntungan dengan mitra bisnismu.",
    });
  }

  // Hutang piutang if modal dari luar
  if (s.modalBerasalDari !== "Sendiri" && s.modalBerasalDari !== "" && s.adaPinjamanLuar === true) {
    docs.push({
      id: "hutang-piutang",
      icon: "💰",
      title: "Perjanjian Hutang Piutang",
      desc: "Dokumentasi modal pinjaman dari pihak luar untuk melengkapi bukti arus modal.",
    });
  }

  // Surat Kuasa if CV/PT
  if (s.bentukUsaha === "CV" || s.bentukUsaha === "PT") {
    docs.push({
      id: "surat-kuasa",
      icon: "📝",
      title: "Surat Kuasa Direksi/Pengurus",
      desc: `Kuasa resmi dari ${s.bentukUsaha} ${s.namaUsaha || "kamu"} untuk pengurusan KUR.`,
    });
  }

  return docs;
}

function SelectCard({
  value,
  current,
  onClick,
  children,
}: {
  value: string;
  current: string | boolean | null;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const selected = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl p-4 text-left transition-all w-full"
      style={{
        background: selected ? "rgba(255,77,109,0.08)" : "rgba(13,27,62,0.04)",
        border: selected
          ? "2px solid #FF4D6D"
          : "2px solid rgba(13,27,62,0.08)",
        cursor: "pointer",
      }}
    >
      <span
        className="text-sm font-semibold"
        style={{ color: selected ? "#FF4D6D" : "#3D4F7C" }}
      >
        {children}
      </span>
    </button>
  );
}

function YesNoSelect({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-3">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className="flex-1 rounded-2xl py-3 text-sm font-bold transition-all"
          style={{
            background:
              value === v ? "rgba(255,77,109,0.08)" : "rgba(13,27,62,0.04)",
            border:
              value === v
                ? "2px solid #FF4D6D"
                : "2px solid rgba(13,27,62,0.08)",
            color: value === v ? "#FF4D6D" : "#3D4F7C",
            cursor: "pointer",
          }}
        >
          {v ? "✅ Ya" : "❌ Tidak"}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-sm font-bold mb-2"
      style={{ color: "#0D1B3E" }}
    >
      {children}
    </label>
  );
}

export default function KURWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBank, setSelectedBank] = useState<"BCA" | "BNI" | "BRI" | "MANDIRI" | "">("");
  const [result, setResult] = useState<{
    documents: RecommendedDoc[];
    totalPrice: number;
    separatePrice: number;
    savingsPercent: number;
    contractData: Record<string, unknown>;
  } | null>(null);

  const set = (k: keyof WizardState, v: unknown) =>
    setData((prev) => ({ ...prev, [k]: v }));

  // ── Validation per step ─────────────────────────────────────────────────────
  function validateStep(): string {
    if (step === 0) {
      if (!data.namaUsaha.trim()) return "Nama usaha wajib diisi";
      if (!data.bentukUsaha) return "Pilih bentuk usaha";
      if (!data.bidangUsaha) return "Pilih bidang usaha";
      if (!data.lamaUsaha) return "Pilih lama usaha berjalan";
      if (!data.kotaUsaha.trim()) return "Kota usaha wajib diisi";
      if (!data.namaPemilik.trim()) return "Nama pemilik/penanggungjawab wajib diisi";
    }
    if (step === 1) {
      if (!data.jumlahKaryawan) return "Pilih jumlah karyawan";
      if (!data.omzetPerBulan) return "Pilih omzet per bulan";
      if (!data.modalBerasalDari) return "Pilih sumber modal";
      if (data.punyaNIB === null) return "Jawab pertanyaan tentang NIB";
      if (data.adaAgunan === null) return "Jawab pertanyaan tentang agunan";
    }
    if (step === 2) {
      if (data.adaKaryawanTetap === null) return "Jawab pertanyaan karyawan tetap";
      if (data.adaMitra === null) return "Jawab pertanyaan mitra bisnis";
      if (data.adaPinjamanLuar === null) return "Jawab pertanyaan pinjaman modal";
      if (data.pernahApplyKUR === null) return "Jawab pertanyaan riwayat KUR";
      if (!data.emailPembeli.trim()) return "Email wajib diisi untuk pengiriman dokumen";
    }
    return "";
  }

  async function handleNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");

    if (step === 2) {
      // Generate bundle
      setLoading(true);
      try {
        const res = await fetch("/api/generate/kur-bundle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            jumlahMitra: data.adaMitra ? data.jumlahMitra : 0,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal membuat bundle");
        // Map icons onto API result docs
        const ICONS: Record<string, string> = {
          "pernyataan-usaha-aktif": "📜",
          "surat-keterangan-usaha": "📋",
          "perjanjian-bagi-hasil": "🤝",
          "perjanjian-hutang-piutang": "💰",
          "surat-kuasa": "📝",
        };
        const docsWithIcons = json.documents.map((d: { id: string; title: string; description: string; html: string; nomorKontrak: string }) => ({
          ...d,
          icon: d.id.startsWith("pkwt") ? "👔" : (ICONS[d.id] || "📄"),
          desc: d.description,
        }));
        setResult({ ...json, documents: docsWithIcons });
        setStep(3);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  }

  async function handleCheckout() {
    if (!result) return;
    if (!selectedBank) {
      setError("Pilih bank untuk pembayaran");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Store bundle htmls
      sessionStorage.setItem(
        "kur_bundle_htmls",
        JSON.stringify(
          result.documents.map((d) => ({
            id: d.id,
            title: d.title,
            html: d.html,
            nomorKontrak: d.nomorKontrak,
          }))
        )
      );

      // Create payment
      const payRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractData: result.contractData,
          bank: selectedBank,
        }),
      });
      const payJson = await payRes.json();
      if (!payRes.ok) throw new Error(payJson.error || "Gagal membuat pembayaran");

      sessionStorage.setItem("kontrak_payment", JSON.stringify(payJson.paymentData));
      router.push("/bayar");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan saat checkout");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "2px solid rgba(13,27,62,0.1)",
    fontSize: "0.9rem",
    color: "#0D1B3E",
    background: "white",
    outline: "none",
  };

  const sectionStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "1.25rem",
    boxShadow: "0 2px 12px rgba(13,27,62,0.06)",
    border: "1px solid rgba(13,27,62,0.06)",
  };

  const docs = result ? result.documents : getRecommendedDocs(data);
  const previewPrice = calcPrice(getRecommendedDocs(data));
  const previewSeparate = calcSeparatePrice(getRecommendedDocs(data));

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto" style={{ maxWidth: "640px" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/kur" className="text-xs font-semibold" style={{ color: "#6B7FA8" }}>
            ← Kembali ke Paket KUR-Ready
          </Link>
          <div className="mt-3">
            <span
              className="badge inline-flex mb-3"
              style={{ background: "rgba(255,209,102,0.12)", color: "#FFD166", border: "1px solid rgba(255,209,102,0.25)" }}
            >
              🏦 Paket KUR-Ready
            </span>
          </div>
          <h1 className="font-jakarta text-2xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Cek Kebutuhan Dokumen KUR
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7FA8" }}>
            Jawab beberapa pertanyaan — sistem auto-detect dokumen yang kamu butuhkan
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  background: i < step ? "#06D6A0" : i === step ? "#FF4D6D" : "rgba(13,27,62,0.1)",
                  color: i <= step ? "white" : "#9BA3C4",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: "2rem",
                    height: "2px",
                    background: i < step ? "#06D6A0" : "rgba(13,27,62,0.1)",
                    borderRadius: "9999px",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl px-4 py-3 mb-4 text-sm font-semibold"
            style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ── STEP 1: Profil Usaha ──────────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <div style={sectionStyle}>
              <div className="mb-5">
                <FieldLabel>Nama Usaha *</FieldLabel>
                <input
                  style={inputStyle}
                  placeholder="Contoh: Toko Makmur Jaya"
                  value={data.namaUsaha}
                  onChange={(e) => set("namaUsaha", e.target.value)}
                />
              </div>

              <div className="mb-5">
                <FieldLabel>Nama Pemilik / Penanggungjawab *</FieldLabel>
                <input
                  style={inputStyle}
                  placeholder="Nama lengkap sesuai KTP"
                  value={data.namaPemilik}
                  onChange={(e) => set("namaPemilik", e.target.value)}
                />
              </div>

              <div className="mb-5">
                <FieldLabel>Bentuk Usaha *</FieldLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.5rem",
                  }}
                >
                  {["Perorangan", "CV", "PT", "UD", "Koperasi"].map((b) => (
                    <SelectCard
                      key={b}
                      value={b}
                      current={data.bentukUsaha}
                      onClick={() => set("bentukUsaha", b)}
                    >
                      {b}
                    </SelectCard>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <FieldLabel>Bidang Usaha *</FieldLabel>
                <select
                  style={{ ...inputStyle, appearance: "auto" }}
                  value={data.bidangUsaha}
                  onChange={(e) => set("bidangUsaha", e.target.value)}
                >
                  <option value="">-- Pilih bidang usaha --</option>
                  {[
                    "Perdagangan",
                    "Jasa",
                    "Pertanian/Perkebunan",
                    "Peternakan",
                    "Perikanan",
                    "Manufaktur/Produksi",
                    "Kuliner",
                    "Lainnya",
                  ].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <FieldLabel>Lama Usaha Berjalan *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {[
                    { v: "<6bln", label: "< 6 bulan" },
                    { v: "6-12bln", label: "6–12 bulan" },
                    { v: "1-2thn", label: "1–2 tahun" },
                    { v: ">2thn", label: "> 2 tahun" },
                  ].map(({ v, label }) => (
                    <SelectCard key={v} value={v} current={data.lamaUsaha} onClick={() => set("lamaUsaha", v)}>
                      {label}
                    </SelectCard>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <FieldLabel>Alamat Usaha</FieldLabel>
                <input
                  style={inputStyle}
                  placeholder="Jl. Contoh No. 1"
                  value={data.alamatUsaha}
                  onChange={(e) => set("alamatUsaha", e.target.value)}
                />
              </div>

              <div>
                <FieldLabel>Kota / Kabupaten *</FieldLabel>
                <input
                  style={inputStyle}
                  placeholder="Contoh: Jakarta Selatan"
                  value={data.kotaUsaha}
                  onChange={(e) => set("kotaUsaha", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Skala Usaha ───────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div style={sectionStyle}>
              <div className="mb-5">
                <FieldLabel>Jumlah Karyawan *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {[
                    { v: "0", label: "0 (saya sendiri)" },
                    { v: "1-5", label: "1–5 orang" },
                    { v: "6-20", label: "6–20 orang" },
                    { v: ">20", label: "> 20 orang" },
                  ].map(({ v, label }) => (
                    <SelectCard key={v} value={v} current={data.jumlahKaryawan} onClick={() => set("jumlahKaryawan", v)}>
                      {label}
                    </SelectCard>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <FieldLabel>Omzet Per Bulan *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {[
                    { v: "<5jt", label: "< Rp 5 juta" },
                    { v: "5-20jt", label: "Rp 5–20 juta" },
                    { v: "20-50jt", label: "Rp 20–50 juta" },
                    { v: ">50jt", label: "> Rp 50 juta" },
                  ].map(({ v, label }) => (
                    <SelectCard key={v} value={v} current={data.omzetPerBulan} onClick={() => set("omzetPerBulan", v)}>
                      {label}
                    </SelectCard>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <FieldLabel>Modal Usaha Berasal Dari *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {["Sendiri", "Keluarga/Teman", "Investor", "Campuran"].map((v) => (
                    <SelectCard key={v} value={v} current={data.modalBerasalDari} onClick={() => set("modalBerasalDari", v)}>
                      {v}
                    </SelectCard>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <FieldLabel>Sudah punya NIB? *</FieldLabel>
                <YesNoSelect value={data.punyaNIB} onChange={(v) => set("punyaNIB", v)} />
                {data.punyaNIB === false && (
                  <div
                    className="mt-3 rounded-2xl p-4"
                    style={{
                      background: "rgba(255,209,102,0.12)",
                      border: "1.5px solid rgba(255,209,102,0.45)",
                    }}
                  >
                    <p className="font-bold text-sm mb-1" style={{ color: "#0D1B3E" }}>
                      📋 Belum punya NIB?
                    </p>
                    <p className="text-xs mb-3" style={{ color: "#5A6A8A", lineHeight: 1.6 }}>
                      NIB (Nomor Induk Berusaha) wajib untuk apply KUR di bank.
                      Kabar baiknya — gratis dan bisa diurus sendiri online dalam 15 menit.
                    </p>
                    <a
                      href="/nib-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold"
                      style={{ color: "#9A7500", textDecoration: "underline" }}
                    >
                      Panduan Urus NIB →
                    </a>
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Ada aset sebagai agunan? *</FieldLabel>
                <YesNoSelect value={data.adaAgunan} onChange={(v) => set("adaAgunan", v)} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Struktur Usaha ────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div style={sectionStyle}>
              <div className="mb-5">
                <FieldLabel>Ada karyawan tetap? *</FieldLabel>
                <YesNoSelect value={data.adaKaryawanTetap} onChange={(v) => set("adaKaryawanTetap", v)} />
              </div>

              <div className="mb-5">
                <FieldLabel>Ada mitra/partner bisnis? *</FieldLabel>
                <YesNoSelect value={data.adaMitra} onChange={(v) => set("adaMitra", v)} />
                {data.adaMitra && (
                  <div className="mt-3">
                    <FieldLabel>Berapa jumlah mitra?</FieldLabel>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      style={inputStyle}
                      value={data.jumlahMitra}
                      onChange={(e) => set("jumlahMitra", Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                )}
              </div>

              <div className="mb-5">
                <FieldLabel>Ada pinjaman modal dari luar (non-bank)? *</FieldLabel>
                <YesNoSelect value={data.adaPinjamanLuar} onChange={(v) => set("adaPinjamanLuar", v)} />
              </div>

              <div className="mb-5">
                <FieldLabel>Pernah apply KUR sebelumnya? *</FieldLabel>
                <YesNoSelect value={data.pernahApplyKUR} onChange={(v) => set("pernahApplyKUR", v)} />
              </div>
            </div>

            <div style={sectionStyle}>
              <h3 className="font-jakarta font-bold mb-4" style={{ color: "#0D1B3E" }}>
                📧 Kemana dokumen dikirim?
              </h3>
              <div className="mb-4">
                <FieldLabel>Email *</FieldLabel>
                <input
                  type="email"
                  style={inputStyle}
                  placeholder="email@contoh.com"
                  value={data.emailPembeli}
                  onChange={(e) => set("emailPembeli", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Nomor WhatsApp (opsional)</FieldLabel>
                <input
                  type="tel"
                  style={inputStyle}
                  placeholder="08123456789"
                  value={data.nomorWhatsapp}
                  onChange={(e) => set("nomorWhatsapp", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Hasil & Rekomendasi ──────────────────────────────────── */}
        {step === 3 && result && (
          <div>
            <div
              className="rounded-3xl p-6 mb-5"
              style={{
                background: "linear-gradient(135deg, #0D1B3E, #162348)",
                boxShadow: "0 8px 40px rgba(13,27,62,0.25)",
              }}
            >
              <div className="text-center mb-4">
                <p className="text-xs font-semibold mb-1" style={{ color: "#6B7FA8" }}>
                  🎯 Auto-detected untuk {data.namaUsaha}
                </p>
                <p
                  className="font-jakarta font-extrabold text-white"
                  style={{ fontSize: "1.5rem" }}
                >
                  {docs.length} Dokumen Dibutuhkan
                </p>
              </div>

              <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div>
                  <p className="text-xs" style={{ color: "#6B7FA8" }}>Total Paket</p>
                  <p className="font-jakarta font-extrabold" style={{ fontSize: "2rem", color: "#FFD166" }}>
                    Rp {new Intl.NumberFormat("id-ID").format(result.totalPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className="rounded-xl px-3 py-1.5"
                    style={{ background: "rgba(6,214,160,0.15)", border: "1px solid rgba(6,214,160,0.3)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "#06D6A0" }}>
                      Hemat {result.savingsPercent}%
                    </p>
                    <p className="text-xs line-through" style={{ color: "#6B7FA8" }}>
                      Rp {new Intl.NumberFormat("id-ID").format(result.separatePrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{doc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white">{doc.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#94A3CB", lineHeight: 1.5 }}>
                        {doc.description || doc.desc}
                      </p>
                    </div>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "9999px",
                        background: "rgba(6,214,160,0.15)",
                        color: "#06D6A0",
                      }}
                    >
                      ✓ Termasuk
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* KUR Bank Matcher */}
            {(() => {
              const kurRecs = getKURRecommendations(data);
              return (
                <div className="mb-5">
                  <div
                    className="rounded-3xl p-5"
                    style={{
                      background: "white",
                      boxShadow: "0 2px 12px rgba(13,27,62,0.06)",
                      border: "1px solid rgba(13,27,62,0.08)",
                    }}
                  >
                    <p
                      className="font-jakarta font-extrabold mb-1"
                      style={{ color: "#0D1B3E", fontSize: "1rem" }}
                    >
                      🏦 Bank KUR yang Cocok untuk Kamu
                    </p>
                    <p className="text-xs mb-4" style={{ color: "#6B7FA8" }}>
                      Berdasarkan profil usahamu, ini rekomendasi kami:
                    </p>

                    <div className="space-y-3">
                      {kurRecs.map((rec) => (
                        <div
                          key={rec.bank}
                          className="rounded-2xl p-4"
                          style={{
                            background: "white",
                            border: "1.5px solid rgba(13,27,62,0.1)",
                            position: "relative",
                            transition: "border-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "#FF4D6D";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(13,27,62,0.1)";
                          }}
                        >
                          {rec.badge && (
                            <span
                              style={{
                                position: "absolute",
                                top: "0.75rem",
                                right: "0.75rem",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.5rem",
                                borderRadius: "9999px",
                                background: rec.badgeColor
                                  ? `${rec.badgeColor}22`
                                  : "rgba(6,214,160,0.15)",
                                color: rec.badgeColor ?? "#06D6A0",
                              }}
                            >
                              {rec.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <span style={{ fontSize: "1.25rem" }}>{rec.logo}</span>
                            <span
                              className="font-jakarta font-bold"
                              style={{ color: "#0D1B3E", fontSize: "0.9rem" }}
                            >
                              {rec.bank}
                            </span>
                          </div>
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: "#3D4F7C" }}
                          >
                            {rec.product}
                          </p>
                          <div
                            className="flex gap-3 text-xs mb-2"
                            style={{ color: "#6B7FA8" }}
                          >
                            <span>Plafon: s/d {rec.plafonMax}</span>
                            <span>·</span>
                            <span>Bunga: {rec.bunga}</span>
                          </div>
                          <p
                            className="text-xs mb-3"
                            style={{ color: "#5A6A8A", lineHeight: 1.5 }}
                          >
                            ✓ {rec.highlight}
                          </p>
                          <a
                            href={rec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold rounded-xl px-3 py-1.5"
                            style={{
                              background: "rgba(13,27,62,0.06)",
                              color: "#0D1B3E",
                            }}
                          >
                            Cek KUR {rec.bank} →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lendana assisted card */}
                  <div
                    className="rounded-3xl p-5 mt-3"
                    style={{
                      background: "rgba(155,138,251,0.08)",
                      border: "1.5px solid rgba(155,138,251,0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: "1.1rem" }}>🤝</span>
                      <p
                        className="font-jakarta font-bold text-sm"
                        style={{ color: "#4B3FAF" }}
                      >
                        Butuh bantuan proses pengajuan?
                      </p>
                    </div>
                    <p className="text-xs mb-3" style={{ color: "#6B7FA8", lineHeight: 1.6 }}>
                      Lendana bisa bantu kamu apply ke bank tanpa ribet.
                      Plafon sesuai bank mitra · bunga 6% per tahun ·{" "}
                      <span style={{ fontWeight: 600, color: "#9B8AFB" }}>
                        Dibantu tim
                      </span>
                    </p>
                    <a
                      href="https://lendana.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold rounded-xl px-3 py-1.5"
                      style={{
                        background: "rgba(155,138,251,0.18)",
                        color: "#4B3FAF",
                      }}
                    >
                      Hubungi Lendana →
                    </a>
                  </div>
                </div>
              );
            })()}

            {/* Bank selector */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: "white",
                boxShadow: "0 2px 12px rgba(13,27,62,0.06)",
                border: "1px solid rgba(13,27,62,0.06)",
              }}
            >
              <p className="font-jakarta font-bold mb-4 text-sm" style={{ color: "#0D1B3E" }}>
                🏦 Pilih Bank untuk Pembayaran
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                {(["BCA", "BNI", "BRI", "MANDIRI"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className="rounded-xl py-3 text-sm font-bold transition-all"
                    style={{
                      background:
                        selectedBank === b ? "rgba(255,77,109,0.08)" : "rgba(13,27,62,0.04)",
                      border:
                        selectedBank === b ? "2px solid #FF4D6D" : "2px solid rgba(13,27,62,0.08)",
                      color: selectedBank === b ? "#FF4D6D" : "#3D4F7C",
                      cursor: "pointer",
                    }}
                  >
                    Bank {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust notice */}
            <div
              className="rounded-2xl px-4 py-3 mb-5 text-xs"
              style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}
            >
              <span style={{ color: "#028A66", fontWeight: 600 }}>
                ✅ Dokumen sesuai standar perbankan Indonesia · 🔒 Data terenkripsi ·
                📧 Dikirim ke {data.emailPembeli}
              </span>
            </div>

            <button
              className="btn-amber w-full py-4 text-base font-extrabold"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "⏳ Memproses..." : `🏦 Buat Semua Dokumen Sekarang — Rp ${new Intl.NumberFormat("id-ID").format(result.totalPrice)}`}
            </button>
          </div>
        )}

        {/* ── Navigation ────────────────────────────────────────────────────── */}
        {step < 3 && (
          <div className="flex gap-3 mt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={() => { setStep((s) => s - 1); setError(""); }}
                className="flex-1 rounded-2xl py-3.5 text-sm font-bold transition-all"
                style={{
                  background: "rgba(13,27,62,0.06)",
                  color: "#6B7FA8",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Kembali
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex-1 btn-primary py-3.5 text-sm font-extrabold"
            >
              {loading
                ? "⏳ Memproses..."
                : step === 2
                ? "🔍 Lihat Rekomendasi Dokumen →"
                : "Lanjut →"}
            </button>
          </div>
        )}

        {/* Preview while filling steps 0-2 */}
        {step < 3 && getRecommendedDocs(data).length > 0 && (
          <div
            className="mt-6 rounded-2xl p-4 text-center"
            style={{
              background: "rgba(255,209,102,0.08)",
              border: "1px solid rgba(255,209,102,0.2)",
            }}
          >
            <p className="text-xs font-semibold" style={{ color: "#9A7500" }}>
              💡 Preview (berdasarkan data sejauh ini):
              <strong> {getRecommendedDocs(data).length} dokumen</strong> ≈{" "}
              <strong>Rp {new Intl.NumberFormat("id-ID").format(previewPrice)}</strong>
              {previewSeparate > previewPrice && (
                <span style={{ color: "#06D6A0" }}>
                  {" "}(hemat Rp {new Intl.NumberFormat("id-ID").format(previewSeparate - previewPrice)})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
