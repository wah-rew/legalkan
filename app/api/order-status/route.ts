import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  if (!supabase) {
    // Without Supabase, we can't check status — return neutral pending
    return NextResponse.json({ status: "pending" });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("order_id", orderId)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: "pending" });
    }

    return NextResponse.json({ status: data.status });
  } catch (err) {
    console.error("[order-status] Error:", err);
    return NextResponse.json({ status: "pending" });
  }
}
