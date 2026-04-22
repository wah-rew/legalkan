import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Perjanjian Bagi Hasil Usaha Online | LegalKan",
  description:
    "Buat perjanjian kerjasama bagi hasil usaha yang adil dan sah. Lengkap dengan mekanisme pelaporan, pengambilan keputusan, dan prosedur keluar. Mulai Rp 79.000.",
  keywords:
    "perjanjian bagi hasil usaha, kontrak kerjasama bisnis, perjanjian profit sharing Indonesia",
  openGraph: {
    title: "Buat Perjanjian Bagi Hasil Usaha Online | LegalKan",
    description:
      "Buat perjanjian kerjasama bagi hasil usaha yang adil dan sah. Lengkap dengan mekanisme pelaporan, pengambilan keputusan, dan prosedur keluar. Mulai Rp 79.000.",
    type: "website",
  },
};

export default function BagiHasilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
