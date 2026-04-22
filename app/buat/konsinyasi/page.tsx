"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";
import BankSearch from "@/components/BankSearch";
import CitySearch from "@/components/CitySearch";

const STEPS = ["Para Pihak", "Detail Produk", "Komisi & Periode", "Ketentuan", "Review"];

interface FormState {
  // Konsinyor (Penitip)
  nama_konsinyor: string; nik_konsinyor: string; alamat_konsinyor: string; nomor_telepon_konsinyor: string;
  nama_bank_konsinyor: string; nomor_rekening_konsinyor: string;
  // Konsinyee (Penerima)
  namaToko: string;
  nama_konsinyee: string; nik_konsinyee: string; alamat_toko_konsinyee: string; nomor_telepon_konsinyee: string;
  // Detail Produk
  nama_produk: string; deskripsi_produk: string; jumlah_unit_awal: string;
  harga_pokok: number; harga_jual_ditetapkan: number; boleh_diskon: boolean; diskon_maks: string;
  masaKadaluarsa: string;
  tanggalSerah: string;
  // Komisi
  jenis_komisi: string; persentase_komisi: string; komisi_flat: number;
  // Periode
  tanggal_mulai: string; tanggal_berakhir: string;
  periode_laporan: string;
  periodelaporan: string;
  periodePembayaran: string;
  tanggal_setor_hasil: string;
  // Ketentuan
  dendaKeterlambatan: string;
  lokasiPembuatan: string;
  kota_penandatanganan: string; tanggal_penandatanganan: string;
  // Saksi
  saksi1Nama: string; saksi1Nik: string; saksi1Alamat: string;
  saksi2Nama: string; saksi2Nik: string; saksi2Alamat: string;
  // Meta
  emailPembeli: string; nomorWhatsapp: string;
}

