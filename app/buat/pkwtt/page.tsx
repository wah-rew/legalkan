"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";
import CitySearch from "@/components/CitySearch";

const STEPS = ["Data Perusahaan", "Data Karyawan", "Pekerjaan & Kompensasi", "Review & Finalisasi"];

interface FormState {
  // Step 1: Perusahaan
  namaPerusahaan: string;
  bidangUsaha: string;
  alamatPerusahaan: string;
  namaRepresentatif: string;
  jabatanRepresentatif: string;

  // Step 2: Karyawan
  namaKaryawan: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  nikKTP: string;
  alamatKaryawan: string;
  pendidikanTerakhir: string;
  nomorTelepon: string;

  // Step 3: Pekerjaan & Kompensasi
  namaJabatan: string;
  divisi: string;
  lokasiKerja: string;
  tanggalMulaiKerja: string;
  polakKerja: string;
  jadwalKerja: string;
  upahPokok: number;
  tunjanganTetap: number;
  tanggalPembayaran: string;
  durasiNonCompete: string;

  // Step 4: Finalisasi
  kota: string;
  tanggalPerjanjian: string;
  saksi1Nama: string;
  saksi2Nama: string;

  // Kontak
  emailPembeli: string;
  nomorWhatsapp: string;
}

const init: FormState = {
  namaPerusahaan: "",
  bidangUsaha: "",
  alamatPerusahaan: "",
  namaRepresentatif: "",
  jabatanRepresentatif: "Direktur",

  namaKaryawan: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "Laki-laki",
  nikKTP: "",
  alamatKaryawan: "",
  pendidikanTerakhir: "S1",
  nomorTelepon: "",

  namaJabatan: "",
  divisi: "",
  lokasiKerja: "",
  tanggalMulaiKerja: "",
  polakKerja: "5 hari",
  jadwalKerja: "Senin s.d. Jumat, 08.00–17.00 WIB",
  upahPokok: 0,
  tunjanganTetap: 0,
  tanggalPembayaran: "25",
  durasiNonCompete: "6",

  kota: "",
  tanggalPerjanjian: "",
  saksi1Nama: "",
  saksi2Nama: "",

  emailPembeli: "",
  nomorWhatsapp: "",
};

