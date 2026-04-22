import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cara Daftar NIB Online Gratis 2024 | Panduan Lengkap + KBLI Finder",
  description:
    "Panduan lengkap cara daftar NIB (Nomor Induk Berusaha) di OSS secara gratis dalam 15 menit. Dilengkapi KBLI Finder interaktif.",
  keywords:
    "cara daftar NIB online, NIB OSS gratis, KBLI usaha, nomor induk berusaha 2024",
  openGraph: {
    title: "Cara Daftar NIB Online Gratis 2024 | Panduan Lengkap + KBLI Finder",
    description:
      "Panduan lengkap cara daftar NIB (Nomor Induk Berusaha) di OSS secara gratis dalam 15 menit. Dilengkapi KBLI Finder interaktif.",
    type: "website",
  },
};

export default function NIBGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
