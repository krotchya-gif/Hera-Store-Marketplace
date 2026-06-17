-- =============================================
-- SEED DATA — Hera Store Products & Vouchers
-- Run this in Supabase SQL Editor AFTER running supabase_schema.sql
-- =============================================

-- Insert products (linked to categories by slug lookup)
WITH cat AS (
  SELECT id, slug FROM public.categories
)
INSERT INTO public.products (name, slug, sku, description, category_id, brand, price, discount_price, stock, unit, weight_gram, is_active)
SELECT p.name, p.slug, p.sku, p.description, cat.id, p.brand, p.price, p.discount_price, p.stock, p.unit, p.weight_gram, true
FROM cat, (VALUES
  ('Sabun Cair Hera Store Premium', 'sabun-cair-hera-store', 'SAB-001',
   'Sabun cair premium dengan formula lembut yang menjaga kelembapan kulit. Mengandung aloe vera dan vitamin E untuk kulit sehat dan lembut sepanjang hari. Cocok untuk semua jenis kulit termasuk kulit sensitif.',
   'perawatan-tubuh', 'Hera Store', 31000, 25000, 150, 'botol', 520),

  ('Pembersih Lantai Super Harum', 'pembersih-lantai-harum', 'PLH-001',
   'Pembersih lantai dengan formula anti bakteri yang ampuh membersihkan noda membandel. Mengharumkan ruangan dengan aroma segar tahan lama.',
   'perawatan-rumah', 'Hera Store', 35000, 28000, 200, 'botol', 1050),

  ('Hand Sanitizer Antibacterial 500ml', 'hand-sanitizer-500ml', 'HAN-001',
   'Hand sanitizer dengan kandungan alkohol 70% yang efektif membunuh 99.9% kuman dan bakteri. Formula gel tidak lengket dan cepat kering.',
   'kesehatan', 'Hera Store', 25000, 18000, 300, 'botol', 520),

  ('Sabun Cuci Piring Anti Lemak 800ml', 'sabun-cuci-piring', 'SCP-001',
   'Sabun cuci piring dengan formula super konsentrat yang ampuh membersihkan lemak dan sisa makanan dengan mudah. Lembut di tangan.',
   'perawatan-rumah', 'Hera Store', 20000, 16000, 180, 'botol', 820),

  ('Pewangi Ruangan Premium Aroma Spa', 'pewangi-ruangan-premium', 'PWR-001',
   'Pewangi ruangan premium dengan aroma spa yang menenangkan. Tahan lama hingga 30 hari dengan teknologi slow release.',
   'perawatan-rumah', 'Hera Store', 28000, 22000, 120, 'botol', 200),

  ('Kondisioner Rambut Silk Smooth 350ml', 'kondisioner-rambut', 'KRB-001',
   'Kondisioner rambut dengan protein sutra yang membuat rambut lembut, berkilau, dan mudah diatur. Cocok untuk rambut kering dan rusak.',
   'perawatan-tubuh', 'Hera Store', 35000, NULL, 95, 'botol', 380),

  ('Pembersih Kaca & Cermin Anti Streak', 'pembersih-kaca', 'PKC-001',
   'Pembersih kaca formula anti bekas (streak-free) yang membuat kaca dan cermin kinclong tanpa meninggalkan bekas sapuan.',
   'perawatan-rumah', 'Hera Store', 19000, NULL, 210, 'botol', 520),

  ('Losion Tubuh Aloe Vera & Vitamin E', 'losion-tubuh-aloe', 'LTA-001',
   'Losion tubuh dengan kandungan aloe vera segar dan vitamin E yang melembapkan dan melembutkan kulit. Formula cepat meresap tidak lengket.',
   'perawatan-tubuh', 'Hera Store', 32000, NULL, 130, 'botol', 270),

  ('Vitamin C 500mg Effervescent 20 Tablet', 'vitamin-c-500mg', 'VIT-001',
   'Suplemen Vitamin C 500mg dalam bentuk effervescent yang mudah dikonsumsi. Mendukung daya tahan tubuh dan kesehatan kulit.',
   'kesehatan', 'Hera Store', 45000, NULL, 450, 'box', 100),

  ('Deterjen Pakaian Bubuk 1kg Anti Kusam', 'deterjen-pakaian', 'DET-001',
   'Deterjen pakaian bubuk dengan formula enzim aktif yang ampuh mengangkat noda membandel tanpa merusak serat kain.',
   'perawatan-rumah', 'Hera Store', 38000, NULL, 280, 'pak', 1050),

  ('Sunscreen SPF 50+ PA++++ Daily Protection', 'sunscreen-spf50', 'SUN-001',
   'Sunscreen ringan SPF 50+ PA++++ dengan formula water-resistant yang melindungi dari sinar UVA dan UVB. Tidak meninggalkan white cast.',
   'kecantikan', 'Hera Store', 55000, NULL, 85, 'tube', 80),

  ('Minyak Kayu Putih Murni 60ml', 'minyak-kayu-putih', 'MKP-001',
   'Minyak kayu putih murni 100% alami tanpa campuran bahan kimia. Membantu meredakan masuk angin, mual, dan pegal-pegal.',
   'kesehatan', 'Hera Store', 28000, NULL, 320, 'botol', 80)
) AS p(name, slug, sku, description, category_slug, brand, price, discount_price, stock, unit, weight_gram)
WHERE cat.slug = p.category_slug
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Add product variants for some products
-- =============================================
INSERT INTO public.product_variants (product_id, name, price, stock, sku)
SELECT p.id, v.name, v.price, v.stock, v.sku
FROM public.products p, (VALUES
  ('sabun-cair-hera-store', 'Fresh', 25000, 50, 'SAB-001-F'),
  ('sabun-cair-hera-store', 'Lemon', 25000, 60, 'SAB-001-L'),
  ('sabun-cair-hera-store', 'Rose', 25000, 40, 'SAB-001-R'),
  ('pembersih-lantai-harum', 'Lavender', 28000, 80, 'PLH-001-LA'),
  ('pembersih-lantai-harum', 'Citrus', 28000, 70, 'PLH-001-C'),
  ('pembersih-lantai-harum', 'Pine', 28000, 50, 'PLH-001-P'),
  ('pewangi-ruangan-premium', 'Lavender', 22000, 40, 'PWR-001-LA'),
  ('pewangi-ruangan-premium', 'Jasmine', 22000, 50, 'PWR-001-J'),
  ('pewangi-ruangan-premium', 'Ocean', 22000, 30, 'PWR-001-O'),
  ('vitamin-c-500mg', 'Jeruk', 45000, 150, 'VIT-001-J'),
  ('vitamin-c-500mg', 'Lemon', 45000, 150, 'VIT-001-L'),
  ('vitamin-c-500mg', 'Stroberi', 45000, 150, 'VIT-001-S')
) AS v(product_slug, name, price, stock, sku)
WHERE p.slug = v.product_slug
ON CONFLICT DO NOTHING;

