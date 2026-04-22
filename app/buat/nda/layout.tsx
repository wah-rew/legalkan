import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat NDA Perjanjian Kerahasiaan Bilateral | LegalKan",
  description:
    "Buat NDA (Non-Disclosure Agreement) bilateral untuk bisnis Indonesia. Sesuai UU Hak Cipta dan hukum Indonesia. Mulai Rp 49.000.",
  keywords:
    "NDA Indonesia, perjanjian kerahasiaan bilateral, non disclosure agreement Indonesia",
  openGraph: {
    title: "Buat NDA Perjanjian Kerahasiaan Bilateral | LegalKan",
    description:
      "Buat NDA (Non-Disclosure Agreement) bilateral untuk bisnis Indonesia. Sesuai UU Hak Cipta dan hukum Indonesia. Mulai Rp 49.000.",
    type: "website",
  },
};

export default function NdaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
