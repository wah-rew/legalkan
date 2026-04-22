"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ContractForm, { FormInput, RpInput, ReviewRow, PriceBox } from "@/components/ContractForm";
import { CONTRACT_PRICES } from "@/types";
import BankSearch from "@/components/BankSearch";

const STEPS = ["Para Pihak", "Detail Acara", "Harga & Ketentuan", "Review"];

interface FormState {
  // Klien
  nama_klien: string;
  nik_klien: string;
  alamat_klien: string;
  nomor_telepon_klien: string;
  emailKlien: string;
  // Mempelai (pernikahan)
  namaMempelaiPria: string;
  namaMempelaiWanita: string;
  // Vendor
  nama_eo_fotografer: string;
  nama_usaha_vendor: string;
  alamat_vendor: string;
  nomor_telepon_vendor: string;
  emailEO: string;
  nama_bank_vendor: string;
  nomor_rekening_vendor: string;
  atasNamaRekening: string;
  // Detail
  jenis_layanan: string;
  nama_acara: string;
  jenis_acara: string;
  tanggal_acara: string;
  waktu_mulai_acara: string;
  waktu_selesai_acara: string;
  lokasi_acara: string;
  estimasi_tamu: string;
  // Foto/Video
  durasi_pemotretan: string;
  jumlah_fotografer: string;
  jumlah_foto_diedit: string;
  format_file_foto: string;
  durasi_video: string;
  waktu_pengiriman_foto: string;
  waktu_pengiriman_video: string;
  media_penyerahan: string;
  // EO
  ruang_lingkup_eo: string;
  // Harga
  total_harga: number;
  persen_dp: string;
  tanggal_dp: string;
  tanggal_pelunasan: string;
  biaya_transportasi: number;
  biaya_akomodasi: number;
  dendaKeterlambatan: string;
  // TTD & Lokasi
  lokasiPembuatan: string;
  kota_penandatanganan: string;
  tanggal_penandatanganan: string;
  // Saksi
  saksi1Nama: string;
  saksi1NIK: string;
  saksi1Alamat: string;
  saksi2Nama: string;
  saksi2NIK: string;
  saksi2Alamat: string;
  // Meta
  emailPembeli: string;
  nomorWhatsapp: string;
}

const init: FormState = {
  nama_klien: "", nik_klien: "", alamat_klien: "", nomor_telepon_klien: "", emailKlien: "",
  namaMempelaiPria: "", namaMempelaiWanita: "",
  nama_eo_fotografer: "", nama_usaha_vendor: "", alamat_vendor: "", nomor_telepon_vendor: "",
  emailEO: "", nama_bank_vendor: "BCA", nomor_rekening_vendor: "", atasNamaRekening: "",
  jenis_layanan: "fotografer_videografer", nama_acara: "", jenis_acara: "pernikahan",
  tanggal_acara: "", waktu_mulai_acara: "08:00", waktu_selesai_acara: "22:00",
  lokasi_acara: "", estimasi_tamu: "100",
  durasi_pemotretan: "10", jumlah_fotografer: "2", jumlah_foto_diedit: "200",
  format_file_foto: "JPG", durasi_video: "10-15 menit highlight",
  waktu_pengiriman_foto: "14", waktu_pengiriman_video: "4", media_penyerahan: "Google Drive",
  ruang_lingkup_eo: "",
  total_harga: 0, persen_dp: "50", tanggal_dp: "", tanggal_pelunasan: "",
  biaya_transportasi: 0, biaya_akomodasi: 0, dendaKeterlambatan: "",
  lokasiPembuatan: "", kota_penandatanganan: "", tanggal_penandatanganan: "",
  saksi1Nama: "", saksi1NIK: "", saksi1Alamat: "",
  saksi2Nama: "", saksi2NIK: "", saksi2Alamat: "",
  emailPembeli: "", nomorWhatsapp: "",
};

