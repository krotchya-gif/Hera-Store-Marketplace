# Panduan Migrasi Database — Hera Store ke Supabase

## Prasyarat
- Sudah punya akun [Supabase](https://supabase.com) dan project sudah dibuat
- File `app/.env.local` sudah berisi credentials (cek ada `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Supabase CLI terinstall (`npm install -g supabase` atau via scoop/choco)

## Langkah Migrasi

### 1. Buka Supabase Dashboard
- Login ke [supabase.com](https://supabase.com)
- Pilih project kamu
- Klik **SQL Editor** di sidebar kiri

### 2. Jalankan Schema Utama
Buka file [`supabase/migrations/20260617000000_supabase_schema.sql`](supabase/migrations/20260617000000_supabase_schema.sql).

Copy seluruh isinya, paste di SQL Editor, lalu klik **Run**.

File ini berisi:
- 12 tabel (profiles, categories, products, product_images, product_variants, orders, order_items, vouchers, flash_sales, flash_sale_products, reviews, store_settings)
- RLS policies untuk semua tabel
- Trigger auto-create profile saat signup
- Function `generate_order_number()` dan `has_role()`
- Seed data: 6 kategori, default settings

### 3. Jalankan Seed Products
Buka file [`supabase/migrations/20260617010000_seed_products.sql`](supabase/migrations/20260617010000_seed_products.sql).

Copy seluruh isinya, paste di SQL Editor baru, lalu klik **Run**.

File ini berisi:
- 12 produk dengan kategori
- Variants untuk beberapa produk
- 5 voucher (HERA15, HERA10, GRATIS5K, NEWUSER20, BELANJA50K)
- 1 Flash Sale aktif

### 4. (Jika perlu) Fix Seed Prices
Kalau sudah pernah menjalankan `seed_products.sql` versi lama (sebelum 18 Juni 2026),
jalankan [`supabase/migrations/20260617230000_fix_seed_prices.sql`](supabase/migrations/20260617230000_fix_seed_prices.sql) untuk memperbaiki harga diskon yang terbalik.

### 5. Jalankan Shipping Addresses Table
Buka file [`supabase/migrations/20260617220000_shipping_addresses.sql`](supabase/migrations/20260617220000_shipping_addresses.sql).

Copy isinya, paste di SQL Editor, lalu klik **Run**.

File ini berisi:
- Tabel `shipping_addresses` untuk menyimpan alamat customer
- RLS policies: user hanya bisa lihat/edit alamat sendiri
- Admin bisa lihat semua alamat

### 6. Setup Authentication
Di Supabase Dashboard → **Authentication** → **Settings**:
- **Site URL**: `http://localhost:3000` (dev) / domain production
- **Redirect URLs**: `http://localhost:3000/**`
- **Enable email/password signup**: ✅

### 7. Setup Storage Bucket (Upload Foto Produk)
Bucket `product-images` sudah dibuat via migration. Jika perlu buat ulang:

**Via Supabase CLI:**
```bash
cd marketplace
supabase db push
```

**Atau via Dashboard:**
1. Supabase Dashboard → **Storage** → **Create bucket**
2. **Name**: `product-images` (harus sama persis)
3. **Public**: ✅ centang

### 8. Verifikasi
Coba akses [`http://localhost:3000`](http://localhost:3000) — homepage harus muncul dengan data real.

Buat akun test di `/profil` → signup → lalu cek di Supabase Table Editor `public.profiles` apakah muncul.

### 9. (Opsional) Buat Admin Pertama
Jalankan di SQL Editor:

```sql
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'email-kamu@example.com';
```

Login di [`/admin/login`](http://localhost:3000/admin/login).

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `relation "public.categories" does not exist` | Jalankan `supabase_schema.sql` dulu sebelum `seed_products.sql` |
| Login gagal | Cek **Authentication** → **Users** apakah user terdaftar |
| Halaman kosong/error | Buka browser console (F12) untuk lihat error |
| Cookie error | Pastikan `NEXT_PUBLIC_SITE_URL` atau verifikasi redirect URLs di Auth settings |
| Upload foto error 403 | Pastikan bucket `product-images` sudah dibuat dan policy RLS sudah di-set |
