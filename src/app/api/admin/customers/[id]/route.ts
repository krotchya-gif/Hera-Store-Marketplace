import { NextRequest, NextResponse } from "next/server";
import { updateCustomerStatus } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const { status } = await request.json();
    const success = await updateCustomerStatus(id, status);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengupdate status pelanggan" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
