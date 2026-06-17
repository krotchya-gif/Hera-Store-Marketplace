// ─── Export Orders as CSV ──────────────────────────────────────
import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";
import { verifyAdminRole } from "@/lib/auth-utils";

export async function GET() {
  try {
    await verifyAdminRole();

    const result = await getAllOrders({ page: 1, pageSize: 1000 });

    const headers = [
      "No. Pesanan",
      "Tanggal",
      "Pelanggan",
      "Status",
      "Pembayaran",
      "Subtotal",
      "Ongkir",
      "Diskon",
      "Total",
      "Metode Pembayaran",
      "Kurir",
      "No. Resi",
    ].join(",");

    const rows = result.data.map((order) =>
      [
        order.order_number,
        new Date(order.created_at).toLocaleDateString("id-ID"),
        `"${order.profiles?.name || "Pelanggan"}"`,
        order.status,
        order.payment_status,
        order.subtotal,
        order.shipping_cost,
        order.discount,
        order.total,
        `"${order.payment_method || ""}"`,
        `"${order.shipping_method || ""}"`,
        `"${order.tracking_number || ""}"`,
      ].join(",")
    );

    const csv = "﻿" + [headers, ...rows].join("\n"); // BOM for UTF-8 Excel

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("[Export CSV Error]", error);
    return NextResponse.json({ error: error?.message || "Export failed" }, { status: 500 });
  }
}
