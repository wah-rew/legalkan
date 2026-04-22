"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";

const STEPS = ["Pihak Pertama", "Pihak Kedua", "Detail NDA", "Review"];

const BADAN_HUKUM_OPTIONS = ["PT", "CV", "Firma", "Perorangan", "Lainnya"];

interface FormState {
  // Pihak Pertama
  namaPerusahaan1: string;
  bentukBadanHukum1: string;
  alamat1: string;
  npwp1: string;
  namaRepresentatif1: string;
  posisiRepresentatif1: string;
  // Pihak Kedua
  namaPerusahaan2: string;
  bentukBadanHukum2: string;
  alamat2: string;
  npwp2: string;
  namaRepresentatif2: string;
  posisiRepresentatif2: string;
  // Detail NDA
  tujuanKerjasama: string;
  tanggalEfektif: string;
  tanggalBerakhir: string;
  durasiKerahasiaan: string;
  penyelesaianSengketa: string;
  // Signature
  tanggalTtdPihak1: string;
  tanggalTtdPihak2: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp: string;
}

const init: FormState = {
  namaPerusahaan1: "",
  bentukBadanHukum1: "PT",
  alamat1: "",
  npwp1: "",
  namaRepresentatif1: "",
  posisiRepresentatif1: "",
  namaPerusahaan2: "",
  bentukBadanHukum2: "PT",
  alamat2: "",
  npwp2: "",
  namaRepresentatif2: "",
  posisiRepresentatif2: "",
  tujuanKerjasama: "",
  tanggalEfektif: "",
  tanggalBerakhir: "",
  durasiKerahasiaan: "2 (dua) tahun",
  penyelesaianSengketa: "BANI",
  tanggalTtdPihak1: "",
  tanggalTtdPihak2: "",
  emailPembeli: "",
  nomorWhatsapp: "",
};

