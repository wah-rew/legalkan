import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, consentType, consentText, consentVersion, timestamp } = body;

    // Get IP and user agent for audit trail
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Log consent
    console.log(`[consent] TnC agreed for order ${orderId} at ${timestamp} from ${ipAddress}`);

    // Save to Supabase user_consents table
    if (supabase) {
      try {
        await supabase.from("user_consents").insert({
          // user_id is null for anonymous users (no auth)
          user_id: null,
          consent_type: consentType || "tnc_agreement",
          is_granted: true,
          granted_at: timestamp || new Date().toISOString(),
          consent_version: consentVersion || "v1.0",
          ip_address: ipAddress,
          user_agent: userAgent,
        });

        // Also update the order record with consent flag
        await supabase
          .from("orders")
          .update({
            consent_data_usage: true,
            consent_timestamp: timestamp || new Date().toISOString(),
          })
          .eq("order_id", orderId);

      } catch (dbErr) {
        console.error("[consent] Supabase insert error (non-fatal):", dbErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[consent] Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
