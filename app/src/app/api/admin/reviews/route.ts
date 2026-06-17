import { NextRequest, NextResponse } from "next/server";
import { getAllReviews, getReviewStats } from "@/lib/admin";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const { searchParams } = new URL(request.url);
    const isVisibleParam = searchParams.get("isVisible");
    const isVisible = isVisibleParam === "true" ? true : isVisibleParam === "false" ? false : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = await getAllReviews({
      page,
      pageSize,
      isVisible,
    });

    const stats = await getReviewStats();

    return NextResponse.json({ ...result, stats });
  } catch (error) {
    console.error("[API GET Reviews]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
