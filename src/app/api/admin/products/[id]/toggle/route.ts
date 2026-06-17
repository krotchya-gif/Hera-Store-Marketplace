import { NextRequest, NextResponse } from "next/server";
import { toggleProductStatus } from "@/lib/admin";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const { is_active } = await request.json();
    const success = await toggleProductStatus(id, is_active);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengubah status produk" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API PATCH Product Toggle]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
