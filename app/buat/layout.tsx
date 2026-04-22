import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Perjanjian Sewa Rumah Online Resmi | LegalKan",
  description:
    "Buat perjanjian sewa menyewa rumah, kos, ruko yang sah secara hukum dalam 5 menit. Sesuai KUHPerdata Indonesia. Mulai Rp 29.000.",
  keywords:
    "perjanjian sewa rumah, kontrak sewa menyewa, surat sewa rumah online, perjanjian sewa kos",
  openGraph: {
    title: "Buat Perjanjian Sewa Rumah Online Resmi | LegalKan",
    description:
      "Buat perjanjian sewa menyewa rumah, kos, ruko yang sah secara hukum dalam 5 menit. Sesuai KUHPerdata Indonesia. Mulai Rp 29.000.",
    type: "website",
  },
};

export default function BuatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
