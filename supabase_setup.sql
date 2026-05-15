-- Supabase Storage & Database Setup for Nexus Manga & Manhwa
-- Run this in the Supabase SQL Editor

-- 1. Create a storage bucket named 'nexus-storage'
insert into storage.buckets (id, name, public)
values ('nexus-storage', 'nexus-storage', true)
on conflict (id) do nothing;

create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'nexus-storage' );

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


-- 2. Create the Database Tables

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Firebase UID
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: stories
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    synopsis TEXT,
    cover_url TEXT,
    author TEXT,
    genres TEXT[],
    status TEXT DEFAULT 'ONGOING',
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: chapters
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    pages_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: library (user favorites)
CREATE TABLE IF NOT EXISTS library (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, story_id)
);

-- Table: likes
CREATE TABLE IF NOT EXISTS likes (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, story_id)
);

-- Disable Row Level Security (RLS) for testing since Auth is in Firebase
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE library DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;

