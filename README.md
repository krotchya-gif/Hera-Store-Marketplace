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
├── src/                            # Source code
│   ├── app/                        # App Router pages & API routes
│   │   ├── page.tsx                # Homepage (server component)
│   │   ├── layout.tsx              # Root layout + SEO scripts
│   │   ├── kategori/[slug]/        # Category listing page
│   │   ├── produk/[slug]/          # Product detail page
│   │   ├── keranjang/              # Cart page
│   │   ├── checkout/               # Multi-step checkout flow
│   │   ├── profil/                 # User profile & orders
│   │   ├── bayar/[id]/             # Dummy payment page
│   │   ├── voucher/                # Voucher listing page
│   │   ├── admin/                  # Admin dashboard (14 halaman)
│   │   │   ├── login/              # Admin login
│   │   │   ├── (dashboard)/        # Protected admin pages
│   │   │   │   ├── page.tsx        # Overview with KPI + charts
│   │   │   │   ├── produk/         # Product management
│   │   │   │   ├── pesanan/        # Order management
│   │   │   │   ├── pelanggan/      # Customer management
│   │   │   │   ├── kategori/       # Category management
│   │   │   │   ├── keuangan/       # Finance reports
│   │   │   │   ├── promo/          # Voucher & Flash Sale
│   │   │   │   ├── ulasan/         # Reviews moderation
│   │   │   │   ├── marketing/      # Marketing dashboard
│   │   │   │   └── pengaturan/     # Store settings
│   │   ├── sitemap.xml/            # Dynamic sitemap
│   │   ├── robots.txt/             # Dynamic robots.txt
│   │   └── api/                    # REST API routes
│   │       ├── products/           # Public product listing
│   │       ├── orders/             # Create orders
│   │       ├── vouchers/validate/  # Voucher validation
│   │       ├── addresses/          # Customer addresses CRUD
│   │       └── admin/              # Admin API endpoints
│   ├── components/                 # Shared React components
│   │   ├── Navbar.tsx              # Sticky navbar
│   │   ├── Footer.tsx              # Site footer
│   │   ├── HomeClient.tsx          # Homepage interactivity
│   │   ├── CategoryClient.tsx      # Category listing interactivity
│   │   ├── ProductDetailClient.tsx # Product detail interactivity
│   │   ├── ProfilClient.tsx        # Profile & auth interactivity
│   │   ├── Toast.tsx               # Toast notification system
│   │   ├── ConfirmDialog.tsx       # Confirmation dialog
│   │   ├── Skeleton.tsx            # Loading skeleton
│   │   └── admin/                  # Admin components
│   │       ├── NotificationDropdown.tsx  # Notification bell + dropdown
│   ├── lib/                        # Data layer (Supabase queries)
│   │   ├── products.ts             # Product & category queries
│   │   ├── orders.ts               # Order queries & creation
│   │   ├── admin.ts                # Admin data queries
│   │   ├── auth-utils.ts           # Admin auth helper
│   │   ├── vouchers.ts             # Voucher validation
│   │   └── seo.ts                  # SEO settings
│   ├── types/
│   │   └── database.ts            # TypeScript definitions
│   └── utils/
│       ├── format.ts              # Formatting utilities
│       ├── storeConfig.ts         # Store name/info config
│       └── supabase/              # Client & server helpers
├── supabase/
│   └── migrations/                # Database migrations (3 files)
├── proxy.ts                       # Next.js middleware (auth proxy)
└── next.config.ts                 # Next.js configuration
```

## Fitur

### Customer-Facing Pages (8 halaman)
- **Homepage** — Hero Banner, Kategori Populer (6 grid + modal semua kategori), Flash Sale (countdown realtime), Produk Terlaris, Promo — animasi entrance
- **Kategori & Listing** — Breadcrumb, sub-kategori chips, sidebar filter (sort, harga), pagination
- **Product Detail** — Image gallery, varian selector, qty control, rating & reviews, specs, produk serupa
- **Keranjang** — Checkbox select, qty control, voucher validation, ringkasan pesanan
- **Checkout** — 5-step stepper (Alamat → Pengiriman → Pembayaran → Konfirmasi → Selesai)
- **Profil** — Mobile header + quick action grid, horizontal tab navigasi, order tabs, action buttons per-status, edit profil, alamat
- **Pembayaran** — Halaman dummy transfer bank (BCA)
- **Voucher** — Daftar voucher aktif + info diskon

### Mobile Features
- **Bottom Tab Bar** — Fixed: Beranda, Voucher, Keranjang, Profil
- **Mobile Menu** — Grid Akun Saya + Pesanan Saya, navigasi cepat
- **Profil Mobile** — Header card + avatar + 4-grid quick actions

### Notifications
- **In-App Notif** — Bell icon + dropdown untuk admin (polling 30 detik)
- **DB Trigger** — Auto-create notifikasi saat status pesanan berubah
- **Customer Notif** — Bell icon di navbar

### Admin Dashboard (14 halaman)
- **Overview** — 4 KPI cards + LineChart penjualan 30 hari + PieChart per kategori
- **Produk** — CRUD + toggle status + upload foto + filter kategori + duplicate
- **Pesanan** — Status filter + date range + detail modal + status update (with validation)
- **Pelanggan** — KPI + tabel + detail modal + block/activate + total belanja + riwayat order
- **Kategori** — Card grid + product count + CRUD
- **Keuangan** — Period filter + BarChart + PieChart payment methods
- **Promo** — Voucher management + Flash Sale table
- **Ulasan** — Rating summary + progress bars + visibility toggle
- **Marketing** — Dashboard channel marketing (placeholder)
- **Pengaturan** — Tab: Info Toko, Pengiriman, Pembayaran, Notifikasi, Admin, SEO

### Infrastructure
- **Dynamic sitemap.xml** — Auto-generate dari products & categories
- **Dynamic robots.txt** — Custom content via admin
- **Meta Pixel & GA4** — Script injection via SEO settings
- **Proxy Middleware** — Admin auth verification & refresh token
- **SEO** — Per-page metadata, SEO settings dari database
- **Toast** — Context-based success/error/info notifications
- **ConfirmDialog** — Reusable confirmation modal
- **Skeleton** — Loading skeleton component
- **Animations** — fade-in-up, scale-in dengan stagger delay di homepage

## API Routes

| Route | Method | Auth | Deskripsi |
|-------|--------|------|-----------|
| `/api/products` | GET | Public | List produk dengan filter (kategori, search, price range, sort, pagination) |
| `/api/orders` | POST | Required | Buat pesanan baru (with auth check) |
| `/api/vouchers/validate` | POST | Public | Validasi kode voucher |
| `/api/addresses` | GET/POST | Required | CRUD alamat customer |
| `/api/addresses/[id]` | PUT/DELETE | Required | Update/hapus alamat |
| `/api/notifications` | GET | Required | Daftar notifikasi + unread count |
| `/api/notifications/read-all` | PUT | Required | Tandai semua notif sudah dibaca |
| `/api/admin/products` | GET/POST | Admin | CRUD produk |
| `/api/admin/products/[id]` | PUT/DELETE | Admin | Update/hapus produk |
| `/api/admin/products/[id]/toggle` | PATCH | Admin | Toggle status produk |
| `/api/admin/categories` | GET/POST | Admin | CRUD kategori |
| `/api/admin/categories/[id]` | PUT/DELETE | Admin | Update/hapus kategori |
| `/api/admin/orders` | GET | Admin | List semua pesanan + stats |
| `/api/admin/orders/[id]` | GET/PUT | Admin | Detail & update status |
| `/api/admin/orders/export` | GET | Admin | Export CSV (paginated) |
| `/api/admin/customers` | GET | Admin | List pelanggan + stats |
| `/api/admin/customers/[id]` | PUT | Admin | Block/activate customer |
| `/api/admin/reviews` | GET | Admin | List ulasan + stats |
| `/api/admin/reviews/[id]/toggle` | PATCH | Admin | Toggle visibilitas ulasan |
| `/api/admin/vouchers` | GET/POST | Admin | CRUD voucher |
| `/api/admin/vouchers/[id]/toggle` | PATCH | Admin | Toggle status voucher |
| `/api/admin/finance` | GET | Admin | Data keuangan (period filter) |
| `/api/admin/settings` | GET/PUT | Admin | Store settings |
| `/api/admin/upload` | POST | Admin | Upload foto produk |

## Cara Menjalankan

### 1. Environment Variables
Buat `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Setup Database
Jalankan migrasi Supabase secara berurutan:

