// ─── Dynamic Sitemap.xml Route Handler ─────────────────────────
// Supports both:
//   1. Custom uploaded sitemap (from admin SEO settings)
//   2. Auto-generated sitemap (from DB products & categories)
// ────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

function generateSitemapXml(entries: { url: string; lastModified: Date; changeFrequency: string; priority: number }[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastModified.toISOString().split("T")[0]}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  // 1) Check for custom uploaded sitemap
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "seo")
      .single();

    const customContent = (data?.value as Record<string, unknown>)?.sitemap_xml_content as string | null;
    if (customContent?.trim()) {
      return new NextResponse(customContent, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }
  } catch {
    // Fall through to dynamic
  }

  // 2) Auto-generate dynamic sitemap
  try {
    const supabase = await createClient();

    const staticPages = [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
      { url: `${BASE_URL}/keranjang`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE_URL}/checkout`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
      { url: `${BASE_URL}/profil`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ];

    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase.from("categories").select("slug, updated_at").eq("is_active", true),
      supabase.from("products").select("slug, updated_at").eq("is_active", true),
    ]);

    const categoryPages = (categories || []).map((cat) => ({
      url: `${BASE_URL}/kategori/${cat.slug}`,
      lastModified: new Date(cat.updated_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const productPages = (products || []).map((prod) => ({
      url: `${BASE_URL}/produk/${prod.slug}`,
      lastModified: new Date(prod.updated_at || new Date()),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const xml = generateSitemapXml([...staticPages, ...categoryPages, ...productPages]);
    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    console.error("[Sitemap Generation Error]", error);
    return new NextResponse("Sitemap generation failed", { status: 500 });
  }
}