const init: FormState = {
  nama_konsinyor: "", nik_konsinyor: "", alamat_konsinyor: "", nomor_telepon_konsinyor: "",
  nama_bank_konsinyor: "BCA", nomor_rekening_konsinyor: "",
  namaToko: "",
  nama_konsinyee: "", nik_konsinyee: "", alamat_toko_konsinyee: "", nomor_telepon_konsinyee: "",
  nama_produk: "", deskripsi_produk: "", jumlah_unit_awal: "10",
  harga_pokok: 0, harga_jual_ditetapkan: 0, boleh_diskon: false, diskon_maks: "10",
  masaKadaluarsa: "", tanggalSerah: "",
  jenis_komisi: "persentase", persentase_komisi: "20", komisi_flat: 0,
  tanggal_mulai: "", tanggal_berakhir: "",
  periode_laporan: "dua_mingguan",
  periodelaporan: "14",
  periodePembayaran: "14",
  tanggal_setor_hasil: "",
  dendaKeterlambatan: "2",
  lokasiPembuatan: "",
  kota_penandatanganan: "", tanggal_penandatanganan: "",
  saksi1Nama: "", saksi1Nik: "", saksi1Alamat: "",
  saksi2Nama: "", saksi2Nik: "", saksi2Alamat: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function KonsinyasiPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        const contractType = parsed?.contractData?.contractType || parsed?.contractType;
        if (contractType === "konsinyasi") {
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
      if (!form.nama_konsinyor.trim()) return "Nama Penitip wajib diisi";
      if (!form.nama_konsinyee.trim()) return "Nama Pemilik Toko wajib diisi";
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
    }
    if (step === 3) {
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
        body: JSON.stringify({
          ...form,
          jumlah_unit_awal: parseInt(form.jumlah_unit_awal) || 10,
          persentase_komisi: parseFloat(form.persentase_komisi) || 20,
          diskon_maks: parseInt(form.diskon_maks) || 10,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify({ ...data, formData: form }));
      router.push("/preview");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  };

  // Komisi preview calculation
  const komisiPerUnit = form.jenis_komisi === "persentase"
    ? form.harga_jual_ditetapkan * (parseFloat(form.persentase_komisi) / 100)
    : form.komisi_flat;
  const bagianPenitip = form.harga_jual_ditetapkan - komisiPerUnit;

  return (
    <ContractForm title="Perjanjian Titip Jual (Konsinyasi)" subtitle="Atur hak & kewajiban antara pemilik produk dan penjual" steps={STEPS} currentStep={step} loading={loading} error={error} onNext={next} onBack={() => { setError(""); setStep(s => s - 1); }} onSubmit={submit} contractTypeLabel="🤝 Konsinyasi">

      {/* ─── Step 0: Para Pihak ─────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Penitip (Pemilik Produk)</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_konsinyor} onChange={e => set("nama_konsinyor", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_konsinyor} onChange={e => set("nik_konsinyor", e.target.value)} /></FormInput>
            <FormInput label="Telepon"><input className="form-input" type="tel" value={form.nomor_telepon_konsinyor} onChange={e => set("nomor_telepon_konsinyor", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_konsinyor} onChange={e => set("alamat_konsinyor", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Bank"><BankSearch value={form.nama_bank_konsinyor} onChange={(val) => set("nama_bank_konsinyor", val)} placeholder="Cari nama bank..." /></FormInput>
            <FormInput label="No. Rekening"><input className="form-input" value={form.nomor_rekening_konsinyor} onChange={e => set("nomor_rekening_konsinyor", e.target.value)} /></FormInput>
          </div>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Penerima Titipan (Toko / Penjual)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Toko" hint="Brand / nama usaha"><input className="form-input" placeholder="Contoh: Toko Makmur" value={form.namaToko} onChange={e => set("namaToko", e.target.value)} /></FormInput>
            <FormInput label="Nama Pemilik" required><input className="form-input" value={form.nama_konsinyee} onChange={e => set("nama_konsinyee", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK Pemilik"><input className="form-input" maxLength={16} value={form.nik_konsinyee} onChange={e => set("nik_konsinyee", e.target.value)} /></FormInput>
            <FormInput label="Telepon Toko"><input className="form-input" type="tel" value={form.nomor_telepon_konsinyee} onChange={e => set("nomor_telepon_konsinyee", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Alamat Toko" required><textarea className="form-input" rows={2} value={form.alamat_toko_konsinyee} onChange={e => set("alamat_toko_konsinyee", e.target.value)} /></FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Dokumen" required><input className="form-input" type="email" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} /></FormInput>
        </div>
      )}

      {/* ─── Step 1: Detail Produk ──────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Nama Produk" required><input className="form-input" placeholder="Contoh: Keripik Singkong Original" value={form.nama_produk} onChange={e => set("nama_produk", e.target.value)} /></FormInput>
          <FormInput label="Deskripsi Produk"><textarea className="form-input" rows={2} placeholder="Varian, ukuran, kemasan, dll." value={form.deskripsi_produk} onChange={e => set("deskripsi_produk", e.target.value)} /></FormInput>
          <FormInput label="Jumlah Unit Awal" required><input className="form-input" type="number" min="1" value={form.jumlah_unit_awal} onChange={e => set("jumlah_unit_awal", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <RpInput label="Harga Pokok (HPP) / Unit" required value={form.harga_pokok} onChange={v => set("harga_pokok", v)} />
            <RpInput label="Harga Jual Ditetapkan / Unit" required value={form.harga_jual_ditetapkan} onChange={v => set("harga_jual_ditetapkan", v)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Masa Kadaluarsa Produk" hint="Hari sejak produksi (opsional)">
              <input className="form-input" type="number" min="1" placeholder="Contoh: 180" value={form.masaKadaluarsa} onChange={e => set("masaKadaluarsa", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal Serah Barang" hint="Kapan barang diserahkan">
              <input className="form-input" type="date" value={form.tanggalSerah} onChange={e => set("tanggalSerah", e.target.value)} />
            </FormInput>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="boleh_diskon" checked={form.boleh_diskon} onChange={e => set("boleh_diskon", e.target.checked)} />
            <label htmlFor="boleh_diskon" className="text-sm cursor-pointer">Penerima boleh memberi diskon kepada konsumen</label>
          </div>
          {form.boleh_diskon && (
            <FormInput label="Diskon Maksimal (%)" hint="0-50">
              <input className="form-input" type="number" min="0" max="50" value={form.diskon_maks} onChange={e => set("diskon_maks", e.target.value)} />
            </FormInput>
          )}
        </div>
      )}

      {/* ─── Step 2: Komisi & Periode ───────────────────────────────────────── */}
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
            <FormInput label="Komisi (%)" hint="Persen dari harga jual per unit">
              <input className="form-input" type="number" min="1" max="99" value={form.persentase_komisi} onChange={e => set("persentase_komisi", e.target.value)} />
            </FormInput>
          )}
          {form.jenis_komisi === "flat" && (
            <RpInput label="Komisi Flat / Unit" value={form.komisi_flat} onChange={v => set("komisi_flat", v)} />
          )}
          {/* Komisi breakdown preview */}
          {form.harga_jual_ditetapkan > 0 && form.jenis_komisi !== "selisih" && (
            <div className="rounded-lg p-3 text-sm" style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.2)" }}>
              <p className="font-semibold mb-1" style={{ color: "#FF4D6D" }}>💡 Simulasi per unit terjual</p>
              <p>Harga jual: <strong>Rp {new Intl.NumberFormat("id-ID").format(form.harga_jual_ditetapkan)}</strong></p>
              <p>Komisi penerima: <strong>Rp {new Intl.NumberFormat("id-ID").format(komisiPerUnit)}</strong></p>
              <p>Bagian penitip: <strong>Rp {new Intl.NumberFormat("id-ID").format(bagianPenitip)}</strong></p>
            </div>
          )}

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Mulai" required><input className="form-input" type="date" value={form.tanggal_mulai} onChange={e => set("tanggal_mulai", e.target.value)} /></FormInput>
            <FormInput label="Tanggal Berakhir" required><input className="form-input" type="date" value={form.tanggal_berakhir} onChange={e => set("tanggal_berakhir", e.target.value)} /></FormInput>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Periode Laporan (hari)" hint="Setiap berapa hari laporan dikirim">
              <input className="form-input" type="number" min="1" placeholder="14" value={form.periodelaporan} onChange={e => set("periodelaporan", e.target.value)} />
            </FormInput>
            <FormInput label="Periode Pembayaran (hari)" hint="Batas bayar setelah laporan diverifikasi">
              <input className="form-input" type="number" min="1" placeholder="14" value={form.periodePembayaran} onChange={e => set("periodePembayaran", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Tanggal Setor Hasil Pertama" hint="Opsional — untuk referensi">
            <input className="form-input" type="date" value={form.tanggal_setor_hasil} onChange={e => set("tanggal_setor_hasil", e.target.value)} />
          </FormInput>
        </div>
      )}

      {/* ─── Step 3: Ketentuan & Saksi ──────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Denda & Penandatanganan</p>
          <FormInput label="Denda Keterlambatan (%)" hint="% dari nilai barang per minggu (default: 2%)">
            <input className="form-input" type="number" min="0" max="20" step="0.5" value={form.dendaKeterlambatan} onChange={e => set("dendaKeterlambatan", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Dibuat di (Kota)" required>
              <CitySearch value={form.kota_penandatanganan} onChange={(val) => { set("kota_penandatanganan", val); if (!form.lokasiPembuatan) set("lokasiPembuatan", val); }} placeholder="Cari kota atau kabupaten..." />
            </FormInput>
            <FormInput label="Tanggal TTD" required>
              <input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Lokasi Pembuatan" hint="Jika berbeda dari kota TTD">
            <input className="form-input" placeholder="Sama dengan kota penandatanganan jika kosong" value={form.lokasiPembuatan} onChange={e => set("lokasiPembuatan", e.target.value)} />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Saksi (Opsional)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Saksi 1"><input className="form-input" value={form.saksi1Nama} onChange={e => set("saksi1Nama", e.target.value)} /></FormInput>
            <FormInput label="NIK Saksi 1"><input className="form-input" maxLength={16} value={form.saksi1Nik} onChange={e => set("saksi1Nik", e.target.value)} /></FormInput>
          </div>
          {form.saksi1Nama && (
            <FormInput label="Alamat Saksi 1">
              <textarea className="form-input" rows={2} value={form.saksi1Alamat} onChange={e => set("saksi1Alamat", e.target.value)} />
            </FormInput>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Saksi 2"><input className="form-input" value={form.saksi2Nama} onChange={e => set("saksi2Nama", e.target.value)} /></FormInput>
            <FormInput label="NIK Saksi 2"><input className="form-input" maxLength={16} value={form.saksi2Nik} onChange={e => set("saksi2Nik", e.target.value)} /></FormInput>
          </div>
          {form.saksi2Nama && (
            <FormInput label="Alamat Saksi 2">
              <textarea className="form-input" rows={2} value={form.saksi2Alamat} onChange={e => set("saksi2Alamat", e.target.value)} />
            </FormInput>
          )}
        </div>
      )}

      {/* ─── Step 4: Review ─────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-1">
          <ReviewRow label="Penitip" value={form.nama_konsinyor} />
          <ReviewRow label="Toko" value={form.namaToko || form.nama_konsinyee} />
          <ReviewRow label="Pemilik Toko" value={form.nama_konsinyee} />
          <ReviewRow label="Produk" value={form.nama_produk} />
          <ReviewRow label="Jumlah Unit" value={form.jumlah_unit_awal} />
          <ReviewRow label="Harga Jual" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.harga_jual_ditetapkan)}`} />
          {form.masaKadaluarsa && <ReviewRow label="Kadaluarsa" value={`${form.masaKadaluarsa} hari`} />}
          <ReviewRow label="Komisi" value={form.jenis_komisi === "persentase" ? `${form.persentase_komisi}%` : form.jenis_komisi} />
          <ReviewRow label="Periode Laporan" value={`${form.periodelaporan} hari`} />
          <ReviewRow label="Periode Bayar" value={`${form.periodePembayaran} hari setelah laporan`} />
          <ReviewRow label="Denda Keterlambatan" value={`${form.dendaKeterlambatan}%`} />
          <ReviewRow label="Masa Berlaku" value={`${form.tanggal_mulai} – ${form.tanggal_berakhir}`} />
          <ReviewRow label="Dibuat di" value={form.lokasiPembuatan || form.kota_penandatanganan} />
          {(form.saksi1Nama || form.saksi2Nama) && (
            <ReviewRow label="Saksi" value={[form.saksi1Nama, form.saksi2Nama].filter(Boolean).join(", ")} />
          )}
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['konsinyasi']} />
        </div>
      )}
    </ContractForm>
  );
}
