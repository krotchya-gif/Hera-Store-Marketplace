import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, getOrderStats } from "@/lib/orders";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import type { OrderStatus } from "@/types/database";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    // Rate limiting
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") as OrderStatus) || undefined;
    const search = searchParams.get("search") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "20"), 1), 100);

    const result = await getAllOrders({
      status,
      search,
      dateFrom,
      dateTo,
      page,
      pageSize,
    });

    const stats = await getOrderStats();

    return NextResponse.json({ ...result, stats });
  } catch (error) {
    return handleAdminError(error);
  }
}
