-- =============================================
-- HERA STORE MARKETPLACE — Full Schema
-- Consolidated migration: tables, RLS, functions, triggers, storage
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  phone text,
  role text not null default 'customer' check (role in ('super_admin', 'admin', 'operator', 'finance', 'customer')),
  status text not null default 'aktif' check (status in ('aktif', 'nonaktif', 'diblokir')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helper function to check roles while bypassing RLS to avoid infinite recursion
create or replace function public.has_role(user_id uuid, roles text[])
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id
    and role = any(roles)
  );
end;
$$;

alter table public.profiles enable row level security;

create policy "Profiles are viewable by admins" on public.profiles
  for select to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator', 'finance']));

create policy "Users can view own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "Users can update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- CATEGORIES (hierarchical via parent_id)
-- =============================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  icon text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are publicly viewable" on public.categories
  for select to authenticated, anon using (true);

create policy "Admins can manage categories" on public.categories
  for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin']));

-- =============================================
-- PRODUCTS
-- =============================================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sku text unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  price numeric not null default 0 check (price >= 0),
  discount_price numeric check (discount_price >= 0),
  stock int not null default 0 check (stock >= 0),
  unit text default 'pcs',
  weight_gram int,
  dimension_p numeric, dimension_l numeric, dimension_t numeric,
  is_active boolean default true,
  meta_title text, meta_description text, slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category_id on public.products(category_id);
create index idx_products_is_active on public.products(is_active);

alter table public.products enable row level security;

create policy "Products are publicly viewable" on public.products
  for select to authenticated, anon using (true);

create policy "Admins can manage products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']));

-- =============================================
-- PRODUCT IMAGES
-- =============================================
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  is_primary boolean default false,
  sort_order int default 0
);

alter table public.product_images enable row level security;
create policy "Product images are publicly viewable" on public.product_images for select to authenticated, anon using (true);
create policy "Admins can manage product images" on public.product_images for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']));

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric not null default 0,
  stock int not null default 0,
  sku text
);

alter table public.product_variants enable row level security;
create policy "Variants are publicly viewable" on public.product_variants for select to authenticated, anon using (true);
create policy "Admins can manage variants" on public.product_variants for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']));

-- =============================================
-- ORDERS
-- =============================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'menunggu' check (status in ('menunggu', 'diproses', 'dikirim', 'selesai', 'dibatalkan')),
  payment_method text,
  payment_status text not null default 'belum_bayar' check (payment_status in ('belum_bayar', 'lunas', 'gagal')),
  shipping_method text,
  tracking_number text,
  shipping_address jsonb,
  subtotal numeric not null default 0,
  shipping_cost numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at desc);

alter table public.orders enable row level security;

create policy "Admins can view all orders" on public.orders
  for select to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator', 'finance']));

create policy "Users can view own orders" on public.orders
  for select to authenticated
  using (user_id = auth.uid());

create policy "Admins can update orders" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']));

create policy "Authenticated users can create orders" on public.orders
  for insert to authenticated
  with check (user_id = auth.uid());

-- Auto increment voucher usage count (atomic)
create or replace function public.increment_voucher_usage(voucher_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.vouchers set used_count = used_count + 1 where id = voucher_id;
end;
$$;

-- Auto-generate order number with HS prefix
create or replace function public.generate_order_number()
returns text language plpgsql as $$
declare
  v_number text;
  v_count int;
begin
  loop
    v_number := 'HS' || to_char(now(), 'YYMM') || lpad(floor(random() * 99999)::text, 5, '0');
    select count(*) into v_count from public.orders where order_number = v_number;
    exit when v_count = 0;
  end loop;
  return v_number;
end;
$$;

-- =============================================
-- ORDER ITEMS
-- =============================================
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  product_sku text,
  qty int not null default 1,
  price numeric not null,
  subtotal numeric not null
);

alter table public.order_items enable row level security;
create policy "Admins can view order items" on public.order_items for select to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator', 'finance']));
create policy "Users can view own order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Auth users can insert order items" on public.order_items for insert to authenticated
  with check (true);

-- =============================================
-- SHIPPING ADDRESSES
-- =============================================
create table if not exists public.shipping_addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Rumah',
  name text not null,
  phone text not null,
  address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  is_default boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shipping_addresses enable row level security;

create policy "Users can view own addresses"
  on public.shipping_addresses for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own addresses"
  on public.shipping_addresses for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own addresses"
  on public.shipping_addresses for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own addresses"
  on public.shipping_addresses for delete to authenticated
  using (user_id = auth.uid());

create policy "Admins can view all addresses"
  on public.shipping_addresses for select to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']));

-- =============================================
-- VOUCHERS
-- =============================================
create table if not exists public.vouchers (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  type text not null check (type in ('percent', 'nominal')),
  value numeric not null,
  min_purchase numeric default 0,
  quota int,
  used_count int default 0,
  per_user_limit int default 1,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.vouchers enable row level security;
create policy "Active vouchers viewable by authenticated" on public.vouchers
  for select to authenticated using (is_active = true);
create policy "Admins can manage vouchers" on public.vouchers for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin']));

-- =============================================
-- FLASH SALES
-- =============================================
create table if not exists public.flash_sales (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  banner_url text,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.flash_sale_products (
  id uuid primary key default uuid_generate_v4(),
  flash_sale_id uuid not null references public.flash_sales(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  flash_price numeric not null,
  flash_stock int not null default 0
);

alter table public.flash_sales enable row level security;
create policy "Flash sales publicly viewable" on public.flash_sales for select to authenticated, anon using (true);
create policy "Admins manage flash sales" on public.flash_sales for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin']));

alter table public.flash_sale_products enable row level security;
create policy "Flash sale products publicly viewable" on public.flash_sale_products for select to authenticated, anon using (true);
create policy "Admins manage flash sale products" on public.flash_sale_products for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin']));

-- =============================================
-- REVIEWS
-- =============================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_visible boolean default true,
  created_at timestamptz not null default now()
);

create index idx_reviews_product_id on public.reviews(product_id);
create index idx_reviews_user_id on public.reviews(user_id);

alter table public.reviews enable row level security;
create policy "Visible reviews publicly viewable" on public.reviews
  for select to authenticated, anon using (is_visible = true);
create policy "Admins can view all reviews" on public.reviews for select to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']));
create policy "Admins can manage reviews" on public.reviews for update to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin']));
create policy "Users can create reviews" on public.reviews for insert to authenticated
  with check (user_id = auth.uid());

-- =============================================
-- STORE SETTINGS (key-value)
-- =============================================
create table if not exists public.store_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;
create policy "Settings publicly readable" on public.store_settings for select to authenticated, anon using (true);
create policy "Admins can manage settings" on public.store_settings for all to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin']))
  with check (public.has_role(auth.uid(), array['super_admin', 'admin']));

-- =============================================
-- STORAGE: Product Images Bucket
-- =============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152, '{image/jpeg,image/png,image/webp}')
on conflict (id) do update set public = true;

create policy "Admin can upload product images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = any(array['super_admin', 'admin', 'operator'])
  )
);

create policy "Public can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

create policy "Admin can delete product images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = any(array['super_admin', 'admin', 'operator'])
  )
);
