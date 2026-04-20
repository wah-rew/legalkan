"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";

const STEPS = ["Para Pihak", "Detail Pekerjaan", "Kompensasi & HKI", "Review"];

interface FormState {
  nama_pemberi_kerja: string; nama_perusahaan: string; alamat_pemberi_kerja: string;
  nama_freelancer: string; nik_freelancer: string; alamat_freelancer: string;
  nomor_rekening_freelancer: string; nama_bank_freelancer: string; atas_nama_rekening: string;
  judul_pekerjaan: string; deskripsi_pekerjaan: string; deliverable: string;
  jumlah_revisi: string; tanggal_mulai: string; tanggal_selesai: string;
  lokasi_kerja: string;
  jumlah_imbalan: number; skema_pembayaran: string; dp_persen: string;
  tanggal_pembayaran_dp: string; tanggal_pembayaran_lunas: string;
  kepemilikan_hak_cipta: string; hak_portofolio: boolean;
  ada_nda: boolean; masa_kerahasiaan: string;
  kota_penandatanganan: string; tanggal_penandatanganan: string;
  emailPembeli: string; nomorWhatsapp: string;
}

const init: FormState = {
  nama_pemberi_kerja: "", nama_perusahaan: "", alamat_pemberi_kerja: "",
  nama_freelancer: "", nik_freelancer: "", alamat_freelancer: "",
  nomor_rekening_freelancer: "", nama_bank_freelancer: "BCA", atas_nama_rekening: "",
  judul_pekerjaan: "", deskripsi_pekerjaan: "", deliverable: "",
  jumlah_revisi: "2", tanggal_mulai: "", tanggal_selesai: "", lokasi_kerja: "remote",
  jumlah_imbalan: 0, skema_pembayaran: "dp_pelunasan", dp_persen: "50",
  tanggal_pembayaran_dp: "", tanggal_pembayaran_lunas: "",
  kepemilikan_hak_cipta: "pemberi_kerja", hak_portofolio: true,
  ada_nda: true, masa_kerahasiaan: "2tahun",
  kota_penandatanganan: "", tanggal_penandatanganan: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function FreelancerPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(init);
  const set = (k: keyof FormState, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (step === 0) {
      if (!form.nama_pemberi_kerja.trim()) return "Nama Pemberi Kerja wajib diisi";
      if (!form.nama_freelancer.trim()) return "Nama Freelancer wajib diisi";
      if (!form.nik_freelancer.trim()) return "NIK Freelancer wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.judul_pekerjaan.trim()) return "Judul pekerjaan wajib diisi";
      if (!form.deskripsi_pekerjaan.trim()) return "Deskripsi pekerjaan wajib diisi";
      if (!form.deliverable.trim()) return "Deliverable wajib diisi";
      if (!form.tanggal_mulai) return "Tanggal mulai wajib diisi";
      if (!form.tanggal_selesai) return "Tanggal selesai wajib diisi";
    }
    if (step === 2) {
      if (!form.jumlah_imbalan || form.jumlah_imbalan < 10000) return "Jumlah imbalan minimal Rp 10.000";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
    }
    return "";
  };

  const next = () => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(s => s + 1); };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const dpPersen = parseInt(form.dp_persen) || 50;
      const dpAmount = Math.round(form.jumlah_imbalan * dpPersen / 100);
      const res = await fetch("/api/generate/freelancer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jumlah_revisi: parseInt(form.jumlah_revisi) || 2, dp_persen: dpPersen, dp_jumlah: dpAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
      sessionStorage.setItem("kontrak_contract", JSON.stringify(data));
      router.push("/preview");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  };

  return (
    <ContractForm title="Kontrak Jasa Freelancer" subtitle="Lindungi hak cipta & pembayaranmu secara legal" steps={STEPS} currentStep={step} loading={loading} error={error} onNext={next} onBack={() => { setError(""); setStep(s => s - 1); }} onSubmit={submit} contractTypeLabel="💼 Kontrak Freelancer">
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>Pemberi Kerja (Klien)</p>
          <FormInput label="Nama / Nama Perusahaan" required>
            <input className="form-input" placeholder="Nama perorangan atau perusahaan" value={form.nama_pemberi_kerja} onChange={e => set("nama_pemberi_kerja", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama PT/CV" hint="opsional">
              <input className="form-input" value={form.nama_perusahaan} onChange={e => set("nama_perusahaan", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Alamat Pemberi Kerja" required>
            <textarea className="form-input" rows={2} value={form.alamat_pemberi_kerja} onChange={e => set("alamat_pemberi_kerja", e.target.value)} />
          </FormInput>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>Freelancer</p>
          <FormInput label="Nama Lengkap" required>
            <input className="form-input" placeholder="Sesuai KTP" value={form.nama_freelancer} onChange={e => set("nama_freelancer", e.target.value)} />
          </FormInput>
          <FormInput label="NIK / No. KTP" required>
            <input className="form-input" placeholder="16 digit" maxLength={16} value={form.nik_freelancer} onChange={e => set("nik_freelancer", e.target.value)} />
          </FormInput>
          <FormInput label="Alamat Lengkap" required>
            <textarea className="form-input" rows={2} value={form.alamat_freelancer} onChange={e => set("alamat_freelancer", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="Bank">
              <select className="form-input" value={form.nama_bank_freelancer} onChange={e => set("nama_bank_freelancer", e.target.value)}>
                {["BCA","BNI","BRI","Mandiri","BSI","CIMB","Danamon","Permata"].map(b => <option key={b}>{b}</option>)}
              </select>
            </FormInput>
            <FormInput label="No. Rekening">
              <input className="form-input" placeholder="No. rekening" value={form.nomor_rekening_freelancer} onChange={e => set("nomor_rekening_freelancer", e.target.value)} />
            </FormInput>
            <FormInput label="Atas Nama">
              <input className="form-input" value={form.atas_nama_rekening} onChange={e => set("atas_nama_rekening", e.target.value)} />
            </FormInput>
          </div>
          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Email Penerima Dokumen" required>
            <input className="form-input" type="email" placeholder="email@contoh.com" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} />
          </FormInput>
          <FormInput label="WhatsApp" hint="opsional">
            <input className="form-input" placeholder="08xxx" value={form.nomorWhatsapp} onChange={e => set("nomorWhatsapp", e.target.value)} />
          </FormInput>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Judul Pekerjaan" required>
            <input className="form-input" placeholder="Contoh: Desain Logo & Brand Identity" value={form.judul_pekerjaan} onChange={e => set("judul_pekerjaan", e.target.value)} />
          </FormInput>
          <FormInput label="Deskripsi Lengkap Pekerjaan" required>
            <textarea className="form-input" rows={3} placeholder="Jelaskan scope pekerjaan secara detail..." value={form.deskripsi_pekerjaan} onChange={e => set("deskripsi_pekerjaan", e.target.value)} />
          </FormInput>
          <FormInput label="Deliverable (Hasil yang Diserahkan)" required>
            <textarea className="form-input" rows={2} placeholder="Contoh: 3 konsep logo format PNG + AI + brand guide PDF" value={form.deliverable} onChange={e => set("deliverable", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="Jumlah Revisi" required>
              <input className="form-input" type="number" min="0" value={form.jumlah_revisi} onChange={e => set("jumlah_revisi", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal Mulai" required>
              <input className="form-input" type="date" value={form.tanggal_mulai} onChange={e => set("tanggal_mulai", e.target.value)} />
            </FormInput>
            <FormInput label="Deadline" required>
              <input className="form-input" type="date" value={form.tanggal_selesai} onChange={e => set("tanggal_selesai", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Lokasi Kerja">
            <select className="form-input" value={form.lokasi_kerja} onChange={e => set("lokasi_kerja", e.target.value)}>
              <option value="remote">Remote (dari mana saja)</option>
              <option value="onsite">On-site (di kantor klien)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </FormInput>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <RpInput label="Total Nilai Kontrak" required value={form.jumlah_imbalan} onChange={v => set("jumlah_imbalan", v)} />
          <FormInput label="Skema Pembayaran">
            <select className="form-input" value={form.skema_pembayaran} onChange={e => set("skema_pembayaran", e.target.value)}>
              <option value="sekaligus">Sekaligus setelah selesai</option>
              <option value="dp_pelunasan">DP + Pelunasan</option>
              <option value="per_milestone">Per Milestone</option>
            </select>
          </FormInput>
          {form.skema_pembayaran === "dp_pelunasan" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <FormInput label="DP (%)">
                <input className="form-input" type="number" min="10" max="90" value={form.dp_persen} onChange={e => set("dp_persen", e.target.value)} />
              </FormInput>
              <FormInput label="Tgl Bayar DP">
                <input className="form-input" type="date" value={form.tanggal_pembayaran_dp} onChange={e => set("tanggal_pembayaran_dp", e.target.value)} />
              </FormInput>
              <FormInput label="Tgl Pelunasan">
                <input className="form-input" type="date" value={form.tanggal_pembayaran_lunas} onChange={e => set("tanggal_pembayaran_lunas", e.target.value)} />
              </FormInput>
            </div>
          )}
          <FormInput label="Kepemilikan Hak Cipta Setelah Lunas">
            <select className="form-input" value={form.kepemilikan_hak_cipta} onChange={e => set("kepemilikan_hak_cipta", e.target.value)}>
              <option value="pemberi_kerja">Milik Pemberi Kerja (paling umum)</option>
              <option value="freelancer">Tetap milik Freelancer (lisensi ke klien)</option>
              <option value="bersama">Dimiliki bersama</option>
            </select>
          </FormInput>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="hak_portofolio" checked={form.hak_portofolio} onChange={e => set("hak_portofolio", e.target.checked)} />
            <label htmlFor="hak_portofolio" className="text-sm cursor-pointer">Freelancer boleh tampilkan di portofolio</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="ada_nda" checked={form.ada_nda} onChange={e => set("ada_nda", e.target.checked)} />
            <label htmlFor="ada_nda" className="text-sm cursor-pointer">Tambahkan klausul kerahasiaan (NDA)</label>
          </div>
          {form.ada_nda && (
            <FormInput label="Durasi Kerahasiaan">
              <select className="form-input" value={form.masa_kerahasiaan} onChange={e => set("masa_kerahasiaan", e.target.value)}>
                <option value="1tahun">1 Tahun setelah kontrak</option>
                <option value="2tahun">2 Tahun setelah kontrak</option>
                <option value="5tahun">5 Tahun setelah kontrak</option>
                <option value="selamanya">Selamanya</option>
              </select>
            </FormInput>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Kota Penandatanganan" required>
              <input className="form-input" placeholder="Jakarta" value={form.kota_penandatanganan} onChange={e => set("kota_penandatanganan", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal TTD" required>
              <input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} />
            </FormInput>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-1">
          <ReviewRow label="Pemberi Kerja" value={form.nama_pemberi_kerja} />
          <ReviewRow label="Freelancer" value={form.nama_freelancer} />
          <ReviewRow label="Pekerjaan" value={form.judul_pekerjaan} />
          <ReviewRow label="Deadline" value={form.tanggal_selesai} />
          <ReviewRow label="Total Nilai" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.jumlah_imbalan)}`} />
          <ReviewRow label="Skema Bayar" value={form.skema_pembayaran.replace(/_/g, " ")} />
          <ReviewRow label="Hak Cipta" value={form.kepemilikan_hak_cipta.replace(/_/g, " ")} />
          <ReviewRow label="NDA" value={form.ada_nda ? `Ya (${form.masa_kerahasiaan})` : "Tidak"} />
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['freelancer']} />
        </div>
      )}
    </ContractForm>
  );
}
