import { NextRequest, NextResponse } from "next/server";
import { getAllVouchers, createVoucher } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";

export async function GET() {
  try {
    await verifyAdminRole();
    const vouchers = await getAllVouchers();
    return NextResponse.json(vouchers);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();
    const body = await request.json();
    const voucher = await createVoucher(body);
    if (!voucher) {
      return NextResponse.json({ error: "Gagal membuat voucher" }, { status: 400 });
    }
    return NextResponse.json(voucher);
  } catch (error) {
    return handleAdminError(error);
  }
}
