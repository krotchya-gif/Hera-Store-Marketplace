import { NextRequest, NextResponse } from "next/server";
import { getAllProductsAdmin, createProduct } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryName = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    let categoryId: string | undefined = undefined;

    if (categoryName && categoryName !== "Semua") {
      const supabase = await createClient();
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("name", categoryName)
        .single();
      
      if (cat) {
        categoryId = cat.id;
      }
    }

    const result = await getAllProductsAdmin({
      search,
      categoryId,
      status,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API GET Products]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();
    const body = await request.json();
    const product = await createProduct(body);
    if (!product) {
      return NextResponse.json({ error: "Gagal membuat produk" }, { status: 400 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("[API POST Products]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
