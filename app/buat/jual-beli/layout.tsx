import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Surat Perjanjian Jual Beli Kendaraan Bekas | LegalKan",
  description:
    "Buat surat perjanjian jual beli motor atau mobil bekas antara individu yang sah. Lengkap dengan as-is clause dan proses balik nama. Mulai Rp 19.000.",
  keywords:
    "surat perjanjian jual beli motor bekas, kontrak jual beli kendaraan, surat jual beli mobil bekas",
  openGraph: {
    title: "Buat Surat Perjanjian Jual Beli Kendaraan Bekas | LegalKan",
    description:
      "Buat surat perjanjian jual beli motor atau mobil bekas antara individu yang sah. Lengkap dengan as-is clause dan proses balik nama. Mulai Rp 19.000.",
    type: "website",
  },
};

export default function JualBeliLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
