import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export default async function VoucherPage() {
  const supabase = await createClient();
  const { data: vouchers } = await supabase
    .from("vouchers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Voucher Saya</h1>
          <p className="text-sm text-gray-500">Kumpulan promo dan diskon untuk belanja hemat</p>
        </div>

        {(!vouchers || vouchers.length === 0) ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <span className="text-5xl block mb-3">🏷️</span>
            <p className="font-semibold text-gray-900">Belum ada voucher</p>
            <p className="text-sm text-gray-500 mt-1">Nantikan promo menarik dari Hera Store</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vouchers.map((v) => {
              const isPercent = v.type === "percent";
              const diskonLabel = isPercent ? `${v.value}%` : formatRp(v.value);
              const minLabel = v.min_purchase > 0 ? `Min. ${formatRp(v.min_purchase)}` : "Tanpa min. belanja";
              const sisa = v.quota !== null ? `${Math.max(0, v.quota - (v.used_count ?? 0))} tersisa` : "Unlimited";

              return (
                <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex">
                    <div className="w-20 bg-gradient-to-b from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg">
                      {isPercent ? `${v.value}%` : "💰"}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{v.code}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{diskonLabel} · {minLabel}</p>
                        </div>
                        <button
                          onClick={async () => {
                            "use server";
                            // Copy code to clipboard — server action placeholder
                          }}
                          className="text-xs font-semibold text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50"
                        >
                          Salin
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400">{sisa}</span>
                        {v.ends_at && (
                          <span className="text-[10px] text-gray-400">Berlaku hingga {new Date(v.ends_at).toLocaleDateString("id-ID")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
