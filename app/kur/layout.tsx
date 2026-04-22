import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumen KUR UMKM Siap 10 Menit | LegalKan",
  description:
    "Siapkan semua dokumen KUR dalam 10 menit. NIB, SKU, laporan keuangan, surat keterangan usaha — semua dalam satu paket siap bank. Mulai Rp 59.000.",
  keywords:
    "dokumen KUR UMKM, syarat KUR BRI 2024, paket dokumen KUR, NIB UMKM online",
  openGraph: {
    title: "Dokumen KUR UMKM Siap 10 Menit | LegalKan",
    description:
      "Siapkan semua dokumen KUR dalam 10 menit. NIB, SKU, laporan keuangan, surat keterangan usaha — semua dalam satu paket siap bank. Mulai Rp 59.000.",
    type: "website",
  },
};

export default function KurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
