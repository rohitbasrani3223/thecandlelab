<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Admin;
use App\Models\MainCategory;
use App\Models\SubCategory;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Inventory;
use App\Models\Customer;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Master Admin & User accounts
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@thecandlelab.com'],
            [
                'name' => 'Super Admin',
                'phone' => '+919876543210',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'reward_points' => 1000,
                'tier' => 'Platinum',
            ]
        );

        \App\Models\User::updateOrCreate(
            ['email' => 'customer@thecandlelab.com'],
            [
                'name' => 'John Doe',
                'phone' => '+919876543211',
                'password' => Hash::make('customer123'),
                'role' => 'customer',
                'reward_points' => 250,
                'tier' => 'Gold',
            ]
        );

        $admin = Admin::updateOrCreate(
            ['email' => 'admin@candlelab.com'],
            [
                'id' => (string) Str::uuid(),
                'full_name' => 'Super Admin',
                'phone' => '+919876543210',
                'password_hash' => Hash::make('admin123'),
                'role' => 'SUPER_ADMIN',
                'status' => 'ACTIVE',
            ]
        );

        // 2. Seed Main Categories
        $mainCats = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Aromatherapy & Wellness',
                'slug' => 'aromatherapy-wellness',
                'description' => 'Essential oil therapeutic candle blends designed for relaxation and mental clarity.',
                'image_url' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Floral & Botanical',
                'slug' => 'floral-botanical',
                'description' => 'Hand-poured floral bouquets of Jasmine, Rose, Tuberose & English Lavender.',
                'image_url' => 'https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Gourmand & Vanilla',
                'slug' => 'gourmand-vanilla',
                'description' => 'Warm Madagascar vanilla bean, salted caramel, and roasted almond scents.',
                'image_url' => 'https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Woody & Resinous Oud',
                'slug' => 'woody-resinous-oud',
                'description' => 'Deep amber, Cambodian oud, cedarwood, and smoldering fireplace notes.',
                'image_url' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
                'sort_order' => 4,
            ]
        ];

        $createdMainCats = [];
        foreach ($mainCats as $cat) {
            $createdMainCats[] = MainCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. Seed Sub Categories
        $subCat = SubCategory::updateOrCreate(
            ['slug' => 'soy-wax-candles'],
            [
                'id' => (string) Str::uuid(),
                'main_category_id' => $createdMainCats[0]->id,
                'name' => 'Soy Wax Candles',
                'slug' => 'soy-wax-candles',
                'description' => 'Clean-burning 100% soy wax candles.',
                'is_active' => true,
                'sort_order' => 1
            ]
        );

        // 4. Seed Collections
        $cols = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Scented Candles',
                'slug' => 'scented-candles',
                'description' => 'Signature aromatherapy candles poured in matte ceramic vessels.',
                'banner_image' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
                'icon_symbol' => '🕯️',
                'is_featured' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Luxury Collection',
                'slug' => 'luxury-collection',
                'description' => 'Rare botanical essences in gold leaf crystal jars.',
                'banner_image' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
                'icon_symbol' => '✨',
                'is_featured' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Seasonal Autumn Atelier',
                'slug' => 'seasonal-autumn-atelier',
                'description' => 'Warm spiced cinnamon, burnt orange peel, and clove bud scents.',
                'banner_image' => 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
                'icon_symbol' => '🍁',
                'is_featured' => true,
            ]
        ];

        $createdCols = [];
        foreach ($cols as $col) {
            $createdCols[] = Collection::updateOrCreate(['slug' => $col['slug']], $col);
        }

        // 5. Seed Products
        $productsData = [
            [
                'name' => 'Midnight Jasmine & Amber Vetiver',
                'slug' => 'midnight-jasmine-amber-vetiver',
                'tagline' => 'Night-blooming Indian Jasmine with warm resinous amber',
                'sku' => 'TCL-CNDL-001',
                'price' => 1499.00,
                'original_price' => 1899.00,
                'short_description' => 'Immerse your space in the serene allure of night-blooming jasmine.',
                'long_description' => 'Hand-poured into a matte warm cream ceramic jar using 100% organic soy wax and a wooden crackling wick.',
                'wax_type' => 'Soy Wax',
                'wick_type' => 'Wooden Crackling Wick',
                'burn_time_hours' => 55,
                'weight_grams' => 280,
                'status' => 'ACTIVE',
                'is_featured' => true,
                'is_bestseller' => true,
                'is_new_arrival' => true,
                'is_trending' => true,
                'main_category_id' => $createdMainCats[0]->id,
                'sub_category_id' => $subCat->id,
                'collection_id' => $createdCols[0]->id,
            ],
            [
                'name' => 'Madagascar Vanilla & Spiced Tonka',
                'slug' => 'madagascar-vanilla-spiced-tonka',
                'tagline' => 'Warm vanilla bean with toasted almond and caramelized sugar',
                'sku' => 'TCL-CNDL-002',
                'price' => 1299.00,
                'original_price' => 1599.00,
                'short_description' => 'A cozy gourmand blend evoking warm autumnal afternoons.',
                'long_description' => 'Infused with natural French vanilla extract and toasted tonka bean oils.',
                'wax_type' => 'Beeswax',
                'wick_type' => 'Cotton Wick',
                'burn_time_hours' => 50,
                'weight_grams' => 250,
                'status' => 'ACTIVE',
                'is_featured' => true,
                'is_bestseller' => true,
                'is_new_arrival' => false,
                'is_trending' => true,
                'main_category_id' => $createdMainCats[2]->id,
                'sub_category_id' => $subCat->id,
                'collection_id' => $createdCols[1]->id,
            ],
            [
                'name' => 'Royal Cambodian Oud & Smoked Birch',
                'slug' => 'royal-cambodian-oud-smoked-birch',
                'tagline' => 'Deep resinous Cambodian agarwood with smoldering fireplace notes',
                'sku' => 'TCL-CNDL-003',
                'price' => 2499.00,
                'original_price' => 2999.00,
                'short_description' => 'An opulent, majestic fragrance crafted for grand open spaces.',
                'long_description' => 'Poured with organic coconut wax and rare agarwood oils.',
                'wax_type' => 'Coconut Wax',
                'wick_type' => 'Wooden Crackling Wick',
                'burn_time_hours' => 65,
                'weight_grams' => 320,
                'status' => 'ACTIVE',
                'is_featured' => true,
                'is_bestseller' => false,
                'is_new_arrival' => true,
                'is_trending' => true,
                'main_category_id' => $createdMainCats[3]->id,
                'sub_category_id' => $subCat->id,
                'collection_id' => $createdCols[1]->id,
            ]
        ];

        foreach ($productsData as $pData) {
            $product = Product::updateOrCreate(
                ['slug' => $pData['slug']],
                array_merge($pData, ['id' => (string) Str::uuid()])
            );

            // Seed Image
            ProductImage::updateOrCreate(
                ['product_id' => $product->id],
                [
                    'id' => (string) Str::uuid(),
                    'image_url' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                    'is_primary' => true,
                    'sort_order' => 1
                ]
            );

            // Seed Inventory
            Inventory::updateOrCreate(
                ['product_id' => $product->id],
                [
                    'id' => (string) Str::uuid(),
                    'stock_quantity' => rand(25, 100),
                    'reorder_level' => 10,
                    'status' => 'IN_STOCK'
                ]
            );
        }

        // 6. Seed Coupons
        Coupon::updateOrCreate(
            ['code' => 'LUXURY15'],
            [
                'id' => (string) Str::uuid(),
                'code' => 'LUXURY15',
                'discount_percentage' => 15.00,
                'max_discount_amount' => 500.00,
                'min_order_amount' => 999.00,
                'usage_limit' => 500,
                'times_used' => 42,
                'start_date' => now()->subDays(10),
                'end_date' => now()->addDays(90),
                'is_active' => true
            ]
        );

        Coupon::updateOrCreate(
            ['code' => 'FIRSTORDER'],
            [
                'id' => (string) Str::uuid(),
                'code' => 'FIRSTORDER',
                'discount_percentage' => 20.00,
                'max_discount_amount' => 600.00,
                'min_order_amount' => 1499.00,
                'usage_limit' => 1000,
                'times_used' => 180,
                'start_date' => now()->subDays(30),
                'end_date' => now()->addDays(180),
                'is_active' => true
            ]
        );

        // 7. Seed Customer
        Customer::updateOrCreate(
            ['email' => 'ananya@example.com'],
            [
                'id' => (string) Str::uuid(),
                'full_name' => 'Ananya Sharma',
                'phone' => '+919876543210',
                'password_hash' => Hash::make('password123'),
                'is_verified' => true,
                'status' => 'ACTIVE'
            ]
        );

        echo "✅ Successfully seeded Supabase PostgreSQL database for The Candle Lab!\n";
    }
}