export default function PKWTTPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(init);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        const contractType = parsed?.contractData?.contractType || parsed?.contractType;
        if (contractType === "pkwtt") {
          const saved = parsed?.formData || parsed?.contractData;
          if (saved) setForm((prev) => ({ ...prev, ...saved }));
        }
      }
    } catch {}
  }, []);

  const set = (k: keyof FormState, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): string => {
    if (step === 0) {
      if (!form.namaPerusahaan.trim()) return "Nama perusahaan wajib diisi";
      if (!form.bidangUsaha.trim()) return "Bidang usaha wajib diisi";
      if (!form.alamatPerusahaan.trim()) return "Alamat perusahaan wajib diisi";
      if (!form.namaRepresentatif.trim()) return "Nama representatif wajib diisi";
    }
    if (step === 1) {
      if (!form.namaKaryawan.trim()) return "Nama karyawan wajib diisi";
      if (!form.tempatLahir.trim()) return "Tempat lahir wajib diisi";
      if (!form.tanggalLahir) return "Tanggal lahir wajib diisi";
      if (!form.nikKTP.trim() || form.nikKTP.length !== 16) return "NIK KTP harus 16 digit";
      if (!form.alamatKaryawan.trim()) return "Alamat karyawan wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 2) {
      if (!form.namaJabatan.trim()) return "Nama jabatan wajib diisi";
      if (!form.divisi.trim()) return "Divisi/departemen wajib diisi";
      if (!form.lokasiKerja.trim()) return "Lokasi kerja wajib diisi";
      if (!form.tanggalMulaiKerja) return "Tanggal mulai kerja wajib diisi";
      if (!form.jadwalKerja.trim()) return "Jadwal kerja wajib diisi";
      if (!form.upahPokok || form.upahPokok < 100000) return "Upah pokok minimal Rp 100.000";
      if (!form.tanggalPembayaran.trim()) return "Tanggal pembayaran gaji wajib diisi";
    }
    if (step === 3) {
      if (!form.kota.trim()) return "Kota pembuatan wajib diisi";
      if (!form.tanggalPerjanjian) return "Tanggal perjanjian wajib diisi";
    }
    return "";
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate/pkwtt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat PKWTT");
      sessionStorage.setItem("kontrak_contract", JSON.stringify({ ...data, formData: form }));
      router.push("/preview");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContractForm
      title="Kontrak Karyawan Tetap (PKWTT)"
      subtitle="Perjanjian kerja permanen sesuai UU Ketenagakerjaan & PP 35/2021"
      steps={STEPS}
      currentStep={step}
      loading={loading}
      error={error}
      onNext={next}
      onBack={() => { setError(""); setStep((s) => s - 1); }}
      onSubmit={submit}
      contractTypeLabel="👔 PKWTT — Karyawan Tetap"
    >
      {/* ─── Step 1: Data Perusahaan ─── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
            Data Perusahaan &amp; Representatif
          </p>
          <FormInput label="Nama Perusahaan" required>
            <input
              className="form-input"
              placeholder="Contoh: PT Maju Bersama Indonesia"
              value={form.namaPerusahaan}
              onChange={(e) => set("namaPerusahaan", e.target.value)}
            />
          </FormInput>
          <FormInput label="Bidang Usaha" required>
            <input
              className="form-input"
              placeholder="Contoh: Teknologi Informasi, Perdagangan, Manufaktur"
              value={form.bidangUsaha}
              onChange={(e) => set("bidangUsaha", e.target.value)}
            />
          </FormInput>
          <FormInput label="Alamat Perusahaan" required>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Alamat lengkap kantor/perusahaan"
              value={form.alamatPerusahaan}
              onChange={(e) => set("alamatPerusahaan", e.target.value)}
            />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Representatif" required hint="yang menandatangani">
              <input
                className="form-input"
                placeholder="Nama lengkap penandatangan"
                value={form.namaRepresentatif}
                onChange={(e) => set("namaRepresentatif", e.target.value)}
              />
            </FormInput>
            <FormInput label="Jabatan Representatif" required>
              <select
                className="form-input"
                value={form.jabatanRepresentatif}
                onChange={(e) => set("jabatanRepresentatif", e.target.value)}
              >
                <option value="Direktur">Direktur</option>
                <option value="Direktur Utama">Direktur Utama</option>
                <option value="HRD Manager">HRD Manager</option>
                <option value="Pimpinan">Pimpinan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </FormInput>
          </div>
          {form.jabatanRepresentatif === "Lainnya" && (
            <FormInput label="Jabatan (isi manual)" required>
              <input
                className="form-input"
                placeholder="Contoh: General Manager"
                onChange={(e) => set("jabatanRepresentatif", e.target.value)}
              />
            </FormInput>
          )}
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>
            Kontak Penerima Dokumen
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Email Penerima Dokumen" required>
              <input
                className="form-input"
                type="email"
                placeholder="email@contoh.com"
                value={form.emailPembeli}
                onChange={(e) => set("emailPembeli", e.target.value)}
              />
            </FormInput>
            <FormInput label="Nomor Telepon" hint="opsional">
              <input
                className="form-input"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={form.nomorWhatsapp}
                onChange={(e) => set("nomorWhatsapp", e.target.value)}
              />
            </FormInput>
          </div>
        </div>
      )}

      {/* ─── Step 2: Data Karyawan ─── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
            Data Pribadi Karyawan
          </p>
          <FormInput label="Nama Lengkap Karyawan" required hint="sesuai KTP">
            <input
              className="form-input"
              placeholder="Nama lengkap sesuai KTP"
              value={form.namaKaryawan}
              onChange={(e) => set("namaKaryawan", e.target.value)}
            />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tempat Lahir" required>
              <input
                className="form-input"
                placeholder="Contoh: Jakarta"
                value={form.tempatLahir}
                onChange={(e) => set("tempatLahir", e.target.value)}
              />
            </FormInput>
            <FormInput label="Tanggal Lahir" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalLahir}
                onChange={(e) => set("tanggalLahir", e.target.value)}
              />
            </FormInput>
          </div>
          <FormInput label="Jenis Kelamin" required>
            <div className="flex gap-6 mt-1">
              {["Laki-laki", "Perempuan"].map((jk) => (
                <label key={jk} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={jk}
                    checked={form.jenisKelamin === jk}
                    onChange={() => set("jenisKelamin", jk)}
                  />
                  {jk}
                </label>
              ))}
            </div>
          </FormInput>
          <FormInput label="NIK KTP" required hint="16 digit">
            <input
              className="form-input"
              placeholder="1234567890123456"
              maxLength={16}
              value={form.nikKTP}
              onChange={(e) => set("nikKTP", e.target.value.replace(/\D/g, ""))}
            />
          </FormInput>
          <FormInput label="Alamat Sesuai KTP" required>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Alamat lengkap sesuai KTP"
              value={form.alamatKaryawan}
              onChange={(e) => set("alamatKaryawan", e.target.value)}
            />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Pendidikan Terakhir" required>
              <select
                className="form-input"
                value={form.pendidikanTerakhir}
                onChange={(e) => set("pendidikanTerakhir", e.target.value)}
              >
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </FormInput>
            <FormInput label="Nomor Telepon" hint="opsional">
              <input
                className="form-input"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={form.nomorTelepon}
                onChange={(e) => set("nomorTelepon", e.target.value)}
              />
            </FormInput>
          </div>
        </div>
      )}

      {/* ─── Step 3: Pekerjaan & Kompensasi ─── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
            Detail Jabatan
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Jabatan" required>
              <input
                className="form-input"
                placeholder="Contoh: Software Engineer"
                value={form.namaJabatan}
                onChange={(e) => set("namaJabatan", e.target.value)}
              />
            </FormInput>
            <FormInput label="Divisi / Departemen" required>
              <input
                className="form-input"
                placeholder="Contoh: Engineering, Marketing"
                value={form.divisi}
                onChange={(e) => set("divisi", e.target.value)}
              />
            </FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Lokasi Kerja" required>
              <CitySearch
                value={form.lokasiKerja}
                onChange={(val) => set("lokasiKerja", val)}
                placeholder="Cari kota atau kabupaten..."
              />
            </FormInput>
            <FormInput label="Tanggal Mulai Kerja" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalMulaiKerja}
                onChange={(e) => set("tanggalMulaiKerja", e.target.value)}
              />
            </FormInput>
          </div>
          <FormInput label="Pola Kerja" required>
            <div className="flex gap-6 mt-1">
              {["5 hari", "6 hari"].map((pola) => (
                <label key={pola} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="polakKerja"
                    value={pola}
                    checked={form.polakKerja === pola}
                    onChange={() => {
                      set("polakKerja", pola);
                      set(
                        "jadwalKerja",
                        pola === "5 hari"
                          ? "Senin s.d. Jumat, 08.00–17.00 WIB"
                          : "Senin s.d. Sabtu, 08.00–16.00 WIB"
                      );
                    }}
                  />
                  {pola} kerja per minggu
                </label>
              ))}
            </div>
          </FormInput>
          <FormInput label="Jadwal Kerja" required hint="contoh: Senin-Jumat, 08.00-17.00 WIB">
            <input
              className="form-input"
              placeholder="Senin s.d. Jumat, 08.00–17.00 WIB"
              value={form.jadwalKerja}
              onChange={(e) => set("jadwalKerja", e.target.value)}
            />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
            Kompensasi
          </p>
          <RpInput
            label="Upah Pokok"
            required
            value={form.upahPokok}
            onChange={(v) => set("upahPokok", v)}
          />
          <RpInput
            label="Tunjangan Tetap"
            hint="opsional — transportasi, makan, dll. yang bersifat tetap"
            value={form.tunjanganTetap}
            onChange={(v) => set("tunjanganTetap", v)}
          />
          <FormInput label="Tanggal Pembayaran Gaji" required hint="tanggal setiap bulan (1–31)">
            <input
              className="form-input"
              type="number"
              min="1"
              max="31"
              placeholder="25"
              value={form.tanggalPembayaran}
              onChange={(e) => set("tanggalPembayaran", e.target.value)}
            />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
            Non-Compete
          </p>
          <FormInput label="Durasi Non-Compete Setelah Keluar" required>
            <select
              className="form-input"
              value={form.durasiNonCompete}
              onChange={(e) => set("durasiNonCompete", e.target.value)}
            >
              <option value="3">3 bulan</option>
              <option value="6">6 bulan</option>
              <option value="12">12 bulan</option>
            </select>
          </FormInput>
        </div>
      )}

      {/* ─── Step 4: Review & Finalisasi ─── */}
      {step === 3 && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#F59E0B" }}>
            Ringkasan Data
          </p>
          <ReviewRow label="Perusahaan" value={form.namaPerusahaan} />
          <ReviewRow label="Bidang Usaha" value={form.bidangUsaha} />
          <ReviewRow label="Representatif" value={`${form.namaRepresentatif} (${form.jabatanRepresentatif})`} />
          <ReviewRow label="Karyawan" value={form.namaKaryawan} />
          <ReviewRow label="Jenis Kelamin" value={form.jenisKelamin} />
          <ReviewRow label="NIK KTP" value={form.nikKTP} />
          <ReviewRow label="Pendidikan" value={form.pendidikanTerakhir} />
          <ReviewRow label="Jabatan" value={`${form.namaJabatan} — ${form.divisi}`} />
          <ReviewRow label="Lokasi Kerja" value={form.lokasiKerja} />
          <ReviewRow label="Mulai Kerja" value={form.tanggalMulaiKerja} />
          <ReviewRow label="Pola Kerja" value={`${form.polakKerja} kerja/minggu`} />
          <ReviewRow
            label="Total Upah"
            value={`Rp ${new Intl.NumberFormat("id-ID").format(form.upahPokok + (form.tunjanganTetap || 0))}/bln`}
          />
          <ReviewRow label="Non-Compete" value={`${form.durasiNonCompete} bulan`} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />

          <hr style={{ borderColor: "rgba(13,27,62,0.08)", margin: "12px 0" }} />
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#F59E0B" }}>
            Finalisasi Perjanjian
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Kota Pembuatan" required>
              <CitySearch
                value={form.kota}
                onChange={(val) => set("kota", val)}
                placeholder="Kota tempat TTD..."
              />
            </FormInput>
            <FormInput label="Tanggal Perjanjian" required>
              <input
                className="form-input"
                type="date"
                value={form.tanggalPerjanjian}
                onChange={(e) => set("tanggalPerjanjian", e.target.value)}
              />
            </FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Saksi 1 (nama)" hint="opsional">
              <input
                className="form-input"
                placeholder="Nama saksi pertama"
                value={form.saksi1Nama}
                onChange={(e) => set("saksi1Nama", e.target.value)}
              />
            </FormInput>
            <FormInput label="Saksi 2 (nama)" hint="opsional">
              <input
                className="form-input"
                placeholder="Nama saksi kedua"
                value={form.saksi2Nama}
                onChange={(e) => set("saksi2Nama", e.target.value)}
              />
            </FormInput>
          </div>
          <PriceBox price={CONTRACT_PRICES["pkwtt"]} />
        </div>
      )}
    </ContractForm>
  );
}
