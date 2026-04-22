"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CitySearch from "@/components/CitySearch";
import BankSearch from "@/components/BankSearch";

const STEPS = ["Profil Usaha", "Skala Usaha", "Struktur Usaha", "Konfirmasi Dokumen", "Detail Dokumen"];

interface WizardState {
  namaUsaha: string;
  bentukUsaha: "Perorangan" | "CV" | "PT" | "UD" | "Koperasi" | "";
  bidangUsaha: string;
  lamaUsaha: "<6bln" | "6-12bln" | "1-2thn" | ">2thn" | "";
  alamatUsaha: string;
  kotaUsaha: string;
  jumlahKaryawan: "0" | "1-5" | "6-20" | ">20" | "";
  omzetPerBulan: "<5jt" | "5-20jt" | "20-50jt" | ">50jt" | "";
  modalBerasalDari: "Sendiri" | "Keluarga/Teman" | "Investor" | "Campuran" | "";
  punyaNIB: boolean | null;
  adaAgunan: boolean | null;
  adaKaryawanTetap: boolean | null;
  adaMitra: boolean | null;
  jumlahMitra: number;
  adaPinjamanLuar: boolean | null;
  pernahApplyKUR: boolean | null;
  namaPemilik: string;
  emailPembeli: string;
  nomorWhatsapp: string;
}

interface KaryawanDetail {
  namaKaryawan: string;
  nikKaryawan: string;
  jabatan: string;
  gajiPokok: string;
  durasiKontrak: string;
  // NEW: fields for improved PKWT compliance
  teleponKaryawan: string;
  emailKaryawan: string;
  ruangLingkup: string;
  namaBankKaryawan: string;
  nomorRekeningKaryawan: string;
  atasNamaRekeningKaryawan: string;
}

interface Step5Data {
  namaLengkapPemilik: string;
  nikPemilik: string;
  alamatLengkap: string;
  tanggalLahirPemilik: string;
  karyawan: KaryawanDetail[];
  namaMitra: string;
  nikMitra: string;
  porsiPemilik: string;
  namaPemberiPinjaman: string;
  nikPemberiPinjaman: string;
  jumlahPinjaman: string;
  bungaPerTahun: string;
  jangkaWaktu: string;
  namaPemberKuasa: string;
  namaPenerimaKuasa: string;
  nikPenerimaKuasa: string;
  keperluanKuasa: string;
  // SKU (Surat Keterangan Usaha) RT/Lurah fields
  namaUsahaSKU: string;
  jenisUsahaSKU: string;
  lamaUsahaSKU: string;
  nomorRT: string;
  nomorRW: string;
  kelurahan: string;
  kecamatan: string;
  kodePos: string;
  namaKetuaRT: string;
  namaKetuaRW: string;
  namaLurah: string;
}

const INITIAL: WizardState = {
  namaUsaha: "",
  bentukUsaha: "",
  bidangUsaha: "",
  lamaUsaha: "",
  alamatUsaha: "",
  kotaUsaha: "",
  jumlahKaryawan: "",
  omzetPerBulan: "",
  modalBerasalDari: "",
  punyaNIB: null,
  adaAgunan: null,
  adaKaryawanTetap: null,
  adaMitra: null,
  jumlahMitra: 1,
  adaPinjamanLuar: null,
  pernahApplyKUR: null,
  namaPemilik: "",
  emailPembeli: "",
  nomorWhatsapp: "",
};

const INITIAL_KARYAWAN: KaryawanDetail = {
  namaKaryawan: "",
  nikKaryawan: "",
  jabatan: "",
  gajiPokok: "",
  durasiKontrak: "12 bulan",
  teleponKaryawan: "",
  emailKaryawan: "",
  ruangLingkup: "",
  namaBankKaryawan: "BRI",
  nomorRekeningKaryawan: "",
  atasNamaRekeningKaryawan: "",
};

function calcBundlePrice(n: number): number {
  if (n === 0) return 0;
  if (n <= 2) return 59000;
  return Math.min(59000 + (n - 2) * 25000, 199000);
}

function calcBundleSeparate(n: number): number {
  return n * 39000;
}

interface RecommendedDoc {
  id: string;
  icon: string;
  title: string;
  desc: string;
  count?: number;
}

interface KURRecommendation {
  bank: string;
  logo: string;
  product: string;
  plafonMax: string;
  bunga: string;
  highlight: string;
  cocokUntuk: string;
  url: string;
  badge: string | null;
  badgeColor: string | null;
}

function getDocCountFromList(docs: RecommendedDoc[]): number {
  return docs.reduce((sum, d) => sum + (d.id === "pkwt" ? (d.count || 1) : 1), 0);
}

function getKURRecommendations(s: WizardState): KURRecommendation[] {
  const recommendations: KURRecommendation[] = [];
  recommendations.push({
    bank: "BRI", logo: "🏦", product: "KUR Mikro BRI", plafonMax: "Rp 100 juta",
    bunga: "6% per tahun", highlight: "Penyalur KUR terbesar Indonesia. Proses cepat, kantor di seluruh Indonesia.",
    cocokUntuk: "Semua jenis usaha mikro", url: "https://bri.co.id/kur", badge: "Terpopuler", badgeColor: "#06D6A0",
  });
  if (s.bidangUsaha === "Pertanian/Perkebunan" || s.bidangUsaha === "Peternakan" || s.bidangUsaha === "Perikanan") {
    recommendations.push({
      bank: "BNI", logo: "🏛️", product: "KUR BNI Agribisnis", plafonMax: "Rp 500 juta",
      bunga: "6% per tahun", highlight: "Spesialis agribisnis. Ada pendampingan usaha dari BNI.",
      cocokUntuk: "Pertanian, peternakan, perikanan", url: "https://bni.co.id/kur", badge: "Cocok untukmu", badgeColor: "#FF4D6D",
    });
  }
  if (s.omzetPerBulan === ">50jt" || s.bentukUsaha === "PT" || s.bentukUsaha === "CV") {
    recommendations.push({
      bank: "Mandiri", logo: "🏢", product: "KUR Kecil Mandiri", plafonMax: "Rp 500 juta",
      bunga: "6% per tahun", highlight: "Ideal untuk usaha yang sudah berkembang dengan omzet lebih besar.",
      cocokUntuk: "CV, PT, usaha omzet > Rp 20 juta/bulan", url: "https://bankmandiri.co.id/kur", badge: null, badgeColor: null,
    });
  }
  recommendations.push({
    bank: "BSI", logo: "🕌", product: "KUR BSI (Syariah)", plafonMax: "Rp 500 juta",
    bunga: "Akad murabahah setara 6%", highlight: "Pilihan tepat jika kamu ingin pembiayaan sesuai prinsip syariah.",
    cocokUntuk: "Semua sektor, khususnya yang prefer syariah", url: "https://bankbsi.co.id/kur", badge: null, badgeColor: null,
  });
  return recommendations;
}

