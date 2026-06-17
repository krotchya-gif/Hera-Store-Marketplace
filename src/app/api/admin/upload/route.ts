// ─── File Upload API — Supabase Storage ─────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: "File dan productId wajib diisi" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF." }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 2MB" }, { status: 400 });
    }

    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload Error]", uploadError);
      return NextResponse.json({ error: "Gagal mengupload file: " + uploadError.message }, { status: 400 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // Check if this is the first image (set as primary)
    const { count } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    // Save to product_images table
    const { error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: publicUrl,
        is_primary: count === 0, // first image = primary
        sort_order: count ?? 0,
      });

    if (dbError) {
      console.error("[DB Insert Error]", dbError);
      return NextResponse.json({ error: "Gagal menyimpan referensi gambar" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      is_primary: count === 0,
    });
  } catch (error: any) {
    console.error("[API Upload]", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
