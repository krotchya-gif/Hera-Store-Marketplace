import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, getOrderStats } from "@/lib/orders";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") as any) || undefined;
    const search = searchParams.get("search") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

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
    console.error("[API GET Orders]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
