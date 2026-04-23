"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";
import CitySearch from "@/components/CitySearch";
import BankSearch from "@/components/BankSearch";

const STEPS = ["Para Pihak", "Detail Pinjaman", "Bunga & Jaminan", "Review"];

interface FormState {
  // Pihak Pertama
  nama_pemberi_pinjaman: string;
  nik_pemberi_pinjaman: string;
  alamat_pemberi_pinjaman: string;
  nomor_telepon_pemberi: string;
  // Rekening Pemberi Pinjaman
  namaBank: string;
  nomorRekening: string;
  atasNamaRekening: string;
  // Pihak Kedua
  nama_penerima_pinjaman: string;
  nik_penerima_pinjaman: string;
  alamat_penerima_pinjaman: string;
  nomor_telepon_penerima: string;
  // Detail
  jumlah_pinjaman: number;
  tanggal_pinjaman: string;
  tanggal_jatuh_tempo: string;
  cara_pembayaran_kembali: string;
  jumlah_cicilan: string;
  jumlah_angsuran: number;
  // Denda
  dendaKeterlambatan: string;
  // Lokasi
  lokasiPembuatan: string;
  // Bunga
  ada_bunga: boolean;
  persentase_bunga: string;
  jenis_bunga: string;
  // Jaminan
  ada_jaminan: boolean;
  jenis_jaminan: string;
  deskripsi_jaminan: string;
  nilai_jaminan: number;
  // Saksi
  nama_saksi_1: string;
  nik_saksi_1: string;
  saksi1Alamat: string;
  nama_saksi_2: string;
  nik_saksi_2: string;
  saksi2Alamat: string;
  // Penandatanganan
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp: string;
}

