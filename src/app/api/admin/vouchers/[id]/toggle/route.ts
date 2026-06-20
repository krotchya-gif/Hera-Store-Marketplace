import { NextRequest, NextResponse } from "next/server";
import { toggleVoucherStatus } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const { is_active } = await request.json();
    const success = await toggleVoucherStatus(id, is_active);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengubah status voucher" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
