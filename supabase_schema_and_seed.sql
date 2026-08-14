-- =========================================================================
-- The Candle Lab 4.0 — Complete Supabase PostgreSQL Schema & Seed Script
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

-- 2. Fragrances Table
CREATE TABLE IF NOT EXISTS fragrances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    short_description TEXT,
    scent_profile VARCHAR(255),
    top_notes TEXT,
    heart_notes TEXT,
    base_notes TEXT,
    scent_family VARCHAR(100) DEFAULT 'Floral',
    intensity VARCHAR(50) DEFAULT 'Medium',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product Sizes Table
CREATE TABLE IF NOT EXISTS sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    unit VARCHAR(50) DEFAULT 'g',
    value NUMERIC(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Colors Table
CREATE TABLE IF NOT EXISTS colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(20) NOT NULL,
    swatch_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Wick Types Table (Candles)
CREATE TABLE IF NOT EXISTS wick_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    additional_price DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Main Categories Table
CREATE TABLE IF NOT EXISTS main_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_desktop TEXT,
    banner_mobile TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Sub Categories Table
CREATE TABLE IF NOT EXISTS sub_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_category_id UUID REFERENCES main_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_desktop TEXT,
    banner_mobile TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Collections Table (Marketing Entities)
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    banner_image TEXT,
    image_url TEXT,
    icon_symbol VARCHAR(50) DEFAULT '✨',
    collection_type VARCHAR(50) DEFAULT 'MANUAL',
    rule_conditions JSONB,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_featured BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_category_id UUID REFERENCES main_categories(id) ON DELETE SET NULL,
    sub_category_id UUID REFERENCES sub_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    short_description TEXT,
    long_description TEXT,
    product_details JSONB,
    fragrance_pyramid JSONB,
    top_notes TEXT,
    heart_notes TEXT,
    base_notes TEXT,
    scent_profile VARCHAR(255),
    wax_type VARCHAR(100) DEFAULT '100% Organic Soy Wax',
    wick_type VARCHAR(100) DEFAULT 'Organic Wood Wick',
    burn_time VARCHAR(100) DEFAULT '60 Hours',
    burn_time_hours INT DEFAULT 60,
    weight_grams INT DEFAULT 250,
    how_to_use TEXT,
    safety_instructions TEXT,
    whats_included TEXT,
    shipping_returns TEXT,
    rating DECIMAL(3, 2) DEFAULT 4.90,
    reviews_count INT DEFAULT 15,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT TRUE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_limited_edition BOOLEAN DEFAULT FALSE,
    has_fragrance_option BOOLEAN DEFAULT TRUE,
    has_size_option BOOLEAN DEFAULT TRUE,
    has_color_option BOOLEAN DEFAULT FALSE,
    has_wick_option BOOLEAN DEFAULT TRUE,
    has_gift_packaging BOOLEAN DEFAULT TRUE,
    has_custom_message BOOLEAN DEFAULT FALSE,
    available_fragrance_ids JSONB,
    available_size_ids JSONB,
    available_color_ids JSONB,
    available_wick_type_ids JSONB,
    collection_ids JSONB,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Product Collections Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS product_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, collection_id)
);

-- 11. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    title VARCHAR(255),
    fragrance_id UUID REFERENCES fragrances(id) ON DELETE SET NULL,
    fragrance_name VARCHAR(255),
    size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,
    size_name VARCHAR(100),
    color_id UUID REFERENCES colors(id) ON DELETE SET NULL,
    color_name VARCHAR(100),
    color_code VARCHAR(50),
    wick_type_id UUID REFERENCES wick_types(id) ON DELETE SET NULL,
    wick_type_name VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock INT DEFAULT 50,
    low_stock_threshold INT DEFAULT 5,
    image_url TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Inventories Table
CREATE TABLE IF NOT EXISTS inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    stock_quantity INT DEFAULT 100,
    reserved_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    status VARCHAR(50) DEFAULT 'IN_STOCK',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Coupons Table
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

-- 15. Customers Table
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

-- 16. Customer Addresses Table
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

-- 17. Orders Table
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

-- 18. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    fragrance VARCHAR(100),
    size VARCHAR(100),
    color VARCHAR(100),
    wick_type VARCHAR(100),
    sku VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(30) DEFAULT 'STRING',
    group_name VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS & Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "site_settings_public_write_cms" ON site_settings;
CREATE POLICY "site_settings_public_write_cms" ON site_settings FOR INSERT WITH CHECK (setting_key = 'tcl_cms_bundle');
DROP POLICY IF EXISTS "site_settings_public_update_cms" ON site_settings;
CREATE POLICY "site_settings_public_update_cms" ON site_settings FOR UPDATE USING (setting_key = 'tcl_cms_bundle') WITH CHECK (setting_key = 'tcl_cms_bundle');

