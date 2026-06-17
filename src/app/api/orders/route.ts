import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Silakan masuk (login) terlebih dahulu untuk membuat pesanan." }, { status: 401 });
    }

    const payload = {
      user_id: user.id,
      shipping_address: body.shipping_address,
      shipping_method: body.shipping_method,
      shipping_cost: body.shipping_cost,
      payment_method: body.payment_method,
      subtotal: body.subtotal,
      discount: body.discount,
      total: body.total,
      notes: body.notes || "",
      items: body.items,
    };

    const order = await createOrder(payload as any);
    if (!order) {
      return NextResponse.json({ error: "Gagal membuat pesanan" }, { status: 400 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[API POST Public Order]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
