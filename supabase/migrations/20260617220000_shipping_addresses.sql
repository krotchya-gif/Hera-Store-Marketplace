-- =============================================
-- Migration: Shipping Addresses for Customer Profiles
-- Memungkinkan customer menyimpan alamat
-- dan memilihnya saat checkout
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

-- Users can view own addresses
create policy "Users can view own addresses"
  on public.shipping_addresses for select to authenticated
  using (user_id = auth.uid());

-- Users can insert own addresses
create policy "Users can insert own addresses"
  on public.shipping_addresses for insert to authenticated
  with check (user_id = auth.uid());

-- Users can update own addresses
create policy "Users can update own addresses"
  on public.shipping_addresses for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Users can delete own addresses
create policy "Users can delete own addresses"
  on public.shipping_addresses for delete to authenticated
  using (user_id = auth.uid());

-- Admins can view all addresses
create policy "Admins can view all addresses"
  on public.shipping_addresses for select to authenticated
  using (public.has_role(auth.uid(), array['super_admin', 'admin', 'operator']));
