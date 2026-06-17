import { NextRequest, NextResponse } from "next/server";
import { validateVoucher } from "@/lib/vouchers";

export async function POST(request: NextRequest) {
  try {
    const { code, total } = await request.json();

    if (!code || total === undefined) {
      return NextResponse.json({ error: "Kode voucher dan total belanja wajib diisi." }, { status: 400 });
    }

    const result = await validateVoucher(code, total);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API POST Validate Voucher]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
