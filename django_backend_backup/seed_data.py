import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Collection, Category, Product
from orders.models import Order, OrderItem
from users.models import User
from cms.models import SiteSettings, ThemeSettings, CheckoutSettings, SearchConfig, HeroBanner, AnnouncementBar, PromoPopup
from marketing.models import MarketingRule, FlashSale, Coupon


def seed():
    print("Seeding comprehensive Candle Lab database...")

    # 1. Users / Customers
    admin_user, _ = User.objects.get_or_create(
        username="admin",
        defaults={
            "email": "admin@candlelab.com",
            "role": "ADMIN",
            "phone": "+91 9876543210",
            "is_staff": True,
            "is_superuser": True
        }
    )
    admin_user.set_password("admin123")
    admin_user.save()

    c1, _ = User.objects.get_or_create(
        username="priyasharma",
        defaults={
            "email": "priya.sharma@example.com",
            "role": "CUSTOMER",
            "phone": "+91 9820011223",
            "wallet_balance": 450.00
        }
    )

    c2, _ = User.objects.get_or_create(
        username="rahulverma",
        defaults={
            "email": "rahul.verma@example.com",
            "role": "CUSTOMER",
            "phone": "+91 9833344556",
            "wallet_balance": 120.00
        }
    )

    c3, _ = User.objects.get_or_create(
        username="ananyaroy",
        defaults={
            "email": "ananya.roy@example.com",
            "role": "CUSTOMER",
            "phone": "+91 9811122233",
            "wallet_balance": 820.00
        }
    )

    # 2. Collections
    col1, _ = Collection.objects.get_or_create(
        name="Scented Candles",
        slug="scented-candles",
        defaults={
            "description": "Aromatherapy infused luxury candles for serene living",
            "banner_image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
            "icon_symbol": "🕯️",
            "is_featured": True
        }
    )

    col2, _ = Collection.objects.get_or_create(
        name="Floral Collection",
        slug="floral-collection",
        defaults={
            "description": "Hand-poured floral bouquets of Jasmine, Rose & Lavender",
            "banner_image": "https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1200&q=80",
            "icon_symbol": "🌸",
            "is_featured": True
        }
    )

    col3, _ = Collection.objects.get_or_create(
        name="Vanilla Collection",
        slug="vanilla-collection",
        defaults={
            "description": "Warm Madagascar vanilla bean & caramel gourmand blends",
            "banner_image": "https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1200&q=80",
            "icon_symbol": "🍦",
            "is_featured": True
        }
    )

    col4, _ = Collection.objects.get_or_create(
        name="Luxury Collection",
        slug="luxury-collection",
        defaults={
            "description": "Rare botanical essences poured into crystal vessels",
            "banner_image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
            "icon_symbol": "💎",
            "is_featured": True
        }
    )

    # 3. Category
    cat_luxury, _ = Category.objects.get_or_create(name="Luxury Aromatherapy", slug="luxury-aromatherapy")

    # 4. Products
    p1, _ = Product.objects.get_or_create(
        slug="velvet-amber-smoked-oud",
        defaults={
            "name": "Velvet Amber & Smoked Oud",
            "tagline": "Deep resinous wood with a glowing honey warm core",
            "price": 899.0,
            "original_price": 1299.0,
            "category": cat_luxury,
            "wax_type": "Soy Wax",
            "wick_type": "Wooden Crackling Wick",
            "burn_time_hours": 55,
            "weight_grams": 280,
            "fragrance_strength": 4,
            "room_size": "Medium (Living Room)",
            "is_best_seller": True,
            "stock": 45,
            "description": "An intoxicating blend crafted to evoke warm fireside evenings."
        }
    )
    p1.collections.add(col1, col4)

    p2, _ = Product.objects.get_or_create(
        slug="madagascar-vanilla-caramel",
        defaults={
            "name": "Madagascar Vanilla & Salted Caramel",
            "tagline": "Rich gourmand sweetness with warm amber resin base",
            "price": 749.0,
            "original_price": 999.0,
            "category": cat_luxury,
            "wax_type": "Soy Wax",
            "wick_type": "Cotton Wick",
            "burn_time_hours": 45,
            "weight_grams": 220,
            "fragrance_strength": 5,
            "room_size": "Small (Bedroom)",
            "is_best_seller": True,
            "stock": 4,  # Low stock alert!
            "description": "Indulgent Madagascar bourbon vanilla swirled with buttery sea-salt caramel."
        }
    )
    p2.collections.add(col1, col3)

    p3, _ = Product.objects.get_or_create(
        slug="french-lavender-chamomile",
        defaults={
            "name": "French Lavender & Blue Chamomile",
            "tagline": "Soothing herbal tranquility for deep restful sleep",
            "price": 799.0,
            "original_price": 1099.0,
            "category": cat_luxury,
            "wax_type": "Beeswax",
            "wick_type": "Cotton Wick",
            "burn_time_hours": 50,
            "weight_grams": 250,
            "fragrance_strength": 3,
            "room_size": "Medium (Living Room)",
            "is_best_seller": False,
            "stock": 18,
            "description": "Calming French lavender fields combined with blue chamomile essential oils."
        }
    )
    p3.collections.add(col1, col2)

    p4, _ = Product.objects.get_or_create(
        slug="midnight-jasmine-tuberose",
        defaults={
            "name": "Midnight Jasmine & Royal Tuberose",
            "tagline": "Exotic night-blooming white flowers in crystal vessel",
            "price": 1299.0,
            "original_price": 1699.0,
            "category": cat_luxury,
            "wax_type": "Coconut Wax",
            "wick_type": "Wooden Crackling Wick",
            "burn_time_hours": 60,
            "weight_grams": 320,
            "fragrance_strength": 5,
            "room_size": "Large (Open Space)",
            "is_best_seller": True,
            "stock": 0,  # Out of stock alert!
            "description": "Opulent Indian jasmine Sambac hand-harvested at midnight with tuberose."
        }
    )
    p4.collections.add(col2, col4)

    # 5. Real Orders
    o1, _ = Order.objects.get_or_create(
        order_number="ORD-84920",
        defaults={
            "customer_name": "Priya Sharma",
            "customer_email": "priya.sharma@example.com",
            "phone": "+91 9820011223",
            "total_amount": 2497.0,
            "status": "DELIVERED",
            "is_gift_wrapped": True,
            "gift_message": "Happy Birthday!"
        }
    )
    OrderItem.objects.get_or_create(order=o1, product=p1, defaults={"quantity": 2, "price": 899.0})
    OrderItem.objects.get_or_create(order=o1, product=p2, defaults={"quantity": 1, "price": 749.0})

    o2, _ = Order.objects.get_or_create(
        order_number="ORD-84921",
        defaults={
            "customer_name": "Rahul Verma",
            "customer_email": "rahul.verma@example.com",
            "phone": "+91 9833344556",
            "total_amount": 1598.0,
            "status": "SHIPPED",
            "is_gift_wrapped": False
        }
    )
    OrderItem.objects.get_or_create(order=o2, product=p3, defaults={"quantity": 2, "price": 799.0})

    o3, _ = Order.objects.get_or_create(
        order_number="ORD-84922",
        defaults={
            "customer_name": "Ananya Roy",
            "customer_email": "ananya.roy@example.com",
            "phone": "+91 9811122233",
            "total_amount": 2598.0,
            "status": "PENDING",
            "is_gift_wrapped": True
        }
    )
    OrderItem.objects.get_or_create(order=o3, product=p4, defaults={"quantity": 2, "price": 1299.0})

    # 6. CMS Settings Initialization
    SiteSettings.objects.get_or_create(
        id=1,
        defaults={
            "site_name": "The Candle Lab",
            "tagline": "Crafted To Glow — Luxury Hand-Poured Aromatherapy",
            "support_email": "support@candlelab.in",
            "support_phone": "+91 9876543210",
            "store_address": "Atelier 4B, Industrial Estate, Lower Parel, Mumbai 400013",
            "currency_symbol": "₹",
            "currency_code": "INR"
        }
    )

    ThemeSettings.objects.get_or_create(
        id=1,
        defaults={
            "primary_color": "#2563EB",
            "secondary_color": "#EFF6FF",
            "accent_color": "#3B82F6",
            "background_color": "#F8FAFC",
            "surface_color": "#FFFFFF",
            "text_primary": "#0F172A",
            "text_secondary": "#475569",
            "border_radius": "12px",
            "font_family": "Inter, sans-serif",
            "dark_mode_enabled": False
        }
    )

    CheckoutSettings.objects.get_or_create(
        id=1,
        defaults={
            "min_order_amount": 299.0,
            "max_order_amount": 100000.0,
            "free_shipping_threshold": 999.0,
            "standard_shipping_charge": 99.0,
            "cod_charge": 49.0,
            "cod_enabled": True,
            "guest_checkout_enabled": True,
            "otp_verification_required": True,
            "gift_wrap_charge": 50.0
        }
    )

    SearchConfig.objects.get_or_create(
        id=1,
        defaults={
            "popular_searches": "Soy Wax, Oud, Amber, Vanilla, Gift Sets",
            "trending_searches": "Velvet Amber, Lavender Sleep Candle, Midnight Jasmine"
        }
    )

    # 7. Marketing Rules & Coupons

    MarketingRule.objects.get_or_create(
        title="Luxury Festive BOGO Deal",
        defaults={
            "rule_type": "BOGO",
            "discount_percent": 20,
            "is_active": True
        }
    )

    Coupon.objects.get_or_create(
        code="LUXURY20",
        defaults={
            "discount_type": "Percentage",
            "value": 20.0,
            "min_spend": 1499.0,
            "usage_limit": 500,
            "times_used": 142,
            "status": "Active"
        }
    )

    Coupon.objects.get_or_create(
        code="FLAT300",
        defaults={
            "discount_type": "Fixed",
            "value": 300.0,
            "min_spend": 1999.0,
            "usage_limit": 200,
            "times_used": 89,
            "status": "Active"
        }
    )

    print("Database successfully seeded with real production data!")

if __name__ == '__main__':
    seed()

