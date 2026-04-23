import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("order_id, contract_type, contract_title, contract_data, status")
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

    return NextResponse.json({
      contractHTML,
      contractTitle: data.contract_title || "Kontrak",
      orderId: data.order_id,
      contractType: data.contract_type,
    });
  } catch (err) {
    console.error("[get-contract] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
