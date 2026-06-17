import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/admin";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const body = await request.json();
    const success = await updateProduct(id, body);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengupdate produk" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API PUT Product]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE Product]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
