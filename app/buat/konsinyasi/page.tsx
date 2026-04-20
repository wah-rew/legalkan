"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";

const STEPS = ["Para Pihak", "Detail Produk", "Komisi & Periode", "Review"];

interface FormState {
  nama_konsinyor: string; nik_konsinyor: string; alamat_konsinyor: string; nomor_telepon_konsinyor: string;
  nama_bank_konsinyor: string; nomor_rekening_konsinyor: string;
  nama_konsinyee: string; nik_konsinyee: string; alamat_toko_konsinyee: string; nomor_telepon_konsinyee: string;
  nama_produk: string; deskripsi_produk: string; jumlah_unit_awal: string;
  harga_pokok: number; harga_jual_ditetapkan: number; boleh_diskon: boolean; diskon_maks: string;
  jenis_komisi: string; persentase_komisi: string; komisi_flat: number;
  tanggal_mulai: string; tanggal_berakhir: string; periode_laporan: string; tanggal_setor_hasil: string;
  kota_penandatanganan: string; tanggal_penandatanganan: string;
  emailPembeli: string; nomorWhatsapp: string;
}

const init: FormState = {
  nama_konsinyor: "", nik_konsinyor: "", alamat_konsinyor: "", nomor_telepon_konsinyor: "",
  nama_bank_konsinyor: "BCA", nomor_rekening_konsinyor: "",
  nama_konsinyee: "", nik_konsinyee: "", alamat_toko_konsinyee: "", nomor_telepon_konsinyee: "",
  nama_produk: "", deskripsi_produk: "", jumlah_unit_awal: "10",
  harga_pokok: 0, harga_jual_ditetapkan: 0, boleh_diskon: false, diskon_maks: "10",
  jenis_komisi: "persentase", persentase_komisi: "20", komisi_flat: 0,
  tanggal_mulai: "", tanggal_berakhir: "", periode_laporan: "bulanan", tanggal_setor_hasil: "",
  kota_penandatanganan: "", tanggal_penandatanganan: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function KonsinyasiPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(init);
  const set = (k: keyof FormState, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (step === 0) {
      if (!form.nama_konsinyor.trim()) return "Nama Konsinyor wajib diisi";
      if (!form.nama_konsinyee.trim()) return "Nama Konsinyee wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.nama_produk.trim()) return "Nama produk wajib diisi";
      if (!form.harga_pokok || form.harga_pokok < 100) return "Harga pokok wajib diisi";
      if (!form.harga_jual_ditetapkan || form.harga_jual_ditetapkan < 100) return "Harga jual wajib diisi";
    }
    if (step === 2) {
      if (!form.tanggal_mulai) return "Tanggal mulai wajib diisi";
      if (!form.tanggal_berakhir) return "Tanggal berakhir wajib diisi";
      if (!form.tanggal_setor_hasil) return "Tanggal setor hasil wajib diisi";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
    }
    return "";
  };

  const next = () => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(s => s + 1); };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/generate/konsinyasi", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jumlah_unit_awal: parseInt(form.jumlah_unit_awal) || 10, persentase_komisi: parseFloat(form.persentase_komisi) || 20, diskon_maks: parseInt(form.diskon_maks) || 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify(data));
      router.push("/preview");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  };

  return (
    <ContractForm title="Perjanjian Titip Jual (Konsinyasi)" subtitle="Atur hak & kewajiban antara pemilik produk dan penjual" steps={STEPS} currentStep={step} loading={loading} error={error} onNext={next} onBack={() => { setError(""); setStep(s => s - 1); }} onSubmit={submit} contractTypeLabel="🤝 Konsinyasi">
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Konsinyor (Pemilik Produk)</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_konsinyor} onChange={e => set("nama_konsinyor", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_konsinyor} onChange={e => set("nik_konsinyor", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" value={form.nomor_telepon_konsinyor} onChange={e => set("nomor_telepon_konsinyor", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_konsinyor} onChange={e => set("alamat_konsinyor", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Bank"><select className="form-input" value={form.nama_bank_konsinyor} onChange={e => set("nama_bank_konsinyor", e.target.value)}>{["BCA","BNI","BRI","Mandiri","BSI"].map(b => <option key={b}>{b}</option>)}</select></FormInput>
            <FormInput label="No. Rekening"><input className="form-input" value={form.nomor_rekening_konsinyor} onChange={e => set("nomor_rekening_konsinyor", e.target.value)} /></FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Konsinyee (Penjual / Toko)</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_konsinyee} onChange={e => set("nama_konsinyee", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_konsinyee} onChange={e => set("nik_konsinyee", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" value={form.nomor_telepon_konsinyee} onChange={e => set("nomor_telepon_konsinyee", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat Toko" required><textarea className="form-input" rows={2} value={form.alamat_toko_konsinyee} onChange={e => set("alamat_toko_konsinyee", e.target.value)} /></FormInput>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Dokumen" required><input className="form-input" type="email" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Nama Produk" required><input className="form-input" placeholder="Contoh: Keripik Singkong Original" value={form.nama_produk} onChange={e => set("nama_produk", e.target.value)} /></FormInput>
          <FormInput label="Deskripsi Produk"><textarea className="form-input" rows={2} value={form.deskripsi_produk} onChange={e => set("deskripsi_produk", e.target.value)} /></FormInput>
          <FormInput label="Jumlah Unit Awal" required><input className="form-input" type="number" min="1" value={form.jumlah_unit_awal} onChange={e => set("jumlah_unit_awal", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <RpInput label="Harga Pokok / Unit" required value={form.harga_pokok} onChange={v => set("harga_pokok", v)} />
            <RpInput label="Harga Jual Ditetapkan / Unit" required value={form.harga_jual_ditetapkan} onChange={v => set("harga_jual_ditetapkan", v)} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="boleh_diskon" checked={form.boleh_diskon} onChange={e => set("boleh_diskon", e.target.checked)} />
            <label htmlFor="boleh_diskon" className="text-sm cursor-pointer">Konsinyee boleh memberi diskon</label>
          </div>
          {form.boleh_diskon && (
            <FormInput label="Diskon Maksimal (%)" hint="0-50">
              <input className="form-input" type="number" min="0" max="50" value={form.diskon_maks} onChange={e => set("diskon_maks", e.target.value)} />
            </FormInput>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <FormInput label="Jenis Komisi">
            <select className="form-input" value={form.jenis_komisi} onChange={e => set("jenis_komisi", e.target.value)}>
              <option value="persentase">Persentase dari harga jual</option>
              <option value="flat">Flat per unit terjual</option>
              <option value="selisih">Selisih harga jual - harga pokok</option>
            </select>
          </FormInput>
          {form.jenis_komisi === "persentase" && (
            <FormInput label="Komisi (%)"><input className="form-input" type="number" min="1" max="99" value={form.persentase_komisi} onChange={e => set("persentase_komisi", e.target.value)} /></FormInput>
          )}
          {form.jenis_komisi === "flat" && (
            <RpInput label="Komisi Flat / Unit" value={form.komisi_flat} onChange={v => set("komisi_flat", v)} />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Mulai" required><input className="form-input" type="date" value={form.tanggal_mulai} onChange={e => set("tanggal_mulai", e.target.value)} /></FormInput>
            <FormInput label="Tanggal Berakhir" required><input className="form-input" type="date" value={form.tanggal_berakhir} onChange={e => set("tanggal_berakhir", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Periode Laporan Penjualan">
            <select className="form-input" value={form.periode_laporan} onChange={e => set("periode_laporan", e.target.value)}>
              <option value="mingguan">Setiap Minggu</option>
              <option value="dua_mingguan">Setiap 2 Minggu</option>
              <option value="bulanan">Setiap Bulan</option>
            </select>
          </FormInput>
          <FormInput label="Tanggal Setor Hasil Pertama" required>
            <input className="form-input" type="date" value={form.tanggal_setor_hasil} onChange={e => set("tanggal_setor_hasil", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Kota Penandatanganan" required><input className="form-input" placeholder="Jakarta" value={form.kota_penandatanganan} onChange={e => set("kota_penandatanganan", e.target.value)} /></FormInput>
            <FormInput label="Tanggal TTD" required><input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} /></FormInput>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-1">
          <ReviewRow label="Konsinyor" value={form.nama_konsinyor} />
          <ReviewRow label="Konsinyee" value={form.nama_konsinyee} />
          <ReviewRow label="Produk" value={form.nama_produk} />
          <ReviewRow label="Jumlah Unit" value={form.jumlah_unit_awal} />
          <ReviewRow label="Harga Jual" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.harga_jual_ditetapkan)}`} />
          <ReviewRow label="Komisi" value={form.jenis_komisi === "persentase" ? `${form.persentase_komisi}%` : form.jenis_komisi} />
          <ReviewRow label="Periode" value={`${form.tanggal_mulai} – ${form.tanggal_berakhir}`} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['konsinyasi']} />
        </div>
      )}
    </ContractForm>
  );
}
