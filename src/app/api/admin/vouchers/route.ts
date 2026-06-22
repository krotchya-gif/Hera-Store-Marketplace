import { NextRequest, NextResponse } from "next/server";
import { getAllVouchers, createVoucher } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const vouchers = await getAllVouchers();
    return NextResponse.json(vouchers);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 20, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const body = await request.json();

    // Validasi input
    if (!body.code || typeof body.code !== "string" || body.code.trim() === "") {
      return NextResponse.json({ error: "Kode voucher wajib diisi." }, { status: 400 });
    }
    const value = Number(body.value);
    if (isNaN(value) || value <= 0) {
      return NextResponse.json({ error: "Nilai diskon harus lebih besar dari 0." }, { status: 400 });
    }
    if (!body.type || !["percent", "nominal"].includes(body.type)) {
      return NextResponse.json({ error: "Tipe diskon harus 'percent' atau 'nominal'." }, { status: 400 });
    }

    const voucher = await createVoucher(body);
    if (!voucher) {
      return NextResponse.json({ error: "Gagal membuat voucher" }, { status: 400 });
    }
    return NextResponse.json(voucher);
  } catch (error) {
    return handleAdminError(error);
  }
}