export default function EventOrganizerPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(init);
  const set = (k: keyof FormState, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const dpPersen = parseInt(form.persen_dp) || 50;
  const dpAmount = Math.round(form.total_harga * dpPersen / 100);

  const isFoto = ["fotografer", "videografer", "fotografer_videografer"].includes(form.jenis_layanan);
  const isPernikahan = form.jenis_acara === "pernikahan";

  const validate = () => {
    if (step === 0) {
      if (!form.nama_klien.trim()) return "Nama klien wajib diisi";
      if (!form.nama_eo_fotografer.trim()) return "Nama vendor wajib diisi";
      if (!form.emailPembeli.includes("@")) return "Email dokumen tidak valid";
    }
    if (step === 1) {
      if (!form.nama_acara.trim()) return "Nama acara wajib diisi";
      if (!form.tanggal_acara) return "Tanggal acara wajib diisi";
      if (!form.lokasi_acara.trim()) return "Lokasi acara wajib diisi";
    }
    if (step === 2) {
      if (!form.total_harga || form.total_harga < 100000) return "Total harga wajib diisi (min Rp 100.000)";
      if (!form.tanggal_dp) return "Tanggal DP wajib diisi";
      if (!form.tanggal_pelunasan) return "Tanggal pelunasan wajib diisi";
      if (!form.kota_penandatanganan.trim()) return "Kota penandatanganan wajib diisi";
      if (!form.tanggal_penandatanganan) return "Tanggal penandatanganan wajib diisi";
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
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/generate/event-organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimasi_tamu: parseInt(form.estimasi_tamu) || 100,
          persen_dp: dpPersen,
          biaya_dp: dpAmount,
          durasi_pemotretan: form.durasi_pemotretan ? parseInt(form.durasi_pemotretan) : undefined,
          jumlah_fotografer: form.jumlah_fotografer ? parseInt(form.jumlah_fotografer) : undefined,
          jumlah_foto_diedit: form.jumlah_foto_diedit ? parseInt(form.jumlah_foto_diedit) : undefined,
          waktu_pengiriman_foto: form.waktu_pengiriman_foto ? parseInt(form.waktu_pengiriman_foto) : undefined,
          waktu_pengiriman_video: form.waktu_pengiriman_video ? parseInt(form.waktu_pengiriman_video) : undefined,
          // pass optional fields only if filled
          emailKlien: form.emailKlien || undefined,
          emailEO: form.emailEO || undefined,
          atasNamaRekening: form.atasNamaRekening || undefined,
          namaMempelaiPria: form.namaMempelaiPria || undefined,
          namaMempelaiWanita: form.namaMempelaiWanita || undefined,
          dendaKeterlambatan: form.dendaKeterlambatan || undefined,
          lokasiPembuatan: form.lokasiPembuatan || undefined,
          saksi1Nama: form.saksi1Nama || undefined,
          saksi1NIK: form.saksi1NIK || undefined,
          saksi1Alamat: form.saksi1Alamat || undefined,
          saksi2Nama: form.saksi2Nama || undefined,
          saksi2NIK: form.saksi2NIK || undefined,
          saksi2Alamat: form.saksi2Alamat || undefined,
        }),
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

  return (
    <ContractForm
      title="Kontrak EO / Fotografer"
      subtitle="Kontrak event yang melindungi dua pihak dari konflik"
      steps={STEPS}
      currentStep={step}
      loading={loading}
      error={error}
      onNext={next}
      onBack={() => { setError(""); setStep(s => s - 1); }}
      onSubmit={submit}
      contractTypeLabel="📸 EO / Fotografer"
    >
      {/* ── STEP 0: Para Pihak ─────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>
            Klien / Pemberi Kerja
          </p>

          <FormInput label="Nama Lengkap" required>
            <input className="form-input" value={form.nama_klien} onChange={e => set("nama_klien", e.target.value)} />
          </FormInput>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="NIK">
              <input className="form-input" maxLength={16} value={form.nik_klien} onChange={e => set("nik_klien", e.target.value)} />
            </FormInput>
            <FormInput label="Telepon">
              <input className="form-input" value={form.nomor_telepon_klien} onChange={e => set("nomor_telepon_klien", e.target.value)} />
            </FormInput>
          </div>

          <FormInput label="Email Klien" hint="opsional">
            <input className="form-input" type="email" value={form.emailKlien} onChange={e => set("emailKlien", e.target.value)} />
          </FormInput>

          <FormInput label="Alamat">
            <textarea className="form-input" rows={2} value={form.alamat_klien} onChange={e => set("alamat_klien", e.target.value)} />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>
            Vendor (EO / Fotografer)
          </p>

          <FormInput label="Nama Vendor / Fotografer" required>
            <input className="form-input" value={form.nama_eo_fotografer} onChange={e => set("nama_eo_fotografer", e.target.value)} />
          </FormInput>

          <FormInput label="Nama Usaha / Brand" hint="opsional">
            <input className="form-input" value={form.nama_usaha_vendor} onChange={e => set("nama_usaha_vendor", e.target.value)} />
          </FormInput>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Telepon">
              <input className="form-input" value={form.nomor_telepon_vendor} onChange={e => set("nomor_telepon_vendor", e.target.value)} />
            </FormInput>
            <FormInput label="Email EO" hint="opsional">
              <input className="form-input" type="email" value={form.emailEO} onChange={e => set("emailEO", e.target.value)} />
            </FormInput>
          </div>

          <FormInput label="Alamat">
            <textarea className="form-input" rows={2} value={form.alamat_vendor} onChange={e => set("alamat_vendor", e.target.value)} />
          </FormInput>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="Bank">
              <BankSearch value={form.nama_bank_vendor} onChange={(val) => set("nama_bank_vendor", val)} placeholder="Cari nama bank..." />
            </FormInput>
            <FormInput label="No. Rekening">
              <input className="form-input" value={form.nomor_rekening_vendor} onChange={e => set("nomor_rekening_vendor", e.target.value)} />
            </FormInput>
            <FormInput label="Atas Nama Rekening" hint="opsional">
              <input className="form-input" placeholder={form.nama_eo_fotografer || "Nama pemilik rekening"} value={form.atasNamaRekening} onChange={e => set("atasNamaRekening", e.target.value)} />
            </FormInput>
          </div>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />

          <FormInput label="Email Dokumen" required hint="Kontrak PDF dikirim ke email ini">
            <input className="form-input" type="email" value={form.emailPembeli} onChange={e => set("emailPembeli", e.target.value)} />
          </FormInput>

          <FormInput label="WhatsApp" hint="opsional">
            <input className="form-input" value={form.nomorWhatsapp} onChange={e => set("nomorWhatsapp", e.target.value)} />
          </FormInput>
        </div>
      )}

      {/* ── STEP 1: Detail Acara ───────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <FormInput label="Jenis Layanan">
            <select className="form-input" value={form.jenis_layanan} onChange={e => set("jenis_layanan", e.target.value)}>
              <option value="fotografer">Fotografer</option>
              <option value="videografer">Videografer</option>
              <option value="fotografer_videografer">Fotografer + Videografer</option>
              <option value="event_organizer">Event Organizer (EO)</option>
              <option value="dekorasi">Dekorasi</option>
              <option value="catering">Catering</option>
              <option value="MC">MC (Master of Ceremony)</option>
              <option value="hiburan">Hiburan / Band</option>
            </select>
          </FormInput>

          <FormInput label="Nama Acara" required>
            <input className="form-input" placeholder="Contoh: Pernikahan Budi & Ani" value={form.nama_acara} onChange={e => set("nama_acara", e.target.value)} />
          </FormInput>

          <FormInput label="Jenis Acara">
            <select className="form-input" value={form.jenis_acara} onChange={e => set("jenis_acara", e.target.value)}>
              <option value="pernikahan">Pernikahan</option>
              <option value="ulang_tahun">Ulang Tahun</option>
              <option value="seminar">Seminar / Workshop</option>
              <option value="konferensi">Konferensi</option>
              <option value="pameran">Pameran</option>
              <option value="launching_produk">Product Launch</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </FormInput>

          {isPernikahan && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF4D6D" }}>
                Data Mempelai
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label="Nama Mempelai Pria" hint="opsional">
                  <input className="form-input" placeholder="Nama lengkap mempelai pria" value={form.namaMempelaiPria} onChange={e => set("namaMempelaiPria", e.target.value)} />
                </FormInput>
                <FormInput label="Nama Mempelai Wanita" hint="opsional">
                  <input className="form-input" placeholder="Nama lengkap mempelai wanita" value={form.namaMempelaiWanita} onChange={e => set("namaMempelaiWanita", e.target.value)} />
                </FormInput>
              </div>
            </>
          )}

          <FormInput label="Tanggal Acara" required>
            <input className="form-input" type="date" value={form.tanggal_acara} onChange={e => set("tanggal_acara", e.target.value)} />
          </FormInput>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Jam Mulai">
              <input className="form-input" type="time" value={form.waktu_mulai_acara} onChange={e => set("waktu_mulai_acara", e.target.value)} />
            </FormInput>
            <FormInput label="Jam Selesai">
              <input className="form-input" type="time" value={form.waktu_selesai_acara} onChange={e => set("waktu_selesai_acara", e.target.value)} />
            </FormInput>
          </div>

          <FormInput label="Lokasi Acara" required>
            <textarea className="form-input" rows={2} value={form.lokasi_acara} onChange={e => set("lokasi_acara", e.target.value)} />
          </FormInput>

          <FormInput label="Estimasi Tamu">
            <input className="form-input" type="number" min="1" value={form.estimasi_tamu} onChange={e => set("estimasi_tamu", e.target.value)} />
          </FormInput>

          {/* Foto/Video detail */}
          {isFoto && (
            <>
              <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>
                Detail Fotografi / Videografi
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormInput label="Durasi (jam)">
                  <input className="form-input" type="number" value={form.durasi_pemotretan} onChange={e => set("durasi_pemotretan", e.target.value)} />
                </FormInput>
                <FormInput label="Jumlah Fotografer">
                  <input className="form-input" type="number" value={form.jumlah_fotografer} onChange={e => set("jumlah_fotografer", e.target.value)} />
                </FormInput>
                <FormInput label="Jumlah Foto Edited">
                  <input className="form-input" type="number" value={form.jumlah_foto_diedit} onChange={e => set("jumlah_foto_diedit", e.target.value)} />
                </FormInput>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label="Format File Foto">
                  <input className="form-input" placeholder="JPG, RAW, dll." value={form.format_file_foto} onChange={e => set("format_file_foto", e.target.value)} />
                </FormInput>
                <FormInput label="Durasi Video" hint="opsional">
                  <input className="form-input" placeholder="Contoh: 10-15 menit highlight" value={form.durasi_video} onChange={e => set("durasi_video", e.target.value)} />
                </FormInput>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormInput label="Kirim Foto (hari)">
                  <input className="form-input" type="number" value={form.waktu_pengiriman_foto} onChange={e => set("waktu_pengiriman_foto", e.target.value)} />
                </FormInput>
                <FormInput label="Kirim Video (minggu)">
                  <input className="form-input" type="number" value={form.waktu_pengiriman_video} onChange={e => set("waktu_pengiriman_video", e.target.value)} />
                </FormInput>
                <FormInput label="Media Penyerahan">
                  <input className="form-input" placeholder="Google Drive, USB, dll." value={form.media_penyerahan} onChange={e => set("media_penyerahan", e.target.value)} />
                </FormInput>
              </div>
            </>
          )}

          {/* EO scope */}
          {form.jenis_layanan === "event_organizer" && (
            <>
              <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
              <FormInput label="Ruang Lingkup EO">
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Jelaskan apa yang ditangani EO (dekorasi, catering, dokumentasi, koordinasi, dll.)..."
                  value={form.ruang_lingkup_eo}
                  onChange={e => set("ruang_lingkup_eo", e.target.value)}
                />
              </FormInput>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: Harga & Ketentuan ─────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <RpInput label="Total Harga Layanan" required value={form.total_harga} onChange={v => set("total_harga", v)} />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput label="DP (%)">
              <input className="form-input" type="number" min="10" max="90" value={form.persen_dp} onChange={e => set("persen_dp", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal DP" required>
              <input className="form-input" type="date" value={form.tanggal_dp} onChange={e => set("tanggal_dp", e.target.value)} />
            </FormInput>
            <FormInput label="Tanggal Pelunasan" required>
              <input className="form-input" type="date" value={form.tanggal_pelunasan} onChange={e => set("tanggal_pelunasan", e.target.value)} />
            </FormInput>
          </div>

          {form.total_harga > 0 && (
            <div className="rounded-2xl p-3" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}>
              <p className="text-xs font-semibold" style={{ color: "#028A66" }}>
                DP: Rp {new Intl.NumberFormat("id-ID").format(dpAmount)} &nbsp;|&nbsp; Pelunasan: Rp {new Intl.NumberFormat("id-ID").format(form.total_harga - dpAmount)}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <RpInput label="Biaya Transportasi" hint="opsional" value={form.biaya_transportasi} onChange={v => set("biaya_transportasi", v)} />
            <RpInput label="Biaya Akomodasi" hint="opsional" value={form.biaya_akomodasi} onChange={v => set("biaya_akomodasi", v)} />
          </div>

          <FormInput label="Denda Keterlambatan Bayar" hint="opsional, contoh: 0,5% per hari">
            <input
              className="form-input"
              placeholder="Contoh: 0,5% per hari dari sisa tagihan"
              value={form.dendaKeterlambatan}
              onChange={e => set("dendaKeterlambatan", e.target.value)}
            />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Lokasi Pembuatan Kontrak" hint="opsional, default = kota TTD">
              <input
                className="form-input"
                placeholder="Contoh: Jakarta Selatan"
                value={form.lokasiPembuatan}
                onChange={e => set("lokasiPembuatan", e.target.value)}
              />
            </FormInput>
            <FormInput label="Kota Penandatanganan" required>
              <input className="form-input" value={form.kota_penandatanganan} onChange={e => set("kota_penandatanganan", e.target.value)} />
            </FormInput>
          </div>

          <FormInput label="Tanggal TTD" required>
            <input className="form-input" type="date" value={form.tanggal_penandatanganan} onChange={e => set("tanggal_penandatanganan", e.target.value)} />
          </FormInput>

          <hr style={{ borderColor: "rgba(13,27,62,0.08)" }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0D1B3E" }}>
            Saksi-Saksi <span className="normal-case font-normal text-gray-400">(opsional)</span>
          </p>

          <div className="rounded-xl p-3 space-y-3" style={{ background: "rgba(13,27,62,0.03)", border: "1px solid rgba(13,27,62,0.08)" }}>
            <p className="text-xs font-semibold" style={{ color: "#0D1B3E" }}>Saksi 1</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput label="Nama Saksi 1">
                <input className="form-input" value={form.saksi1Nama} onChange={e => set("saksi1Nama", e.target.value)} />
              </FormInput>
              <FormInput label="NIK Saksi 1">
                <input className="form-input" maxLength={16} value={form.saksi1NIK} onChange={e => set("saksi1NIK", e.target.value)} />
              </FormInput>
            </div>
            <FormInput label="Alamat Saksi 1">
              <input className="form-input" value={form.saksi1Alamat} onChange={e => set("saksi1Alamat", e.target.value)} />
            </FormInput>
          </div>

          <div className="rounded-xl p-3 space-y-3" style={{ background: "rgba(13,27,62,0.03)", border: "1px solid rgba(13,27,62,0.08)" }}>
            <p className="text-xs font-semibold" style={{ color: "#0D1B3E" }}>Saksi 2</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput label="Nama Saksi 2">
                <input className="form-input" value={form.saksi2Nama} onChange={e => set("saksi2Nama", e.target.value)} />
              </FormInput>
              <FormInput label="NIK Saksi 2">
                <input className="form-input" maxLength={16} value={form.saksi2NIK} onChange={e => set("saksi2NIK", e.target.value)} />
              </FormInput>
            </div>
            <FormInput label="Alamat Saksi 2">
              <input className="form-input" value={form.saksi2Alamat} onChange={e => set("saksi2Alamat", e.target.value)} />
            </FormInput>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review ─────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#FF4D6D" }}>Klien</p>
          <ReviewRow label="Nama Klien" value={form.nama_klien} />
          <ReviewRow label="NIK Klien" value={form.nik_klien} />
          <ReviewRow label="Telepon Klien" value={form.nomor_telepon_klien} />
          {form.emailKlien && <ReviewRow label="Email Klien" value={form.emailKlien} />}
          {isPernikahan && form.namaMempelaiPria && <ReviewRow label="Mempelai Pria" value={form.namaMempelaiPria} />}
          {isPernikahan && form.namaMempelaiWanita && <ReviewRow label="Mempelai Wanita" value={form.namaMempelaiWanita} />}

          <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-2" style={{ color: "#0D1B3E" }}>Vendor</p>
          <ReviewRow label="Nama Vendor" value={form.nama_eo_fotografer} />
          {form.nama_usaha_vendor && <ReviewRow label="Nama Usaha" value={form.nama_usaha_vendor} />}
          {form.emailEO && <ReviewRow label="Email EO" value={form.emailEO} />}
          <ReviewRow label="Rekening" value={`${form.nama_bank_vendor} ${form.nomor_rekening_vendor}`} />
          {form.atasNamaRekening && <ReviewRow label="Atas Nama Rekening" value={form.atasNamaRekening} />}

          <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-2" style={{ color: "#0D1B3E" }}>Acara</p>
          <ReviewRow label="Jenis Layanan" value={form.jenis_layanan.replace(/_/g, " ")} />
          <ReviewRow label="Nama Acara" value={form.nama_acara} />
          <ReviewRow label="Jenis Acara" value={form.jenis_acara.replace(/_/g, " ")} />
          <ReviewRow label="Tanggal Acara" value={form.tanggal_acara} />
          <ReviewRow label="Waktu" value={`${form.waktu_mulai_acara} – ${form.waktu_selesai_acara}`} />
          <ReviewRow label="Lokasi" value={form.lokasi_acara} />
          <ReviewRow label="Estimasi Tamu" value={`± ${form.estimasi_tamu} orang`} />
          {isFoto && (
            <>
              {form.format_file_foto && <ReviewRow label="Format Foto" value={form.format_file_foto} />}
              {form.media_penyerahan && <ReviewRow label="Media Penyerahan" value={form.media_penyerahan} />}
            </>
          )}

          <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-2" style={{ color: "#0D1B3E" }}>Keuangan</p>
          <ReviewRow label="Total Harga" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.total_harga)}`} />
          <ReviewRow label="DP" value={`${dpPersen}% = Rp ${new Intl.NumberFormat("id-ID").format(dpAmount)}`} />
          <ReviewRow label="Pelunasan" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.total_harga - dpAmount)}`} />
          {form.dendaKeterlambatan && <ReviewRow label="Denda Keterlambatan" value={form.dendaKeterlambatan} />}
          {form.biaya_transportasi > 0 && <ReviewRow label="Biaya Transport" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.biaya_transportasi)}`} />}
          {form.biaya_akomodasi > 0 && <ReviewRow label="Biaya Akomodasi" value={`Rp ${new Intl.NumberFormat("id-ID").format(form.biaya_akomodasi)}`} />}

          <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-2" style={{ color: "#0D1B3E" }}>Penandatanganan</p>
          {form.lokasiPembuatan && <ReviewRow label="Lokasi Pembuatan" value={form.lokasiPembuatan} />}
          <ReviewRow label="Kota TTD" value={form.kota_penandatanganan} />
          <ReviewRow label="Tanggal TTD" value={form.tanggal_penandatanganan} />
          {form.saksi1Nama && (
            <>
              <ReviewRow label="Saksi 1" value={form.saksi1Nama} />
              {form.saksi1Alamat && <ReviewRow label="Alamat Saksi 1" value={form.saksi1Alamat} />}
            </>
          )}
          {form.saksi2Nama && (
            <>
              <ReviewRow label="Saksi 2" value={form.saksi2Nama} />
              {form.saksi2Alamat && <ReviewRow label="Alamat Saksi 2" value={form.saksi2Alamat} />}
            </>
          )}

          <p className="text-xs font-bold uppercase tracking-wider mt-3 mb-2" style={{ color: "#0D1B3E" }}>Dokumen</p>
          <ReviewRow label="Email Dokumen" value={form.emailPembeli} />

          <PriceBox price={CONTRACT_PRICES['event-organizer']} />
        </div>
      )}
    </ContractForm>
  );
}
