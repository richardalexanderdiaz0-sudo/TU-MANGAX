-- Supabase Storage, Tables, & Database Setup for Nexus Manga & Manhwa
-- Ejecuta este código completo directamente en el SQL Editor de tu proyecto de Supabase Pro!

-- 1. Eliminar tablas antiguas si existen (para poder crearlas de forma limpia)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS library CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Crear las Tablas Limpias

-- Tabla: users (Firebase Auth UIDs as primary keys)
CREATE TABLE users (
    id TEXT PRIMARY KEY,                       -- UID de Firebase Auth
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    display_name TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: stories (Obras)
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    synopsis TEXT,
    cover_url TEXT,
    author TEXT DEFAULT 'Desconocido',
    writer TEXT DEFAULT 'Desconocido',
    genres TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'ONGOING',
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    publish_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: chapters (Capítulos)
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    pages_urls TEXT[] DEFAULT '{}',             -- URLs de las imágenes y PDFs convertidos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: library (Mis mangas guardados/Biblioteca)
CREATE TABLE library (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, story_id)
);

-- Tabla: likes (Likes a obras)
CREATE TABLE likes (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, story_id)
);

-- Tabla: comments (Comentarios en capítulos)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Storage y crear el bucket 'nexus-storage'
-- Esto crea el bucket si no existe y aumenta el limite a 500MB para los PDFs largos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('nexus-storage', 'nexus-storage', true, 524288000)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 524288000;

-- 4. Deshabilitar RLS temporalmente para asegurar que el Front-End (con Firebase Auth) conectado por API Key Anónima pueda operar sin trabas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE library DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Políticas de Storage abiertas para acceso público total al bucket (Subidas, descargas, etc)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'nexus-storage' );

CREATE POLICY "Allow generic upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'nexus-storage' );

CREATE POLICY "Allow generic update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'nexus-storage' );

CREATE POLICY "Allow generic delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'nexus-storage' );
