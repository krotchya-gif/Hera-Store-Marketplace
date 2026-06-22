import { NextRequest, NextResponse } from "next/server";
import { getAllCustomers } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "20"), 1), 100);

    const result = await getAllCustomers({
      search,
      status,
      page,
      pageSize,
    });

    // Count active and new customers dynamically
    const supabase = await createClient();
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [{ count: total }, { count: active }, { count: newThisMonth }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer").eq("status", "aktif"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer").gte("created_at", thisMonthStart),
    ]);

    const stats = {
      total: total || 0,
      active: active || 0,
      newThisMonth: newThisMonth || 0,
    };

    return NextResponse.json({ ...result, stats });
  } catch (error) {
    return handleAdminError(error);
  }
}
