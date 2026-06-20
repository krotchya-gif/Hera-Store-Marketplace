import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BayarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order || order.status !== "menunggu") notFound();

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Simple header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <Link href="/profil?tab=pesanan" className="text-sm text-green-600 font-medium">← Kembali</Link>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Pembayaran</h1>
          <p className="text-sm text-gray-500 mb-6">Selesaikan pembayaran sebelum batas waktu</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">No. Pesanan</span>
              <span className="font-semibold text-gray-900 font-mono">#{order.order_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Bayar</span>
              <span className="font-bold text-green-700 text-lg">Rp {order.total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Transfer ke:</h3>
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Bank</span>
                <span className="font-semibold text-gray-900">BCA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">No. Rekening</span>
                <span className="font-semibold text-gray-900 font-mono">1234567890</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Atas Nama</span>
                <span className="font-semibold text-gray-900">PT Hera Store</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Konfirmasi pembayaran melalui WhatsApp setelah transfer.</p>
          </div>

          <Link
            href="/profil?tab=pesanan"
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors"
          >
            Sudah Bayar
          </Link>
        </div>
      </div>
    </div>
  );
}
