-- ============================================
-- Husayn ProHerbal Medicine - Supabase Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  price_raw NUMERIC DEFAULT 0,
  category TEXT,
  image_url TEXT,
  description TEXT,
  features TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read products"
  ON products FOR SELECT
  USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow anonymous insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read contact_messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert subscribers"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete orders"
  ON orders FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. Categories Table (used by admin category management)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'fas fa-tag',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (needed for shop category filter)
CREATE POLICY "Allow anonymous read categories"
  ON categories FOR SELECT
  USING (true);

-- Allow anonymous insert (admin panel)
CREATE POLICY "Allow anonymous insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

-- Allow authenticated full access
CREATE POLICY "Allow authenticated update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- 6. Create storage bucket for product images
-- Run this in Supabase Dashboard > Storage or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- Or create it manually in the Storage section of your Supabase Dashboard.

-- Note: To create the storage bucket via SQL, uncomment:
-- INSERT INTO storage.buckets (id, name, public, avif_autodetection)
-- VALUES ('product-images', 'product-images', true, false)
-- ON CONFLICT (id) DO NOTHING;

-- Allow public access to bucket
-- CREATE POLICY "Allow public read product-images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');

-- CREATE POLICY "Allow authenticated upload product-images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated delete product-images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
