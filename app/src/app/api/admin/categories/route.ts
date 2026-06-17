import { NextRequest, NextResponse } from "next/server";
import { getAllCategoriesAdmin, createCategory } from "@/lib/admin";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function GET() {
  try {
    await verifyAdminRole();
    const categories = await getAllCategoriesAdmin();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[API GET Admin Categories]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRole();
    const body = await request.json();
    const category = await createCategory(body);
    if (!category) {
      return NextResponse.json({ error: "Gagal membuat kategori" }, { status: 400 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error("[API POST Admin Categories]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
