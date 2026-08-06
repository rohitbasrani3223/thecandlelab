-- =========================================================================
-- The Candle Lab 3.0 — Complete Supabase PostgreSQL Schema & Seed Script
-- Execute this script in Supabase Dashboard → SQL Editor to create all tables
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Main Categories Table
CREATE TABLE IF NOT EXISTS main_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sub Categories Table
CREATE TABLE IF NOT EXISTS sub_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_category_id UUID REFERENCES main_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    banner_image TEXT,
    icon_symbol VARCHAR(50),
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_category_id UUID REFERENCES main_categories(id) ON DELETE SET NULL,
    sub_category_id UUID REFERENCES sub_categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    short_description TEXT,
    long_description TEXT,
    wax_type VARCHAR(100),
    wick_type VARCHAR(100),
    burn_time_hours INT,
    weight_grams INT,
    rating DECIMAL(3, 2) DEFAULT 4.90,
    reviews_count INT DEFAULT 15,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    is_featured BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    size_grams INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INT DEFAULT 50,
    sku VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Inventories Table
CREATE TABLE IF NOT EXISTS inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    stock_quantity INT DEFAULT 100,
    reorder_level INT DEFAULT 10,
    status VARCHAR(50) DEFAULT 'IN_STOCK',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 15.00,
    max_discount_amount DECIMAL(10, 2) DEFAULT 500.00,
    min_order_amount DECIMAL(10, 2) DEFAULT 999.00,
    usage_limit INT DEFAULT 500,
    times_used INT DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '90 days'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255),
    is_verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Customer Addresses Table
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Razorpay',
    payment_status VARCHAR(50) DEFAULT 'PAID',
    order_status VARCHAR(50) DEFAULT 'PROCESSING',
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 14. Site Settings (global CMS bundle for all visitors)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(30) DEFAULT 'STRING',
    group_name VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_settings_public_write_cms" ON site_settings;
CREATE POLICY "site_settings_public_write_cms"
  ON site_settings FOR INSERT
  WITH CHECK (setting_key = 'tcl_cms_bundle');

DROP POLICY IF EXISTS "site_settings_public_update_cms" ON site_settings;
CREATE POLICY "site_settings_public_update_cms"
  ON site_settings FOR UPDATE
  USING (setting_key = 'tcl_cms_bundle')
  WITH CHECK (setting_key = 'tcl_cms_bundle');

-- =========================================================================
-- INITIAL SEED DATA (Valid Hex UUIDs)
-- =========================================================================

-- Seed Master Admin (Password: admin123)
INSERT INTO admins (email, full_name, phone, password_hash, role, status)
VALUES ('admin@candlelab.com', 'Super Admin', '+919876543210', '$2y$12$e6rA.y.35rC6Qx9M/XjAeeQv.T2rK0xK9rM7.xK5x5K5x5K5x5K5x', 'SUPER_ADMIN', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Seed Main Categories
INSERT INTO main_categories (id, name, slug, description, image_url, sort_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Aromatherapy & Wellness', 'aromatherapy-wellness', 'Essential oil therapeutic candle blends designed for relaxation.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', 1),
  ('22222222-2222-2222-2222-222222222222', 'Floral & Botanical', 'floral-botanical', 'Hand-poured floral bouquets of Jasmine, Rose & Lavender.', 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80', 2),
  ('33333333-3333-3333-3333-333333333333', 'Gourmand & Vanilla', 'gourmand-vanilla', 'Warm Madagascar vanilla bean & caramel blends.', 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80', 3),
  ('44444444-4444-4444-4444-444444444444', 'Woody & Resinous Oud', 'woody-resinous-oud', 'Deep amber, Cambodian oud, and cedarwood notes.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed Collections
INSERT INTO collections (id, name, slug, description, banner_image, icon_symbol, is_featured)
VALUES
  ('ca111111-1111-1111-1111-111111111111', 'Scented Candles', 'scented-candles', 'Signature aromatherapy candles poured in matte ceramic vessels.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80', '🕯️', TRUE),
  ('ca222222-2222-2222-2222-222222222222', 'Luxury Collection', 'luxury-collection', 'Rare botanical essences in gold leaf crystal jars.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80', '✨', TRUE),
  ('ca333333-3333-3333-3333-333333333333', 'Seasonal Autumn Atelier', 'seasonal-autumn-atelier', 'Warm spiced cinnamon and clove bud scents.', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80', '🍁', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
INSERT INTO products (id, main_category_id, collection_id, name, slug, tagline, sku, price, original_price, short_description, long_description, wax_type, wick_type, burn_time_hours, weight_grams, rating, reviews_count, status, is_featured, is_bestseller, is_new_arrival, is_trending)
VALUES
  ('fa111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ca111111-1111-1111-1111-111111111111', 'Midnight Jasmine & Amber Vetiver', 'midnight-jasmine-amber-vetiver', 'Night-blooming Indian Jasmine with warm resinous amber', 'TCL-CNDL-001', 1499.00, 1899.00, 'Serene night blooming jasmine candle.', 'Hand-poured into a matte warm cream ceramic jar using 100% organic soy wax.', 'Soy Wax', 'Wooden Crackling Wick', 55, 280, 4.95, 48, 'ACTIVE', TRUE, TRUE, TRUE, TRUE),
  ('fa222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'ca222222-2222-2222-2222-222222222222', 'Madagascar Vanilla & Spiced Tonka', 'madagascar-vanilla-spiced-tonka', 'Warm vanilla bean with toasted almond', 'TCL-CNDL-002', 1299.00, 1599.00, 'Cozy gourmand vanilla bean blend.', 'Infused with natural French vanilla extract and toasted tonka bean oils.', 'Beeswax', 'Cotton Wick', 50, 250, 4.90, 32, 'ACTIVE', TRUE, TRUE, FALSE, TRUE),
  ('fa333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'ca222222-2222-2222-2222-222222222222', 'Royal Cambodian Oud & Smoked Birch', 'royal-cambodian-oud-smoked-birch', 'Deep resinous Cambodian agarwood', 'TCL-CNDL-003', 2499.00, 2999.00, 'Opulent agarwood candle for open spaces.', 'Poured with organic coconut wax and rare agarwood oils.', 'Coconut Wax', 'Wooden Crackling Wick', 65, 320, 4.88, 19, 'ACTIVE', TRUE, FALSE, TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed Images
INSERT INTO product_images (product_id, image_url, is_primary)
VALUES
  ('fa111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', TRUE),
  ('fa222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80', TRUE),
  ('fa333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT DO NOTHING;

-- Seed Inventories
INSERT INTO inventories (product_id, stock_quantity, reorder_level, status)
VALUES
  ('fa111111-1111-1111-1111-111111111111', 85, 10, 'IN_STOCK'),
  ('fa222222-2222-2222-2222-222222222222', 40, 10, 'IN_STOCK'),
  ('fa333333-3333-3333-3333-333333333333', 15, 10, 'IN_STOCK')
ON CONFLICT DO NOTHING;

-- Seed Coupons
INSERT INTO coupons (code, discount_percentage, max_discount_amount, min_order_amount, usage_limit, times_used, is_active)
VALUES
  ('LUXURY15', 15.00, 500.00, 999.00, 500, 42, TRUE),
  ('FIRSTORDER', 20.00, 600.00, 1499.00, 1000, 180, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Seed Customers
INSERT INTO customers (id, full_name, email, phone, status)
VALUES ('ea111111-1111-1111-1111-111111111111', 'Ananya Sharma', 'ananya@example.com', '+919876543210', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;
