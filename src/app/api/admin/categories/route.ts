import { NextRequest, NextResponse } from "next/server";
import { getAllCategoriesAdmin, createCategory } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 30, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const categories = await getAllCategoriesAdmin();
    return NextResponse.json(categories);
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();
    const rlKey = getRateLimitKey(request);
    const { allowed } = checkRateLimit(rlKey, 20, 60000);
    if (!allowed) return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi." }, { status: 429 });
    const body = await request.json();

    // Validasi input
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
    }
    if (body.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
      return NextResponse.json({ error: "Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung." }, { status: 400 });
    }

    const category = await createCategory(body);
    if (!category) {
      return NextResponse.json({ error: "Gagal membuat kategori" }, { status: 400 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return handleAdminError(error);
  }
}
