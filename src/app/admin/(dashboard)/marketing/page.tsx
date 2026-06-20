"use client";

import { useState, useEffect, useTransition } from "react";
import { Megaphone, Mail, Smartphone, BarChart3, MessageSquare, Gift, Loader2 } from "lucide-react";
import type { Voucher } from "@/types/database";

const channels = [
  { name: "Email Blast", icon: <Mail className="w-5 h-5" />, desc: "Kirim newsletter & promosi ke pelanggan", status: "Segera", color: "text-blue-600 bg-blue-50" },
  { name: "Push Notification", icon: <Smartphone className="w-5 h-5" />, desc: "Notifikasi langsung ke perangkat pelanggan", status: "Segera", color: "text-purple-600 bg-purple-50" },
  { name: "SMS Broadcast", icon: <MessageSquare className="w-5 h-5" />, desc: "Kirim promo via SMS ke nomor terdaftar", status: "Segera", color: "text-green-600 bg-green-50" },
  { name: "Banner Iklan", icon: <Megaphone className="w-5 h-5" />, desc: "Kelola banner promosi di homepage", status: "Segera", color: "text-orange-600 bg-orange-50" },
  { name: "Analytics & Report", icon: <BarChart3 className="w-5 h-5" />, desc: "Laporan performa kampanye marketing", status: "Segera", color: "text-indigo-600 bg-indigo-50" },
  { name: "Voucher Campaign", icon: <Gift className="w-5 h-5" />, desc: "Buat kampanye voucher massal", status: "Aktif", color: "text-green-600 bg-green-50" },
];

export default function MarketingPage() {
  const [loading, setLoading] = useState(true);
  const [customerCount, setCustomerCount] = useState(0);
  const [activeCustomerCount, setActiveCustomerCount] = useState(0);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [, startTransition] = useTransition();

  const fetchMarketingData = async () => {
    try {
      const [resCust, resVouch] = await Promise.all([
        fetch("/api/admin/customers"),
        fetch("/api/admin/vouchers"),
      ]);

      if (resCust.ok) {
        const custData = await resCust.json();
        setCustomerCount(custData.stats?.total || 0);
        setActiveCustomerCount(custData.stats?.active || 0);
      }

      if (resVouch.ok) {
        const vouchData = await resVouch.json();
        setVouchers(vouchData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchMarketingData();
    });
  }, []);

  const activeVouchers = vouchers.filter((v) => v.is_active).length;
  const totalVoucherUses = vouchers.reduce((sum, v) => sum + (v.used_count || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        <p className="text-sm font-medium text-gray-500 font-sans">Memuat data marketing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Marketing</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kelola kampanye dan promosi pemasaran secara terpadu</p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pelanggan", value: customerCount.toLocaleString(), icon: "👥", color: "border-blue-100 bg-blue-50/30" },
          { label: "Pelanggan Aktif", value: activeCustomerCount.toLocaleString(), icon: "🟢", color: "border-green-100 bg-green-50/30" },
          { label: "Voucher Aktif", value: activeVouchers.toString(), icon: "🏷️", color: "border-yellow-100 bg-yellow-50/30" },
          { label: "Total Penggunaan Voucher", value: totalVoucherUses.toString(), icon: "📈", color: "border-purple-100 bg-purple-50/30" },
        ].map((s) => (
          <div key={s.label} className={`border border-gray-100 rounded-2xl p-5 shadow-sm bg-white ${s.color}`}>
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Marketing Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div key={ch.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ch.color} mb-3`}>
                {ch.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{ch.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{ch.desc}</p>
            </div>
            <div>
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                ch.status === "Segera" ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
              }`}>
                {ch.status === "Segera" ? "🚧 Dalam Pengembangan" : "✅ Aktif"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Campaign Performance Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">🏷️ Performa Kampanye Voucher</h3>
          <p className="text-xs text-gray-400 mt-0.5">Analisis konversi penggunaan kode voucher aktif</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Nilai Diskon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Min. Belanja</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Kebutuhan / Penggunaan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-sm text-gray-400">Belum ada kampanye voucher dibuat.</td>
                </tr>
              ) : (
                vouchers.map((v) => {
                  const quotaVal = v.quota ?? 0;
                  const usedVal = v.used_count ?? 0;
                  const pct = quotaVal > 0 ? Math.min(100, Math.round((usedVal / quotaVal) * 100)) : 0;

                  return (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                          {v.code}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-gray-900">
                        {v.type === "percent" ? `${v.value}%` : `Rp ${v.value.toLocaleString("id-ID")}`}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">
                        Rp {v.min_purchase.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-full max-w-[150px]">
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>{usedVal} terpakai</span>
                            <span>{quotaVal > 0 ? `${quotaVal} kuota` : "∞"}</span>
                          </div>
                          {quotaVal > 0 ? (
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-green-600 font-medium">Aktif Tanpa Batas</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {v.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
