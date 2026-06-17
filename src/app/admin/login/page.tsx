"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Leaf, Shield } from "lucide-react";
import { STORE_NAME, getAdminEmail } from "@/utils/storeConfig";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah. Coba lagi.");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-900 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-[-100px] w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-green-200 uppercase tracking-widest">
                Admin Panel
              </p>
              <h1 className="text-2xl font-bold">{STORE_NAME}</h1>
            </div>
          </div>

          <div className="space-y-6 mt-12">
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-xl">📦</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Manajemen Produk</p>
                <p className="text-green-200 text-xs">Kelola semua produk marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-xl">📋</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Manajemen Pesanan</p>
                <p className="text-green-200 text-xs">Pantau dan proses pesanan masuk</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-xl">💰</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Laporan Keuangan</p>
                <p className="text-green-200 text-xs">Pantau pendapatan & transaksi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">{STORE_NAME}</span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Masuk Admin</h2>
                <p className="text-gray-400 text-sm">Akses panel administrasi</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getAdminEmail("admin")}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                id="btn-admin-login"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:text-green-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
              Hanya untuk staf yang berwenang.{" "}
              <span className="text-green-400">{STORE_NAME}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
