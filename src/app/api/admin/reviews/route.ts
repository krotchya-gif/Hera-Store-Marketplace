import { NextRequest, NextResponse } from "next/server";
import { getAllReviews, getReviewStats } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const { searchParams } = new URL(request.url);
    const isVisibleParam = searchParams.get("isVisible");
    const isVisible = isVisibleParam === "true" ? true : isVisibleParam === "false" ? false : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "20"), 1), 100);

    const result = await getAllReviews({
      page,
      pageSize,
      isVisible,
    });

    const stats = await getReviewStats();

    return NextResponse.json({ ...result, stats });
  } catch (error) {
    return handleAdminError(error);
  }
}
