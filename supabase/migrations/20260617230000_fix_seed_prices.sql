-- =============================================
-- Fix: Seed data price & discount_price terbalik
-- Semua produk seed memiliki nilai price dan discount_price tertukar
-- Contoh: Sabun Cair (price=25000, discount_price=31000) → seharusnya (price=31000, discount_price=25000)
-- =============================================

UPDATE public.products SET
  price = 31000,
  discount_price = 25000
WHERE slug = 'sabun-cair-hera-store' AND price = 25000 AND discount_price = 31000;

UPDATE public.products SET
  price = 35000,
  discount_price = 28000
WHERE slug = 'pembersih-lantai-harum' AND price = 28000 AND discount_price = 35000;

UPDATE public.products SET
  price = 25000,
  discount_price = 18000
WHERE slug = 'hand-sanitizer-500ml' AND price = 18000 AND discount_price = 25000;

UPDATE public.products SET
  price = 20000,
  discount_price = 16000
WHERE slug = 'sabun-cuci-piring' AND price = 16000 AND discount_price = 20000;

UPDATE public.products SET
  price = 28000,
  discount_price = 22000
WHERE slug = 'pewangi-ruangan-premium' AND price = 22000 AND discount_price = 28000;
