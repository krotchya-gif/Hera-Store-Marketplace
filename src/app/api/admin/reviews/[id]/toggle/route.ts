import { NextRequest, NextResponse } from "next/server";
import { toggleReviewVisibility } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const { id } = await params;
    const { is_visible } = await request.json();
    const success = await toggleReviewVisibility(id, is_visible);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengubah visibilitas ulasan" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