function getRecommendedDocs(s: WizardState): RecommendedDoc[] {
  const docs: RecommendedDoc[] = [];
  docs.push({ id: "pernyataan-usaha-aktif", icon: "📜", title: "Surat Pernyataan Usaha Aktif", desc: "Deklarasi bahwa usahamu sedang aktif beroperasi, tidak dalam gagal bayar, dan patuh hukum." });
  docs.push({ id: "surat-keterangan-usaha", icon: "📋", title: "Surat Keterangan Usaha", desc: "Dokumen formal yang menerangkan keberadaan, jenis, dan alamat usahamu." });
  const hasKaryawan = (s.jumlahKaryawan !== "0" && s.jumlahKaryawan !== "") || s.adaKaryawanTetap === true;
  if (hasKaryawan) {
    let numPKWT = 1;
    if (s.jumlahKaryawan === "1-5") numPKWT = 3;
    else if (s.jumlahKaryawan === "6-20" || s.jumlahKaryawan === ">20") numPKWT = 5;
    docs.push({ id: "pkwt", icon: "👔", title: "PKWT (Kontrak Karyawan)", desc: "Perjanjian kerja untuk karyawanmu.", count: numPKWT });
  }
  if (s.adaMitra === true) {
    docs.push({ id: "bagi-hasil", icon: "🤝", title: "Perjanjian Bagi Hasil Usaha", desc: "Dokumen kemitraan yang mengatur porsi keuntungan dengan mitra bisnismu." });
  }
  if (s.modalBerasalDari !== "Sendiri" && s.modalBerasalDari !== "" && s.adaPinjamanLuar === true) {
    docs.push({ id: "hutang-piutang", icon: "💰", title: "Perjanjian Hutang Piutang", desc: "Dokumentasi modal pinjaman dari pihak luar untuk melengkapi bukti arus modal." });
  }
  if (s.bentukUsaha === "CV" || s.bentukUsaha === "PT") {
    docs.push({ id: "surat-kuasa", icon: "📝", title: "Surat Kuasa Direksi/Pengurus", desc: `Kuasa resmi dari ${s.bentukUsaha} ${s.namaUsaha || "kamu"} untuk pengurusan KUR.` });
  }
  return docs;
}

function SelectCard({ value, current, onClick, children }: {
  value: string; current: string | boolean | null; onClick: () => void; children: React.ReactNode;
}) {
  const selected = current === value;
  return (
    <button type="button" onClick={onClick} className="rounded-2xl p-4 text-left transition-all w-full"
      style={{ background: selected ? "rgba(255,77,109,0.08)" : "rgba(13,27,62,0.04)", border: selected ? "2px solid #FF4D6D" : "2px solid rgba(13,27,62,0.08)", cursor: "pointer" }}>
      <span className="text-sm font-semibold" style={{ color: selected ? "#FF4D6D" : "#3D4F7C" }}>{children}</span>
    </button>
  );
}

