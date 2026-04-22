"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";

const STEPS = ["Para Pihak", "Detail Kendaraan", "Sewa & Ketentuan", "Review"];

interface FormState {
  nama_pemilik_kendaraan: string; nik_pemilik: string; alamat_pemilik: string;
  nomor_telepon_pemilik: string; nomor_rekening_pemilik: string; nama_bank_pemilik: string;
  nama_penyewa: string; nik_penyewa: string; alamat_penyewa: string;
  nomor_telepon_penyewa: string; nomor_sim: string; jenis_sim: string;
  jenis_kendaraan: string; merek_kendaraan: string; model_kendaraan: string;
  tahun_kendaraan: string; warna_kendaraan: string; nomor_polisi: string;
  nomor_rangka: string; nomor_mesin: string; kondisi_awal_kendaraan: string; km_awal: string;
  tanggal_mulai_sewa: string; tanggal_selesai_sewa: string;
  jamPenyerahan: string; jamPengembalian: string;
  harga_sewa_per_hari: number; total_harga_sewa: number;
  batas_km_per_hari: string; biaya_km_lebih: number;
  dendaKeterlambatan: number;
  jumlah_deposit: number; kapan_deposit_dikembalikan: string;
  skema_pembayaran: string; area_penggunaan: string;
  saksi_1_nama: string; saksi1Alamat: string;
  saksi_2_nama: string; saksi2Alamat: string;
  kota_penandatanganan: string; lokasiPembuatan: string; tanggal_penandatanganan: string;
  emailPembeli: string; nomorWhatsapp: string;
}

