"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";
import CitySearch from "@/components/CitySearch";

const STEPS = ["Para Pihak", "Detail Usaha", "Bagi Hasil & Kelola", "Pengakhiran & Saksi", "Review"];

interface FormState {
  // Para Pihak
  nama_pihak_1: string; nik_pihak_1: string; alamat_pihak_1: string; nomorTelepon1: string;
  peran_pihak_1: string; modal_pihak_1: number; bentuk_kontribusi_pihak_1: string;
  nama_pihak_2: string; nik_pihak_2: string; alamat_pihak_2: string; nomorTelepon2: string;
  peran_pihak_2: string; modal_pihak_2: number; bentuk_kontribusi_pihak_2: string;
  // Detail Usaha
  nama_usaha: string; jenis_usaha: string; alamat_usaha: string; tanggal_mulai_usaha: string;
  total_modal: number;
  // Bagi Hasil
  persen_bagi_hasil_pihak_1: string; persen_bagi_hasil_pihak_2: string;
  persen_tanggung_rugi_pihak_1: string; persen_tanggung_rugi_pihak_2: string;
  periode_bagi_hasil: string;
  tanggalPembagian: string;
  tanggalLaporan: string;
  apakah_ada_gaji_pengelola: boolean; gaji_pengelola: number;
  // Pengelolaan
  siapa_yang_mengelola: string; keputusan_besar_threshold: number;
  batasModalTambahan: number;
  batasInvestasi: number;
  frekuensi_laporan_keuangan: string;
  // Pengakhiran
  jangka_waktu_perjanjian: string; tanggal_berakhir: string;
  masaPemberitahuanKeluar: string;
  // Non-compete
  radiusNonCompete: string;
  durasiNonCompete: string;
  // Sanksi
  sanksiDenda: string;
  // Saksi
  saksi_1: string; nik_saksi_1: string; saksi1Alamat: string;
  saksi_2: string; nik_saksi_2: string; saksi2Alamat: string;
  // Penandatanganan
  kota_penandatanganan: string; lokasiPembuatan: string; tanggal_penandatanganan: string;
  // Meta
  emailPembeli: string; nomorWhatsapp: string;
}

