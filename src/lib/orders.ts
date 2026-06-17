// ─── Orders Data Layer — Supabase queries ────────────────────────────────────
import { createClient } from "@/utils/supabase/server";
import type { Order, OrderItem, OrderStatus, ShippingAddress } from "@/types/database";

// ─── User orders ──────────────────────────────────────────────────────────────

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*, products(id, name, slug))`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getOrdersByUser]", error);
    return [];
  }
  return (data as unknown as Order[]) ?? [];
}

// ─── Admin: all orders ────────────────────────────────────────────────────────

export interface OrderFilters {
  status?: OrderStatus | "semua";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export async function getAllOrders(filters: OrderFilters = {}) {
  const supabase = await createClient();
  const { status, search, dateFrom, dateTo, page = 1, pageSize = 20 } = filters;

  let query = supabase
    .from("orders")
    .select(
      `*, profiles(id, name, email, phone), order_items(id, product_name, qty, price, subtotal)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (status && status !== "semua") {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,profiles.name.ilike.%${search}%`);
  }
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59");

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("[getAllOrders]", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  return {
    data: (data as unknown as Order[]) ?? [],
    count: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, profiles(id, name, email, phone), order_items(*, products(id, name, slug))`)
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data as unknown as Order;
}

// ─── Create order ─────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  user_id: string;
  shipping_address: ShippingAddress;
  shipping_method: string;
  shipping_cost: number;
  payment_method: string;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  items: {
    product_id: string;
    variant_id?: string;
    product_name: string;
    product_sku?: string;
    qty: number;
    price: number;
    subtotal: number;
  }[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order | null> {
  const supabase = await createClient();

  // Generate order number via DB function
  const { data: orderNumData } = await supabase.rpc("generate_order_number");
  const orderNumber = orderNumData ?? `HS${Date.now()}`;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: payload.user_id,
      status: "menunggu",
      payment_method: payload.payment_method,
      payment_status: "belum_bayar",
      shipping_method: payload.shipping_method,
      shipping_cost: payload.shipping_cost,
      shipping_address: payload.shipping_address,
      subtotal: payload.subtotal,
      discount: payload.discount,
      total: payload.total,
      notes: payload.notes ?? null,
    })
    .select()
    .single();

  if (error || !order) {
    console.error("[createOrder]", error);
    return null;
  }

  // Insert order items
  const items = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id ?? null,
    product_name: item.product_name,
    product_sku: item.product_sku ?? null,
    qty: item.qty,
    price: item.price,
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) {
    console.error("[createOrder items]", itemsError);
    // Cleanup: delete orphaned order if items failed
    await supabase.from("orders").delete().eq("id", order.id);
    return null;
  }

  return order as unknown as Order;
}

// ─── Update order status ──────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<boolean> {
  const supabase = await createClient();

  const updatePayload: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (trackingNumber) updatePayload.tracking_number = trackingNumber;

  const { error } = await supabase.from("orders").update(updatePayload).eq("id", orderId);

  if (error) {
    console.error("[updateOrderStatus]", error);
    return false;
  }
  return true;
}

// ─── Order stats ──────────────────────────────────────────────────────────────

export async function getOrderStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("orders")
    .select("status, total, created_at");

  if (!data) return { todayCount: 0, menunggu: 0, dikirim: 0, selesai: 0 };

  const todayOrders = data.filter((o) => o.created_at.startsWith(today));
  const byStatus = (s: string) => data.filter((o) => o.status === s).length;

  return {
    todayCount: todayOrders.length,
    menunggu: byStatus("menunggu"),
    diproses: byStatus("diproses"),
    dikirim: byStatus("dikirim"),
    selesai: byStatus("selesai"),
    dibatalkan: byStatus("dibatalkan"),
  };
}
