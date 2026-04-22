import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Kontrak Kerja Freelancer Indonesia Online | LegalKan",
  description:
    "Buat PKWT dan kontrak freelancer yang sah sesuai UU Ketenagakerjaan dan PP 35/2021. Lindungi hak sebagai freelancer atau pemberi kerja. Mulai Rp 49.000.",
  keywords:
    "kontrak freelancer Indonesia, PKWT online, perjanjian kerja freelance, kontrak jasa desainer developer",
  openGraph: {
    title: "Buat Kontrak Kerja Freelancer Indonesia Online | LegalKan",
    description:
      "Buat PKWT dan kontrak freelancer yang sah sesuai UU Ketenagakerjaan dan PP 35/2021. Lindungi hak sebagai freelancer atau pemberi kerja. Mulai Rp 49.000.",
    type: "website",
  },
};

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
