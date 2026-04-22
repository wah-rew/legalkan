"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";
import CitySearch from "@/components/CitySearch";

const STEPS = ["Para Pihak", "Detail Barang", "Harga & Serah Terima", "Review"];

interface FormState {
  nama_penjual: string; nik_penjual: string; alamat_penjual: string; nomor_telepon_penjual: string;
  nomor_rekening_penjual: string; nama_bank_penjual: string;
  nama_pembeli: string; nik_pembeli: string; alamat_pembeli: string; nomor_telepon_pembeli: string;
  jenis_barang: string; nama_barang: string; merek: string; model_tipe: string;
  tahun_pembuatan: string; warna: string; kondisi_barang: string; deskripsi_kondisi: string;
  nomor_polisi: string; nomor_rangka: string; nomor_mesin: string; km_odometer: string;
  nomor_bpkb: string; stnk_berlaku_hingga: string;
  nomor_seri: string;
  harga_jual: number; cara_pembayaran: string; jumlah_dp: number;
  tanggal_pembayaran_dp: string; tanggal_pelunasan: string;
  tanggal_serah_terima: string; lokasi_serah_terima: string;
  saksi_nama: string; saksi_nik: string; saksi1_alamat: string;
  lokasi_pembuatan: string;
  kota_penandatanganan: string; tanggal_penandatanganan: string;
  emailPembeli: string; nomorWhatsapp: string;
}

