"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { STORE_NAME } from "@/utils/storeConfig";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Leaf,
  Menu,
  X,
  ChevronDown,
  Package,
  Bell,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [, startTransition] = useTransition();

  interface NavbarCategory {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    products?: { count: number }[];
  }

  const [navCategories, setNavCategories] = useState<NavbarCategory[]>([]);

  useEffect(() => {
    const fetchNavbarCategories = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, slug, icon, products(count)")
          .eq("is_active", true)
          .is("parent_id", null)
          .order("sort_order");

        if (!error && data) {
          setNavCategories(data as unknown as NavbarCategory[]);
        }
      } catch (err) {
        console.error("Failed to load navbar categories from DB", err);
      }
    };
    startTransition(() => {
      fetchNavbarCategories();
    });
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/kategori/semua?search=${encodeURIComponent(q)}`);
  };
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    startTransition(() => {
      setMobileMenuOpen(false);
      setCategoryOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Logged in: check if role is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile && ["super_admin", "admin", "operator", "finance"].includes(profile.role)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        updateCartCount();
        updateWishlistCount();
      } else {
        setIsAdmin(false);
        updateCartCount();
        updateWishlistCount();
      }
    };

    const updateCartCount = () => {
      try {
        const cartStr = localStorage.getItem("hera_cart");
        if (cartStr) {
          const cart = JSON.parse(cartStr);
          if (Array.isArray(cart)) {
            const total = cart.reduce((sum, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
            setCartCount(total);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setCartCount(0);
    };

    const updateWishlistCount = () => {
      try {
        const wishStr = localStorage.getItem("hera_wishlist");
        if (wishStr) {
          const wish = JSON.parse(wishStr);
          if (Array.isArray(wish)) {
            setWishlistCount(wish.length);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setWishlistCount(0);
    };

    checkUser();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("wishlist-updated", updateWishlistCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("wishlist-updated", updateWishlistCount);
    };
  }, []);

  const navLinks = [
    { label: "Flash Sale", href: "/#flash-sale" },
    { label: "Promo", href: "/#promo" },
    { label: "Terlaris", href: "/#terlaris" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top row */}
        <div className="flex items-center gap-3 py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-green-700 text-sm md:text-base leading-tight">
                {STORE_NAME}
              </p>
              <p className="text-xs text-gray-400 leading-tight hidden md:block">
                Official
              </p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 mx-2 md:mx-4 relative">
            <input
              id="navbar-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk, kategori, atau merek..."
              className="w-full border border-gray-200 rounded-full py-2 md:py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <Link
              href="/profil?tab=wishlist"
              className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/profil"
              className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Link>
            <Link
              href="/keranjang"
              className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-green-600 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/profil"
              className="hidden md:flex w-9 h-9 md:w-10 md:h-10 items-center justify-center text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
            {/* Hamburger */}
            <button
              id="navbar-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-1 border-t border-gray-100 py-2">
          {/* Beranda Link first */}
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/"
                ? "text-green-700 bg-green-50"
                : "text-gray-600 hover:text-green-700 hover:bg-green-50"
            }`}
          >
            Beranda
          </Link>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Category Dropdown second */}
          <div className="relative">
            <button
              id="navbar-category-dropdown"
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap"
            >
              <Menu className="w-4 h-4" /> Kategori{" "}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {navCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setCategoryOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 group transition-colors"
                  >
                    <span className="text-xl">{cat.icon || "📦"}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-green-700">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {cat.products && cat.products[0] ? cat.products[0].count : 0} produk
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* navLinks: Flash Sale, Promo, Terlaris */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === link.href
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin Panel button - ONLY IF isAdmin is true */}
          {isAdmin && (
            <div className="ml-auto">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 border border-green-200 transition-colors"
              >
                ⚙️ Admin Panel
              </Link>
            </div>
          )}
        </div>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 relative z-50 bg-white">
            {/* Akun & Pesanan — Top Section */}
            <div className="px-4 pb-4 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 bg-green-50 rounded-xl py-4 hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Akun Saya</span>
                </Link>
                <Link
                  href="/profil?tab=pesanan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 bg-blue-50 rounded-xl py-4 hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Pesanan Saya</span>
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-3 pt-3 space-y-0.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="w-6 text-center">🏠</span> Beranda
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="w-6 text-center">
                    {link.label === "Flash Sale" ? "⚡" : link.label === "Promo" ? "🏷️" : "🔥"}
                  </span>
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-600 hover:bg-green-50 border border-green-200 mt-2 transition-colors"
                >
                  <span className="w-6 text-center">⚙️</span> Admin Panel
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="px-3 pt-2 mt-2 border-t border-gray-100">
              <button
                onClick={async () => {
                  localStorage.removeItem("hera_cart");
                  localStorage.removeItem("hera_wishlist");
                  localStorage.removeItem("hera_checkout_items");
                  localStorage.removeItem("hera_applied_voucher");
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <span className="w-6 text-center">🚪</span> Keluar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for category dropdown */}
      {categoryOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCategoryOpen(false)}
        />
      )}

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex items-center justify-around py-1">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl">{pathname === "/" ? "🏠" : "🏠"}</span>
            <span className="text-[10px] font-medium">Beranda</span>
          </Link>
          <Link
            href="/voucher"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/voucher" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl">🏷️</span>
            <span className="text-[10px] font-medium">Voucher</span>
          </Link>
          <Link
            href="/keranjang"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative ${
              pathname === "/keranjang" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 right-1 w-4 h-4 bg-green-600 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <span className="text-[10px] font-medium">Keranjang</span>
          </Link>
          <Link
            href="/profil"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/profil" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </div>

    </header>
  );
}
