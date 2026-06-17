# Hera Store Marketplace

Full-stack marketplace aplikasi untuk produk rumah tangga dan perawatan pribadi. Dibangun dengan **Next.js 16** (App Router) + **Supabase**.

## Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS 4 + Poppins font
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase SSR (cookie-based session)
- **Storage**: Supabase Storage (product images)
- **Charts**: Recharts
- **Icons**: Lucide React

## Struktur Project

```
marketplace/
├── app/                          # Next.js application
│   └── src/
│       ├── app/                  # App Router pages & API routes
│       │   ├── page.tsx          # Homepage
│       │   ├── layout.tsx        # Root layout + SEO scripts
│       │   ├── sitemap.xml/      # Dynamic sitemap
│       │   ├── robots.txt/       # Dynamic robots.txt
│       │   ├── kategori/         # Category listing
│       │   ├── produk/           # Product detail
│       │   ├── keranjang/        # Cart
│       │   ├── checkout/         # Checkout flow
│       │   ├── profil/           # User profile
│       │   ├── admin/            # Admin dashboard
│       │   └── api/              # REST API routes
│       ├── components/           # Shared React components
│       │   └── admin/            # Admin-specific components
│       ├── lib/                  # Data layer (Supabase queries)
│       ├── types/                # TypeScript type definitions
│       └── utils/                # Utilities & helpers
├── supabase/                     # Supabase CLI config & migrations
│   └── migrations/               # Semua file SQL (schema, seed, patches)
├── public/                       # Static assets (product images)
```

## Fitur

### Customer-Facing
- Homepage dengan Hero Banner, Kategori Populer, Flash Sale (countdown realtime), Produk Terlaris
- Kategori & Product Listing dengan filter harga, sort, pagination
- Product Detail dengan varian selector, image gallery, rating, reviews
- Cart dengan voucher validation
- Checkout 5-step (Alamat → Pengiriman → Pembayaran → Konfirmasi → Selesai)
- Profile dengan history pesanan, wishlist, dan manajemen alamat
- Search produk realtime

### Admin Dashboard
- Overview dengan KPI cards + charts (LineChart, PieChart)
- Manajemen Produk (CRUD, toggle status, upload foto)
- Manajemen Pesanan (status update, tracking number, filter)
- Manajemen Pelanggan (block/activate)
- Manajemen Kategori (CRUD dari Supabase)
- Laporan Keuangan (filter period, charts)
- Promo & Voucher (create, toggle)
- Ulasan Pelanggan (moderasi visibility)
- Pengaturan Toko (info, shipping, payment, notifications, admin access)
- Pengaturan SEO (Meta Pixel, GA4, meta tags, robots.txt, sitemap)

### SEO
- Dynamic sitemap.xml (auto-generate dari products & categories)
- Dynamic robots.txt (custom content via admin)
- Meta Pixel & Google Analytics 4 injection
- Per-page metadata (product, category, homepage)

## Cara Menjalankan

### 1. Environment Variables
Buat `app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Setup Database
Jalankan file SQL dari `supabase/migrations/` di Supabase SQL Editor secara berurutan:
1. `20260617000000_supabase_schema.sql` — Schema utama + seed kategori
2. `20260617010000_seed_products.sql` — Seed produk, voucher, flash sale

### 3. Install & Run
```bash
cd app
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Setup Admin
1. Daftar akun via `/profil`
2. Upgrade ke admin via SQL:
   ```sql
   UPDATE public.profiles SET role = 'super_admin' WHERE email = 'your@email.com';
   ```
3. Login di `/admin/login`

### 5. Storage (untuk upload foto produk)
Bucket `product-images` harus ada di Supabase Storage:
```bash
cd marketplace
supabase db push   # migration sudah include storage setup
```

## API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/products` | GET | Public | List produk dengan filter |
| `/api/orders` | POST | Required | Buat pesanan baru |
| `/api/vouchers/validate` | POST | Public | Validasi kode voucher |
| `/api/addresses` | GET/POST | Required | CRUD alamat customer |
| `/api/admin/*` | All | Admin | Admin panel endpoints |
| `/api/admin/upload` | POST | Admin | Upload foto produk |
| `/api/admin/orders/export` | GET | Admin | Export CSV pesanan |

## Migrations

Jalankan via Supabase SQL Editor atau Supabase CLI:
```bash
supabase db push
```


