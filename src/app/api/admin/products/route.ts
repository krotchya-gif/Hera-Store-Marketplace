import { NextRequest, NextResponse } from "next/server";
import { getAllProductsAdmin, createProduct } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    // Rate limiting
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi." },
        { status: 429 }
      );
    }
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "20"), 1), 100);

    const result = await getAllProductsAdmin({
      search,
      categoryId,
      status,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();
    // Rate limiting
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 20, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi." },
        { status: 429 }
      );
    }
    const body = await request.json();

    // Validasi input
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "Nama produk wajib diisi." }, { status: 400 });
    }
    const price = Number(body.price);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Harga produk harus lebih besar dari 0." }, { status: 400 });
    }

    const product = await createProduct(body);
    if (!product) {
      return NextResponse.json({ error: "Gagal membuat produk" }, { status: 400 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return handleAdminError(error);
  }
}
