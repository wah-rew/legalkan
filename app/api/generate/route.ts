import { NextRequest, NextResponse } from "next/server";
import { ContractFormData, ContractData } from "@/types";
import { supabase } from "@/lib/supabase";
import {
  generateContractHTML,
  generateContractNumber,
  calculateEndDate,
} from "@/lib/contract-template";

export async function POST(req: NextRequest) {
  try {
    const body: ContractFormData = await req.json();

    // Validate required fields
    const required: (keyof ContractFormData)[] = [
      "namaPihakPertama",
      "namaPihakKedua",
      "alamatProperti",
      "hargaSewa",
      "durasiSewa",
      "tanggalMulai",
      "emailPembeli",
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        );
      }
    }

    const contractData: ContractData & { contractType: string; contractTitle: string } = {
      ...body,
      nomorKontrak: generateContractNumber(),
      tanggalPembuatan: new Date().toISOString().split("T")[0],
      tanggalBerakhir: calculateEndDate(body.tanggalMulai, body.durasiSewa),
      contractType: 'sewa-properti',
      contractTitle: 'Perjanjian Sewa Menyewa',
    };

    // Option A: Use OpenAI to enhance contract (when API key is available)
    // Option B: Use template-based generation (always works)
    let contractHTML: string;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== "placeholder") {
      // TODO: Use OpenAI to generate a more personalized contract
      // For now, fall through to template
      contractHTML = generateContractHTML(contractData);
    } else {
      contractHTML = generateContractHTML(contractData);
    }

    // Save order to Supabase (graceful fallback if not configured)
    if (supabase) {
      try {
        await supabase.from('orders').insert({
          order_id: contractData.nomorKontrak,
          contract_type: contractData.contractType,
          contract_title: contractData.contractTitle,
          amount: Number(process.env.NEXT_PUBLIC_PRICE) || 29000,
          status: 'pending',
          customer_name: body.namaPihakKedua || null,
          customer_email: body.emailPembeli || null,
          customer_phone: body.nomorWhatsapp || null,
          pihak_pertama: body.namaPihakPertama || null,
          pihak_kedua: body.namaPihakKedua || null,
          contract_data: { ...contractData, contractHTML },
        });
      } catch (dbErr) {
        console.error('[generate] Supabase insert error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      contractData,
      contractHTML,
    });
  } catch (error) {
    console.error("Error generating contract:", error);
    return NextResponse.json(
      { error: "Gagal membuat kontrak. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
