import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Perjanjian Konsinyasi Titip Jual UMKM | LegalKan",
  description:
    "Buat perjanjian konsinyasi (titip jual) untuk produk UMKM yang sah. Atur komisi, pelaporan, dan tanggung jawab kerusakan barang. Mulai Rp 29.000.",
  keywords:
    "perjanjian konsinyasi, kontrak titip jual, surat konsinyasi UMKM Indonesia",
  openGraph: {
    title: "Buat Perjanjian Konsinyasi Titip Jual UMKM | LegalKan",
    description:
      "Buat perjanjian konsinyasi (titip jual) untuk produk UMKM yang sah. Atur komisi, pelaporan, dan tanggung jawab kerusakan barang. Mulai Rp 29.000.",
    type: "website",
  },
};

export default function KonsinyasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