const init: FormState = {
  nama_pemilik_kendaraan: "", nik_pemilik: "", alamat_pemilik: "", nomor_telepon_pemilik: "", nomor_rekening_pemilik: "", nama_bank_pemilik: "BCA",
  nama_penyewa: "", nik_penyewa: "", alamat_penyewa: "", nomor_telepon_penyewa: "", nomor_sim: "", jenis_sim: "C",
  jenis_kendaraan: "motor", merek_kendaraan: "", model_kendaraan: "", tahun_kendaraan: "", warna_kendaraan: "", nomor_polisi: "", nomor_rangka: "", nomor_mesin: "", kondisi_awal_kendaraan: "Baik, tidak ada kerusakan berarti", km_awal: "0",
  tanggal_mulai_sewa: "", tanggal_selesai_sewa: "",
  jamPenyerahan: "08:00", jamPengembalian: "18:00",
  harga_sewa_per_hari: 0, total_harga_sewa: 0, batas_km_per_hari: "0", biaya_km_lebih: 0,
  dendaKeterlambatan: 200000,
  jumlah_deposit: 0, kapan_deposit_dikembalikan: "7 hari kerja setelah kendaraan dikembalikan",
  skema_pembayaran: "lunas_di_muka", area_penggunaan: "dalam_kota",
  saksi_1_nama: "", saksi1Alamat: "",
  saksi_2_nama: "", saksi2Alamat: "",
  kota_penandatanganan: "", lokasiPembuatan: "", tanggal_penandatanganan: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function SewaKendaraanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        const contractType = parsed?.contractData?.contractType || parsed?.contractType;
        if (contractType === "sewa-kendaraan") {
          const saved = parsed?.formData || parsed?.contractData;
          if (saved) setForm((prev) => ({ ...prev, ...saved }));
        }
      }
    } catch {}
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(init);
  const set = (k: keyof FormState, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (step === 0) {
      if (!form.nama_pemilik_kendaraan.trim()) return "Nama pemilik kendaraan wajib diisi";
      if (!form.nama_penyewa.trim()) return "Nama penyewa wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.merek_kendaraan.trim()) return "Merek kendaraan wajib diisi";
      if (!form.nomor_polisi.trim()) return "Nomor polisi wajib diisi";
    }
    if (step === 2) {
      if (!form.tanggal_mulai_sewa) return "Tanggal mulai sewa wajib diisi";
      if (!form.tanggal_selesai_sewa) return "Tanggal selesai sewa wajib diisi";
      if (!form.total_harga_sewa || form.total_harga_sewa < 1000) return "Total harga sewa wajib diisi";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
    }
    return "";
  };

  const next = () => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(s => s + 1); };

  // Convert HH:MM → HH.MM WIB for contract template
  const toWIB = (t: string) => t ? t.replace(":", ".") + " WIB" : undefined;

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const payload = {
        ...form,
        tahun_kendaraan: parseInt(form.tahun_kendaraan) || 2020,
        km_awal: parseInt(form.km_awal) || 0,
        batas_km_per_hari: parseInt(form.batas_km_per_hari) || 0,
        jamPenyerahan: toWIB(form.jamPenyerahan),
        jamPengembalian: toWIB(form.jamPengembalian),
        dendaKeterlambatan: String(form.dendaKeterlambatan || 200000),
        lokasiPembuatan: form.lokasiPembuatan || form.kota_penandatanganan,
      };
      const res = await fetch("/api/generate/sewa-kendaraan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify({ ...data, formData: form }));
      router.push("/preview");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  };

  return (
    <ContractForm title="Perjanjian Sewa Kendaraan" subtitle="Lindungi kendaraanmu dengan kontrak yang jelas" steps={STEPS} currentStep={step} loading={loading} error={error} onNext={next} onBack={() => { setError(""); setStep(s => s - 1); }} onSubmit={submit} contractTypeLabel="🚗 Sewa Kendaraan">
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Pemilik Kendaraan</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_pemilik_kendaraan} onChange={e => set("nama_pemilik_kendaraan", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_pemilik} onChange={e => set("nik_pemilik", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" type="tel" value={form.nomor_telepon_pemilik} onChange={e => set("nomor_telepon_pemilik", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_pemilik} onChange={e => set("alamat_pemilik", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Bank"><select className="form-input" value={form.nama_bank_pemilik} onChange={e => set("nama_bank_pemilik", e.target.value)}>{["BCA","BNI","BRI","Mandiri","BSI"].map(b => <option key={b}>{b}</option>)}</select></FormInput>
            <FormInput label="No. Rekening"><input className="form-input" value={form.nomor_rekening_pemilik} onChange={e => set("nomor_rekening_pemilik", e.target.value)} /></FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Penyewa</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_penyewa} onChange={e => set("nama_penyewa", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_penyewa} onChange={e => set("nik_penyewa", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" type="tel" value={form.nomor_telepon_penyewa} onChange={e => set("nomor_telepon_penyewa", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_penyewa} onChange={e => set("alamat_penyewa", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="No. SIM" required><input className="form-input" value={form.nomor_sim} onChange={e => set("nomor_sim", e.target.value)} /></FormInput>
            <FormInput label="Jenis SIM">
              <select className="form-input" value={form.jenis_sim} onChange={e => set("jenis_sim", e.target.value)}>
                {["A","B1","B2","C","D"].map(s => <option key={s}>{s}</option>)}
              </select>
            </FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Dokumen" required><input className="form-input" type="email" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Jenis Kendaraan">
            <select className="form-input" value={form.jenis_kendaraan} onChange={e => set("jenis_kendaraan", e.target.value)}>
              <option value="motor">Motor</option>
              <option value="mobil">Mobil</option>
              <option value="truk">Truk/Pickup</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Merek" required><input className="form-input" placeholder="Honda / Toyota" value={form.merek_kendaraan} onChange={e => set("merek_kendaraan", e.target.value)} /></FormInput>
            <FormInput label="Model/Tipe" required><input className="form-input" placeholder="Beat / Avanza" value={form.model_kendaraan} onChange={e => set("model_kendaraan", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="Tahun"><input className="form-input" type="number" min="1990" max="2030" placeholder="2021" value={form.tahun_kendaraan} onChange={e => set("tahun_kendaraan", e.target.value)} /></FormInput>
            <FormInput label="Warna"><input className="form-input" placeholder="Merah" value={form.warna_kendaraan} onChange={e => set("warna_kendaraan", e.target.value)} /></FormInput>
            <FormInput label="Nomor Polisi" required><input className="form-input" placeholder="B 1234 ABC" value={form.nomor_polisi} onChange={e => set("nomor_polisi", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nomor Rangka"><input className="form-input" value={form.nomor_rangka} onChange={e => set("nomor_rangka", e.target.value)} /></FormInput>
            <FormInput label="Nomor Mesin"><input className="form-input" value={form.nomor_mesin} onChange={e => set("nomor_mesin", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="KM Awal (odometer)"><input className="form-input" type="number" min="0" value={form.km_awal} onChange={e => set("km_awal", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Kondisi Awal Kendaraan"><textarea className="form-input" rows={2} value={form.kondisi_awal_kendaraan} onChange={e => set("kondisi_awal_kendaraan", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Mulai Sewa" required><input className="form-input" type="date" value={form.tanggal_mulai_sewa} onChange={e => set("tanggal_mulai_sewa", e.target.value)} /></FormInput>
            <FormInput label="Tanggal Selesai Sewa" required><input className="form-input" type="date" value={form.tanggal_selesai_sewa} onChange={e => set("tanggal_selesai_sewa", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Jam Penyerahan" hint="default 08:00"><input className="form-input" type="time" value={form.jamPenyerahan} onChange={e => set("jamPenyerahan", e.target.value)} /></FormInput>
            <FormInput label="Jam Pengembalian" hint="default 18:00"><input className="form-input" type="time" value={form.jamPengembalian} onChange={e => set("jamPengembalian", e.target.value)} /></FormInput>
          </div>
          <RpInput label="Harga Sewa per Hari" value={form.harga_sewa_per_hari} onChange={v => set("harga_sewa_per_hari", v)} />
          <RpInput label="Total Harga Sewa" required value={form.total_harga_sewa} onChange={v => set("total_harga_sewa", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Batas KM/Hari (0 = bebas)"><input className="form-input" type="number" min="0" value={form.batas_km_per_hari} onChange={e => set("batas_km_per_hari", e.target.value)} /></FormInput>
            {parseInt(form.batas_km_per_hari) > 0 && <RpInput label="Biaya Kelebihan KM" value={form.biaya_km_lebih} onChange={v => set("biaya_km_lebih", v)} />}
          </div>
          <FormInput label="Denda Keterlambatan per Jam (Rp)" hint="default Rp 200.000">
            <input className="form-input" type="number" min="0" step="10000" value={form.dendaKeterlambatan} onChange={e => set("dendaKeterlambatan", parseInt(e.target.value) || 0)} />
          </FormInput>
          <RpInput label="Deposit / Uang Jaminan" required value={form.jumlah_deposit} onChange={v => set("jumlah_deposit", v)} />
          <FormInput label="Kapan Deposit Dikembalikan"><input className="form-input" value={form.kapan_deposit_dikembalikan} onChange={e => set("kapan_deposit_dikembalikan", e.target.value)} /></FormInput>
          <FormInput label="Skema Pembayaran">
            <select className="form-input" value={form.skema_pembayaran} onChange={e => set("skema_pembayaran", e.target.value)}>
              <option value="lunas_di_muka">Lunas di muka sebelum kendaraan diserahkan</option>
              <option value="dp_lunas_saat_kembali">DP di muka, pelunasan saat kendaraan kembali</option>
            </select>
          </FormInput>
          <FormInput label="Area Penggunaan">
            <select className="form-input" value={form.area_penggunaan} onChange={e => set("area_penggunaan", e.target.value)}>
              <option value="dalam_kota">Dalam Kota</option>
              <option value="dalam_provinsi">Dalam Provinsi</option>
              <option value="seluruh_Indonesia">Seluruh Indonesia</option>
            </select>
          </FormInput>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Saksi (Opsional)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Saksi 1"><input className="form-input" value={form.saksi_1_nama} onChange={e => set("saksi_1_nama", e.target.value)} /></FormInput>
            <FormInput label="Alamat Saksi 1"><input className="form-input" value={form.saksi1Alamat} onChange={e => set("saksi1Alamat", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Saksi 2"><input className="form-input" value={form.saksi_2_nama} onChange={e => set("saksi_2_nama", e.target.value)} /></FormInput>
            <FormInput label="Alamat Saksi 2"><input className="form-input" value={form.saksi2Alamat} onChange={e => set("saksi2Alamat", e.target.value)} /></FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Kota Penandatanganan" required><input className="form-input" value={form.kota_penandatanganan} onChange={e => set("kota_penandatanganan", e.target.value)} /></FormInput>
            <FormInput label="Lokasi Pembuatan" hint="opsional, default = kota TTD"><input className="form-input" value={form.lokasiPembuatan} onChange={e => set("lokasiPembuatan", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Tanggal TTD" required><input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-1">
          <ReviewRow label="Pemilik Kendaraan" value={form.nama_pemilik_kendaraan} />
          <ReviewRow label="Telepon Pemilik" value={form.nomor_telepon_pemilik} />
          <ReviewRow label="Penyewa" value={form.nama_penyewa} />
          <ReviewRow label="Telepon Penyewa" value={form.nomor_telepon_penyewa} />
          <ReviewRow label="Kendaraan" value={`${form.merek_kendaraan} ${form.model_kendaraan} (${form.nomor_polisi})`} />
          <ReviewRow label="Periode Sewa" value={`${form.tanggal_mulai_sewa} ${form.jamPenyerahan} – ${form.tanggal_selesai_sewa} ${form.jamPengembalian}`} />
          <ReviewRow label="Total Sewa" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.total_harga_sewa)}`} />
          <ReviewRow label="Deposit" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.jumlah_deposit)}`} />
          <ReviewRow label="Denda Keterlambatan" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.dendaKeterlambatan)}/jam`} />
          <ReviewRow label="Area Penggunaan" value={form.area_penggunaan.replace(/_/g, " ")} />
          <ReviewRow label="Kota TTD" value={form.kota_penandatanganan} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['sewa-kendaraan']} />
        </div>
      )}
    </ContractForm>
  );
}
