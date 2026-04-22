import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Kontrak Event Organizer & Fotografer Pernikahan | LegalKan",
  description:
    "Buat kontrak EO dan fotografer pernikahan yang sah. Dilengkapi kebijakan pembatalan bertingkat, hak cipta foto, dan force majeure. Mulai Rp 49.000.",
  keywords:
    "kontrak event organizer pernikahan, kontrak fotografer wedding Indonesia, perjanjian EO",
  openGraph: {
    title: "Buat Kontrak Event Organizer & Fotografer Pernikahan | LegalKan",
    description:
      "Buat kontrak EO dan fotografer pernikahan yang sah. Dilengkapi kebijakan pembatalan bertingkat, hak cipta foto, dan force majeure. Mulai Rp 49.000.",
    type: "website",
  },
};

export default function EventOrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