-- =============================================
-- Seed vouchers
-- =============================================
INSERT INTO public.vouchers (code, type, value, min_purchase, quota, per_user_limit, ends_at, is_active)
VALUES
  ('HERA15', 'percent', 15, 50000, 500, 1, NOW() + INTERVAL '30 days', true),
  ('HERA10', 'percent', 10, 30000, 1000, 2, NOW() + INTERVAL '60 days', true),
  ('GRATIS5K', 'nominal', 5000, 25000, 200, 1, NOW() + INTERVAL '14 days', true),
  ('NEWUSER20', 'percent', 20, 100000, 100, 1, NOW() + INTERVAL '90 days', true),
  ('BELANJA50K', 'nominal', 10000, 50000, NULL, 3, NOW() + INTERVAL '30 days', true)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- Seed a Flash Sale (active now)
-- =============================================
INSERT INTO public.flash_sales (name, starts_at, ends_at, is_active)
VALUES (
  'Flash Sale Hari Ini',
  NOW(),
  NOW() + INTERVAL '3 hours',
  true
) ON CONFLICT DO NOTHING;

-- Add flash sale products (products with discount_price)
INSERT INTO public.flash_sale_products (flash_sale_id, product_id, flash_price, flash_stock)
SELECT fs.id, p.id, p.discount_price, 50
FROM public.flash_sales fs, public.products p
WHERE fs.name = 'Flash Sale Hari Ini'
  AND p.discount_price IS NOT NULL
ON CONFLICT DO NOTHING;
