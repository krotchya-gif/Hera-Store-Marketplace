# Hera Store Marketplace

Full-stack marketplace aplikasi untuk produk rumah tangga dan perawatan pribadi. Dibangun dengan **Next.js 16** (App Router) + **Supabase** (PostgreSQL, Auth, Storage).

## Tech Stack

- **Framework**: Next.js 16.2.9 (App Router + Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + Poppins font (Google Fonts)
- **Database**: Supabase PostgreSQL + Row Level Security (RLS)
- **Auth**: Supabase SSR (cookie-based session)
- **Storage**: Supabase Storage (bucket `product-images`)
- **Charts**: Recharts (LineChart, PieChart, BarChart)
- **Icons**: Lucide React
- **CLI**: Supabase CLI (migrations via `supabase db push`)

## Struktur Project

```
marketplace/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Homepage
│   │   ├── layout.tsx                   # Root layout + SEO scripts
│   │   ├── tentang-kami/                # Halaman statis (Tentang Kami)
│   │   ├── karir/                       # Halaman statis (Karir)
│   │   ├── blog/                        # Halaman statis (Blog)
│   │   ├── hubungi-kami/                # Halaman statis (Hubungi Kami + Google Maps)
│   │   ├── faq/                         # Halaman statis (FAQ accordion)
│   │   ├── cara-belanja/                # Halaman statis (Panduan belanja)
│   │   ├── pengembalian-barang/         # Halaman statis (Syarat retur)
│   │   ├── kategori/[slug]/             # Category listing
│   │   ├── produk/[slug]/               # Product detail
│   │   ├── keranjang/                   # Cart page
│   │   ├── checkout/                    # Multi-step checkout
│   │   ├── profil/                      # User profile & orders
│   │   ├── bayar/[id]/                  # Payment confirmation
│   │   ├── voucher/                     # Voucher listing
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   └── (dashboard)/
│   │   │       ├── page.tsx             # Overview dashboard
│   │   │       ├── produk/              # Product management
│   │   │       ├── pesanan/             # Order management
│   │   │       ├── pelanggan/           # Customer management
│   │   │       ├── kategori/            # Category management
│   │   │       ├── keuangan/            # Finance reports
│   │   │       ├── promo/               # Voucher & Flash Sale
│   │   │       ├── ulasan/              # Reviews moderation
│   │   │       ├── marketing/           # Marketing dashboard
│   │   │       └── pengaturan/          # Store settings (7 tabs)
│   │   ├── sitemap.xml/                 # Dynamic sitemap
│   │   ├── robots.txt/                  # Dynamic robots.txt
│   │   └── api/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── vouchers/validate/
│   │       ├── addresses/
│   │       ├── notifications/
│   │       └── admin/                   # Admin CRUD endpoints
│   ├── components/
│   │   ├── Navbar.tsx              # Navbar + floating WA button
│   │   ├── Footer.tsx              # Site footer
│   │   ├── HomeClient.tsx          # Homepage interactivity
│   │   ├── CategoryClient.tsx      # Category listing interactivity
│   │   ├── ProductDetailClient.tsx # Product detail interactivity
│   │   ├── ProfilClient.tsx        # Profile & auth interactivity
│   │   ├── Toast.tsx               # Toast notification system
│   │   ├── ConfirmDialog.tsx       # Confirmation modal
│   │   ├── Skeleton.tsx            # Loading skeleton
│   │   ├── CopyVoucherButton.tsx   # Copy voucher code
│   │   ├── ErrorBoundary.tsx       # Error boundary
│   │   └── admin/
│   │       ├── AdminShell.tsx
│   │       ├── AdminDashboardClient.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminTopbar.tsx
│   │       ├── NotificationDropdown.tsx
│   │       ├── StatCard.tsx
│   │       └── StatusBadge.tsx
│   ├── lib/
│   │   ├── products.ts             # Product & category queries
│   │   ├── orders.ts               # Order queries + creation + stock decrement
│   │   ├── admin.ts                # Admin dashboard + CRUD
│   │   ├── auth-utils.ts           # verifyAdminRole() helper
│   │   ├── vouchers.ts             # validateVoucher() + redeemVoucher()
│   │   ├── rate-limit.ts           # In-memory rate limiter
│   │   └── seo.ts                  # SEO settings cached
│   ├── types/
│   │   └── database.ts
│   ├── utils/
│   │   ├── format.ts               # formatRp, formatRupiah, formatDate
│   │   ├── storeConfig.ts          # STORE_NAME, STORE_EMAIL, etc.
│   │   ├── order-status.ts         # Status badge configs
│   │   ├── mockData.ts             # categories fallback (45 lines)
│   │   └── supabase/
│   │       ├── client.ts           # Browser client
│   │       └── server.ts           # Server (SSR) client
├── supabase/
│   └── migrations/                 # 5 migration files
├── src/proxy.ts                    # Next.js Proxy (auth guard)
└── next.config.ts                  # CSP + security headers
```

## Fitur

### Customer-Facing Pages (15 halaman)
- **Homepage** — Hero Banner, Kategori Populer, Flash Sale (countdown), Produk Terlaris, Promo
- **Kategori & Listing** — Breadcrumb, sub-kategori chips, filter (sort, harga), pagination
- **Product Detail** — Image gallery, varian selector, qty control, rating & reviews, specs
- **Keranjang** — Checkbox select, qty control, voucher validation, ringkasan
- **Checkout** — 5-step stepper (Alamat → Pengiriman → Pembayaran → Konfirmasi → Selesai)
- **Profil** — Tab navigasi, order tabs, edit profil, alamat, wishlist
- **Pembayaran** — Konfirmasi pembayaran transfer bank
- **Voucher** — Daftar voucher aktif + copy code
- **Tentang Kami** — konten dari DB (bisa diedit admin)
- **Karir** — daftar lowongan dari DB (bisa diedit admin)
- **Blog** — daftar artikel dari DB (bisa diedit admin)
- **Hubungi Kami** — form WhatsApp + Google Maps embed
- **FAQ** — Accordion interaktif (8 pertanyaan)
- **Cara Belanja** — 8 langkah panduan
- **Pengembalian Barang** — Syarat & prosedur retur

### Mobile Features
- **Bottom Tab Bar** — Fixed: Beranda, Voucher, Keranjang, Profil
- **Floating WhatsApp** — Tombol WA mengambang (nomor dari DB), animasi pulse
- **Mobile Menu** — "Masuk/Daftar" jika belum login, "Akun Saya" jika sudah
- **Responsive** — Navbar, bottom tab, mobile-first design

### Admin Dashboard (15 fitur)
- **Overview** — 4 KPI cards + LineChart 30 hari + PieChart per kategori
- **Produk** — CRUD + toggle status + upload foto + filter kategori
- **Pesanan** — Status filter + date range + detail + status update
- **Pelanggan** — KPI + tabel + detail + block/activate
- **Kategori** — Card grid + product count + CRUD
- **Keuangan** — Period filter + BarChart + PieChart
- **Promo** — Voucher + Flash Sale management
- **Ulasan** — Rating summary + visibility toggle
- **Marketing** — Dashboard (placeholder)
- **Pengaturan** — 7 tabs: Info Toko, Pengiriman, Pembayaran, Notifikasi, Admin & Hak Akses, SEO, **Halaman Statis**

### Infrastructure
- **Dynamic sitemap.xml** — Auto-generate dari products & categories
- **Dynamic robots.txt** — Custom content via admin
- **Meta Pixel & GA4** — Script injection via SEO settings
- **Next.js 16 Proxy** — `src/proxy.ts` (menggantikan `middleware.ts`). **JANGAN** membuat file `middleware.ts` — Next.js 16 secara otomatis mendeteksi `proxy.ts` sebagai middleware entry point. Jika ada `middleware.ts`, akan terjadi konflik/auth looping.
- **SEO** — Per-page metadata, SEO settings dari database
- **Security Headers** — CSP, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- **Rate Limiting** — 20+ endpoint dilindungi
- **Atomic Stock Decrement** — RPC + rollback + variant stock support
- **Toast** — Context-based notifications
- **ErrorBoundary** — Root layout wrapper

## API Routes

| Route | Method | Auth | Deskripsi |
|-------|--------|------|-----------|
| `/api/products` | GET | Public | List produk (filter, sort, pagination) |
| `/api/orders` | POST | Required | Buat pesanan (validasi price/variant/stock) |
| `/api/vouchers/validate` | POST | Required | Validasi kode voucher |
| `/api/addresses` | GET/POST | Required | CRUD alamat customer |
| `/api/addresses/[id]` | PUT/DELETE | Required | Update/hapus alamat |
| `/api/notifications` | GET | Required | Daftar notifikasi |
| `/api/notifications/read-all` | PUT | Required | Tandai semua dibaca |
| `/api/admin/products` | GET/POST | Admin | CRUD produk |
| `/api/admin/products/[id]` | PUT/DELETE | Admin | Update/hapus produk |
| `/api/admin/products/[id]/toggle` | PATCH | Admin | Toggle status |
| `/api/admin/categories` | GET/POST | Admin | CRUD kategori |
| `/api/admin/categories/[id]` | PUT/DELETE | Admin | Update/hapus kategori |
| `/api/admin/orders` | GET | Admin | List pesanan + stats |
| `/api/admin/orders/[id]` | GET/PUT | Admin | Detail & update status |
| `/api/admin/orders/export` | GET | Admin | Export CSV (max 5000) |
| `/api/admin/customers` | GET | Admin | List pelanggan + stats |
| `/api/admin/customers/[id]` | PUT | Admin | Block/activate |
| `/api/admin/reviews` | GET | Admin | List ulasan + stats |
| `/api/admin/reviews/[id]/toggle` | PATCH | Admin | Toggle visibilitas |
| `/api/admin/vouchers` | GET/POST | Admin | CRUD voucher |
| `/api/admin/vouchers/[id]/toggle` | PATCH | Admin | Toggle status |
| `/api/admin/finance` | GET | Admin | Data keuangan |
| `/api/admin/settings` | GET/PUT | Admin | Store settings (semua key) |
| `/api/admin/upload` | POST | Admin | Upload foto produk |

## Cara Menjalankan

### 1. Environment Variables
Buat `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Setup Database
Jalankan migrasi berurutan via Supabase SQL Editor:
1. `supabase/migrations/20260621000001_full_schema.sql`
2. `supabase/migrations/20260621000002_seed_data.sql`
3. `supabase/migrations/20260621000003_notifications.sql`
4. `supabase/migrations/20260622000001_fix_security.sql`
5. `supabase/migrations/20260623000001_additional_fixes.sql`

Atau: `supabase db push`

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Setup Admin
1. Daftar akun via `/profil`
2. Upgrade ke admin via SQL:
   ```sql
   UPDATE public.profiles SET role = 'super_admin' WHERE email = 'your@email.com';
   ```
3. Login di `/admin/login`

## Status Proyek

| Area | Status |
|------|--------|
| Customer Pages (15 halaman) | ✅ 100% |
| Admin Dashboard (15 fitur) | ✅ 100% |
| API Routes (24 endpoint) | ✅ 100% |
| Linter | ✅ 15 warnings (non-blocking, mostly `as any` & `alert()`) |
| Build | ✅ Sukses (39 pages) |

## Migrations

Semua migrasi ada di `supabase/migrations/` (5 file):

| File | Deskripsi |
|------|-----------|
| `20260621000001_full_schema.sql` | Schema lengkap: semua tabel, RLS, functions, triggers, storage |
| `20260621000002_seed_data.sql` | Seed: 6 kategori, 36 subkategori, 12 produk, 12 varian, 5 voucher, 1 flash sale, default settings |
| `20260621000003_notifications.sql` | Notifikasi: tabel, RLS, trigger order status → notif |
| `20260622000001_fix_security.sql` | Security fixes: RLS policies, CHECK constraints, indexes, atomic stock decrement |
| `20260623000001_additional_fixes.sql` | Variant stock management RPCs (decrement + increment) |
