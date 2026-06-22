"use client";

import { useState, useEffect } from "react";
import { STORE_NAME } from "@/utils/storeConfig";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import {
  Leaf,
  Truck,
  Shield,
  Headphones,
  BadgeCheck,
  ChevronRight,
  Star,
  Zap,
  Heart,
  X,
} from "lucide-react";
import type { Product, Category } from "@/types/database";

import { formatRp } from "@/utils/format";
import { addToCart, getWishlist, toggleWishlist } from "@/lib/cart-utils";

export function getProductEmoji(slug: string | null, categoryIcon?: string | null): string {
  if (!slug) return categoryIcon || "📦";
  const map: Record<string, string> = {
    "sabun-cair-hera-store": "🧴",
    "pembersih-lantai-harum": "🧹",
    "hand-sanitizer-500ml": "🧼",
    "sabun-cuci-piring": "🍽️",
    "pewangi-ruangan-premium": "🌸",
    "kondisioner-rambut": "💆",
    "pembersih-kaca": "🪟",
    "losion-tubuh-aloe": "🧴",
    "vitamin-c-500mg": "💊",
    "deterjen-pakaian": "👕",
    "sunscreen-spf50": "🧴",
    "minyak-kayu-putih": "🌿",
    "pembersih-toilet": "🚽"
  };
  return map[slug] || categoryIcon || "📦";
}

