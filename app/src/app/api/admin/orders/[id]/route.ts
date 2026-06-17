import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrderById } from "@/lib/orders";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("[API GET Order Detail]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdminRole();
    const { id } = await params;
    const { status, tracking_number } = await request.json();
    const success = await updateOrderStatus(id, status, tracking_number);
    if (!success) {
      return NextResponse.json({ error: "Gagal mengupdate pesanan" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API PUT Order]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
