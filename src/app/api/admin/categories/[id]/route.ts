import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/admin";
import { verifyAdminRole, handleAdminError } from "@/lib/auth-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const body = await request.json();
    const success = await updateCategory(id, body);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengupdate kategori" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}
