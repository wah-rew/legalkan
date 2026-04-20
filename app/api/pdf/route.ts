import { NextRequest, NextResponse } from "next/server";
import { generateContractHTML } from "@/lib/contract-template";
import { ContractData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: { contractData: ContractData } = await req.json();
    const { contractData } = body;

    if (!contractData) {
      return NextResponse.json({ error: "Data kontrak tidak valid" }, { status: 400 });
    }

    const html = generateContractHTML(contractData);

    // Return HTML as the "PDF" content for now
    // In production, use puppeteer to convert to actual PDF:
    //
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.setContent(html, { waitUntil: 'networkidle0' });
    // const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '25mm', right: '25mm' } });
    // await browser.close();
    // return new NextResponse(pdf, { headers: { 'Content-Type': 'application/pdf', ... } });

    // For MVP: return printable HTML
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="Perjanjian-Sewa-${contractData.nomorKontrak}.html"`,
      },
    });
  } catch (error) {
    console.error("PDF error:", error);
    return NextResponse.json({ error: "Gagal membuat PDF" }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "LegalKan PDF API" });
}
