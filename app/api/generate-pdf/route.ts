import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const maxDuration = 60; // Vercel: allow up to 60s for PDF generation

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Fetch contract HTML from Supabase (same logic as /api/get-contract)
    const { data, error } = await supabase
      .from("orders")
      .select("order_id, contract_title, contract_data, status")
      .eq("order_id", orderId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const allowedStatuses = ["paid", "delivered", "pending_verification"];
    if (!allowedStatuses.includes(data.status)) {
      return NextResponse.json({ error: "Payment not confirmed yet" }, { status: 403 });
    }

    const contractData = data.contract_data as Record<string, unknown>;
    const contractHTML = contractData?.contractHTML as string;

    if (!contractHTML) {
      return NextResponse.json({ error: "Contract HTML not found" }, { status: 404 });
    }

    // Generate PDF using @sparticuz/chromium + puppeteer-core (optimized for serverless)
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 1024 },
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });

    try {
      const page = await browser.newPage();
      await page.setContent(contractHTML, { waitUntil: "networkidle0" });
      const pdf = await page.pdf({
        format: "A4",
        margin: { top: "20mm", right: "25mm", bottom: "20mm", left: "25mm" },
        printBackground: true,
        displayHeaderFooter: false, // No browser headers/footers
      });
      await browser.close();

      return new NextResponse(Buffer.from(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="LegalKan-${orderId}.pdf"`,
        },
      });
    } catch (pdfErr) {
      await browser.close();
      throw pdfErr;
    }
  } catch (err) {
    console.error("[generate-pdf] Error:", err);
    return NextResponse.json({ error: "Gagal membuat PDF" }, { status: 500 });
  }
}
