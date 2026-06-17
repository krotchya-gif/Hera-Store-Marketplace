"use client";

import { Megaphone, Mail, Smartphone, BarChart3, MessageSquare, Gift } from "lucide-react";

const channels = [
  { name: "Email Blast", icon: <Mail className="w-5 h-5" />, desc: "Kirim newsletter & promosi ke pelanggan", status: "Segera", color: "text-blue-600 bg-blue-50" },
  { name: "Push Notification", icon: <Smartphone className="w-5 h-5" />, desc: "Notifikasi langsung ke perangkat pelanggan", status: "Segera", color: "text-purple-600 bg-purple-50" },
  { name: "SMS Broadcast", icon: <MessageSquare className="w-5 h-5" />, desc: "Kirim promo via SMS ke nomor terdaftar", status: "Segera", color: "text-green-600 bg-green-50" },
  { name: "Banner Iklan", icon: <Megaphone className="w-5 h-5" />, desc: "Kelola banner promosi di homepage", status: "Segera", color: "text-orange-600 bg-orange-50" },
  { name: "Analytics & Report", icon: <BarChart3 className="w-5 h-5" />, desc: "Laporan performa kampanye marketing", status: "Segera", color: "text-indigo-600 bg-indigo-50" },
  { name: "Voucher Campaign", icon: <Gift className="w-5 h-5" />, desc: "Buat kampanye voucher massal", status: "Ada di Promo", color: "text-green-600 bg-green-50" },
];

export default function MarketingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Marketing</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kelola kampanye dan promosi pemasaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div key={ch.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ch.color} mb-3`}>
              {ch.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{ch.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{ch.desc}</p>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
              ch.status === "Segera" ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"
            }`}>
              {ch.status === "Segera" ? "🚧 Dalam Pengembangan" : "✅ " + ch.status}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 text-sm">📊 Ringkasan Marketing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Total Pelanggan", value: "-", icon: "👥" },
            { label: "Email Terdaftar", value: "-", icon: "📧" },
            { label: "Voucher Aktif", value: "5", icon: "🏷️" },
            { label: "Kampanye Berjalan", value: "0", icon: "📢" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          Fitur marketing akan segera hadir: Email blast, push notification, SMS broadcast, dan analitik kampanye.
        </p>
      </div>
    </div>
  );
}