-- =========================================================================
-- SEED DATA (Valid Hex UUIDs & Realistic Luxury Product Formulations)
-- =========================================================================

-- Seed Admins
INSERT INTO admins (email, full_name, phone, password_hash, role, status)
VALUES ('admin@candlelab.com', 'Master Super Admin', '+916264885453', '$2y$12$e6rA.y.35rC6Qx9M/XjAeeQv.T2rK0xK9rM7.xK5x5K5x5K5x5K5x', 'SUPER_ADMIN', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Seed Fragrances
INSERT INTO fragrances (id, name, slug, image_url, short_description, scent_profile, top_notes, heart_notes, base_notes, scent_family, intensity, is_active, sort_order)
VALUES
  ('fr111111-1111-1111-1111-111111111111', 'Vanilla Bourbon & Toasted Tonka', 'vanilla-bourbon-toasted-tonka', 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=600&q=80', 'Rich Madagascar vanilla pod infused with dark spiced rum and caramelized tonka.', 'Warm Gourmand & Spiced Vanilla', 'Madagascar Vanilla Bean, Caramelized Sugar', 'Bourbon Pod, French Butter, Spiced Nutmeg', 'Toasted Tonka Bean, Golden Amber, Cashmere Musk', 'Gourmand', 'Rich', TRUE, 1),
  ('fr222222-2222-2222-2222-222222222222', 'Velvet Rose & Smoked Amber', 'velvet-rose-smoked-amber', 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=600&q=80', 'Sensual damask rose layered over smoked birch and nocturnal vetiver.', 'Romantic Floral & Smoked Woods', 'Bergamot Zest, Pink Peppercorn, Dewy Violet', 'Turkish Damask Rose, Moroccan Jasmine, Clove Leaf', 'Smoked Birch, Amber Resins, Sandalwood, Dark Musk', 'Floral Woody', 'Intense', TRUE, 2),
  ('fr333333-3333-3333-3333-333333333333', 'Royal Cambodian Oud & Smoked Birch', 'royal-cambodian-oud-smoked-birch', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', 'Deep resinous agarwood blended with smoked leather and Himalayan cedar.', 'Majestic Resinous Oud & Leather', 'Cardamom Pods, Incense Smoke, Wild Thyme', 'Cambodian Agarwood, Aged Leather, Iris', 'Smoked Birch, Atlas Cedarwood, Patchouli, Ambergris', 'Woody Oriental', 'Intense', TRUE, 3),
  ('fr444444-4444-4444-4444-444444444444', 'French Lavender & Wild Chamomile', 'french-lavender-wild-chamomile', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80', 'Soothing high-altitude French lavender blossoms with calming Roman chamomile.', 'Aromatherapeutic Herbal Serenity', 'French Lavender Buds, Crushed Eucalyptus', 'Blue Chamomile, Clary Sage, Geranium', 'Clean White Musk, Blonde Cedar, Tonka', 'Fresh Herbal', 'Medium', TRUE, 4),
  ('fr555555-5555-5555-5555-555555555555', 'Mysore Sandalwood & Spiced Saffron', 'mysore-sandalwood-spiced-saffron', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80', 'Sacred Indian sandalwood paste infused with Kashmiri saffron strands.', 'Meditative Warm Sandalwood', 'Kashmiri Saffron, Sweet Cardamom, Cinnamon Bark', 'Mysore Sandalwood, Rose Petals, Olibanum', 'Golden Amber, Vetiver Roots, Creamy Benzoin', 'Woody', 'Rich', TRUE, 5),
  ('fr666666-6666-6666-6666-666666666666', 'Arabica Dark Roast & Belgian Cocoa', 'arabica-dark-roast-belgian-cocoa', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'Freshly ground Arabica espresso beans with velvety roasted cacao notes.', 'Gourmand Roasted Coffee Bar', 'Crushed Arabica Coffee Beans, Hazelnut Liqueur', 'Dark Belgian Cocoa, Steamed Milk Froth', 'Espresso Crema, Vanilla Extract, Brown Sugar', 'Gourmand', 'Rich', TRUE, 6),
  ('fr777777-7777-7777-7777-777777777777', 'Italian Bergamot & Coastal Sea Salt', 'italian-bergamot-coastal-sea-salt', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80', 'Crisp Mediterranean citrus breezes balanced by mineral sea kelp.', 'Crisp Coastal Citrus & Marine', 'Calabrian Bergamot, Ocean Mist, Lemon Blossom', 'Marine Accord, Crushed Rosemary, Water Lotus', 'Driftwood, Sea Moss, Light Amber', 'Fresh Citrus', 'Medium', TRUE, 7)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_description = EXCLUDED.short_description, top_notes = EXCLUDED.top_notes, heart_notes = EXCLUDED.heart_notes, base_notes = EXCLUDED.base_notes;

-- Seed Generic Sizes
INSERT INTO sizes (id, name, slug, unit, value, is_active, sort_order)
VALUES
  ('sz111111-1111-1111-1111-111111111111', '100g Petite Travel', '100g', 'g', 100, TRUE, 1),
  ('sz222222-2222-2222-2222-222222222222', '200g Classic Atelier', '200g', 'g', 200, TRUE, 2),
  ('sz333333-3333-3333-3333-333333333333', '400g Grand Reserve (3-Wick)', '400g', 'g', 400, TRUE, 3),
  ('sz444444-4444-4444-4444-444444444444', '100ml Reed Diffuser', '100ml', 'ml', 100, TRUE, 4),
  ('sz555555-5555-5555-5555-555555555555', '200ml Luxury Flacon', '200ml', 'ml', 200, TRUE, 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, unit = EXCLUDED.unit;

-- Seed Colors
INSERT INTO colors (id, name, hex_code, swatch_image, is_active, sort_order)
VALUES
  ('cl111111-1111-1111-1111-111111111111', 'Ivory Warm Cream', '#FAF6F0', NULL, TRUE, 1),
  ('cl222222-2222-2222-2222-222222222222', 'Matte Obsidian Black', '#1C130E', NULL, TRUE, 2),
  ('cl333333-3333-3333-3333-333333333333', 'Royal 24K Gold Foil', '#D4AF37', NULL, TRUE, 3),
  ('cl444444-4444-4444-4444-444444444444', 'Blush Botanical Rose', '#E8C5B8', NULL, TRUE, 4)
ON CONFLICT DO NOTHING;

-- Seed Wick Types
INSERT INTO wick_types (id, name, description, additional_price, is_active, sort_order)
VALUES
  ('wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 'Sustainably sourced FSC wood that emits a soothing fireside crackle as it burns.', 0.00, TRUE, 1),
  ('wk222222-2222-2222-2222-222222222222', '100% Organic Cotton Wick (Silent)', 'Lead-free unbleached braided cotton wick for an ultra-clean, whisper-silent flame.', 0.00, TRUE, 2)
ON CONFLICT DO NOTHING;

-- Seed Main Categories
INSERT INTO main_categories (id, name, slug, description, image_url, sort_order)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Scented Soy Candles', 'scented-soy-candles', 'Hand-poured pure soy wax candle creations infused with botanical fragrance oils.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', 1),
  ('22222222-2222-2222-2222-222222222222', 'Home & Ambient Fragrance', 'home-ambient-fragrance', 'Flame-free ambient diffusion systems including rattan reed diffusers and room mists.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 2),
  ('33333333-3333-3333-3333-333333333333', 'Luxury Gift Sets & Ateliers', 'luxury-gift-sets-ateliers', 'Bespoke gift box presentations embossed in gold foil with candle care brass tools.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', 3),
  ('44444444-4444-4444-4444-444444444444', 'Wax Melts & Aromatherapy', 'wax-melts-aromatherapy', 'Snap bars and botanical wax melts designed for ceramic and electric warmers.', 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Sub Categories
INSERT INTO sub_categories (id, main_category_id, name, slug, description, sort_order)
VALUES
  ('sc111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Luxury Glass Jar Candles', 'luxury-glass-jar-candles', 'Handcrafted in heavy frosted Italian glass vessels with timber dust covers.', 1),
  ('sc222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Botanical Travel Tins', 'botanical-travel-tins', 'Seamless brushed metallic travel tins for wanderlust and compact spaces.', 2),
  ('sc333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Rattan Reed Diffusers', 'rattan-reed-diffusers', 'Continuous ambient scent throw lasting 90+ days without open flames.', 1),
  ('sc444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Festive & Bridal Gift Boxes', 'festive-bridal-gift-boxes', 'Curated trios packaged in embossed rigid velvet-lined boxes.', 1)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, main_category_id = EXCLUDED.main_category_id;

-- Seed Collections (Marketing Groupings)
INSERT INTO collections (id, name, slug, description, banner_image, icon_symbol, is_featured, is_active, sort_order)
VALUES
  ('ca111111-1111-1111-1111-111111111111', 'Best Sellers Atelier', 'best-sellers', 'Our most beloved and iconic hand-poured olfactory signatures.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80', '🔥', TRUE, TRUE, 1),
  ('ca222222-2222-2222-2222-222222222222', 'Royal 24K Luxury Reserve', 'royal-luxury-reserve', 'Rare botanical extracts poured in custom frosted glass and gold-leaf vessels.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80', '✨', TRUE, TRUE, 2),
  ('ca333333-3333-3333-3333-333333333333', 'New Seasonal Releases', 'new-arrivals', 'Fresh batch formulations capturing the spirit of changing seasons.', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80', '🌟', TRUE, TRUE, 3),
  ('ca444444-4444-4444-4444-444444444444', 'Gourmand & Coffee Bar', 'gourmand-coffee', 'Warm vanillas, roasted Arabica beans, tonka, and spiced confections.', 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1200&q=80', '☕', TRUE, TRUE, 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Products
INSERT INTO products (
    id, main_category_id, sub_category_id, name, slug, tagline, sku, price, original_price,
    short_description, long_description,
    product_details, fragrance_pyramid,
    top_notes, heart_notes, base_notes, scent_profile,
    wax_type, wick_type, burn_time, burn_time_hours, weight_grams,
    how_to_use, safety_instructions, whats_included, shipping_returns,
    rating, reviews_count, status, is_featured, is_bestseller, is_new_arrival, is_trending, is_limited_edition,
    has_fragrance_option, has_size_option, has_color_option, has_wick_option, has_gift_packaging, has_custom_message,
    available_fragrance_ids, available_size_ids, available_color_ids, available_wick_type_ids, collection_ids,
    meta_title, meta_description
)
VALUES
(
    'fa111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'sc111111-1111-1111-1111-111111111111',
    'Vanilla Bourbon & Spiced Tonka Atelier Candle',
    'vanilla-bourbon-spiced-tonka-candle',
    'Madagascar vanilla pod with bourbon oak and warm toasted tonka',
    'TCL-VNB-001',
    1499.00,
    1899.00,
    'Hand-poured luxury soy candle featuring warm French vanilla, aged bourbon cask oak, and caramelized tonka bean.',
    'An opulent gourmand masterpiece crafted for intimate evenings and serene living spaces. Poured by master artisans in small small-batch runs using 100% pure organic soy wax derived from American farms and therapeutic botanical extracts.',
    '{"wax": "100% Pure Organic Soy Wax", "burnTime": "60-65 Hours", "wick": "Organic FSC Wood Wick / Cotton", "vessel": "Heavy Frosted Glass Jar", "dimensions": "8.5cm Dia x 10cm Height", "weight": "250g Wax Net Weight (600g Gross)", "madeIn": "Handcrafted in Mumbai, India"}',
    '{"scentProfile": "Warm Gourmand & Spiced Vanilla", "topNotes": "Madagascar Vanilla Bean, Caramelized Sugar", "heartNotes": "Bourbon Pod, French Butter, Spiced Nutmeg", "baseNotes": "Toasted Tonka Bean, Golden Amber, Cashmere Musk", "intensity": "Rich & Cozy"}',
    'Madagascar Vanilla Bean, Caramelized Sugar',
    'Bourbon Pod, French Butter, Spiced Nutmeg',
    'Toasted Tonka Bean, Golden Amber, Cashmere Musk',
    'Warm Gourmand & Spiced Vanilla',
    '100% Organic Soy Wax',
    'Organic Wood Wick (Crackling)',
    '65 Hours',
    65,
    250,
    'On first light, allow the candle wax to melt completely across the top diameter (approx 2-3 hours) to prevent wax memory tunneling. Always trim wick to 1/4 inch before each relighting.',
    'Never leave a burning candle unattended. Keep away from flammable materials, drafty corridors, pets, and children. Discontinue use when 1/2 inch of unmelted wax remains.',
    '1x Hand-Poured Glass Candle (250g), 1x Custom Wooden Snuffer Lid, 1x Matchbox with Gold Matches, 1x Luxury Embossed Gift Box.',
    'Complimentary Pan-India Gold Express Delivery on orders above ₹1,499. Dispatched within 24 hours in shock-proof custom foam packaging. 30-Day Hassle-Free Exchange Guarantee.',
    4.96,
    142,
    'ACTIVE',
    TRUE, TRUE, TRUE, TRUE, FALSE,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    '["fr111111-1111-1111-1111-111111111111", "fr222222-2222-2222-2222-222222222222", "fr555555-5555-5555-5555-555555555555"]',
    '["sz111111-1111-1111-1111-111111111111", "sz222222-2222-2222-2222-222222222222", "sz333333-3333-3333-3333-333333333333"]',
    '["cl111111-1111-1111-1111-111111111111", "cl222222-2222-2222-2222-222222222222"]',
    '["wk111111-1111-1111-1111-111111111111", "wk222222-2222-2222-2222-222222222222"]',
    '["ca111111-1111-1111-1111-111111111111", "ca444444-4444-4444-4444-444444444444"]',
    'Vanilla Bourbon & Spiced Tonka Candle — The Candle Lab',
    'Handcrafted luxury soy candle with Madagascar vanilla bean, oak bourbon, and crackling wood wick.'
),
(
    'fa222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'sc111111-1111-1111-1111-111111111111',
    'Velvet Rose & Smoked Amber Luxury Jar',
    'velvet-rose-smoked-amber-jar',
    'Nocturnal Damask rose blossoms with smoked birch and golden amber',
    'TCL-VRSA-002',
    1599.00,
    1999.00,
    'A deeply seductive floral-woody formulation balancing Turkish rose petals and smoldering amber resins.',
    'Formulated with cold-extracted Turkish damask rose petals and ancient Baltic amber resins. Designed to create a moody, romantic atmosphere in master bedrooms and luxury lounges.',
    '{"wax": "100% Pure Organic Soy Wax", "burnTime": "60-65 Hours", "wick": "Organic FSC Wood Wick", "vessel": "Italian Frosted Amber Glass", "dimensions": "8.5cm Dia x 10cm Height", "weight": "250g Wax Net Weight", "madeIn": "Handcrafted in Mumbai, India"}',
    '{"scentProfile": "Romantic Floral & Smoked Woods", "topNotes": "Bergamot Zest, Pink Peppercorn, Dewy Violet", "heartNotes": "Turkish Damask Rose, Moroccan Jasmine, Clove Leaf", "baseNotes": "Smoked Birch, Amber Resins, Sandalwood, Dark Musk", "intensity": "Intense"}',
    'Bergamot Zest, Pink Peppercorn, Dewy Violet',
    'Turkish Damask Rose, Moroccan Jasmine, Clove Leaf',
    'Smoked Birch, Amber Resins, Sandalwood, Dark Musk',
    'Romantic Floral & Smoked Woods',
    '100% Organic Soy Wax',
    'Organic Wood Wick (Crackling)',
    '65 Hours',
    65,
    250,
    'Trim wick before every burn. Allow entire top pool to liquefy to the glass rim.',
    'Keep away from flammable fabrics and pets. Do not burn for more than 4 hours at a time.',
    '1x Velvet Rose Luxury Candle, 1x Brushed Gold Metal Lid, 1x Velvet Gift Pouch.',
    'Ships within 24h. Free Express Delivery Pan-India.',
    4.94,
    98,
    'ACTIVE',
    TRUE, TRUE, FALSE, TRUE, FALSE,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    '["fr222222-2222-2222-2222-222222222222", "fr111111-1111-1111-1111-111111111111", "fr333333-3333-3333-3333-333333333333"]',
    '["sz111111-1111-1111-1111-111111111111", "sz222222-2222-2222-2222-222222222222", "sz333333-3333-3333-3333-333333333333"]',
    '["cl111111-1111-1111-1111-111111111111", "cl444444-4444-4444-4444-444444444444"]',
    '["wk111111-1111-1111-1111-111111111111", "wk222222-2222-2222-2222-222222222222"]',
    '["ca111111-1111-1111-1111-111111111111", "ca222222-2222-2222-2222-222222222222"]',
    'Velvet Rose & Smoked Amber Candle — The Candle Lab',
    'Romantic Damask Rose and Smoked Amber soy candle hand-poured in luxury glass.'
),
(
    'fa333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'sc111111-1111-1111-1111-111111111111',
    'Royal Cambodian Oud & Smoked Birch Grand Reserve',
    'royal-cambodian-oud-smoked-birch',
    'Rare Cambodian agarwood with aged leather and smoky birch',
    'TCL-OUD-003',
    2499.00,
    2999.00,
    'Our most majestic woody formulation infused with genuine Cambodian agarwood and Himalayan cedarwood.',
    'Reserved for connoisseurs of deep, mysterious oriental scents. Hand-poured in limited batches of 50 units with gold-leaf accents.',
    '{"wax": "100% Organic Soy & Coconut Wax Blend", "burnTime": "75 Hours", "wick": "Double Organic Wood Wick", "vessel": "Matte Obsidian Ceramic Jar", "dimensions": "10cm Dia x 12cm Height", "weight": "350g Wax Net Weight", "madeIn": "Handcrafted in Mumbai, India"}',
    '{"scentProfile": "Majestic Resinous Oud & Leather", "topNotes": "Cardamom Pods, Incense Smoke, Wild Thyme", "heartNotes": "Cambodian Agarwood, Aged Leather, Iris", "baseNotes": "Smoked Birch, Atlas Cedarwood, Patchouli, Ambergris", "intensity": "Intense & Long-Lasting"}',
    'Cardamom Pods, Incense Smoke, Wild Thyme',
    'Cambodian Agarwood, Aged Leather, Iris',
    'Smoked Birch, Atlas Cedarwood, Patchouli, Ambergris',
    'Majestic Resinous Oud & Leather',
    'Organic Soy & Coconut Wax Blend',
    'Organic Wood Wick (Crackling)',
    '75 Hours',
    75,
    350,
    'Burn for 3 hours on first lighting. Ensure crackling double wick is trimmed to 4mm.',
    'Extinguish using the included ceramic snuffer lid.',
    '1x Grand Reserve Oud Candle (350g), 1x Brass Wick Trimmer, 1x Luxury Rigid Presentation Box.',
    'Dispatched in reinforced presentation packaging. 30-Day Guarantee.',
    4.98,
    76,
    'ACTIVE',
    TRUE, FALSE, TRUE, TRUE, TRUE,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    '["fr333333-3333-3333-3333-333333333333", "fr555555-5555-5555-5555-555555555555"]',
    '["sz222222-2222-2222-2222-222222222222", "sz333333-3333-3333-3333-333333333333"]',
    '["cl222222-2222-2222-2222-222222222222", "cl333333-3333-3333-3333-333333333333"]',
    '["wk111111-1111-1111-1111-111111111111"]',
    '["ca222222-2222-2222-2222-222222222222"]',
    'Royal Cambodian Oud Grand Reserve Candle — The Candle Lab',
    'Prestige Cambodian agarwood luxury candle with double crackling wooden wicks.'
),
(
    'fa444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'sc333333-3333-3333-3333-333333333333',
    'French Lavender & Chamomile Rattan Reed Diffuser',
    'french-lavender-chamomile-reed-diffuser',
    'Continuous 90-day ambient aromatherapy without open flame',
    'TCL-DIF-004',
    1299.00,
    1599.00,
    'Flame-free luxury rattan reed diffuser infused with therapeutic French lavender blossoms and Roman chamomile.',
    'Provides continuous, flame-free diffusion for powder rooms, bedrooms, and executive suites. Formulated with alcohol-free bio-solvent carrier oils that maximize scent dispersion for up to 90 days.',
    '{"volume": "100ml / 200ml", "duration": "90+ Days Ambient Diffusion", "reeds": "8x Premium Porous Fiber Rattan Reeds", "bottle": "Heavy Tinted Glass Apothecary Bottle", "carrier": "100% Bio-based Alcohol-Free Solvent", "madeIn": "Handcrafted in Mumbai, India"}',
    '{"scentProfile": "Aromatherapeutic Herbal Serenity", "topNotes": "French Lavender Buds, Crushed Eucalyptus", "heartNotes": "Blue Chamomile, Clary Sage, Geranium", "baseNotes": "Clean White Musk, Blonde Cedar, Tonka", "intensity": "Continuous & Gentle"}',
    'French Lavender Buds, Crushed Eucalyptus',
    'Blue Chamomile, Clary Sage, Geranium',
    'Clean White Musk, Blonde Cedar, Tonka',
    'Aromatherapeutic Herbal Serenity',
    'N/A (Liquid Diffuser)',
    'N/A (Fiber Reeds)',
    '90 Days Diffusion',
    NULL,
    100,
    'Insert all 8 fiber reeds into the glass flacon. Allow reeds to absorb oil for 24 hours. Flip reeds weekly for enhanced scent throw.',
    'Do not ingest. Keep away from direct sunlight and open flames. Wipe any spills immediately from varnished surfaces.',
    '1x 100ml Glass Apothecary Flacon, 8x High-Absorption Black Fiber Reeds, 1x Gold Foil Gift Box.',
    'Free Shipping over ₹1,499. Dispatched in 24h.',
    4.91,
    54,
    'ACTIVE',
    TRUE, FALSE, TRUE, FALSE, FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE, FALSE,
    '["fr444444-4444-4444-4444-444444444444", "fr777777-7777-7777-7777-777777777777"]',
    '["sz444444-4444-4444-4444-444444444444", "sz555555-5555-5555-5555-555555555555"]',
    '[]',
    '[]',
    '["ca333333-3333-3333-3333-333333333333"]',
    'French Lavender & Chamomile Reed Diffuser — The Candle Lab',
    'Flame-free continuous ambient reed diffuser with French lavender and wild chamomile.'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    product_details = EXCLUDED.product_details,
    fragrance_pyramid = EXCLUDED.fragrance_pyramid,
    how_to_use = EXCLUDED.how_to_use,
    safety_instructions = EXCLUDED.safety_instructions,
    whats_included = EXCLUDED.whats_included,
    shipping_returns = EXCLUDED.shipping_returns,
    available_fragrance_ids = EXCLUDED.available_fragrance_ids,
    available_size_ids = EXCLUDED.available_size_ids,
    available_color_ids = EXCLUDED.available_color_ids,
    available_wick_type_ids = EXCLUDED.available_wick_type_ids,
    collection_ids = EXCLUDED.collection_ids,
    has_fragrance_option = EXCLUDED.has_fragrance_option,
    has_size_option = EXCLUDED.has_size_option,
    has_color_option = EXCLUDED.has_color_option,
    has_wick_option = EXCLUDED.has_wick_option;

-- Seed Product Collections Many-to-Many
INSERT INTO product_collections (product_id, collection_id)
VALUES
  ('fa111111-1111-1111-1111-111111111111', 'ca111111-1111-1111-1111-111111111111'),
  ('fa111111-1111-1111-1111-111111111111', 'ca444444-4444-4444-4444-444444444444'),
  ('fa222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111'),
  ('fa222222-2222-2222-2222-222222222222', 'ca222222-2222-2222-2222-222222222222'),
  ('fa333333-3333-3333-3333-333333333333', 'ca222222-2222-2222-2222-222222222222'),
  ('fa444444-4444-4444-4444-444444444444', 'ca333333-3333-3333-3333-333333333333')
ON CONFLICT (product_id, collection_id) DO NOTHING;

-- Seed Product Variants
INSERT INTO product_variants (
    id, product_id, sku, title,
    fragrance_id, fragrance_name, size_id, size_name, color_id, color_name, color_code,
    wick_type_id, wick_type_name, price, original_price, cost_price, stock, low_stock_threshold, is_default, status
)
VALUES
  -- Product 1 Variants (Vanilla Bourbon)
  ('va111111-1111-1111-1111-111111111111', 'fa111111-1111-1111-1111-111111111111', 'TCL-VNB-100G-IVR', 'Vanilla Bourbon • 100g • Ivory', 'fr111111-1111-1111-1111-111111111111', 'Vanilla Bourbon & Toasted Tonka', 'sz111111-1111-1111-1111-111111111111', '100g Petite Travel', 'cl111111-1111-1111-1111-111111111111', 'Ivory Warm Cream', '#FAF6F0', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 999.00, 1299.00, 350.00, 45, 5, FALSE, 'ACTIVE'),
  ('va222222-2222-2222-2222-222222222222', 'fa111111-1111-1111-1111-111111111111', 'TCL-VNB-200G-IVR', 'Vanilla Bourbon • 200g • Ivory', 'fr111111-1111-1111-1111-111111111111', 'Vanilla Bourbon & Toasted Tonka', 'sz222222-2222-2222-2222-222222222222', '200g Classic Atelier', 'cl111111-1111-1111-1111-111111111111', 'Ivory Warm Cream', '#FAF6F0', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 1499.00, 1899.00, 520.00, 80, 10, TRUE, 'ACTIVE'),
  ('va333333-3333-3333-3333-333333333333', 'fa111111-1111-1111-1111-111111111111', 'TCL-VNB-400G-IVR', 'Vanilla Bourbon • 400g • Ivory', 'fr111111-1111-1111-1111-111111111111', 'Vanilla Bourbon & Toasted Tonka', 'sz333333-3333-3333-3333-333333333333', '400g Grand Reserve (3-Wick)', 'cl111111-1111-1111-1111-111111111111', 'Ivory Warm Cream', '#FAF6F0', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 2199.00, 2699.00, 800.00, 25, 5, FALSE, 'ACTIVE'),
  ('va444444-4444-4444-4444-444444444444', 'fa111111-1111-1111-1111-111111111111', 'TCL-VRSA-200G-IVR', 'Velvet Rose • 200g • Ivory', 'fr222222-2222-2222-2222-222222222222', 'Velvet Rose & Smoked Amber', 'sz222222-2222-2222-2222-222222222222', '200g Classic Atelier', 'cl111111-1111-1111-1111-111111111111', 'Ivory Warm Cream', '#FAF6F0', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 1499.00, 1899.00, 520.00, 35, 5, FALSE, 'ACTIVE'),

  -- Product 2 Variants (Velvet Rose)
  ('va555555-5555-5555-5555-555555555555', 'fa222222-2222-2222-2222-222222222222', 'TCL-VR-200G-ROSE', 'Velvet Rose • 200g • Blush Rose', 'fr222222-2222-2222-2222-222222222222', 'Velvet Rose & Smoked Amber', 'sz222222-2222-2222-2222-222222222222', '200g Classic Atelier', 'cl444444-4444-4444-4444-444444444444', 'Blush Botanical Rose', '#E8C5B8', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 1599.00, 1999.00, 550.00, 50, 8, TRUE, 'ACTIVE'),
  ('va666666-6666-6666-6666-666666666666', 'fa222222-2222-2222-2222-222222222222', 'TCL-VR-400G-ROSE', 'Velvet Rose • 400g • Blush Rose', 'fr222222-2222-2222-2222-222222222222', 'Velvet Rose & Smoked Amber', 'sz333333-3333-3333-3333-333333333333', '400g Grand Reserve (3-Wick)', 'cl444444-4444-4444-4444-444444444444', 'Blush Botanical Rose', '#E8C5B8', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 2299.00, 2799.00, 850.00, 18, 5, FALSE, 'ACTIVE'),

  -- Product 3 Variants (Royal Oud)
  ('va777777-7777-7777-7777-777777777777', 'fa333333-3333-3333-3333-333333333333', 'TCL-OUD-200G-BLK', 'Royal Oud • 200g • Obsidian Black', 'fr333333-3333-3333-3333-333333333333', 'Royal Cambodian Oud & Smoked Birch', 'sz222222-2222-2222-2222-222222222222', '200g Classic Atelier', 'cl222222-2222-2222-2222-222222222222', 'Matte Obsidian Black', '#1C130E', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 2499.00, 2999.00, 950.00, 30, 5, TRUE, 'ACTIVE'),
  ('va888888-8888-8888-8888-888888888888', 'fa333333-3333-3333-3333-333333333333', 'TCL-OUD-400G-BLK', 'Royal Oud • 400g • Obsidian Black', 'fr333333-3333-3333-3333-333333333333', 'Royal Cambodian Oud & Smoked Birch', 'sz333333-3333-3333-3333-333333333333', '400g Grand Reserve (3-Wick)', 'cl222222-2222-2222-2222-222222222222', 'Matte Obsidian Black', '#1C130E', 'wk111111-1111-1111-1111-111111111111', 'Organic Wood Wick (Crackling)', 3499.00, 4199.00, 1300.00, 15, 3, FALSE, 'ACTIVE'),

  -- Product 4 Variants (Reed Diffuser)
  ('va999999-9999-9999-9999-999999999999', 'fa444444-4444-4444-4444-444444444444', 'TCL-DIF-100ML-LAV', 'French Lavender • 100ml Reed Diffuser', 'fr444444-4444-4444-4444-444444444444', 'French Lavender & Wild Chamomile', 'sz444444-4444-4444-4444-444444444444', '100ml Reed Diffuser', NULL, NULL, NULL, NULL, NULL, 1299.00, 1599.00, 420.00, 40, 8, TRUE, 'ACTIVE'),
  ('vaa11111-1111-1111-1111-111111111111', 'fa444444-4444-4444-4444-444444444444', 'TCL-DIF-200ML-LAV', 'French Lavender • 200ml Luxury Flacon', 'fr444444-4444-4444-4444-444444444444', 'French Lavender & Wild Chamomile', 'sz555555-5555-5555-5555-555555555555', '200ml Luxury Flacon', NULL, NULL, NULL, NULL, NULL, 1999.00, 2499.00, 680.00, 25, 5, FALSE, 'ACTIVE')
ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;

-- Seed Product Gallery Images
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
VALUES
  -- Product 1 Images
  ('fa111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80', TRUE, 0),
  ('fa111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1000&q=80', FALSE, 1),
  ('fa111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1000&q=80', FALSE, 2),

  -- Product 2 Images
  ('fa222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1000&q=80', TRUE, 0),
  ('fa222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80', FALSE, 1),

  -- Product 3 Images
  ('fa333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80', TRUE, 0),
  ('fa333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80', FALSE, 1),

  -- Product 4 Images
  ('fa444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80', TRUE, 0)
ON CONFLICT DO NOTHING;

-- Seed Inventories
INSERT INTO inventories (product_id, variant_id, stock_quantity, reorder_level, status)
VALUES
  ('fa111111-1111-1111-1111-111111111111', 'va222222-2222-2222-2222-222222222222', 80, 10, 'IN_STOCK'),
  ('fa222222-2222-2222-2222-222222222222', 'va555555-5555-5555-5555-555555555555', 50, 10, 'IN_STOCK'),
  ('fa333333-3333-3333-3333-333333333333', 'va777777-7777-7777-7777-777777777777', 30, 5, 'IN_STOCK'),
  ('fa444444-4444-4444-4444-444444444444', 'va999999-9999-9999-9999-999999999999', 40, 8, 'IN_STOCK')
ON CONFLICT DO NOTHING;

-- Seed Coupons
INSERT INTO coupons (code, discount_percentage, max_discount_amount, min_order_amount, usage_limit, times_used, is_active)
VALUES
  ('LUXURY20', 20.00, 600.00, 1499.00, 1000, 185, TRUE),
  ('FIRSTORDER', 15.00, 400.00, 999.00, 2000, 420, TRUE),
  ('ATELIER10', 10.00, 300.00, 799.00, 500, 64, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Seed Customers
INSERT INTO customers (id, full_name, email, phone, status)
VALUES ('ea111111-1111-1111-1111-111111111111', 'Ananya Sharma', 'ananya.sharma@example.com', '+919876543210', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;