const init: FormState = {
  nama_pemberi_pinjaman: "", nik_pemberi_pinjaman: "", alamat_pemberi_pinjaman: "", nomor_telepon_pemberi: "",
  namaBank: "", nomorRekening: "", atasNamaRekening: "",
  nama_penerima_pinjaman: "", nik_penerima_pinjaman: "", alamat_penerima_pinjaman: "", nomor_telepon_penerima: "",
  jumlah_pinjaman: 0, tanggal_pinjaman: "", tanggal_jatuh_tempo: "",
  cara_pembayaran_kembali: "sekaligus", jumlah_cicilan: "", jumlah_angsuran: 0,
  dendaKeterlambatan: "0.5",
  lokasiPembuatan: "",
  ada_bunga: false, persentase_bunga: "", jenis_bunga: "flat",
  ada_jaminan: false, jenis_jaminan: "", deskripsi_jaminan: "", nilai_jaminan: 0,
  nama_saksi_1: "", nik_saksi_1: "", saksi1Alamat: "",
  nama_saksi_2: "", nik_saksi_2: "", saksi2Alamat: "",
  kota_penandatanganan: "", tanggal_penandatanganan: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function HutangPiutangPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kontrak_contract");
      if (raw) {
        const parsed = JSON.parse(raw);
        const contractType = parsed?.contractData?.contractType || parsed?.contractType;
        if (contractType === "hutang-piutang") {
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
      if (!form.nama_pemberi_pinjaman.trim()) return "Nama Pemberi Pinjaman wajib diisi";
      if (!form.nik_pemberi_pinjaman.trim()) return "NIK Pemberi Pinjaman wajib diisi";
      if (!form.nama_penerima_pinjaman.trim()) return "Nama Penerima Pinjaman wajib diisi";
      if (!form.nik_penerima_pinjaman.trim()) return "NIK Penerima Pinjaman wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email tidak valid";
    }
    if (step === 1) {
      if (!form.jumlah_pinjaman || form.jumlah_pinjaman < 10000) return "Jumlah pinjaman minimal Rp 10.000";
      if (!form.tanggal_pinjaman) return "Tanggal pinjaman wajib diisi";
      if (!form.tanggal_jatuh_tempo) return "Tanggal jatuh tempo wajib diisi";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
    }
    if (step === 2) {
      if (!form.nama_saksi_1.trim()) return "Nama saksi 1 wajib diisi";
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
      const res = await fetch("/api/generate/hutang-piutang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ada_bunga: form.ada_bunga,
          persentase_bunga: form.ada_bunga ? parseFloat(form.persentase_bunga) : undefined,
          ada_jaminan: form.ada_jaminan,
          jumlah_cicilan: form.jumlah_cicilan ? parseInt(form.jumlah_cicilan) : undefined,
          namaBank: form.namaBank || undefined,
          nomorRekening: form.nomorRekening || undefined,
          atasNamaRekening: form.atasNamaRekening || undefined,
          dendaKeterlambatan: form.dendaKeterlambatan || "0.5",
          lokasiPembuatan: form.lokasiPembuatan || undefined,
          saksi1Alamat: form.saksi1Alamat || undefined,
          saksi2Alamat: form.saksi2Alamat || undefined,
          nik_saksi_2: form.nik_saksi_2 || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate kontrak");
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
      title="Perjanjian Hutang Piutang"
      subtitle="Isi data lengkap — kontrak legal siap dalam menit"
      steps={STEPS}
      currentStep={step}
      loading={loading}
      error={error}
      onNext={next}
      onBack={() => { setError(""); setStep(s => s - 1); }}
      onSubmit={submit}
      contractTypeLabel="💰 Hutang Piutang"
    >
      {/* STEP 0: Para Pihak */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#FF4D6D" }}>Pemberi Pinjaman (Kreditur)</p>
          <FormInput label="Nama Lengkap" required>
            <input className="form-input" placeholder="Sesuai KTP" value={form.nama_pemberi_pinjaman} onChange={e => set("nama_pemberi_pinjaman", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK / No. KTP" required>
              <input className="form-input" placeholder="16 digit" maxLength={16} value={form.nik_pemberi_pinjaman} onChange={e => set("nik_pemberi_pinjaman", e.target.value)} />
            </FormInput>
            <FormInput label="No. Telepon">
              <input className="form-input" placeholder="08xxx" value={form.nomor_telepon_pemberi} onChange={e => set("nomor_telepon_pemberi", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Alamat Lengkap" required>
            <textarea className="form-input" rows={2} value={form.alamat_pemberi_pinjaman} onChange={e => set("alamat_pemberi_pinjaman", e.target.value)} />
          </FormInput>

          <p className="text-xs font-bold uppercase tracking-wider mt-2 mb-1" style={{ color: "#FF4D6D" }}>Rekening Pemberi Pinjaman</p>
          <p className="text-xs" style={{ color: "#666", marginBottom: 4 }}>Untuk tujuan pembayaran cicilan/pelunasan (opsional, tapi disarankan)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nama Bank" hint="opsional">
              <BankSearch value={form.namaBank || ""} onChange={(val) => set("namaBank", val)} placeholder="Cari nama bank..." />
            </FormInput>
            <FormInput label="Nomor Rekening" hint="opsional">
              <input className="form-input" placeholder="Nomor rekening" value={form.nomorRekening} onChange={e => set("nomorRekening", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Atas Nama Rekening" hint="opsional — kosongkan jika sama dengan nama pemberi">
            <input className="form-input" placeholder="Nama pemilik rekening" value={form.atasNamaRekening} onChange={e => set("atasNamaRekening", e.target.value)} />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)", margin: "8px 0" }} />
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#0D1B3E" }}>Penerima Pinjaman (Debitur)</p>
          <FormInput label="Nama Lengkap" required>
            <input className="form-input" placeholder="Sesuai KTP" value={form.nama_penerima_pinjaman} onChange={e => set("nama_penerima_pinjaman", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK / No. KTP" required>
              <input className="form-input" placeholder="16 digit" maxLength={16} value={form.nik_penerima_pinjaman} onChange={e => set("nik_penerima_pinjaman", e.target.value)} />
            </FormInput>
            <FormInput label="No. Telepon">
              <input className="form-input" placeholder="08xxx" value={form.nomor_telepon_penerima} onChange={e => set("nomor_telepon_penerima", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Alamat Lengkap" required>
            <textarea className="form-input" rows={2} value={form.alamat_penerima_pinjaman} onChange={e => set("alamat_penerima_pinjaman", e.target.value)} />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)", margin: "8px 0" }} />
          <FormInput label="Email Penerima Dokumen" required>
            <input className="form-input" type="email" placeholder="email@contoh.com" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} />
          </FormInput>
          <FormInput label="Nomor Telepon (opsional)">
            <input className="form-input" placeholder="08xxx" value={form.nomorWhatsapp} onChange={e => set("nomorWhatsapp", e.target.value)} />
          </FormInput>
        </div>
      )}

      {/* STEP 1: Detail Pinjaman */}
      {step === 1 && (
        <div className="space-y-4">
          <RpInput label="Jumlah Pinjaman" required value={form.jumlah_pinjaman} onChange={v => set("jumlah_pinjaman", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Tanggal Penyerahan Uang" required>
              <input className="form-input" type="date" value={form.tanggal_pinjaman} onChange={e => set("tanggal_pinjaman", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal Jatuh Tempo" required>
              <input className="form-input" type="date" value={form.tanggal_jatuh_tempo} onChange={e => set("tanggal_jatuh_tempo", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Cara Pengembalian" required>
            <select className="form-input" value={form.cara_pembayaran_kembali} onChange={e => set("cara_pembayaran_kembali", e.target.value)}>
              <option value="sekaligus">Sekaligus (lunas saat jatuh tempo)</option>
              <option value="cicilan_bulanan">Cicilan Bulanan</option>
              <option value="cicilan_mingguan">Cicilan Mingguan</option>
            </select>
          </FormInput>
          {form.cara_pembayaran_kembali !== "sekaligus" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Jumlah Cicilan" hint="berapa kali">
                <input className="form-input" type="number" min="1" value={form.jumlah_cicilan} onChange={e => set("jumlah_cicilan", e.target.value)} />
              </FormInput>
              <RpInput label="Besaran Per Cicilan" value={form.jumlah_angsuran} onChange={v => set("jumlah_angsuran", v)} />
            </div>
          )}

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <FormInput label="Denda Keterlambatan (% per hari)" hint="default 0.5% per hari">
            <input
              className="form-input"
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0.5"
              value={form.dendaKeterlambatan}
              onChange={e => set("dendaKeterlambatan", e.target.value)}
            />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Kota Penandatanganan" required>
              <CitySearch value={form.kota_penandatanganan} onChange={(val) => set("kota_penandatanganan", val)} placeholder="Cari kota atau kabupaten..." />
            </FormInput>
            <FormInput label="Tanggal Penandatanganan" required>
              <input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Lokasi Pembuatan" hint="opsional — misal: Jakarta Selatan, Notaris ABC">
            <input className="form-input" placeholder="Sama dengan kota penandatanganan jika kosong" value={form.lokasiPembuatan} onChange={e => set("lokasiPembuatan", e.target.value)} />
          </FormInput>
        </div>
      )}

      {/* STEP 2: Bunga & Jaminan */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(13,27,62,0.04)" }}>
            <input type="checkbox" id="ada_bunga" checked={form.ada_bunga} onChange={e => set("ada_bunga", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="ada_bunga" className="text-sm font-semibold cursor-pointer" style={{ color: "#0D1B3E" }}>Pinjaman dikenakan bunga</label>
          </div>
          {form.ada_bunga && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Bunga (% per bulan)">
                <input className="form-input" type="number" step="0.1" min="0" placeholder="2" value={form.persentase_bunga} onChange={e => set("persentase_bunga", e.target.value)} />
              </FormInput>
              <FormInput label="Jenis Bunga">
                <select className="form-input" value={form.jenis_bunga} onChange={e => set("jenis_bunga", e.target.value)}>
                  <option value="flat">Flat (dari pokok awal)</option>
                  <option value="efektif">Efektif/Proporsional (dari saldo sisa)</option>
                  <option value="majemuk">Majemuk (bunga berbunga)</option>
                </select>
              </FormInput>
            </div>
          )}

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(13,27,62,0.04)" }}>
            <input type="checkbox" id="ada_jaminan" checked={form.ada_jaminan} onChange={e => set("ada_jaminan", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="ada_jaminan" className="text-sm font-semibold cursor-pointer" style={{ color: "#0D1B3E" }}>Terdapat jaminan/agunan</label>
          </div>
          {form.ada_jaminan && (
            <>
              <FormInput label="Jenis Jaminan">
                <input className="form-input" placeholder="Contoh: BPKB Motor, Sertifikat Tanah" value={form.jenis_jaminan} onChange={e => set("jenis_jaminan", e.target.value)} />
              </FormInput>
              <FormInput label="Deskripsi Jaminan">
                <textarea className="form-input" rows={2} placeholder="Deskripsi lengkap barang jaminan" value={form.deskripsi_jaminan} onChange={e => set("deskripsi_jaminan", e.target.value)} />
              </FormInput>
              <RpInput label="Nilai Taksiran Jaminan" hint="estimasi nilai pasar jaminan" value={form.nilai_jaminan} onChange={v => set("nilai_jaminan", v)} />
            </>
          )}

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#0D1B3E" }}>Saksi-Saksi</p>
          <FormInput label="Nama Saksi 1" required>
            <input className="form-input" placeholder="Nama lengkap saksi" value={form.nama_saksi_1} onChange={e => set("nama_saksi_1", e.target.value)} />
          </FormInput>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK Saksi 1" hint="opsional">
              <input className="form-input" placeholder="16 digit" maxLength={16} value={form.nik_saksi_1} onChange={e => set("nik_saksi_1", e.target.value)} />
            </FormInput>
            <FormInput label="Alamat Saksi 1" hint="opsional">
              <input className="form-input" placeholder="Alamat lengkap saksi 1" value={form.saksi1Alamat} onChange={e => set("saksi1Alamat", e.target.value)} />
            </FormInput>
          </div>
          <FormInput label="Nama Saksi 2" hint="opsional">
            <input className="form-input" value={form.nama_saksi_2} onChange={e => set("nama_saksi_2", e.target.value)} />
          </FormInput>
          {form.nama_saksi_2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="NIK Saksi 2" hint="opsional">
                <input className="form-input" placeholder="16 digit" maxLength={16} value={form.nik_saksi_2} onChange={e => set("nik_saksi_2", e.target.value)} />
              </FormInput>
              <FormInput label="Alamat Saksi 2" hint="opsional">
                <input className="form-input" placeholder="Alamat lengkap saksi 2" value={form.saksi2Alamat} onChange={e => set("saksi2Alamat", e.target.value)} />
              </FormInput>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Review */}
      {step === 3 && (
        <div className="space-y-1">
          <ReviewRow label="Pemberi Pinjaman" value={form.nama_pemberi_pinjaman} />
          <ReviewRow label="NIK Pemberi" value={form.nik_pemberi_pinjaman} />
          {form.namaBank && <ReviewRow label="Bank Pemberi" value={`${form.namaBank} — ${form.nomorRekening}`} />}
          <ReviewRow label="Penerima Pinjaman" value={form.nama_penerima_pinjaman} />
          <ReviewRow label="NIK Penerima" value={form.nik_penerima_pinjaman} />
          <ReviewRow label="Jumlah Pinjaman" value={form.jumlah_pinjaman ? `Rp ${new Intl.NumberFormat("id-ID").format(form.jumlah_pinjaman)}` : "-"} />
          <ReviewRow label="Tanggal Pinjaman" value={form.tanggal_pinjaman} />
          <ReviewRow label="Jatuh Tempo" value={form.tanggal_jatuh_tempo} />
          <ReviewRow label="Cara Bayar Kembali" value={form.cara_pembayaran_kembali.replace(/_/g, " ")} />
          <ReviewRow label="Denda Keterlambatan" value={`${form.dendaKeterlambatan || "0.5"}% per hari`} />
          <ReviewRow label="Bunga" value={form.ada_bunga ? `${form.persentase_bunga}% per bulan (${form.jenis_bunga})` : "Tanpa bunga"} />
          <ReviewRow label="Jaminan" value={form.ada_jaminan ? form.jenis_jaminan : "Tanpa jaminan"} />
          {form.ada_jaminan && form.nilai_jaminan > 0 && (
            <ReviewRow label="Nilai Taksiran Jaminan" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.nilai_jaminan)}`} />
          )}
          <ReviewRow label="Kota TTD" value={form.kota_penandatanganan} />
          {form.lokasiPembuatan && <ReviewRow label="Lokasi Pembuatan" value={form.lokasiPembuatan} />}
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />
          <PriceBox price={CONTRACT_PRICES['hutang-piutang']} />
        </div>
      )}
    </ContractForm>
  );
}