// ─── Countdown Timer ─────────────────────────────────────────────
function useCountdown(targetDate: string | null) {
  const calcRemaining = () => {
    if (!targetDate) return { h: 0, m: 0, s: 0 };
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(calcRemaining());
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return time;
}

// ─── Hero Banner ──────────────────────────────────────────────────
function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 relative overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-1/4 w-32 md:w-48 h-32 md:h-48 bg-white/5 rounded-full translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-200 text-sm font-medium">{STORE_NAME}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
            Solusi Produk<br />
            <span className="text-green-200">Berkualitas</span>
          </h1>
          <p className="text-green-100 text-sm md:text-base mb-6 max-w-md mx-auto md:mx-0">
            Temukan ribuan produk rumah tangga premium — sabun, pembersih, perawatan tubuh, dan lebih banyak lagi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
              Belanja Sekarang
            </button>
            <button className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
              Lihat Promo →
            </button>
          </div>
        </div>

        <div className="flex gap-3 md:gap-4 shrink-0">
          {["🧴", "🧼", "🌸"].map((emoji, i) => (
            <div
              key={i}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/20 shadow-xl ${i === 1 ? "-translate-y-3 md:-translate-y-4" : ""}`}
            >
              <span className="text-4xl md:text-5xl block mb-2">{emoji}</span>
              <div className="w-full h-1.5 bg-white/20 rounded-full">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${70 - i * 15}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: <Truck className="w-5 h-5 text-green-600" />, title: "Gratis Ongkir", sub: "Min. belanja tertentu" },
    { icon: <BadgeCheck className="w-5 h-5 text-green-600" />, title: "Garansi Produk", sub: "100% Original" },
    { icon: <Shield className="w-5 h-5 text-green-600" />, title: "Pembayaran Aman", sub: "Dijamin aman" },
    { icon: <Headphones className="w-5 h-5 text-green-600" />, title: "Support 24/7", sub: "Siap membantu" },
  ];
  return (
    <section className="bg-white border-b border-gray-100 py-4 animate-fade-in-up delay-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 md:divide-x divide-gray-100">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 px-0 md:px-6 first:pl-0 last:pr-0">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-xs md:text-sm">{item.title}</p>
                <p className="text-gray-400 text-xs">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────
function ProductCard({
  product,
  showDiscount = false,
  stats,
}: {
  product: Product;
  showDiscount?: boolean;
  stats?: { average: number; count: number; sold: number };
}) {
  const [wished, setWished] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return getWishlist().includes(product.id);
  });
  const [added, setAdded] = useState(false);

  const emoji = getProductEmoji(product.slug, product.categories?.icon);
  const finalPrice = product.discount_price ?? product.price;
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discount_price!) / product.price) * 100) : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Silakan masuk (login) terlebih dahulu untuk berbelanja.");
        window.location.href = "/profil";
        return;
      }

      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.discount_price ?? product.price,
          emoji: emoji,
          stock: product.stock,
          slug: product.slug ?? undefined,
          originalPrice: product.discount_price ? product.price : null,
        },
        1
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link href={`/produk/${product.slug}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer">
        <div className="relative aspect-square bg-green-50 flex items-center justify-center">
          <span className="text-5xl md:text-6xl">{emoji}</span>

          {showDiscount && hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}

          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  alert("Silakan masuk (login) terlebih dahulu untuk menambahkan wishlist.");
                  window.location.href = "/profil";
                  return;
                }

                const nextWished = !wished;
                setWished(nextWished);
                toggleWishlist(product.id);
              } catch (err) {
                console.error(err);
              }
            }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${
              wished ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleAdd}
            className={`absolute bottom-2 left-2 right-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${added
                ? "bg-green-600 text-white opacity-100"
                : "bg-white text-green-700 border border-green-200 md:opacity-0 md:group-hover:opacity-100 opacity-100"
              }`}
          >
            {added ? "✓ Ditambahkan!" : "+ Keranjang"}
          </button>
        </div>

        <div className="p-3">
          <p className="font-medium text-gray-900 text-xs leading-snug line-clamp-2 mb-1">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-500">
              {stats && stats.count > 0 ? `${stats.average} · ${stats.sold.toLocaleString("id-ID")} terjual` : "Produk Baru"}
            </span>
          </div>
          <div>
            <p className="font-bold text-green-700 text-sm">
              {formatRp(finalPrice)}
            </p>
            {hasDiscount && (
              <p className="text-gray-400 text-xs line-through">
                {formatRp(product.price)}
              </p>
            )}
          </div>
          {product.categories && (
            <span className="mt-1.5 inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
              {product.categories.name}
            </span>
          )}
          <p className="text-gray-400 text-xs mt-1">📦 Gratis Ongkir</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────────
function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-green-600 text-xs md:text-sm font-semibold hover:text-green-700 transition-colors">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

interface HomeClientProps {
  categories: Category[];
  flashSaleProducts: Product[];
  bestSellerProducts: Product[];
  promoProducts: Product[];
  flashSaleEnd?: string | null;
  productStats?: Record<string, { average: number; count: number; sold: number }>;
}

export default function HomeClient({ categories, flashSaleProducts, bestSellerProducts, promoProducts, flashSaleEnd, productStats = {} }: HomeClientProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [emailSubscribe, setEmailSubscribe] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const countdown = useCountdown(flashSaleEnd ?? null);

  const handleSubscribe = async () => {
    if (!emailSubscribe.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSubscribe.trim())) {
      alert("Masukkan alamat email yang valid.");
      return;
    }
    setSubscribeStatus("loading");
    try {
      // Simpan ke store_settings untuk keperluan marketing
      const supabase = createClient();
      const { error } = await supabase
        .from("store_settings")
        .upsert({
          key: "subscribed_emails",
          value: { emails: [emailSubscribe.trim()] },
          updated_at: new Date().toISOString(),
        }, { onConflict: "key" });
      if (error) {
        console.warn("[Email Subscribe] Gagal simpan ke DB:", error.message);
        // Fallback: tetap anggap berhasil
      }
      setSubscribeStatus("success");
      setEmailSubscribe("");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    } catch (err) {
      console.error("[Email Subscribe] Error:", err);
      setSubscribeStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />

      <HeroBanner />

      <TrustBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* Kategori Populer */}
        <section>
          <SectionHeader title="Kategori Populer" subtitle="Temukan produk sesuai kebutuhanmu" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 hover:border-green-200 transition-all group animate-scale-in"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <span className="text-2xl md:text-3xl">{cat.icon || "📦"}</span>
                <p className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-green-700">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-400">Lihat detail</p>
              </Link>
            ))}
          </div>
          {categories.length > 6 && (
            <button
              onClick={() => setShowAllCategories(true)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium text-sm hover:bg-green-50 transition-colors"
            >
              Tampilkan Semua Kategori ({categories.length})
            </button>
          )}
        </section>

        {/* All Categories Modal */}
        {showAllCategories && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAllCategories(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">Semua Kategori</h3>
                <button onClick={() => setShowAllCategories(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setShowAllCategories(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-transparent transition-all"
                  >
                    <span className="text-3xl">{cat.icon || "📦"}</span>
                    <p className="text-xs font-medium text-gray-700 text-center">{cat.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flash Sale */}
        {flashSaleProducts.length > 0 && (
          <section id="flash-sale" className="scroll-mt-20 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white fill-current animate-pulse" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">Flash Sale</h2>
                </div>
                <span className="text-gray-400 text-xs hidden sm:block">Berakhir dalam</span>
                <div className="flex items-center gap-1">
                  {[countdown.h, countdown.m, countdown.s].map((val, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="bg-gray-900 text-white font-mono font-bold text-xs md:text-sm px-2 py-1 rounded-lg">
                        {String(val).padStart(2, "0")}
                      </span>
                      {i < 2 && <span className="text-gray-400 font-bold text-sm">:</span>}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/kategori/semua?sort=popular" className="flex items-center gap-1 text-red-500 text-xs md:text-sm font-semibold hover:text-red-600">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible snap-x snap-mandatory">
              {flashSaleProducts.map((product) => (
                <div key={product.id} className="min-w-[160px] md:min-w-0 snap-start">
                  <ProductCard product={product} showDiscount stats={productStats[product.id]} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Promo Utama */}
        {promoProducts && promoProducts.length > 0 && (
          <section id="promo" className="scroll-mt-20 animate-fade-in-up delay-300">
            <SectionHeader title="Promo Terbatas" subtitle="Diskon spesial khusus minggu ini" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} showDiscount stats={productStats[product.id]} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        <section id="terlaris" className="scroll-mt-20 animate-fade-in-up delay-300">
          <SectionHeader title="Produk Terlaris" subtitle="Pilihan favorit ribuan pelanggan" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} stats={productStats[product.id]} />
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="animate-fade-in-up delay-200">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Daftar Sekarang & Dapatkan Promo!</h3>
                <p className="text-green-100 text-sm">Voucher diskon 15% untuk pembelian pertamamu.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <input
                  type="email"
                  placeholder="Masukkan emailmu..."
                  value={emailSubscribe}
                  onChange={(e) => setEmailSubscribe(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubscribe(); }}
                  className="bg-white/20 border border-white/30 text-white placeholder-green-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white/30 w-full sm:w-56"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={subscribeStatus === "loading"}
                  className="bg-white text-green-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-green-50 transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {subscribeStatus === "loading" ? "Mendaftarkan..." : subscribeStatus === "success" ? "✓ Terdaftar!" : "Daftar Gratis"}
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
