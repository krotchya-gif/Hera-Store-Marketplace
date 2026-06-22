"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import { Search, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Order, OrderStatus } from "@/types/database";

const statusFilters = ["Semua", "Menunggu Bayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
const statusKeys: Record<string, string> = {
  "Semua": "semua",
  "Menunggu Bayar": "menunggu",
  "Diproses": "diproses",
  "Dikirim": "dikirim",
  "Selesai": "selesai",
  "Dibatalkan": "dibatalkan",
};

import { formatRp } from "@/utils/format";

function OrderDetailModal({
  orderId,
  onClose,
  onUpdateSuccess,
}: {
  orderId: string;
  onClose: () => void;
  onUpdateSuccess: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchOrderDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setTrackingNumberInput(data.tracking_number || "");
      }
    } catch {
      console.error("Failed to fetch order detail");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    startTransition(() => {
      fetchOrderDetail();
    });
  }, [fetchOrderDetail]);

  const handleUpdateStatus = async (status: OrderStatus) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            tracking_number: trackingNumberInput || undefined,
          }),
        });
        if (res.ok) {
          fetchOrderDetail();
          onUpdateSuccess();
        }
      } catch (error) {
        console.error("Failed to update status", error);
      }
    });
  };

  if (isLoading || !order) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white h-full w-full max-w-xl shadow-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const timeline = [
    { label: "Pesanan dibuat", time: new Date(order.created_at).toLocaleString("id-ID"), done: true },
    { label: "Pembayaran diterima", time: order.payment_status === "lunas" ? "Lunas" : "", done: order.payment_status === "lunas" },
    { label: "Sedang diproses", time: order.status !== "menunggu" && order.status !== "dibatalkan" ? "Diproses" : "", done: order.status !== "menunggu" && order.status !== "dibatalkan" },
    { label: "Dikirim", time: order.tracking_number ? `Resi: ${order.tracking_number}` : "", done: !!order.tracking_number },
    { label: "Selesai", time: order.status === "selesai" ? "Selesai" : "", done: order.status === "selesai" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white h-full w-full max-w-xl shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-gray-900">Detail Pesanan</h2>
            <p className="text-xs text-gray-400 font-mono">#{order.order_number}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString("id-ID")}</span>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Timeline Pesanan</p>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.done ? "bg-green-500" : "bg-gray-200"}`}>
                    {step.done ? <span className="text-white text-xs">✓</span> : <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${step.done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                    {step.time && <p className="text-xs text-gray-400">{step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Info Pelanggan & Alamat</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-gray-900">{order.profiles?.name || "Pelanggan"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{order.profiles?.email || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">No. HP</span>
                <span className="font-medium text-gray-900">{order.profiles?.phone || order.shipping_address?.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Alamat</span>
                <span className="font-medium text-gray-900 text-right max-w-[250px]">
                  {order.shipping_address ? `${order.shipping_address.name}, ${order.shipping_address.phone}, ${order.shipping_address.address}, ${order.shipping_address.city}, ${order.shipping_address.province}, ${order.shipping_address.postal_code}` : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Product Items */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Produk</p>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🧴</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty} · Satuan: {formatRp(item.price)}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">{formatRp(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Rincian Biaya</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatRp(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim ({order.shipping_method || "Regular"})</span>
                <span>{formatRp(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Diskon</span>
                <span className="text-green-600">- {formatRp(order.discount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{formatRp(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Shipping info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Pembayaran</p>
              <p className="text-xs text-gray-900 font-medium">{order.payment_method || "Transfer"}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${order.payment_status === "lunas" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {order.payment_status === "lunas" ? "Lunas" : "Belum Bayar"}
              </span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Pengiriman</p>
              <p className="text-xs text-gray-900 font-medium">{order.shipping_method || "JNE"}</p>
              {order.status === "menunggu" || order.status === "diproses" ? (
                <input
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="Input no. resi..."
                  className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-green-400"
                />
              ) : (
                <p className="text-xs text-green-600 font-mono mt-1">{order.tracking_number || "-"}</p>
              )}
            </div>
          </div>

          {/* Actions depending on status */}
          <div className="flex gap-2 pt-2">
            {order.status === "menunggu" && (
              <button
                disabled={isPending}
                onClick={() => handleUpdateStatus("diproses")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-xs disabled:opacity-50"
              >
                Proses Pesanan
              </button>
            )}
            {order.status === "diproses" && (
              <button
                disabled={isPending}
                onClick={() => handleUpdateStatus("dikirim")}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl text-xs disabled:opacity-50"
              >
                Kirim Pesanan (Gunakan Resi)
              </button>
            )}
            {order.status === "dikirim" && (
              <button
                disabled={isPending}
                onClick={() => handleUpdateStatus("selesai")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-xs disabled:opacity-50"
              >
                Selesaikan Pesanan
              </button>
            )}
            {order.status !== "selesai" && order.status !== "dibatalkan" && (
              <button
                disabled={isPending}
                onClick={() => handleUpdateStatus("dibatalkan")}
                className="px-4 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-red-50 disabled:opacity-50"
              >
                Batalkan
              </button>
            )}
            <button className="px-4 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-xs hover:bg-gray-50">
              Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  const [stats, setStats] = useState({
    todayCount: 0,
    menunggu: 0,
    diproses: 0,
    dikirim: 0,
    selesai: 0,
    dibatalkan: 0,
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: Math.min(10, 100).toString(),
        status: statusKeys[statusFilter],
        ...(search && { search }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data ?? []);
        setTotalCount(data.count ?? 0);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, search, dateFrom, dateTo]);

  useEffect(() => {
    startTransition(() => {
      fetchOrders();
    });
  }, [fetchOrders]);

  const totalPages = Math.ceil(totalCount / 10);

  const miniStats = [
    { label: "Total Hari Ini", value: stats.todayCount, icon: "📋", color: "bg-blue-50 text-blue-600" },
    { label: "Menunggu", value: stats.menunggu, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
    { label: "Dikirim", value: stats.dikirim, icon: "🚚", color: "bg-purple-50 text-purple-700" },
    { label: "Selesai", value: stats.selesai, icon: "✅", color: "bg-green-50 text-green-700" },
    { label: "Dibatalkan", value: stats.dibatalkan, icon: "❌", color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen Pesanan</h2>
        <p className="text-sm text-gray-500 mt-0.5">Pantau dan proses semua pesanan masuk</p>
      </div>

      {/* Mini Stat Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {miniStats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Cari no. pesanan atau nama pelanggan..."
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 focus:outline-none focus:border-green-400"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 focus:outline-none focus:border-green-400"
              />
            </div>
          </div>
          <button
            onClick={() => window.open("/api/admin/orders/export", "_blank")}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 mt-3 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">No. Pesanan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Pelanggan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">Produk</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Pembayaran</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Kurir</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">Tidak ada pesanan ditemukan.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const firstItem = order.order_items && order.order_items[0];
                  const productsText = firstItem
                    ? `${firstItem.product_name}${order.order_items!.length > 1 ? ` + ${order.order_items!.length - 1} produk` : ""}`
                    : "-";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">#{order.order_number}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-900 text-xs">{order.profiles?.name || "Pelanggan"}</p>
                        <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <p className="text-xs text-gray-600 max-w-[160px] truncate" title={productsText}>{productsText}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-gray-900 text-xs">{formatRp(order.total)}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-600">{order.payment_method || "-"}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-600">{order.shipping_method || "-"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-order-detail-${order.id}`}
                            onClick={() => setSelectedOrderId(order.id)}
                            className="text-green-600 hover:text-green-700 text-xs font-semibold hover:underline"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Menampilkan {orders.length} dari {totalCount} pesanan</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold ${currentPage === i + 1 ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onUpdateSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
