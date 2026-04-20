import { NextRequest, NextResponse } from "next/server";
import { ContractData, BankCode, PaymentData, PRICE, CONTRACT_PRICES } from "@/types";

// Mock VA numbers for each bank (sandbox)
const MOCK_VA_PREFIX: Record<BankCode, string> = {
  BCA: "70012",
  BNI: "88908",
  BRI: "26215",
  MANDIRI: "88908",
};

function generateMockVA(bank: BankCode, orderId: string): string {
  const prefix = MOCK_VA_PREFIX[bank];
  const suffix = orderId.replace(/\D/g, "").slice(-6).padStart(6, "0");
  return `${prefix}${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: { contractData: ContractData & { contractType?: string }; bank: BankCode } = await req.json();
    const { contractData, bank } = body;

    if (!contractData || !bank) {
      return NextResponse.json(
        { error: "Data kontrak dan bank wajib dipilih" },
        { status: 400 }
      );
    }

    // Determine price based on contract type
    const contractType = (contractData as unknown as Record<string, unknown>).contractType as string | undefined;
    const amount = contractType && CONTRACT_PRICES[contractType] ? CONTRACT_PRICES[contractType] : PRICE;

    const orderId = `SS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const xenditKey = process.env.XENDIT_SECRET_KEY;

    let paymentData: PaymentData;

    if (xenditKey && xenditKey !== "placeholder") {
      // Real Xendit API call
      try {
        const response = await fetch("https://api.xendit.co/callback_virtual_accounts", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${Buffer.from(xenditKey + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            external_id: orderId,
            bank_code: bank,
            name: contractData.namaPihakKedua?.toUpperCase().slice(0, 20) || "KONTRAK",
            expected_amount: amount,
            is_single_use: true,
            expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          }),
        });

        const xenditData = await response.json();

        if (!response.ok) {
          throw new Error(xenditData.message || "Xendit error");
        }

        paymentData = {
          orderId,
          contractData,
          vaNumber: xenditData.account_number,
          bank,
          amount,
          expiryTime: xenditData.expiration_date,
        };
      } catch (xenditError) {
        console.error("Xendit error, falling back to mock:", xenditError);
        // Fall back to mock
        paymentData = createMockPayment(orderId, contractData, bank, amount);
      }
    } else {
      // Mock payment for development/demo
      paymentData = createMockPayment(orderId, contractData, bank, amount);
    }

    return NextResponse.json({ success: true, paymentData });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pembayaran. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

function createMockPayment(
  orderId: string,
  contractData: ContractData,
  bank: BankCode,
  amount: number = PRICE
): PaymentData {
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return {
    orderId,
    contractData,
    vaNumber: generateMockVA(bank, orderId),
    bank,
    amount,
    expiryTime,
  };
}