const init: FormState = {
  nama_pihak_1: "", nik_pihak_1: "", alamat_pihak_1: "", nomorTelepon1: "",
  peran_pihak_1: "Modal uang", modal_pihak_1: 0, bentuk_kontribusi_pihak_1: "uang_tunai",
  nama_pihak_2: "", nik_pihak_2: "", alamat_pihak_2: "", nomorTelepon2: "",
  peran_pihak_2: "Tenaga & keahlian", modal_pihak_2: 0, bentuk_kontribusi_pihak_2: "tenaga",
  nama_usaha: "", jenis_usaha: "", alamat_usaha: "", tanggal_mulai_usaha: "", total_modal: 0,
  persen_bagi_hasil_pihak_1: "50", persen_bagi_hasil_pihak_2: "50",
  persen_tanggung_rugi_pihak_1: "50", persen_tanggung_rugi_pihak_2: "50",
  periode_bagi_hasil: "bulanan",
  tanggalPembagian: "10",
  tanggalLaporan: "5",
  apakah_ada_gaji_pengelola: false, gaji_pengelola: 0,
  siapa_yang_mengelola: "pihak_2", keputusan_besar_threshold: 5000000,
  batasModalTambahan: 5000000,
  batasInvestasi: 2000000,
  frekuensi_laporan_keuangan: "bulanan",
  jangka_waktu_perjanjian: "tidak_terbatas", tanggal_berakhir: "",
  masaPemberitahuanKeluar: "3",
  radiusNonCompete: "500",
  durasiNonCompete: "1",
  sanksiDenda: "1% omzet bulanan",
  saksi_1: "", nik_saksi_1: "", saksi1Alamat: "",
  saksi_2: "", nik_saksi_2: "", saksi2Alamat: "",
  kota_penandatanganan: "", lokasiPembuatan: "", tanggal_penandatanganan: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function BagiHasilPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        const contractType = parsed?.contractData?.contractType || parsed?.contractType;
        if (contractType === "bagi-hasil") {
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

  const bh1 = parseInt(form.persen_bagi_hasil_pihak_1) || 0;
  const bh2 = parseInt(form.persen_bagi_hasil_pihak_2) || 0;
  const tr1 = parseInt(form.persen_tanggung_rugi_pihak_1) || 0;
  const tr2 = parseInt(form.persen_tanggung_rugi_pihak_2) || 0;

  const validate = () => {
    if (step === 0) {
      if (!form.nama_pihak_1.trim()) return "Nama Pihak Pertama wajib diisi";
      if (!form.nama_pihak_2.trim()) return "Nama Pihak Kedua wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.nama_usaha.trim()) return "Nama usaha wajib diisi";
      if (!form.jenis_usaha.trim()) return "Jenis usaha wajib diisi";
      if (!form.tanggal_mulai_usaha) return "Tanggal mulai usaha wajib diisi";
    }
    if (step === 2) {
      if (bh1 + bh2 !== 100) return `Bagi hasil harus total 100% (sekarang ${bh1 + bh2}%)`;
      if (tr1 + tr2 !== 100) return `Tanggung rugi harus total 100% (sekarang ${tr1 + tr2}%)`;
      const tglBagi = parseInt(form.tanggalPembagian);
      if (isNaN(tglBagi) || tglBagi < 1 || tglBagi > 28) return "Tanggal pembagian harus antara 1–28";
      const tglLaporan = parseInt(form.tanggalLaporan);
      if (isNaN(tglLaporan) || tglLaporan < 1 || tglLaporan > 28) return "Tanggal laporan harus antara 1–28";
    }
    if (step === 3) {
      if (!form.saksi_1.trim()) return "Nama saksi wajib diisi";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
    }
    return "";
  };

  const next = () => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(s => s + 1); };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const totalModal = form.modal_pihak_1 + form.modal_pihak_2;
      const res = await fetch("/api/generate/bagi-hasil", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, total_modal: totalModal,
          persen_bagi_hasil_pihak_1: bh1, persen_bagi_hasil_pihak_2: bh2,
          persen_tanggung_rugi_pihak_1: tr1, persen_tanggung_rugi_pihak_2: tr2,
          batasModalTambahan: String(form.batasModalTambahan),
          batasInvestasi: String(form.batasInvestasi),
          sanksiDenda: form.sanksiDenda || undefined,
          lokasiPembuatan: form.lokasiPembuatan || form.kota_penandatanganan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify({ ...data, formData: form }));
      router.push("/preview");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  };

  return (
    <ContractForm title="Perjanjian Bagi Hasil Usaha" subtitle="Formalkan kemitraan usaha dengan dasar hukum yang kuat" steps={STEPS} currentStep={step} loading={loading} error={error} onNext={next} onBack={() => { setError(""); setStep(s => s - 1); }} onSubmit={submit} contractTypeLabel="📊 Bagi Hasil Usaha">
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Pihak Pertama (Mitra 1)</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_pihak_1} onChange={e => set("nama_pihak_1", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_pihak_1} onChange={e => set("nik_pihak_1", e.target.value)} /></FormInput>
            <FormInput label="No. Telepon"><input className="form-input" type="tel" placeholder="08xxxxxxxxxx" value={form.nomorTelepon1} onChange={e => set("nomorTelepon1", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Peran/Kontribusi"><input className="form-input" placeholder="Modal uang" value={form.peran_pihak_1} onChange={e => set("peran_pihak_1", e.target.value)} /></FormInput>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_pihak_1} onChange={e => set("alamat_pihak_1", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <RpInput label="Kontribusi Modal" value={form.modal_pihak_1} onChange={v => set("modal_pihak_1", v)} />
            <FormInput label="Bentuk Kontribusi">
              <select className="form-input" value={form.bentuk_kontribusi_pihak_1} onChange={e => set("bentuk_kontribusi_pihak_1", e.target.value)}>
                <option value="uang_tunai">Uang Tunai</option>
                <option value="aset">Aset/Barang</option>
                <option value="tenaga">Tenaga Kerja</option>
                <option value="keahlian">Keahlian/Skill</option>
                <option value="campuran">Campuran</option>
              </select>
            </FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Pihak Kedua (Mitra 2)</p>
          <FormInput label="Nama Lengkap" required><input className="form-input" value={form.nama_pihak_2} onChange={e => set("nama_pihak_2", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK"><input className="form-input" maxLength={16} value={form.nik_pihak_2} onChange={e => set("nik_pihak_2", e.target.value)} /></FormInput>
            <FormInput label="No. Telepon"><input className="form-input" type="tel" placeholder="08xxxxxxxxxx" value={form.nomorTelepon2} onChange={e => set("nomorTelepon2", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Peran/Kontribusi"><input className="form-input" placeholder="Tenaga & keahlian" value={form.peran_pihak_2} onChange={e => set("peran_pihak_2", e.target.value)} /></FormInput>
          <FormInput label="Alamat"><textarea className="form-input" rows={2} value={form.alamat_pihak_2} onChange={e => set("alamat_pihak_2", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <RpInput label="Kontribusi Modal" value={form.modal_pihak_2} onChange={v => set("modal_pihak_2", v)} />
            <FormInput label="Bentuk Kontribusi">
              <select className="form-input" value={form.bentuk_kontribusi_pihak_2} onChange={e => set("bentuk_kontribusi_pihak_2", e.target.value)}>
                <option value="uang_tunai">Uang Tunai</option>
                <option value="aset">Aset/Barang</option>
                <option value="tenaga">Tenaga Kerja</option>
                <option value="keahlian">Keahlian/Skill</option>
                <option value="campuran">Campuran</option>
              </select>
            </FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Dokumen" required><input className="form-input" type="email" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Nama Usaha" required><input className="form-input" placeholder="Warung Makan Bu Sari" value={form.nama_usaha} onChange={e => set("nama_usaha", e.target.value)} /></FormInput>
          <FormInput label="Jenis Usaha" required><input className="form-input" placeholder="Warung makan, toko online, dll" value={form.jenis_usaha} onChange={e => set("jenis_usaha", e.target.value)} /></FormInput>
          <FormInput label="Alamat Usaha"><textarea className="form-input" rows={2} value={form.alamat_usaha} onChange={e => set("alamat_usaha", e.target.value)} /></FormInput>
          <FormInput label="Tanggal Mulai Operasi" required><input className="form-input" type="date" value={form.tanggal_mulai_usaha} onChange={e => set("tanggal_mulai_usaha", e.target.value)} /></FormInput>
          <div
            className="rounded-2xl p-3"
            style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "#028A66" }}>
              Total Modal: Rp {new Intl.NumberFormat("id-ID").format(form.modal_pihak_1 + form.modal_pihak_2)}
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Bagi Hasil (total harus 100%)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label={`${form.nama_pihak_1 || "Pihak 1"} (%)`}><input className="form-input" type="number" min="0" max="100" value={form.persen_bagi_hasil_pihak_1} onChange={e => { set("persen_bagi_hasil_pihak_1", e.target.value); set("persen_bagi_hasil_pihak_2", String(100 - (parseInt(e.target.value) || 0))); }} /></FormInput>
            <FormInput label={`${form.nama_pihak_2 || "Pihak 2"} (%)`}><input className="form-input" type="number" min="0" max="100" value={form.persen_bagi_hasil_pihak_2} onChange={e => { set("persen_bagi_hasil_pihak_2", e.target.value); set("persen_bagi_hasil_pihak_1", String(100 - (parseInt(e.target.value) || 0))); }} /></FormInput>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Tanggung Rugi (total harus 100%)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label={`${form.nama_pihak_1 || "Pihak 1"} (%)`}><input className="form-input" type="number" min="0" max="100" value={form.persen_tanggung_rugi_pihak_1} onChange={e => { set("persen_tanggung_rugi_pihak_1", e.target.value); set("persen_tanggung_rugi_pihak_2", String(100 - (parseInt(e.target.value) || 0))); }} /></FormInput>
            <FormInput label={`${form.nama_pihak_2 || "Pihak 2"} (%)`}><input className="form-input" type="number" min="0" max="100" value={form.persen_tanggung_rugi_pihak_2} onChange={e => { set("persen_tanggung_rugi_pihak_2", e.target.value); set("persen_tanggung_rugi_pihak_1", String(100 - (parseInt(e.target.value) || 0))); }} /></FormInput>
          </div>
          <FormInput label="Periode Bagi Hasil">
            <select className="form-input" value={form.periode_bagi_hasil} onChange={e => set("periode_bagi_hasil", e.target.value)}>
              <option value="bulanan">Setiap Bulan</option>
              <option value="triwulan">Setiap 3 Bulan</option>
              <option value="semesteran">Setiap 6 Bulan</option>
              <option value="tahunan">Setiap Tahun</option>
            </select>
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Pembagian Keuntungan (tgl berapa tiap bulan)">
              <input className="form-input" type="number" min="1" max="28" placeholder="10" value={form.tanggalPembagian} onChange={e => set("tanggalPembagian", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal Laporan Keuangan (diserahkan tgl berapa)">
              <input className="form-input" type="number" min="1" max="28" placeholder="5" value={form.tanggalLaporan} onChange={e => set("tanggalLaporan", e.target.value)} />
            </FormInput>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="gaji_pengelola" checked={form.apakah_ada_gaji_pengelola} onChange={e => set("apakah_ada_gaji_pengelola", e.target.checked)} />
            <label htmlFor="gaji_pengelola" className="text-sm cursor-pointer">Pengelola mendapat honor bulanan (selain bagi hasil)</label>
          </div>
          {form.apakah_ada_gaji_pengelola && <RpInput label="Honor Pengelola / Bulan" value={form.gaji_pengelola} onChange={v => set("gaji_pengelola", v)} />}
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Pengelolaan & Keputusan Strategis</p>
          <FormInput label="Pengelola Usaha">
            <select className="form-input" value={form.siapa_yang_mengelola} onChange={e => set("siapa_yang_mengelola", e.target.value)}>
              <option value="pihak_1">{form.nama_pihak_1 || "Pihak Pertama"}</option>
              <option value="pihak_2">{form.nama_pihak_2 || "Pihak Kedua"}</option>
              <option value="bersama">Bersama-sama</option>
            </select>
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <RpInput label="Batas penambahan modal (perlu persetujuan bersama jika di atas nilai ini)" value={form.batasModalTambahan} onChange={v => set("batasModalTambahan", v)} />
            <RpInput label="Batas investasi/aset baru (perlu persetujuan bersama)" value={form.batasInvestasi} onChange={v => set("batasInvestasi", v)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Jangka Waktu & Pengakhiran</p>
          <FormInput label="Jangka Waktu Kemitraan">
            <select className="form-input" value={form.jangka_waktu_perjanjian} onChange={e => set("jangka_waktu_perjanjian", e.target.value)}>
              <option value="1tahun">1 Tahun</option>
              <option value="2tahun">2 Tahun</option>
              <option value="3tahun">3 Tahun</option>
              <option value="tidak_terbatas">Tidak Terbatas</option>
            </select>
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Masa Pemberitahuan Keluar (bulan, minimal 3)">
              <input className="form-input" type="number" min="1" max="12" placeholder="3" value={form.masaPemberitahuanKeluar} onChange={e => set("masaPemberitahuanKeluar", e.target.value)} />
            </FormInput>
            <FormInput label="Radius Larangan Persaingan (meter)">
              <input className="form-input" type="number" min="100" placeholder="500" value={form.radiusNonCompete} onChange={e => set("radiusNonCompete", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Durasi Larangan Persaingan setelah berakhir (tahun)">
            <input className="form-input" type="number" min="1" max="5" placeholder="1" value={form.durasiNonCompete} onChange={e => set("durasiNonCompete", e.target.value)} />
          </FormInput>
          <FormInput label="Sanksi Denda Wanprestasi" hint="misal: 1% omzet bulanan, Rp 500.000/hari">
            <input className="form-input" placeholder="1% omzet bulanan" value={form.sanksiDenda} onChange={e => set("sanksiDenda", e.target.value)} />
          </FormInput>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Saksi-Saksi</p>
          <p className="text-xs" style={{ color: "#666" }}>Saksi memberikan legitimasi tambahan pada dokumen perjanjian</p>
          <FormInput label="Nama Saksi 1" required><input className="form-input" value={form.saksi_1} onChange={e => set("saksi_1", e.target.value)} /></FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK Saksi 1"><input className="form-input" maxLength={16} value={form.nik_saksi_1} onChange={e => set("nik_saksi_1", e.target.value)} /></FormInput>
            <FormInput label="Alamat Saksi 1"><input className="form-input" value={form.saksi1Alamat} onChange={e => set("saksi1Alamat", e.target.value)} /></FormInput>
          </div>
          <FormInput label="Nama Saksi 2 (opsional)"><input className="form-input" value={form.saksi_2} onChange={e => set("saksi_2", e.target.value)} /></FormInput>
          {form.saksi_2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="NIK Saksi 2"><input className="form-input" maxLength={16} value={form.nik_saksi_2} onChange={e => set("nik_saksi_2", e.target.value)} /></FormInput>
              <FormInput label="Alamat Saksi 2"><input className="form-input" value={form.saksi2Alamat} onChange={e => set("saksi2Alamat", e.target.value)} /></FormInput>
            </div>
          )}
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Penandatanganan</p>
          <FormInput label="Lokasi Pembuatan / Kota Penandatanganan" required><CitySearch value={form.kota_penandatanganan} onChange={(val) => { set("kota_penandatanganan", val); if (!form.lokasiPembuatan) set("lokasiPembuatan", val); }} placeholder="Cari kota atau kabupaten..." /></FormInput>
          <FormInput label="Tanggal Penandatanganan" required><input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} /></FormInput>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-1">
          <ReviewRow label="Mitra 1" value={form.nama_pihak_1} />
          <ReviewRow label="Mitra 2" value={form.nama_pihak_2} />
          <ReviewRow label="Nama Usaha" value={form.nama_usaha} />
          <ReviewRow label="Total Modal" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.modal_pihak_1 + form.modal_pihak_2)}`} />
          <ReviewRow label="Bagi Hasil" value={`${form.persen_bagi_hasil_pihak_1}% : ${form.persen_bagi_hasil_pihak_2}%`} />
          <ReviewRow label="Periode" value={form.periode_bagi_hasil} />
          <ReviewRow label="Tgl Pembagian" value={`Setiap tgl ${form.tanggalPembagian}`} />
          <ReviewRow label="Tgl Laporan" value={`Setiap tgl ${form.tanggalLaporan}`} />
          <ReviewRow label="Non-compete" value={`${form.radiusNonCompete}m, ${form.durasiNonCompete} thn`} />
          {form.sanksiDenda && <ReviewRow label="Sanksi Denda" value={form.sanksiDenda} />}
          <ReviewRow label="Jangka Waktu" value={form.jangka_waktu_perjanjian.replace(/_/g, " ")} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['bagi-hasil']} />
        </div>
      )}
    </ContractForm>
  );
}