```bash
supabase db push
```

Atau manual via Supabase SQL Editor (sesuai urutan):
1. `supabase/migrations/20260621000001_full_schema.sql`
2. `supabase/migrations/20260621000002_seed_data.sql`

### 3. Install & Run
```bash
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

## Status Proyek

| Area | Status |
|------|--------|
| Customer Pages (6 halaman) | ✅ 100% (34/34 fitur) |
| Admin Dashboard (14 halaman) | ✅ 95% (28/30 fitur) |
| API Routes (22 endpoint) | ✅ 100% |
| Linter | ✅ 0 error, 6 warning (non-blocking) |
| Build | ✅ Sukses (31/31 halaman) |

### Bug Fixes Selesai (21 Juni 2026)

- **Critical**: 5/5 ✅ — Upload temp ID, validasi status, idempotensi, aksi profil
- **High**: 10/10 ✅ — handleAdminError, navbar DB, finance week, stat real, duplicate, flash link, flash sale admin, subkategori mitigasi
- **Medium**: 9/9 ✅ — Checkout real data, ongkir settings, cart validation, email cleanup, mini stats, filter by ID, customer table/modal, review bars
- **Low**: 4/4 ✅ — formatRp terpusat, emoji fallback, CSV pagination, storeConfig cleanup

### Masih Open (Non-Blocking)

- Halaman Marketing (placeholder — 6 channel cards)
- Notifikasi pihak ketiga (SendGrid, Twilio — UI toggle sudah ada)
- Filter subkategori proper (butuh API support)

## Migrations

Semua migrasi ada di `supabase/migrations/` (3 file):

| File | Deskripsi |
|------|-----------|
| `20260621000001_full_schema.sql` | Schema lengkap: semua tabel, RLS policies, functions, triggers, storage bucket |
| `20260621000002_seed_data.sql` | Seed data: 6 kategori, 36 subkategori, 12 produk, 12 varian, 5 voucher, 1 flash sale, default settings |
| `20260621000003_notifications.sql` | Notifikasi: tabel + RLS + trigger order status change |
