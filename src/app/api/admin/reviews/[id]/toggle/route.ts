import { NextRequest, NextResponse } from "next/server";
import { toggleReviewVisibility } from "@/lib/admin";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const { is_visible } = await request.json();
    const success = await toggleReviewVisibility(id, is_visible);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengubah visibilitas ulasan" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API PATCH Review Visibility]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