export default function NDAPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(init);
  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = (): string => {
    if (step === 0) {
      if (!form.namaPerusahaan1.trim()) return "Nama perusahaan Pihak Pertama wajib diisi";
      if (!form.alamat1.trim()) return "Alamat Pihak Pertama wajib diisi";
      if (!form.npwp1.trim()) return "NPWP Pihak Pertama wajib diisi";
      if (!form.namaRepresentatif1.trim()) return "Nama representatif Pihak Pertama wajib diisi";
      if (!form.posisiRepresentatif1.trim()) return "Jabatan representatif Pihak Pertama wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.namaPerusahaan2.trim()) return "Nama perusahaan Pihak Kedua wajib diisi";
      if (!form.alamat2.trim()) return "Alamat Pihak Kedua wajib diisi";
      if (!form.npwp2.trim()) return "NPWP Pihak Kedua wajib diisi";
      if (!form.namaRepresentatif2.trim()) return "Nama representatif Pihak Kedua wajib diisi";
      if (!form.posisiRepresentatif2.trim()) return "Jabatan representatif Pihak Kedua wajib diisi";
    }
    if (step === 2) {
      if (!form.tujuanKerjasama.trim()) return "Tujuan kerjasama wajib diisi";
      if (!form.tanggalEfektif) return "Tanggal mulai berlaku wajib diisi";
      if (!form.tanggalBerakhir) return "Tanggal berakhir wajib diisi";
      if (form.tanggalEfektif >= form.tanggalBerakhir) return "Tanggal berakhir harus setelah tanggal mulai";
      if (!form.tanggalTtdPihak1) return "Tanggal tanda tangan Pihak Pertama wajib diisi";
      if (!form.tanggalTtdPihak2) return "Tanggal tanda tangan Pihak Kedua wajib diisi";
    }
    return "";
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate/nda", {
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

  const formatNPWP = (val: string) => {
    // Strip non-digits and format as XX.XXX.XXX.X-XXX.XXX
    const digits = val.replace(/\D/g, "").slice(0, 15);
    let out = digits;
    if (digits.length > 2) out = digits.slice(0, 2) + "." + digits.slice(2);
    if (digits.length > 5) out = out.slice(0, 6) + "." + digits.slice(5);
    if (digits.length > 8) out = out.slice(0, 10) + "." + digits.slice(8);
    if (digits.length > 9) out = out.slice(0, 12) + "-" + digits.slice(9);
    if (digits.length > 12) out = out.slice(0, 16) + "." + digits.slice(12);
    return out;
  };

  const PartyFields = ({
    prefix,
    label,
  }: {
    prefix: "1" | "2";
    label: string;
  }) => {
    const nKey = `namaPerusahaan${prefix}` as keyof FormState;
    const bKey = `bentukBadanHukum${prefix}` as keyof FormState;
    const aKey = `alamat${prefix}` as keyof FormState;
    const pKey = `npwp${prefix}` as keyof FormState;
    const rKey = `namaRepresentatif${prefix}` as keyof FormState;
    const jKey = `posisiRepresentatif${prefix}` as keyof FormState;

    return (
      <div className="space-y-4">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: prefix === "1" ? "#FF4D6D" : "#0D1B3E" }}
        >
          {label}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Bentuk Badan Hukum" required>
            <select
              className="form-input"
              value={form[bKey] as string}
              onChange={e => set(bKey, e.target.value)}
            >
              {BADAN_HUKUM_OPTIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </FormInput>
          <FormInput label="Nama Perusahaan" required>
            <input
              className="form-input"
              placeholder="Nama perusahaan tanpa bentuk badan hukum"
              value={form[nKey] as string}
              onChange={e => set(nKey, e.target.value)}
            />
          </FormInput>
        </div>

        <FormInput label="Alamat Lengkap" required>
          <textarea
            className="form-input"
            rows={2}
            placeholder="Alamat kantor terdaftar"
            value={form[aKey] as string}
            onChange={e => set(aKey, e.target.value)}
          />
        </FormInput>

        <FormInput label="NPWP" required hint="Format: XX.XXX.XXX.X-XXX.XXX">
          <input
            className="form-input"
            placeholder="00.000.000.0-000.000"
            value={form[pKey] as string}
            onChange={e => set(pKey, formatNPWP(e.target.value))}
          />
        </FormInput>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Nama Penandatangan / Representatif" required>
            <input
              className="form-input"
              placeholder="Nama lengkap"
              value={form[rKey] as string}
              onChange={e => set(rKey, e.target.value)}
            />
          </FormInput>
          <FormInput label="Jabatan" required>
            <input
              className="form-input"
              placeholder="Contoh: Direktur Utama"
              value={form[jKey] as string}
              onChange={e => set(jKey, e.target.value)}
            />
          </FormInput>
        </div>
      </div>
    );
  };

  return (
    <ContractForm
      title="NDA / Perjanjian Kerahasiaan"
      subtitle="Bilateral NDA antar perusahaan — sesuai hukum Indonesia"
      steps={STEPS}
      currentStep={step}
      loading={loading}
      error={error}
      onNext={next}
      onBack={() => { setError(""); setStep(s => s - 1); }}
      onSubmit={submit}
      contractTypeLabel="🤝 NDA Bilateral B2B"
    >
      {/* ── Step 0: Pihak Pertama ── */}
      {step === 0 && (
        <div className="space-y-4">
          <PartyFields prefix="1" label="Data Pihak Pertama (Perusahaan Anda)" />
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Penerima Dokumen" required>
            <input
              className="form-input"
              type="email"
              placeholder="email@perusahaan.com"
              value={form.emailPembeli}
              onChange={e => set("emailPembeli", e.target.value)}
            />
          </FormInput>
          <FormInput label="WhatsApp" hint="opsional">
            <input
              className="form-input"
              placeholder="08xxx"
              value={form.nomorWhatsapp}
              onChange={e => set("nomorWhatsapp", e.target.value)}
            />
          </FormInput>
        </div>
      )}

      {/* ── Step 1: Pihak Kedua ── */}
      {step === 1 && (
        <div className="space-y-4">
          <PartyFields prefix="2" label="Data Pihak Kedua (Perusahaan Rekan)" />
        </div>
      )}

      {/* ── Step 2: Detail NDA ── */}
      {step === 2 && (
        <div className="space-y-4">
          <FormInput
            label="Tujuan Kerjasama / Diskusi"
            required
            hint="Contoh: evaluasi potensi kerjasama distribusi produk FMCG"
          >
            <textarea
              className="form-input"
              rows={3}
              placeholder="Untuk keperluan apa NDA ini dibuat? Jelaskan secara singkat dan jelas."
              value={form.tujuanKerjasama}
              onChange={e => set("tujuanKerjasama", e.target.value)}
            />
          </FormInput>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Mulai Berlaku" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalEfektif}
                onChange={e => set("tanggalEfektif", e.target.value)}
              />
            </FormInput>
            <FormInput label="Tanggal Berakhir" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalBerakhir}
                onChange={e => set("tanggalBerakhir", e.target.value)}
              />
            </FormInput>
          </div>

          <FormInput
            label="Durasi Kewajiban Kerahasiaan Setelah Berakhir"
            hint="Kewajiban merahasiakan tetap berlaku setelah NDA berakhir"
          >
            <select
              className="form-input"
              value={form.durasiKerahasiaan}
              onChange={e => set("durasiKerahasiaan", e.target.value)}
            >
              <option value="1 (satu) tahun">1 Tahun</option>
              <option value="2 (dua) tahun">2 Tahun (direkomendasikan)</option>
              <option value="3 (tiga) tahun">3 Tahun</option>
            </select>
          </FormInput>

          <FormInput label="Mekanisme Penyelesaian Sengketa">
            <select
              className="form-input"
              value={form.penyelesaianSengketa}
              onChange={e => set("penyelesaianSengketa", e.target.value)}
            >
              <option value="BANI">BANI (Arbitrase — direkomendasikan untuk B2B)</option>
              <option value="PN Jakarta Selatan">Pengadilan Negeri Jakarta Selatan</option>
              <option value="PN domisili Pihak Pertama">Pengadilan Negeri domisili Pihak Pertama</option>
            </select>
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>
            Tanggal Penandatanganan
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tgl TTD Pihak Pertama" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalTtdPihak1}
                onChange={e => set("tanggalTtdPihak1", e.target.value)}
              />
            </FormInput>
            <FormInput label="Tgl TTD Pihak Kedua" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalTtdPihak2}
                onChange={e => set("tanggalTtdPihak2", e.target.value)}
              />
            </FormInput>
          </div>
        </div>
      )}

      {/* ── Step 3: Review ── */}
      {step === 3 && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#FF4D6D" }}>
            Pihak Pertama
          </p>
          <ReviewRow label="Perusahaan" value={`${form.bentukBadanHukum1} ${form.namaPerusahaan1}`} />
          <ReviewRow label="NPWP" value={form.npwp1} />
          <ReviewRow label="Representatif" value={`${form.namaRepresentatif1} (${form.posisiRepresentatif1})`} />

          <p className="text-xs font-bold uppercase tracking-wider mt-4 mb-3" style={{ color: "#0D1B3E" }}>
            Pihak Kedua
          </p>
          <ReviewRow label="Perusahaan" value={`${form.bentukBadanHukum2} ${form.namaPerusahaan2}`} />
          <ReviewRow label="NPWP" value={form.npwp2} />
          <ReviewRow label="Representatif" value={`${form.namaRepresentatif2} (${form.posisiRepresentatif2})`} />

          <p className="text-xs font-bold uppercase tracking-wider mt-4 mb-3" style={{ color: "#06D6A0" }}>
            Detail NDA
          </p>
          <ReviewRow label="Tujuan" value={form.tujuanKerjasama} />
          <ReviewRow label="Berlaku" value={`${form.tanggalEfektif} s/d ${form.tanggalBerakhir}`} />
          <ReviewRow label="Durasi Kerahasiaan" value={`${form.durasiKerahasiaan} setelah berakhir`} />
          <ReviewRow label="Sengketa" value={form.penyelesaianSengketa} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />

          <PriceBox price={CONTRACT_PRICES["nda"]} />
        </div>
      )}
    </ContractForm>
  );
}
