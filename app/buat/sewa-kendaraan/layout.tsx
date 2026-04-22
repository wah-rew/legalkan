import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Perjanjian Sewa Kendaraan Bermotor Online | LegalKan",
  description:
    "Buat perjanjian sewa mobil atau motor antara individu yang sah. Lengkap dengan prosedur kecelakaan, denda keterlambatan, dan tanggung jawab kerusakan. Mulai Rp 29.000.",
  keywords:
    "perjanjian sewa kendaraan, kontrak sewa mobil, surat sewa motor online Indonesia",
  openGraph: {
    title: "Buat Perjanjian Sewa Kendaraan Bermotor Online | LegalKan",
    description:
      "Buat perjanjian sewa mobil atau motor antara individu yang sah. Lengkap dengan prosedur kecelakaan, denda keterlambatan, dan tanggung jawab kerusakan. Mulai Rp 29.000.",
    type: "website",
  },
};

export default function SewaKendaraanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
