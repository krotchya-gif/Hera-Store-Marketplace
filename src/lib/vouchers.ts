// ─── Voucher Validation — Supabase ───────────────────────────────────────────
import { createClient } from "@/utils/supabase/server";
import type { Voucher } from "@/types/database";

export interface VoucherValidationResult {
  valid: boolean;
  voucher?: Voucher;
  discount?: number;
  message: string;
}

export async function validateVoucher(
  code: string,
  cartTotal: number
): Promise<VoucherValidationResult> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: voucher, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error || !voucher) {
    return { valid: false, message: "Kode voucher tidak ditemukan atau tidak aktif." };
  }

  // Check validity period
  if (voucher.starts_at && voucher.starts_at > now) {
    return { valid: false, message: "Voucher belum berlaku." };
  }
  if (voucher.ends_at && voucher.ends_at < now) {
    return { valid: false, message: "Voucher sudah kadaluarsa." };
  }

  // Check minimum purchase
  if (cartTotal < (voucher.min_purchase ?? 0)) {
    const minStr = `Rp ${voucher.min_purchase?.toLocaleString("id-ID")}`;
    return { valid: false, message: `Minimum pembelian ${minStr} untuk menggunakan voucher ini.` };
  }

  // Check quota
  if (voucher.quota !== null && (voucher.used_count ?? 0) >= voucher.quota) {
    return { valid: false, message: "Kuota voucher sudah habis." };
  }

  // Calculate discount
  let discount = 0;
  if (voucher.type === "percent") {
    discount = Math.round((cartTotal * voucher.value) / 100);
  } else {
    discount = voucher.value;
  }

  // Cap discount at cart total
  discount = Math.min(discount, cartTotal);

  return {
    valid: true,
    voucher: voucher as Voucher,
    discount,
    message: `Voucher berhasil! Hemat Rp ${discount.toLocaleString("id-ID")}`,
  };
}

export async function redeemVoucher(voucherId: string): Promise<boolean> {
  const supabase = await createClient();
  // Try atomic increment via RPC
  const { error } = await supabase.rpc("increment_voucher_usage", { voucher_id: voucherId });
  if (error) {
    console.error("[redeemVoucher RPC]", error);
    // Fallback: atomic update with quota guard + optimistic locking
    const { data: voucher } = await supabase
      .from("vouchers")
      .select("used_count, quota")
      .eq("id", voucherId)
      .single();
    if (!voucher) return false;
    if (voucher.quota !== null && (voucher.used_count ?? 0) >= voucher.quota) return false;
    const { error: updateError } = await supabase
      .from("vouchers")
      .update({ used_count: (voucher.used_count ?? 0) + 1 })
      .eq("id", voucherId)
      .eq("used_count", voucher.used_count ?? 0); // optimistic lock — prevents race
    if (updateError) {
      console.error("[redeemVoucher fallback update failed]", updateError);
      return false;
    }
  }
  return true;
}
