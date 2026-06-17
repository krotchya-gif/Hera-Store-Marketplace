// ─── Formatting Utilities ──────────────────────────────────────

export const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export const formatRupiah = (value: number) => {
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
  if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`;
  return `Rp ${value}`;
};

export const formatDate = (dateStr: string, locale = "id-ID") => {
  return new Date(dateStr).toLocaleDateString(locale);
};

export const getDiscountPercent = (price: number, discountPrice: number | null) => {
  if (!discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
};
