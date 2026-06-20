import { NextRequest, NextResponse } from "next/server";
import { getAllProductsAdmin, createProduct } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

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
    const body = await request.json();
    const product = await createProduct(body);
    if (!product) {
      return NextResponse.json({ error: "Gagal membuat produk" }, { status: 400 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return handleAdminError(error);
  }
}
