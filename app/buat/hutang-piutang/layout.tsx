import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Surat Perjanjian Hutang Piutang Online | LegalKan",
  description:
    "Buat surat perjanjian hutang piutang antar individu yang sah sesuai KUHPerdata. Lengkap dengan klausul bunga, jaminan, dan wanprestasi. Mulai Rp 49.000.",
  keywords:
    "surat perjanjian hutang piutang, kontrak hutang piutang, surat hutang online Indonesia",
  openGraph: {
    title: "Buat Surat Perjanjian Hutang Piutang Online | LegalKan",
    description:
      "Buat surat perjanjian hutang piutang antar individu yang sah sesuai KUHPerdata. Lengkap dengan klausul bunga, jaminan, dan wanprestasi. Mulai Rp 49.000.",
    type: "website",
  },
};

export default function HutangPiutangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
