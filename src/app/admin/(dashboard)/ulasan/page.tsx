"use client";

import { useState, useEffect, useTransition } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/types/database";

const ratingColors = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-blue-400", "text-green-500"];

export default function ReviewsPage() {
  const [filter, setFilter] = useState("Semua");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
  });

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      let isVisibleParam = undefined;
      if (filter === "Tampil") isVisibleParam = "true";
      if (filter === "Disembunyikan") isVisibleParam = "false";

      const params = new URLSearchParams({
        ...(isVisibleParam && { isVisible: isVisibleParam }),
        page: "1",
        pageSize: "50", // fetch top 50
      });

      const res = await fetch(`/api/admin/reviews?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data ?? []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const toggleStatus = async (id: string, currentVisible: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/reviews/${id}/toggle`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_visible: !currentVisible }),
        });
        if (res.ok) {
          fetchReviews();
        }
      } catch (error) {
        console.error("Failed to toggle review visibility", error);
      }
    });
  };

  // Client side rating filters
  const filtered = reviews.filter((r) => {
    if (filter === "Semua" || filter === "Tampil" || filter === "Disembunyikan") return true;
    if (filter === "5 ⭐") return r.rating === 5;
    if (filter === "4 ⭐") return r.rating === 4;
    if (filter === "≤3 ⭐") return r.rating <= 3;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen Ulasan</h2>
        <p className="text-sm text-gray-500 mt-0.5">Pantau dan moderasi ulasan pelanggan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{stats.average}</p>
          <div className="flex justify-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-3.5 h-3.5 ${stats.average >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">Rata-rata Rating</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-2">Total Ulasan</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {Object.values(stats.breakdown).reduce((a, b) => a + b, 0)} {/* estimate total */}
          </p>
          <p className="text-xs text-gray-400 mt-2">Ulasan Terdaftar</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-gray-400">
            {stats.breakdown[1] + stats.breakdown[2] + stats.breakdown[3]}
          </p>
          <p className="text-xs text-gray-400 mt-2">Rating Kurang (≤3★)</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {["Semua", "Tampil", "Disembunyikan", "5 ⭐", "4 ⭐", "≤3 ⭐"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filter === f ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100 shadow-sm">
            Tidak ada ulasan ditemukan.
          </div>
        ) : (
          filtered.map((review) => (
            <div key={review.id} className={`bg-white rounded-2xl border shadow-sm p-5 border-gray-100 ${!review.is_visible ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(review.profiles?.name || "P").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{review.profiles?.name || "Pelanggan Hera"}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? `fill-current ${ratingColors[review.rating]}` : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-0.5">📦 {review.products?.name || "Produk"}</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${review.is_visible ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {review.is_visible ? "Tampil" : "Disembunyikan"}
                  </span>
                  <button
                    id={`btn-toggle-review-${review.id}`}
                    onClick={() => toggleStatus(review.id, review.is_visible)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${review.is_visible ? "border-gray-200 text-gray-600 hover:bg-gray-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
                  >
                    {review.is_visible ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
