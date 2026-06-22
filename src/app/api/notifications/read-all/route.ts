import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function PUT(request: NextRequest) {
  try {
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 10, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API PUT Read All]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
