import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cara Daftar NIB Online Gratis 2024 | Panduan Lengkap + KBLI Finder",
  description:
    "Panduan lengkap cara daftar NIB (Nomor Induk Berusaha) di OSS secara online, gratis, selesai 15 menit. Dilengkapi KBLI Finder untuk bantu pilih kode usaha yang tepat.",
  keywords: [
    "cara daftar NIB",
    "NIB OSS",
    "cara buat NIB online",
    "NIB usaha gratis",
    "KBLI usaha",
    "Nomor Induk Berusaha",
  ],
  openGraph: {
    title: "Cara Daftar NIB Online Gratis | Panduan Lengkap + KBLI Finder",
    description:
      "Gratis, online, 15 menit. Panduan lengkap daftar NIB di OSS lengkap dengan KBLI Finder interaktif.",
    type: "article",
  },
};

export default function NIBGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
