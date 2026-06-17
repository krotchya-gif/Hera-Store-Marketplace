// ─── SEO Data Layer — Supabase queries ─────────────────────────
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import type { SeoSettings } from "@/types/database";

const DEFAULT_SEO: SeoSettings = {
  meta_pixel_id: null,
  ga4_measurement_id: null,
  default_title: null,
  default_description: null,
  default_keywords: null,
  robots_txt_content: null,
  sitemap_xml_content: null,
};

export const getSeoSettings = cache(async (): Promise<SeoSettings> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "seo")
      .single();

    if (!data?.value) return DEFAULT_SEO;

    return data.value as SeoSettings;
  } catch {
    return DEFAULT_SEO;
  }
});
