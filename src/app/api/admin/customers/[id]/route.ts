import { NextRequest, NextResponse } from "next/server";
import { updateCustomerStatus } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 20, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
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