function YesNoSelect({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      {[true, false].map((v) => (
        <button key={String(v)} type="button" onClick={() => onChange(v)} className="flex-1 rounded-2xl py-3 text-sm font-bold transition-all"
          style={{ background: value === v ? "rgba(255,77,109,0.08)" : "rgba(13,27,62,0.04)", border: value === v ? "2px solid #FF4D6D" : "2px solid rgba(13,27,62,0.08)", color: value === v ? "#FF4D6D" : "#3D4F7C", cursor: "pointer" }}>
          {v ? "✅ Ya" : "❌ Tidak"}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-bold mb-2" style={{ color: "#0D1B3E" }}>{children}</label>;
}

export default function KURWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBank, setSelectedBank] = useState<"BCA" | "BNI" | "BRI" | "MANDIRI" | "">("");

  // Step 4 state
  const [pkwtCount, setPkwtCount] = useState<number | null>(null);
  const [skippedDocs, setSkippedDocs] = useState<Set<string>>(new Set());

  // Step 5 state
  const [step5Data, setStep5Data] = useState<Step5Data>({
    namaLengkapPemilik: "", nikPemilik: "", alamatLengkap: "", tanggalLahirPemilik: "",
    karyawan: Array.from({ length: 5 }, () => ({ ...INITIAL_KARYAWAN })),
    namaMitra: "", nikMitra: "", porsiPemilik: "",
    namaPemberiPinjaman: "", nikPemberiPinjaman: "", jumlahPinjaman: "", bungaPerTahun: "0", jangkaWaktu: "",
    namaPemberKuasa: "", namaPenerimaKuasa: "", nikPenerimaKuasa: "", keperluanKuasa: "mengurus pengajuan KUR",
    // SKU fields
    namaUsahaSKU: "", jenisUsahaSKU: "", lamaUsahaSKU: "",
    nomorRT: "", nomorRW: "", kelurahan: "", kecamatan: "", kodePos: "",
    namaKetuaRT: "", namaKetuaRW: "", namaLurah: "",
  });
  const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(new Set([0]));
  const [skuSectionOpen, setSkuSectionOpen] = useState(true);

  const set = (k: keyof WizardState, v: unknown) => setData((prev) => ({ ...prev, [k]: v }));
  const setStep5D = (k: keyof Omit<Step5Data, "karyawan">, v: string) =>
    setStep5Data((prev) => ({ ...prev, [k]: v }));
  const setStep5K = (idx: number, k: keyof KaryawanDetail, v: string) =>
    setStep5Data((prev) => ({
      ...prev,
      karyawan: prev.karyawan.map((item, i) => (i === idx ? { ...item, [k]: v } : item)),
    }));

  // Derived values
  const allDocs = getRecommendedDocs(data);
  const pkwtDoc = allDocs.find((d) => d.id === "pkwt");
  const nonPkwtDocs = allDocs.filter((d) => d.id !== "pkwt");
  const hasPKWT = !!pkwtDoc;
  const maxPkwt = Math.min(pkwtDoc?.count ?? 5, 5);
  const effectivePkwtCount = pkwtCount !== null ? pkwtCount : (pkwtDoc?.count ?? 1);

  const fullDocCount = nonPkwtDocs.length + (hasPKWT ? effectivePkwtCount : 0);
  const fullPrice = calcBundlePrice(fullDocCount);
  const separatePrice = calcBundleSeparate(fullDocCount);

  let activeDocCount = 0;
  for (const doc of nonPkwtDocs) { if (!skippedDocs.has(doc.id)) activeDocCount++; }
  if (hasPKWT && !skippedDocs.has("pkwt")) activeDocCount += effectivePkwtCount;
  const activePrice = calcBundlePrice(activeDocCount);
  const skippedSavings = Math.max(0, fullPrice - activePrice);
  const savingsPercent = separatePrice > 0 ? Math.round(((separatePrice - activePrice) / separatePrice) * 100) : 0;

  const previewDocs = getRecommendedDocs(data);
  const previewDocCount = getDocCountFromList(previewDocs);
  const previewPrice = calcBundlePrice(previewDocCount);
  const previewSeparate = calcBundleSeparate(previewDocCount);

  const hasBagiHasil = nonPkwtDocs.some((d) => d.id === "bagi-hasil") && !skippedDocs.has("bagi-hasil");
  const hasHutang = nonPkwtDocs.some((d) => d.id === "hutang-piutang") && !skippedDocs.has("hutang-piutang");
  const hasSuratKuasa = nonPkwtDocs.some((d) => d.id === "surat-kuasa") && !skippedDocs.has("surat-kuasa");
  const showPKWTSection = hasPKWT && !skippedDocs.has("pkwt") && effectivePkwtCount > 0;
  const hasSKU = !skippedDocs.has("surat-keterangan-usaha");

  function toggleSkip(docId: string) {
    setSkippedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId); else next.add(docId);
      return next;
    });
  }

  function toggleEmployee(idx: number) {
    setExpandedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function initStep5() {
    const skuLamaFill = data.lamaUsaha === "<6bln" ? "< 1"
      : data.lamaUsaha === "6-12bln" ? "1"
      : data.lamaUsaha === "1-2thn" ? "2"
      : data.lamaUsaha === ">2thn" ? "3"
      : "";
    setStep5Data((prev) => ({
      ...prev,
      namaLengkapPemilik: prev.namaLengkapPemilik || data.namaPemilik,
      alamatLengkap: prev.alamatLengkap || data.alamatUsaha,
      namaPemberKuasa: prev.namaPemberKuasa || data.namaPemilik,
      // Pre-fill SKU fields from wizard Step 1
      namaUsahaSKU: prev.namaUsahaSKU || data.namaUsaha,
      jenisUsahaSKU: prev.jenisUsahaSKU || data.bidangUsaha,
      lamaUsahaSKU: prev.lamaUsahaSKU || skuLamaFill,
    }));
  }

  function validateStep(): string {
    if (step === 0) {
      if (!data.namaUsaha.trim()) return "Nama usaha wajib diisi";
      if (!data.bentukUsaha) return "Pilih bentuk usaha";
      if (!data.bidangUsaha) return "Pilih bidang usaha";
      if (!data.lamaUsaha) return "Pilih lama usaha berjalan";
      if (!data.kotaUsaha.trim()) return "Kota usaha wajib diisi";
      if (!data.namaPemilik.trim()) return "Nama pemilik/penanggungjawab wajib diisi";
    }
    if (step === 1) {
      if (!data.jumlahKaryawan) return "Pilih jumlah karyawan";
      if (!data.omzetPerBulan) return "Pilih omzet per bulan";
      if (!data.modalBerasalDari) return "Pilih sumber modal";
      if (data.punyaNIB === null) return "Jawab pertanyaan tentang NIB";
      if (data.adaAgunan === null) return "Jawab pertanyaan tentang agunan";
    }
    if (step === 2) {
      if (data.adaKaryawanTetap === null) return "Jawab pertanyaan karyawan tetap";
      if (data.adaMitra === null) return "Jawab pertanyaan mitra bisnis";
      if (data.adaPinjamanLuar === null) return "Jawab pertanyaan pinjaman modal";
      if (data.pernahApplyKUR === null) return "Jawab pertanyaan riwayat KUR";
      if (!data.emailPembeli.trim()) return "Email wajib diisi untuk pengiriman dokumen";
    }
    if (step === 3) {
      if (!selectedBank) return "Pilih bank untuk pembayaran";
    }
    return "";
  }

  function validateStep5(): string {
    if (!step5Data.namaLengkapPemilik.trim()) return "Nama lengkap pemilik wajib diisi";
    if (step5Data.nikPemilik.replace(/\D/g, "").length !== 16) return "NIK pemilik harus 16 digit angka";
    if (!step5Data.alamatLengkap.trim()) return "Alamat lengkap wajib diisi";
    if (!step5Data.tanggalLahirPemilik) return "Tanggal lahir pemilik wajib diisi";
    if (hasPKWT && !skippedDocs.has("pkwt") && effectivePkwtCount > 0) {
      for (let i = 0; i < effectivePkwtCount; i++) {
        const k = step5Data.karyawan[i];
        if (!k.namaKaryawan.trim()) return `Nama karyawan ${i + 1} wajib diisi`;
        if (k.nikKaryawan.replace(/\D/g, "").length !== 16) return `NIK karyawan ${i + 1} harus 16 digit`;
        if (!k.jabatan.trim()) return `Jabatan karyawan ${i + 1} wajib diisi`;
        if (!k.gajiPokok || parseFloat(k.gajiPokok) <= 0) return `Gaji karyawan ${i + 1} wajib diisi`;
      }
    }
    if (hasBagiHasil) {
      if (!step5Data.namaMitra.trim()) return "Nama mitra wajib diisi";
      if (step5Data.nikMitra.replace(/\D/g, "").length !== 16) return "NIK mitra harus 16 digit";
      const p = parseInt(step5Data.porsiPemilik);
      if (isNaN(p) || p < 1 || p > 99) return "Porsi bagi hasil pemilik harus 1–99%";
    }
    if (hasHutang) {
      if (!step5Data.namaPemberiPinjaman.trim()) return "Nama pemberi pinjaman wajib diisi";
      if (step5Data.nikPemberiPinjaman.replace(/\D/g, "").length !== 16) return "NIK pemberi pinjaman harus 16 digit";
      if (!step5Data.jumlahPinjaman || parseFloat(step5Data.jumlahPinjaman) <= 0) return "Jumlah pinjaman wajib diisi";
      if (!step5Data.jangkaWaktu || parseInt(step5Data.jangkaWaktu) <= 0) return "Jangka waktu wajib diisi";
    }
    if (hasSuratKuasa) {
      if (!step5Data.namaPenerimaKuasa.trim()) return "Nama penerima kuasa wajib diisi";
      if (step5Data.nikPenerimaKuasa.replace(/\D/g, "").length !== 16) return "NIK penerima kuasa harus 16 digit";
      if (!step5Data.keperluanKuasa.trim()) return "Keperluan kuasa wajib diisi";
    }
    return "";
  }

  async function handleNext() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    if (step === 3) {
      initStep5();
      setStep(4);
    } else if (step === 4) {
      const err5 = validateStep5();
      if (err5) { setError(err5); return; }
      await handleCheckout();
    } else {
      setStep((s) => s + 1);
    }
  }

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate/kur-bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          jumlahMitra: data.adaMitra ? data.jumlahMitra : 0,
          pkwtCount: effectivePkwtCount,
          skippedDocIds: Array.from(skippedDocs),
          docDetails: {
            namaLengkapPemilik: step5Data.namaLengkapPemilik,
            nikPemilik: step5Data.nikPemilik,
            alamatLengkap: step5Data.alamatLengkap,
            tanggalLahirPemilik: step5Data.tanggalLahirPemilik,
            karyawan: step5Data.karyawan.slice(0, effectivePkwtCount).map((k) => ({
              ...k, gajiPokok: parseFloat(k.gajiPokok) || 0,
            })),
            namaMitra: step5Data.namaMitra,
            nikMitra: step5Data.nikMitra,
            porsiPemilik: parseInt(step5Data.porsiPemilik) || 50,
            namaPemberiPinjaman: step5Data.namaPemberiPinjaman,
            nikPemberiPinjaman: step5Data.nikPemberiPinjaman,
            jumlahPinjaman: parseFloat(step5Data.jumlahPinjaman) || 0,
            bungaPerTahun: parseFloat(step5Data.bungaPerTahun) || 0,
            jangkaWaktu: parseInt(step5Data.jangkaWaktu) || 12,
            namaPemberKuasa: step5Data.namaPemberKuasa,
            namaPenerimaKuasa: step5Data.namaPenerimaKuasa,
            nikPenerimaKuasa: step5Data.nikPenerimaKuasa,
            keperluanKuasa: step5Data.keperluanKuasa,
            // SKU RT/Lurah fields
            namaUsahaSKU: step5Data.namaUsahaSKU,
            jenisUsahaSKU: step5Data.jenisUsahaSKU,
            lamaUsahaSKU: step5Data.lamaUsahaSKU,
            nomorRT: step5Data.nomorRT,
            nomorRW: step5Data.nomorRW,
            kelurahan: step5Data.kelurahan,
            kecamatan: step5Data.kecamatan,
            kodePos: step5Data.kodePos,
            kotaSKU: data.kotaUsaha,
            namaKetuaRT: step5Data.namaKetuaRT,
            namaKetuaRW: step5Data.namaKetuaRW,
            namaLurah: step5Data.namaLurah,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal membuat bundle");
      const ICONS: Record<string, string> = {
        "pernyataan-usaha-aktif": "📜", "surat-keterangan-usaha": "📋",
        "perjanjian-bagi-hasil": "🤝", "perjanjian-hutang-piutang": "💰", "surat-kuasa": "📝",
      };
      sessionStorage.setItem("kur_bundle_htmls", JSON.stringify(
        json.documents.map((d: { id: string; title: string; html: string; nomorKontrak: string }) => ({
          id: d.id, title: d.title, html: d.html, nomorKontrak: d.nomorKontrak,
          icon: d.id.startsWith("pkwt") ? "👔" : (ICONS[d.id] || "📄"),
        }))
      ));
      const payRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractData: json.contractData, bank: selectedBank }),
      });
      const payJson = await payRes.json();
      if (!payRes.ok) throw new Error(payJson.error || "Gagal membuat pembayaran");
      sessionStorage.setItem("kontrak_payment", JSON.stringify(payJson.paymentData));
      router.push("/bayar");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan saat checkout");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "12px",
    border: "2px solid rgba(13,27,62,0.1)", fontSize: "0.9rem",
    color: "#0D1B3E", background: "white", outline: "none",
  };

  const sectionStyle: React.CSSProperties = {
    background: "white", borderRadius: "20px", padding: "1.5rem", marginBottom: "1.25rem",
    boxShadow: "0 2px 12px rgba(13,27,62,0.06)", border: "1px solid rgba(13,27,62,0.06)",
  };

  const counterBtnStyle: React.CSSProperties = {
    width: "28px", height: "28px", borderRadius: "50%",
    border: "2px solid #FF4D6D", background: "white",
    color: "#FF4D6D", fontWeight: 700, fontSize: "1rem",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, padding: 0,
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto" style={{ maxWidth: "640px" }}>

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/kur" className="text-xs font-semibold" style={{ color: "#6B7FA8" }}>
            ← Kembali ke Paket KUR-Ready
          </Link>
          <div className="mt-3">
            <span className="badge inline-flex mb-3"
              style={{ background: "rgba(255,209,102,0.12)", color: "#FFD166", border: "1px solid rgba(255,209,102,0.25)" }}>
              🏦 Paket KUR-Ready
            </span>
          </div>
          <h1 className="font-jakarta text-2xl font-extrabold" style={{ color: "#0D1B3E" }}>
            Cek Kebutuhan Dokumen KUR
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7FA8" }}>
            Jawab beberapa pertanyaan — sistem auto-detect dokumen yang kamu butuhkan
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                  style={{
                    background: i < step ? "#06D6A0" : i === step ? "#FF4D6D" : "rgba(13,27,62,0.1)",
                    color: i <= step ? "white" : "#9BA3C4",
                  }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-xs mt-1 font-semibold hidden sm:block"
                  style={{ color: i === step ? "#FF4D6D" : i < step ? "#06D6A0" : "#9BA3C4", fontSize: "0.6rem" }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: "1.5rem", height: "2px", background: i < step ? "#06D6A0" : "rgba(13,27,62,0.1)", borderRadius: "9999px", marginBottom: "1rem" }} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl px-4 py-3 mb-4 text-sm font-semibold"
            style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── STEP 1: Profil Usaha ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <div style={sectionStyle}>
              <div className="mb-5">
                <FieldLabel>Nama Usaha *</FieldLabel>
                <input style={inputStyle} placeholder="Contoh: Toko Makmur Jaya" value={data.namaUsaha} onChange={(e) => set("namaUsaha", e.target.value)} />
              </div>
              <div className="mb-5">
                <FieldLabel>Nama Pemilik / Penanggungjawab *</FieldLabel>
                <input style={inputStyle} placeholder="Nama lengkap sesuai KTP" value={data.namaPemilik} onChange={(e) => set("namaPemilik", e.target.value)} />
              </div>
              <div className="mb-5">
                <FieldLabel>Bentuk Usaha *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {["Perorangan", "CV", "PT", "UD", "Koperasi"].map((b) => (
                    <SelectCard key={b} value={b} current={data.bentukUsaha} onClick={() => set("bentukUsaha", b)}>{b}</SelectCard>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <FieldLabel>Bidang Usaha *</FieldLabel>
                <select style={{ ...inputStyle, appearance: "auto" }} value={data.bidangUsaha} onChange={(e) => set("bidangUsaha", e.target.value)}>
                  <option value="">-- Pilih bidang usaha --</option>
                  {["Perdagangan", "Jasa", "Pertanian/Perkebunan", "Peternakan", "Perikanan", "Manufaktur/Produksi", "Kuliner", "Lainnya"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <FieldLabel>Lama Usaha Berjalan *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {[{ v: "<6bln", label: "< 6 bulan" }, { v: "6-12bln", label: "6–12 bulan" }, { v: "1-2thn", label: "1–2 tahun" }, { v: ">2thn", label: "> 2 tahun" }].map(({ v, label }) => (
                    <SelectCard key={v} value={v} current={data.lamaUsaha} onClick={() => set("lamaUsaha", v)}>{label}</SelectCard>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <FieldLabel>Alamat Usaha</FieldLabel>
                <input style={inputStyle} placeholder="Jl. Contoh No. 1" value={data.alamatUsaha} onChange={(e) => set("alamatUsaha", e.target.value)} />
              </div>
              <div>
                <FieldLabel>Kota / Kabupaten *</FieldLabel>
                <CitySearch value={data.kotaUsaha} onChange={(val) => set("kotaUsaha", val)} placeholder="Cari kota atau kabupaten..." required />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Skala Usaha ──────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div style={sectionStyle}>
              <div className="mb-5">
                <FieldLabel>Jumlah Karyawan *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {[{ v: "0", label: "0 (saya sendiri)" }, { v: "1-5", label: "1–5 orang" }, { v: "6-20", label: "6–20 orang" }, { v: ">20", label: "> 20 orang" }].map(({ v, label }) => (
                    <SelectCard key={v} value={v} current={data.jumlahKaryawan} onClick={() => set("jumlahKaryawan", v)}>{label}</SelectCard>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <FieldLabel>Omzet Per Bulan *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {[{ v: "<5jt", label: "< Rp 5 juta" }, { v: "5-20jt", label: "Rp 5–20 juta" }, { v: "20-50jt", label: "Rp 20–50 juta" }, { v: ">50jt", label: "> Rp 50 juta" }].map(({ v, label }) => (
                    <SelectCard key={v} value={v} current={data.omzetPerBulan} onClick={() => set("omzetPerBulan", v)}>{label}</SelectCard>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <FieldLabel>Modal Usaha Berasal Dari *</FieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {["Sendiri", "Keluarga/Teman", "Investor", "Campuran"].map((v) => (
                    <SelectCard key={v} value={v} current={data.modalBerasalDari} onClick={() => set("modalBerasalDari", v)}>{v}</SelectCard>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <FieldLabel>Sudah punya NIB? *</FieldLabel>
                <YesNoSelect value={data.punyaNIB} onChange={(v) => set("punyaNIB", v)} />
                {data.punyaNIB === false && (
                  <div className="mt-3 rounded-2xl p-4" style={{ background: "rgba(255,209,102,0.12)", border: "1.5px solid rgba(255,209,102,0.45)" }}>
                    <p className="font-bold text-sm mb-1" style={{ color: "#0D1B3E" }}>📋 Belum punya NIB?</p>
                    <p className="text-xs mb-3" style={{ color: "#5A6A8A", lineHeight: 1.6 }}>NIB wajib untuk apply KUR di bank. Gratis dan bisa diurus sendiri online dalam 15 menit.</p>
                    <a href="/nib-guide" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: "#9A7500", textDecoration: "underline" }}>Panduan Urus NIB →</a>
                  </div>
                )}
              </div>
              <div>
                <FieldLabel>Ada aset sebagai agunan? *</FieldLabel>
                <YesNoSelect value={data.adaAgunan} onChange={(v) => set("adaAgunan", v)} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Struktur Usaha ───────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div style={sectionStyle}>
              <div className="mb-5">
                <FieldLabel>Ada karyawan tetap? *</FieldLabel>
                <YesNoSelect value={data.adaKaryawanTetap} onChange={(v) => set("adaKaryawanTetap", v)} />
              </div>
              <div className="mb-5">
                <FieldLabel>Ada mitra/partner bisnis? *</FieldLabel>
                <YesNoSelect value={data.adaMitra} onChange={(v) => set("adaMitra", v)} />
                {data.adaMitra && (
                  <div className="mt-3">
                    <FieldLabel>Berapa jumlah mitra?</FieldLabel>
                    <input type="number" min={1} max={10} style={inputStyle} value={data.jumlahMitra}
                      onChange={(e) => set("jumlahMitra", Math.max(1, parseInt(e.target.value) || 1))} />
                  </div>
                )}
              </div>
              <div className="mb-5">
                <FieldLabel>Ada pinjaman modal dari luar (non-bank)? *</FieldLabel>
                <YesNoSelect value={data.adaPinjamanLuar} onChange={(v) => set("adaPinjamanLuar", v)} />
              </div>
              <div className="mb-5">
                <FieldLabel>Pernah apply KUR sebelumnya? *</FieldLabel>
                <YesNoSelect value={data.pernahApplyKUR} onChange={(v) => set("pernahApplyKUR", v)} />
              </div>
            </div>
            <div style={sectionStyle}>
              <h3 className="font-jakarta font-bold mb-4" style={{ color: "#0D1B3E" }}>📧 Kemana dokumen dikirim?</h3>
              <div className="mb-4">
                <FieldLabel>Email *</FieldLabel>
                <input type="email" style={inputStyle} placeholder="email@contoh.com" value={data.emailPembeli} onChange={(e) => set("emailPembeli", e.target.value)} />
              </div>
              <div>
                <FieldLabel>Nomor WhatsApp (opsional)</FieldLabel>
                <input type="tel" style={inputStyle} placeholder="08123456789" value={data.nomorWhatsapp} onChange={(e) => set("nomorWhatsapp", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Konfirmasi Dokumen ───────────────────────────────────────── */}
        {step === 3 && (
          <div>
            {/* Price Banner */}
            <div className="rounded-3xl p-6 mb-5" style={{ background: "linear-gradient(135deg, #0D1B3E, #162348)", boxShadow: "0 8px 40px rgba(13,27,62,0.25)" }}>
              <div className="text-center mb-4">
                <p className="text-xs font-semibold mb-1" style={{ color: "#6B7FA8" }}>
                  🎯 Auto-detected untuk {data.namaUsaha}
                </p>
                <p className="font-jakarta font-extrabold text-white" style={{ fontSize: "1.5rem" }}>
                  {activeDocCount} Dokumen Aktif
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs" style={{ color: "#6B7FA8" }}>Total Paket</p>
                  <p className="font-jakarta font-extrabold" style={{ fontSize: "2rem", color: "#FFD166" }}>
                    Rp {new Intl.NumberFormat("id-ID").format(activePrice)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="rounded-xl px-3 py-1.5" style={{ background: "rgba(6,214,160,0.15)", border: "1px solid rgba(6,214,160,0.3)" }}>
                    <p className="text-xs font-bold" style={{ color: "#06D6A0" }}>Hemat {savingsPercent}%</p>
                    <p className="text-xs line-through" style={{ color: "#6B7FA8" }}>
                      Rp {new Intl.NumberFormat("id-ID").format(separatePrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings from skipped docs */}
            {skippedDocs.size > 0 && skippedSavings > 0 && (
              <div className="rounded-2xl p-4 mb-4 text-sm font-semibold" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.25)" }}>
                <span style={{ color: "#028A66" }}>
                  💚 Kamu menghemat Rp {new Intl.NumberFormat("id-ID").format(skippedSavings)} karena sudah punya {skippedDocs.size} dokumen
                </span>
              </div>
            )}

            {/* Doc list - individual cards */}
            <div className="mb-5">
              <p className="text-xs font-bold mb-3" style={{ color: "#6B7FA8" }}>DOKUMEN YANG DIREKOMENDASIKAN</p>

              {/* Non-PKWT docs */}
              {nonPkwtDocs.map((doc) => {
                const skipped = skippedDocs.has(doc.id);
                return (
                  <div key={doc.id} className="rounded-2xl mb-3 transition-all"
                    style={{ background: "white", border: `1.5px solid ${skipped ? "rgba(13,27,62,0.06)" : "rgba(13,27,62,0.1)"}`, padding: "1rem 1.25rem", opacity: skipped ? 0.6 : 1, boxShadow: "0 1px 6px rgba(13,27,62,0.05)" }}>
                    <div className="flex items-start gap-3">
                      <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: "0.1rem" }}>{doc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: "#0D1B3E", textDecoration: skipped ? "line-through" : "none" }}>{doc.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#6B7FA8", lineHeight: 1.6 }}>{doc.desc}</p>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer" style={{ userSelect: "none" }}>
                          <input type="checkbox" checked={skipped} onChange={() => toggleSkip(doc.id)} style={{ accentColor: "#FF4D6D", width: "14px", height: "14px", flexShrink: 0 }} />
                          <span className="text-xs" style={{ color: "#9BA3C4" }}>Saya sudah punya dokumen ini</span>
                        </label>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, padding: "0.3rem 0.65rem", borderRadius: "9999px", background: skipped ? "rgba(13,27,62,0.06)" : "rgba(6,214,160,0.15)", color: skipped ? "#9BA3C4" : "#06D6A0", marginTop: "0.1rem", whiteSpace: "nowrap" }}>
                        {skipped ? "Dilewati" : "✓ Termasuk"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* PKWT row — single row with counter */}
              {hasPKWT && (() => {
                const skipped = skippedDocs.has("pkwt");
                return (
                  <div className="rounded-2xl mb-3 transition-all"
                    style={{ background: "white", border: `1.5px solid ${skipped ? "rgba(13,27,62,0.06)" : "rgba(13,27,62,0.1)"}`, padding: "1rem 1.25rem", opacity: skipped ? 0.6 : 1, boxShadow: "0 1px 6px rgba(13,27,62,0.05)" }}>
                    <div className="flex items-start gap-3">
                      <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: "0.1rem" }}>👔</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-sm flex-1" style={{ color: "#0D1B3E", textDecoration: skipped ? "line-through" : "none" }}>PKWT Karyawan</p>
                          {!skipped && (
                            <div className="flex items-center gap-2">
                              <button style={counterBtnStyle} onClick={() => { if (effectivePkwtCount > 1) setPkwtCount(effectivePkwtCount - 1); }} type="button">−</button>
                              <span className="font-extrabold text-sm" style={{ color: "#0D1B3E", minWidth: "1.5rem", textAlign: "center" }}>{effectivePkwtCount}</span>
                              <button style={counterBtnStyle} onClick={() => { if (effectivePkwtCount < maxPkwt) setPkwtCount(effectivePkwtCount + 1); }} type="button">+</button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "#6B7FA8", lineHeight: 1.6 }}>Perjanjian kerja untuk karyawanmu.{!skipped ? ` +Rp ${new Intl.NumberFormat("id-ID").format(effectivePkwtCount * 25000)} (${effectivePkwtCount} karyawan)` : ""}</p>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer" style={{ userSelect: "none" }}>
                          <input type="checkbox" checked={skipped} onChange={() => toggleSkip("pkwt")} style={{ accentColor: "#FF4D6D", width: "14px", height: "14px", flexShrink: 0 }} />
                          <span className="text-xs" style={{ color: "#9BA3C4" }}>Saya sudah punya dokumen ini</span>
                        </label>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, padding: "0.3rem 0.65rem", borderRadius: "9999px", background: skipped ? "rgba(13,27,62,0.06)" : "rgba(6,214,160,0.15)", color: skipped ? "#9BA3C4" : "#06D6A0", marginTop: "0.1rem", whiteSpace: "nowrap" }}>
                        {skipped ? "Dilewati" : "✓ Termasuk"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* KUR Bank Matcher */}
            {(() => {
              const kurRecs = getKURRecommendations(data);
              return (
                <div className="mb-5">
                  <div className="rounded-3xl p-5" style={{ background: "white", boxShadow: "0 2px 12px rgba(13,27,62,0.06)", border: "1px solid rgba(13,27,62,0.08)" }}>
                    <p className="font-jakarta font-extrabold mb-1" style={{ color: "#0D1B3E", fontSize: "1rem" }}>🏦 Bank KUR yang Cocok untuk Kamu</p>
                    <p className="text-xs mb-4" style={{ color: "#6B7FA8" }}>Berdasarkan profil usahamu, ini rekomendasi kami:</p>
                    <div className="space-y-4">
                      {kurRecs.map((rec) => (
                        <div key={rec.bank} className="rounded-2xl" style={{ background: "white", border: "1.5px solid rgba(13,27,62,0.1)", position: "relative", padding: "1.25rem 1.5rem" }}>
                          {rec.badge && (
                            <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", fontSize: "0.6rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "9999px", background: `${rec.badgeColor}22`, color: rec.badgeColor ?? "#06D6A0" }}>{rec.badge}</span>
                          )}
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: "1.5rem" }}>{rec.logo}</span>
                            <span className="font-jakarta font-bold" style={{ color: "#0D1B3E", fontSize: "1rem" }}>{rec.bank}</span>
                          </div>
                          <p className="text-sm font-semibold mb-2" style={{ color: "#3D4F7C" }}>{rec.product}</p>
                          <div className="flex gap-3 text-xs mb-3" style={{ color: "#6B7FA8" }}>
                            <span>Plafon: s/d {rec.plafonMax}</span><span>·</span><span>Bunga: {rec.bunga}</span>
                          </div>
                          <p className="text-xs mb-4" style={{ color: "#5A6A8A", lineHeight: 1.7 }}>✓ {rec.highlight}</p>
                          <a href={rec.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold rounded-xl px-4 py-2" style={{ background: "rgba(13,27,62,0.06)", color: "#0D1B3E" }}>Cek KUR {rec.bank} →</a>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl p-5 mt-3" style={{ background: "rgba(155,138,251,0.08)", border: "1.5px solid rgba(155,138,251,0.3)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: "1.1rem" }}>🤝</span>
                      <p className="font-jakarta font-bold text-sm" style={{ color: "#4B3FAF" }}>Butuh bantuan proses pengajuan?</p>
                    </div>
                    <p className="text-xs mb-3" style={{ color: "#6B7FA8", lineHeight: 1.6 }}>Lendana bisa bantu kamu apply ke bank tanpa ribet. Plafon sesuai bank mitra · bunga 6% per tahun · <span style={{ fontWeight: 600, color: "#9B8AFB" }}>Dibantu tim</span></p>
                    <a href="https://lendana.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold rounded-xl px-3 py-1.5" style={{ background: "rgba(155,138,251,0.18)", color: "#4B3FAF" }}>Hubungi Lendana →</a>
                  </div>
                </div>
              );
            })()}

            {/* Bank selector */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: "white", boxShadow: "0 2px 12px rgba(13,27,62,0.06)", border: "1px solid rgba(13,27,62,0.06)" }}>
              <p className="font-jakarta font-bold mb-4 text-sm" style={{ color: "#0D1B3E" }}>🏦 Pilih Bank untuk Pembayaran *</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                {(["BCA", "BNI", "BRI", "MANDIRI"] as const).map((b) => (
                  <button key={b} type="button" onClick={() => setSelectedBank(b)} className="rounded-xl py-3 text-sm font-bold transition-all"
                    style={{ background: selectedBank === b ? "rgba(255,77,109,0.08)" : "rgba(13,27,62,0.04)", border: selectedBank === b ? "2px solid #FF4D6D" : "2px solid rgba(13,27,62,0.08)", color: selectedBank === b ? "#FF4D6D" : "#3D4F7C", cursor: "pointer" }}>
                    Bank {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust notice */}
            <div className="rounded-2xl px-4 py-3 mb-5 text-xs" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}>
              <span style={{ color: "#028A66", fontWeight: 600 }}>
                ✅ Dokumen sesuai standar perbankan · 🔒 Data terenkripsi · 📧 Dikirim ke {data.emailPembeli}
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 5: Detail Dokumen ───────────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <div className="rounded-2xl px-4 py-3 mb-5" style={{ background: "rgba(255,209,102,0.08)", border: "1px solid rgba(255,209,102,0.2)" }}>
              <p className="text-sm font-bold" style={{ color: "#9A7500" }}>📝 Lengkapi Data Dokumen</p>
              <p className="text-xs mt-1" style={{ color: "#B8920A" }}>Data ini akan digunakan untuk mengisi dokumen yang kamu pilih.</p>
            </div>

            {/* Section A: Data Pemilik */}
            <div style={sectionStyle}>
              <h3 className="font-jakarta font-bold text-sm mb-4" style={{ color: "#0D1B3E" }}>👤 Data Pemilik Usaha</h3>
              <div className="mb-4">
                <FieldLabel>Nama Lengkap Pemilik *</FieldLabel>
                <input style={inputStyle} placeholder="Sesuai KTP" value={step5Data.namaLengkapPemilik} onChange={(e) => setStep5D("namaLengkapPemilik", e.target.value)} />
              </div>
              <div className="mb-4">
                <FieldLabel>NIK / No. KTP Pemilik * (16 digit)</FieldLabel>
                <input style={inputStyle} placeholder="3271xxxxxxxxxxxxxxxx" value={step5Data.nikPemilik} maxLength={16} inputMode="numeric"
                  onChange={(e) => setStep5D("nikPemilik", e.target.value.replace(/\D/g, ""))} />
                {step5Data.nikPemilik && step5Data.nikPemilik.length > 0 && step5Data.nikPemilik.length !== 16 && (
                  <p className="text-xs mt-1" style={{ color: "#FF4D6D" }}>{step5Data.nikPemilik.length}/16 digit</p>
                )}
              </div>
              <div className="mb-4">
                <FieldLabel>Alamat Lengkap *</FieldLabel>
                <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="Jl. Contoh No. 1, Kecamatan, Kota"
                  value={step5Data.alamatLengkap} onChange={(e) => setStep5D("alamatLengkap", e.target.value)} />
              </div>
              <div>
                <FieldLabel>Tanggal Lahir *</FieldLabel>
                <input type="date" style={inputStyle} value={step5Data.tanggalLahirPemilik} onChange={(e) => setStep5D("tanggalLahirPemilik", e.target.value)} />
              </div>

              {/* SKU Subsection — collapsible */}
              {hasSKU && (
                <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(13,27,62,0.1)" }}>
                  <button type="button" onClick={() => setSkuSectionOpen(!skuSectionOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                    style={{ background: skuSectionOpen ? "rgba(255,77,109,0.04)" : "rgba(13,27,62,0.02)", cursor: "pointer", border: "none" }}>
                    <div>
                      <span className="font-bold text-sm" style={{ color: "#0D1B3E" }}>📋 Data untuk Surat Keterangan Usaha</span>
                      <p className="text-xs mt-0.5" style={{ color: "#6B7FA8" }}>Dibutuhkan RT/RW/Lurah untuk mengeluarkan surat resmi</p>
                    </div>
                    <span style={{ color: "#6B7FA8", fontSize: "0.8rem", flexShrink: 0 }}>{skuSectionOpen ? "▲" : "▼"}</span>
                  </button>
                  {skuSectionOpen && (
                    <div className="p-4 space-y-4" style={{ borderTop: "1px solid rgba(13,27,62,0.08)" }}>
                      <div>
                        <FieldLabel>Nama Usaha</FieldLabel>
                        <input style={inputStyle} placeholder="Nama usaha Anda (contoh: Warung Bu Siti)" value={step5Data.namaUsahaSKU}
                          onChange={(e) => setStep5D("namaUsahaSKU", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Jenis / Bidang Usaha</FieldLabel>
                        <input style={inputStyle} placeholder="Contoh: Perdagangan, Kuliner, Jasa" value={step5Data.jenisUsahaSKU}
                          onChange={(e) => setStep5D("jenisUsahaSKU", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Lama Usaha Berjalan (tahun)</FieldLabel>
                        <input style={inputStyle} placeholder="Contoh: 2" value={step5Data.lamaUsahaSKU}
                          onChange={(e) => setStep5D("lamaUsahaSKU", e.target.value)} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <FieldLabel>Nomor RT</FieldLabel>
                          <input style={inputStyle} placeholder="001" value={step5Data.nomorRT}
                            onChange={(e) => setStep5D("nomorRT", e.target.value)} />
                        </div>
                        <div>
                          <FieldLabel>Nomor RW</FieldLabel>
                          <input style={inputStyle} placeholder="003" value={step5Data.nomorRW}
                            onChange={(e) => setStep5D("nomorRW", e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Kelurahan</FieldLabel>
                        <input style={inputStyle} placeholder="Nama kelurahan" value={step5Data.kelurahan}
                          onChange={(e) => setStep5D("kelurahan", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Kecamatan</FieldLabel>
                        <input style={inputStyle} placeholder="Nama kecamatan" value={step5Data.kecamatan}
                          onChange={(e) => setStep5D("kecamatan", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Kode Pos</FieldLabel>
                        <input style={inputStyle} placeholder="5 digit kode pos" maxLength={5} inputMode="numeric"
                          value={step5Data.kodePos} onChange={(e) => setStep5D("kodePos", e.target.value.replace(/\D/g, ""))} />
                      </div>
                      <div>
                        <FieldLabel>Nama Ketua RT</FieldLabel>
                        <input style={inputStyle} placeholder="Nama ketua RT" value={step5Data.namaKetuaRT}
                          onChange={(e) => setStep5D("namaKetuaRT", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Nama Ketua RW</FieldLabel>
                        <input style={inputStyle} placeholder="Nama ketua RW" value={step5Data.namaKetuaRW}
                          onChange={(e) => setStep5D("namaKetuaRW", e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Nama Lurah</FieldLabel>
                        <input style={inputStyle} placeholder="Nama lurah / kepala kelurahan" value={step5Data.namaLurah}
                          onChange={(e) => setStep5D("namaLurah", e.target.value)} />
                      </div>
                      <div className="rounded-xl px-3 py-2" style={{ background: "rgba(255,209,102,0.08)", border: "1px solid rgba(255,209,102,0.25)" }}>
                        <p className="text-xs" style={{ color: "#9A7500" }}>💡 Kosongkan jika belum tahu — bisa diisi manual di dokumen setelah diunduh.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section B: Data Karyawan (PKWT) */}
            {showPKWTSection && (
              <div style={sectionStyle}>
                <h3 className="font-jakarta font-bold text-sm mb-1" style={{ color: "#0D1B3E" }}>👔 Data Karyawan (untuk PKWT)</h3>
                <p className="text-xs mb-4" style={{ color: "#6B7FA8" }}>{effectivePkwtCount} karyawan — isi data masing-masing</p>
                {Array.from({ length: effectivePkwtCount }, (_, i) => {
                  const expanded = expandedEmployees.has(i);
                  const k = step5Data.karyawan[i];
                  return (
                    <div key={i} className="rounded-2xl mb-3 overflow-hidden" style={{ border: "1.5px solid rgba(13,27,62,0.1)" }}>
                      <button type="button" onClick={() => toggleEmployee(i)} className="w-full flex items-center justify-between px-4 py-3 text-left"
                        style={{ background: expanded ? "rgba(255,77,109,0.04)" : "rgba(13,27,62,0.02)", cursor: "pointer" }}>
                        <span className="font-bold text-sm" style={{ color: "#0D1B3E" }}>Karyawan ke-{i + 1}</span>
                        <span style={{ color: "#6B7FA8", fontSize: "0.8rem" }}>{expanded ? "▲" : "▼"}</span>
                      </button>
                      {expanded && (
                        <div className="p-4 space-y-4">
                          <div>
                            <FieldLabel>Nama Lengkap Karyawan *</FieldLabel>
                            <input style={inputStyle} placeholder="Nama lengkap" value={k.namaKaryawan} onChange={(e) => setStep5K(i, "namaKaryawan", e.target.value)} />
                          </div>
                          <div>
                            <FieldLabel>NIK Karyawan * (16 digit)</FieldLabel>
                            <input style={inputStyle} placeholder="16 digit NIK" maxLength={16} inputMode="numeric"
                              value={k.nikKaryawan} onChange={(e) => setStep5K(i, "nikKaryawan", e.target.value.replace(/\D/g, ""))} />
                            {k.nikKaryawan && k.nikKaryawan.length > 0 && k.nikKaryawan.length !== 16 && (
                              <p className="text-xs mt-1" style={{ color: "#FF4D6D" }}>{k.nikKaryawan.length}/16 digit</p>
                            )}
                          </div>
                          <div>
                            <FieldLabel>Jabatan / Posisi *</FieldLabel>
                            <input style={inputStyle} placeholder="Contoh: Kasir, Admin, Teknisi" value={k.jabatan} onChange={(e) => setStep5K(i, "jabatan", e.target.value)} />
                          </div>
                          <div>
                            <FieldLabel>Gaji Pokok per Bulan (Rp) *</FieldLabel>
                            <input type="number" style={inputStyle} placeholder="Contoh: 3000000" min={0} value={k.gajiPokok} onChange={(e) => setStep5K(i, "gajiPokok", e.target.value)} />
                          </div>
                          <div>
                            <FieldLabel>Durasi Kontrak *</FieldLabel>
                            <select style={{ ...inputStyle, appearance: "auto" }} value={k.durasiKontrak} onChange={(e) => setStep5K(i, "durasiKontrak", e.target.value)}>
                              {["6 bulan", "12 bulan", "24 bulan", "Sesuai kesepakatan"].map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          <div>
                            <FieldLabel>Ruang Lingkup Pekerjaan</FieldLabel>
                            <textarea style={{ ...inputStyle, minHeight: "64px", resize: "vertical" }} placeholder="Jelaskan uraian tugas dan tanggung jawab..." value={k.ruangLingkup} onChange={(e) => setStep5K(i, "ruangLingkup", e.target.value)} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div>
                              <FieldLabel>No. Telepon Karyawan</FieldLabel>
                              <input style={inputStyle} placeholder="08xxx" inputMode="tel" value={k.teleponKaryawan} onChange={(e) => setStep5K(i, "teleponKaryawan", e.target.value)} />
                            </div>
                            <div>
                              <FieldLabel>Email Karyawan</FieldLabel>
                              <input style={inputStyle} type="email" placeholder="email@contoh.com" value={k.emailKaryawan} onChange={(e) => setStep5K(i, "emailKaryawan", e.target.value)} />
                            </div>
                          </div>
                          <div style={{ background: "rgba(13,27,62,0.03)", borderRadius: "12px", padding: "12px" }}>
                            <p className="text-xs font-bold mb-2" style={{ color: "#0D1B3E" }}>Rekening Bank (untuk pembayaran gaji)</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                              <div>
                                <FieldLabel>Bank</FieldLabel>
                                <BankSearch value={k.namaBankKaryawan} onChange={(val) => setStep5K(i, "namaBankKaryawan", val)} placeholder="Cari bank..." />
                              </div>
                              <div>
                                <FieldLabel>No. Rekening</FieldLabel>
                                <input style={inputStyle} placeholder="No. rekening" inputMode="numeric" value={k.nomorRekeningKaryawan} onChange={(e) => setStep5K(i, "nomorRekeningKaryawan", e.target.value)} />
                              </div>
                              <div>
                                <FieldLabel>Atas Nama</FieldLabel>
                                <input style={inputStyle} placeholder="Nama pemilik rek." value={k.atasNamaRekeningKaryawan} onChange={(e) => setStep5K(i, "atasNamaRekeningKaryawan", e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Section C: Data Mitra */}
            {hasBagiHasil && (
              <div style={sectionStyle}>
                <h3 className="font-jakarta font-bold text-sm mb-4" style={{ color: "#0D1B3E" }}>🤝 Data Mitra Usaha</h3>
                <div className="mb-4">
                  <FieldLabel>Nama Lengkap Mitra *</FieldLabel>
                  <input style={inputStyle} placeholder="Nama lengkap mitra" value={step5Data.namaMitra} onChange={(e) => setStep5D("namaMitra", e.target.value)} />
                </div>
                <div className="mb-4">
                  <FieldLabel>NIK Mitra * (16 digit)</FieldLabel>
                  <input style={inputStyle} placeholder="16 digit NIK" maxLength={16} inputMode="numeric"
                    value={step5Data.nikMitra} onChange={(e) => setStep5D("nikMitra", e.target.value.replace(/\D/g, ""))} />
                  {step5Data.nikMitra && step5Data.nikMitra.length > 0 && step5Data.nikMitra.length !== 16 && (
                    <p className="text-xs mt-1" style={{ color: "#FF4D6D" }}>{step5Data.nikMitra.length}/16 digit</p>
                  )}
                </div>
                <div className="mb-4">
                  <FieldLabel>Porsi Bagi Hasil Pemilik (%) *</FieldLabel>
                  <input type="number" style={inputStyle} placeholder="Contoh: 60" min={1} max={99} value={step5Data.porsiPemilik} onChange={(e) => setStep5D("porsiPemilik", e.target.value)} />
                </div>
                {step5Data.porsiPemilik && parseInt(step5Data.porsiPemilik) >= 1 && parseInt(step5Data.porsiPemilik) <= 99 && (
                  <div className="rounded-xl px-3 py-2" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}>
                    <p className="text-xs" style={{ color: "#028A66" }}>
                      Pemilik: {step5Data.porsiPemilik}% · Mitra: {100 - parseInt(step5Data.porsiPemilik)}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Section D: Data Hutang Piutang */}
            {hasHutang && (
              <div style={sectionStyle}>
                <h3 className="font-jakarta font-bold text-sm mb-4" style={{ color: "#0D1B3E" }}>💰 Data Pinjaman Modal</h3>
                <div className="mb-4">
                  <FieldLabel>Nama Pemberi Pinjaman *</FieldLabel>
                  <input style={inputStyle} placeholder="Nama lengkap pemberi pinjaman" value={step5Data.namaPemberiPinjaman} onChange={(e) => setStep5D("namaPemberiPinjaman", e.target.value)} />
                </div>
                <div className="mb-4">
                  <FieldLabel>NIK Pemberi Pinjaman * (16 digit)</FieldLabel>
                  <input style={inputStyle} placeholder="16 digit NIK" maxLength={16} inputMode="numeric"
                    value={step5Data.nikPemberiPinjaman} onChange={(e) => setStep5D("nikPemberiPinjaman", e.target.value.replace(/\D/g, ""))} />
                  {step5Data.nikPemberiPinjaman && step5Data.nikPemberiPinjaman.length > 0 && step5Data.nikPemberiPinjaman.length !== 16 && (
                    <p className="text-xs mt-1" style={{ color: "#FF4D6D" }}>{step5Data.nikPemberiPinjaman.length}/16 digit</p>
                  )}
                </div>
                <div className="mb-4">
                  <FieldLabel>Jumlah Pinjaman (Rp) *</FieldLabel>
                  <input type="number" style={inputStyle} placeholder="Contoh: 50000000" min={0} value={step5Data.jumlahPinjaman} onChange={(e) => setStep5D("jumlahPinjaman", e.target.value)} />
                </div>
                <div className="mb-4">
                  <FieldLabel>Bunga per Tahun (%)</FieldLabel>
                  <input type="number" style={inputStyle} placeholder="0 jika tanpa bunga" min={0} step={0.1} value={step5Data.bungaPerTahun} onChange={(e) => setStep5D("bungaPerTahun", e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Jangka Waktu (bulan) *</FieldLabel>
                  <input type="number" style={inputStyle} placeholder="Contoh: 12" min={1} value={step5Data.jangkaWaktu} onChange={(e) => setStep5D("jangkaWaktu", e.target.value)} />
                </div>
              </div>
            )}

            {/* Section E: Data Surat Kuasa */}
            {hasSuratKuasa && (
              <div style={sectionStyle}>
                <h3 className="font-jakarta font-bold text-sm mb-4" style={{ color: "#0D1B3E" }}>📝 Data Surat Kuasa</h3>
                <div className="mb-4">
                  <FieldLabel>Nama Pemberi Kuasa</FieldLabel>
                  <input style={inputStyle} placeholder="Nama direktur/pengurus" value={step5Data.namaPemberKuasa} onChange={(e) => setStep5D("namaPemberKuasa", e.target.value)} />
                  <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>Biasanya diisi nama pemilik/direktur</p>
                </div>
                <div className="mb-4">
                  <FieldLabel>Nama Penerima Kuasa *</FieldLabel>
                  <input style={inputStyle} placeholder="Nama orang yang diberi kuasa" value={step5Data.namaPenerimaKuasa} onChange={(e) => setStep5D("namaPenerimaKuasa", e.target.value)} />
                </div>
                <div className="mb-4">
                  <FieldLabel>NIK Penerima Kuasa * (16 digit)</FieldLabel>
                  <input style={inputStyle} placeholder="16 digit NIK" maxLength={16} inputMode="numeric"
                    value={step5Data.nikPenerimaKuasa} onChange={(e) => setStep5D("nikPenerimaKuasa", e.target.value.replace(/\D/g, ""))} />
                  {step5Data.nikPenerimaKuasa && step5Data.nikPenerimaKuasa.length > 0 && step5Data.nikPenerimaKuasa.length !== 16 && (
                    <p className="text-xs mt-1" style={{ color: "#FF4D6D" }}>{step5Data.nikPenerimaKuasa.length}/16 digit</p>
                  )}
                </div>
                <div>
                  <FieldLabel>Keperluan Kuasa *</FieldLabel>
                  <input style={inputStyle} placeholder="mengurus pengajuan KUR" value={step5Data.keperluanKuasa} onChange={(e) => setStep5D("keperluanKuasa", e.target.value)} />
                </div>
              </div>
            )}

            {/* Summary before checkout */}
            <div className="rounded-2xl px-4 py-3 mb-5 text-xs" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}>
              <span style={{ color: "#028A66", fontWeight: 600 }}>
                ✅ {activeDocCount} dokumen · 🏦 Bank {selectedBank} · 📧 {data.emailPembeli}
              </span>
            </div>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────────────── */}
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <button type="button" onClick={() => { setStep((s) => s - 1); setError(""); }}
              className="flex-1 rounded-2xl py-3.5 text-sm font-bold transition-all"
              style={{ background: "rgba(13,27,62,0.06)", color: "#6B7FA8", border: "none", cursor: "pointer" }}>
              ← Kembali
            </button>
          )}
          <button type="button" onClick={handleNext} disabled={loading}
            className="flex-1 btn-primary py-3.5 text-sm font-extrabold">
            {loading ? "⏳ Memproses..." :
              step === 4 ? `🏦 Lanjut ke Pembayaran — Rp ${new Intl.NumberFormat("id-ID").format(activePrice)}` :
              step === 3 ? "Lanjut ke Detail Dokumen →" :
              step === 2 ? "🔍 Lihat Rekomendasi Dokumen →" :
              "Lanjut →"}
          </button>
        </div>

        {/* Preview (steps 0-2) */}
        {step < 3 && previewDocs.length > 0 && (
          <div className="mt-6 rounded-2xl p-4 text-center" style={{ background: "rgba(255,209,102,0.08)", border: "1px solid rgba(255,209,102,0.2)" }}>
            <p className="text-xs font-semibold" style={{ color: "#9A7500" }}>
              💡 Preview: <strong>{previewDocCount} dokumen</strong> ≈{" "}
              <strong>Rp {new Intl.NumberFormat("id-ID").format(previewPrice)}</strong>
              {previewSeparate > previewPrice && (
                <span style={{ color: "#06D6A0" }}> (hemat Rp {new Intl.NumberFormat("id-ID").format(previewSeparate - previewPrice)})</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