const init: FormState = {
  nama_penjual: "", nik_penjual: "", alamat_penjual: "", nomor_telepon_penjual: "", nomor_rekening_penjual: "", nama_bank_penjual: "BCA",
  nama_pembeli: "", nik_pembeli: "", alamat_pembeli: "", nomor_telepon_pembeli: "",
  jenis_barang: "kendaraan_bermotor", nama_barang: "", merek: "", model_tipe: "", tahun_pembuatan: "", warna: "", kondisi_barang: "baik", deskripsi_kondisi: "",
  nomor_polisi: "", nomor_rangka: "", nomor_mesin: "", km_odometer: "",
  nomor_bpkb: "", stnk_berlaku_hingga: "",
  nomor_seri: "",
  harga_jual: 0, cara_pembayaran: "transfer", jumlah_dp: 0,
  tanggal_pembayaran_dp: "", tanggal_pelunasan: "",
  tanggal_serah_terima: "", lokasi_serah_terima: "",
  saksi_nama: "", saksi_nik: "", saksi1_alamat: "",
  lokasi_pembuatan: "",
  kota_penandatanganan: "", tanggal_penandatanganan: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function JualBeliPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        const contractType = parsed?.contractData?.contractType || parsed?.contractType;
        if (contractType === "jual-beli") {
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
      if (!form.nama_penjual.trim()) return "Nama penjual wajib diisi";
      if (!form.nama_pembeli.trim()) return "Nama pembeli wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.nama_barang.trim()) return "Nama barang wajib diisi";
      if (!form.merek.trim()) return "Merek wajib diisi";
      if (!form.deskripsi_kondisi.trim()) return "Deskripsi kondisi wajib diisi";
    }
    if (step === 2) {
      if (!form.harga_jual || form.harga_jual < 1000) return "Harga jual wajib diisi";
      if (!form.tanggal_serah_terima) return "Tanggal serah terima wajib diisi";
      if (!form.lokasi_serah_terima.trim()) return "Lokasi serah terima wajib diisi";
      if (!form.saksi_nama.trim()) return "Nama saksi wajib diisi";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
    }
    return "";
  };

  const next = () => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(s => s + 1); };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/generate/jual-beli", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tahun_pembuatan: form.tahun_pembuatan ? parseInt(form.tahun_pembuatan) : undefined, km_odometer: form.km_odometer ? parseInt(form.km_odometer) : undefined, nomorBPKB: form.nomor_bpkb || undefined, stnkBerlakuHingga: form.stnk_berlaku_hingga || undefined, saksi1Alamat: form.saksi1_alamat || undefined, lokasiPembuatan: form.lokasi_pembuatan || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify({ ...data, formData: form }));
      router.push("/preview");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  };

  const isKendaraan = form.jenis_barang === "kendaraan_bermotor";
  const isElektronik = form.jenis_barang === "elektronik";

  return (
    <ContractForm title="Perjanjian Jual Beli Secondhand" subtitle="Transaksi barang bekas yang aman & berkekuatan hukum" steps={STEPS} currentStep={step} loading={loading} error={error} onNext={next} onBack={() => { setError(""); setStep(s => s - 1); }} onSubmit={submit} contractTypeLabel="🛍️ Jual Beli Secondhand">
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Penjual</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_penjual} onChange={e => set("nama_penjual", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_penjual} onChange={e => set("nik_penjual", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" value={form.nomor_telepon_penjual} onChange={e => set("nomor_telepon_penjual", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_penjual} onChange={e => set("alamat_penjual", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Bank"><select className="form-input" value={form.nama_bank_penjual} onChange={e => set("nama_bank_penjual", e.target.value)}>{["BCA","BNI","BRI","Mandiri","BSI","GoPay","OVO"].map(b => <option key={b}>{b}</option>)}</select></FormInput>
            <FormInput label="No. Rekening"><input className="form-input" value={form.nomor_rekening_penjual} onChange={e => set("nomor_rekening_penjual", e.target.value)} /></FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Pembeli</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_pembeli} onChange={e => set("nama_pembeli", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_pembeli} onChange={e => set("nik_pembeli", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" value={form.nomor_telepon_pembeli} onChange={e => set("nomor_telepon_pembeli", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_pembeli} onChange={e => set("alamat_pembeli", e.target.value)} /></FormInput>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Dokumen" required><input className="form-input" type="email" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Kategori Barang">
            <select className="form-input" value={form.jenis_barang} onChange={e => set("jenis_barang", e.target.value)}>
              <option value="kendaraan_bermotor">Kendaraan Bermotor</option>
              <option value="elektronik">Elektronik (HP, laptop, dll)</option>
              <option value="furnitur">Furnitur</option>
              <option value="perhiasan">Perhiasan</option>
              <option value="mesin">Mesin / Peralatan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </FormInput>
          <FormInput label="Nama Barang" required><input className="form-input" placeholder="Contoh: Honda Beat 2020" value={form.nama_barang} onChange={e => set("nama_barang", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="Merek" required><input className="form-input" value={form.merek} onChange={e => set("merek", e.target.value)} /></FormInput>
            <FormInput label="Model/Tipe"><input className="form-input" value={form.model_tipe} onChange={e => set("model_tipe", e.target.value)} /></FormInput>
            <FormInput label="Tahun"><input className="form-input" type="number" placeholder="2020" value={form.tahun_pembuatan} onChange={e => set("tahun_pembuatan", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Kondisi">
            <select className="form-input" value={form.kondisi_barang} onChange={e => set("kondisi_barang", e.target.value)}>
              <option value="sangat_baik">Sangat Baik</option>
              <option value="baik">Baik</option>
              <option value="cukup_baik">Cukup Baik</option>
              <option value="perlu_perbaikan">Perlu Perbaikan</option>
            </select>
          </FormInput>
          <FormInput label="Deskripsi Kondisi (termasuk cacat yang diketahui)" required>
            <textarea className="form-input" rows={3} placeholder="Jelaskan kondisi barang secara jujur termasuk cacat/kekurangan..." value={form.deskripsi_kondisi} onChange={e => set("deskripsi_kondisi", e.target.value)} />
          </FormInput>
          {isKendaraan && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormInput label="Nomor Polisi"><input className="form-input" value={form.nomor_polisi} onChange={e => set("nomor_polisi", e.target.value)} /></FormInput>
                <FormInput label="Nomor Rangka"><input className="form-input" value={form.nomor_rangka} onChange={e => set("nomor_rangka", e.target.value)} /></FormInput>
                <FormInput label="Nomor Mesin"><input className="form-input" value={form.nomor_mesin} onChange={e => set("nomor_mesin", e.target.value)} /></FormInput>
              </div>
              <FormInput label="KM Odometer"><input className="form-input" type="number" value={form.km_odometer} onChange={e => set("km_odometer", e.target.value)} /></FormInput>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label="Nomor BPKB" hint="opsional"><input className="form-input" value={form.nomor_bpkb} onChange={e => set("nomor_bpkb", e.target.value)} /></FormInput>
                <FormInput label="STNK Berlaku Hingga" hint="opsional"><input className="form-input" type="date" value={form.stnk_berlaku_hingga} onChange={e => set("stnk_berlaku_hingga", e.target.value)} /></FormInput>
              </div>
            </>
          )}
          {isElektronik && (
            <FormInput label="Nomor Seri / IMEI"><input className="form-input" value={form.nomor_seri} onChange={e => set("nomor_seri", e.target.value)} /></FormInput>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <RpInput label="Harga Jual" required value={form.harga_jual} onChange={v => set("harga_jual", v)} />
          <FormInput label="Cara Pembayaran">
            <select className="form-input" value={form.cara_pembayaran} onChange={e => set("cara_pembayaran", e.target.value)}>
              <option value="tunai">Tunai saat serah terima</option>
              <option value="transfer">Transfer bank</option>
              <option value="dp_pelunasan">DP + Pelunasan</option>
            </select>
          </FormInput>
          {form.cara_pembayaran === "dp_pelunasan" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <RpInput label="Jumlah DP" value={form.jumlah_dp} onChange={v => set("jumlah_dp", v)} />
              <FormInput label="Tanggal DP"><input className="form-input" type="date" value={form.tanggal_pembayaran_dp} onChange={e => set("tanggal_pembayaran_dp", e.target.value)} /></FormInput>
              <FormInput label="Tgl Pelunasan"><input className="form-input" type="date" value={form.tanggal_pelunasan} onChange={e => set("tanggal_pelunasan", e.target.value)} /></FormInput>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Serah Terima" required><input className="form-input" type="date" value={form.tanggal_serah_terima} onChange={e => set("tanggal_serah_terima", e.target.value)} /></FormInput>
            <FormInput label="Lokasi Serah Terima" required><input className="form-input" placeholder="Rumah penjual / kantor polisi" value={form.lokasi_serah_terima} onChange={e => set("lokasi_serah_terima", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Saksi" required><input className="form-input" value={form.saksi_nama} onChange={e => set("saksi_nama", e.target.value)} /></FormInput>
            <FormInput label="NIK Saksi" hint="opsional"><input className="form-input" maxLength={16} value={form.saksi_nik} onChange={e => set("saksi_nik", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat Saksi" hint="opsional"><input className="form-input" placeholder="Alamat lengkap saksi" value={form.saksi1_alamat} onChange={e => set("saksi1_alamat", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Kota Penandatanganan" required><CitySearch value={form.kota_penandatanganan} onChange={(val) => set("kota_penandatanganan", val)} placeholder="Cari kota atau kabupaten..." /></FormInput>
            <FormInput label="Tanggal TTD" required><input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Lokasi Pembuatan" hint="opsional — jika berbeda dari kota TTD"><input className="form-input" placeholder="Misal: Jakarta Selatan" value={form.lokasi_pembuatan} onChange={e => set("lokasi_pembuatan", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-1">
          <ReviewRow label="Penjual" value={form.nama_penjual} />
          <ReviewRow label="Pembeli" value={form.nama_pembeli} />
          <ReviewRow label="Barang" value={`${form.nama_barang} (${form.merek} ${form.model_tipe})`} />
          <ReviewRow label="Kondisi" value={form.kondisi_barang.replace(/_/g, " ")} />
          <ReviewRow label="Harga Jual" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.harga_jual)}`} />
          <ReviewRow label="Cara Bayar" value={form.cara_pembayaran.replace(/_/g, " ")} />
          <ReviewRow label="Serah Terima" value={form.tanggal_serah_terima} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['jual-beli']} />
        </div>
      )}
    </ContractForm>
  );
}
