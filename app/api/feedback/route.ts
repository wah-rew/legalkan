import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

const FEEDBACK_FILE = path.join(process.cwd(), "data", "feedback.json");

async function readFeedback(): Promise<object[]> {
  try {
    await fs.mkdir(path.dirname(FEEDBACK_FILE), { recursive: true });
    const content = await fs.readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function appendFeedback(entry: object): Promise<void> {
  const existing = await readFeedback();
  existing.push(entry);
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(existing, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, rating, message } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1–5" },
        { status: 400 }
      );
    }

    const entry = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      orderId: orderId || null,
      rating: Number(rating),
      message: message || null,
    };

    console.log("⭐ [Feedback Received]", entry);

    await appendFeedback(entry);

    // Also save to Supabase if configured
    if (supabase) {
      try {
        await supabase.from('feedback').insert({
          order_id: orderId || null,
          rating: Number(rating),
          message: message || null,
        });
      } catch (dbErr) {
        console.error('[feedback] Supabase insert error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Terima kasih atas feedback kamu!" });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan feedback. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
