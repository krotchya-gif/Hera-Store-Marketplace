import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "seo")
      .single();

    const customContent = (data?.value as Record<string, unknown>)?.robots_txt_content as string | null;

    if (customContent?.trim()) {
      return new NextResponse(customContent, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  } catch {
    // Fall through to default
  }

  const defaultContent = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${BASE_URL}/sitemap.xml`,
  ].join("\n");

  return new NextResponse(defaultContent, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
