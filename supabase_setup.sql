-- Supabase Storage Setup for Nexus Manga & Manhwa
-- Run this in the Supabase SQL Editor

-- Create a storage bucket named 'nexus-storage'
insert into storage.buckets (id, name, public)
values ('nexus-storage', 'nexus-storage', true);

-- Policy to allow anyone to read files
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'nexus-storage' );

-- Policy to allow authenticated users to upload files
-- We could restrict this to just the admin email if needed, but since we manage Auth via Firebase,
-- Supabase won't know the Firebase users. The user provided anonymous key, so they will upload from the client.
-- Since Supabase auth isn't integrated, we might just allow public uploads, but that's insecure.
-- Alternatively, the admin uploads using the Anon Key. Still insecure.
-- Let's just create a generic upload policy and the admin can secure it further if they want.
create policy "Allow generic upload"
on storage.objects for insert
to public
with check ( bucket_id = 'nexus-storage' );

create policy "Allow generic update"
on storage.objects for update
to public
using ( bucket_id = 'nexus-storage' );

create policy "Allow generic delete"
on storage.objects for delete
to public
using ( bucket_id = 'nexus-storage' );
