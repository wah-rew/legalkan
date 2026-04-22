export interface ContractFormData {
  // ─── Core ───────────────────────────────────────────────
  namaPihakPertama: string;
  namaPihakKedua: string;
  alamatProperti: string;
  hargaSewa: number;
  durasiSewa: number;
  periodeSewa?: string;
  tanggalMulai: string;
  emailPembeli: string;
  nomorWhatsapp?: string;
  ketentuanTambahan?: string;

  // ─── Properti ───────────────────────────────────────────
  penggunaanProperti?: "hunian" | "komersial" | "campuran";
  kondisiProperti?: string;       // catatan kondisi saat serah terima
  perpanjanganOtomatis?: boolean;
  noticePeriodHari?: 30 | 60 | 90;
  eskalasHargaPersen?: number;    // 0 = tidak ada eskalasi

  // ─── Larangan ───────────────────────────────────────────
  laranganSubletting?: boolean;
  laranganRenovasi?: boolean;
  laranganHewan?: boolean;
  laranganMerokok?: boolean;
  laranganUsaha?: boolean;        // tidak boleh usaha/bisnis di hunian

  // ─── Utilitas ───────────────────────────────────────────
  utilitasListrik?: "penyewa" | "pemberi_sewa" | "dibagi";
  utilitasAir?: "penyewa" | "pemberi_sewa" | "dibagi";
  utilitasInternet?: "penyewa" | "pemberi_sewa" | "tidak_ada";

  // ─── Metode Pembayaran ──────────────────────────────────
  metodePembayaran?: "lunas" | "cicilan" | "dp_cicilan";
  frekuensiCicilan?: "bulanan" | "triwulan" | "semesteran" | "tahunan";
  jumlahPerCicilan?: number;
  jumlahDP?: number;

  // ─── Sertifikat Properti ──────────────────────────────────
  jenisSertifikat?: string;
  nomorSertifikat?: string;

  // ─── Rekening Bank Pemilik ──────────────────────────────
  namaBank?: string;
  nomorRekening?: string;

  // ─── Lokasi Pembuatan ──────────────────────────────────────────
  lokasiPembuatan?: string;        // kota/tempat dibuat, default = kota TTD

  // ─── Saksi-Saksi ────────────────────────────────────────
  saksiEnabled?: boolean;
  saksi1Nama?: string;
  saksi1NIK?: string;
  saksi2Nama?: string;
  saksi2NIK?: string;

  // ─── Deposit ────────────────────────────────────────────
  adaDeposit?: boolean;
  jumlahDeposit?: number;
  kondisiPengembalianDeposit?: "penuh" | "setelah_kerusakan" | "tidak_dikembalikan";
  waktuPengembalianDepositHari?: number;
}

export interface ContractData extends ContractFormData {
  nomorKontrak: string;
  tanggalPembuatan: string;
  tanggalBerakhir: string;
}

export interface PaymentData {
  orderId: string;
  contractData: ContractData;
  vaNumber: string;
  bank: "BCA" | "BNI" | "BRI" | "MANDIRI";
  amount: number;
  expiryTime: string;
  // Manual transfer fields
  uniqueCode?: number;
  totalWithCode?: number;
}

export type BankCode = "BCA" | "BNI" | "BRI" | "MANDIRI";

export const BANK_LABELS: Record<BankCode, string> = {
  BCA: "Bank BCA",
  BNI: "Bank BNI",
  BRI: "Bank BRI",
  MANDIRI: "Bank Mandiri",
};

export const PRICE = 29000;

export const CONTRACT_PRICES: Record<string, number> = {
  'sewa-properti': 29000,
  'hutang-piutang': 49000,
  'freelancer': 49000,
  'konsinyasi': 29000,
  'bagi-hasil': 79000,
  'sewa-kendaraan': 29000,
  'jual-beli': 19000,
  'event-organizer': 49000,
  'nda': 49000,
  // KUR bundle — price is calculated dynamically, 59000 is the minimum
  'kur-bundle': 59000,
};

export function getContractPrice(contractType?: string): number {
  if (!contractType) return PRICE;
  return CONTRACT_PRICES[contractType] ?? PRICE;
}

export function formatRpShort(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n);
}
