-- Create storage bucket for product images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152, '{image/jpeg,image/png,image/webp}')
on conflict (id) do update set public = true;

-- Allow admin users to upload
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

-- Allow public viewing
create policy "Public can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

-- Allow admin to delete
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
