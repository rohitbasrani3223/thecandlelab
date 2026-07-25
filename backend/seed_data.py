import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Collection, Category, Product

def seed():
    print("Seeding initial Candle Lab collections & products...")

    col1, _ = Collection.objects.get_or_create(
        name="Scented Candles",
        slug="scented-candles",
        description="Aromatherapy infused luxury candles for serene living",
        banner_image="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="🕯️",
        is_featured=True
    )

    col2, _ = Collection.objects.get_or_create(
        name="Floral Collection",
        slug="floral-collection",
        description="Hand-poured floral bouquets of Jasmine, Rose & Lavender",
        banner_image="https://images.unsplash.com/photo-1572726729207-a78d6fea73a7?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="🌸",
        is_featured=True
    )

    col3, _ = Collection.objects.get_or_create(
        name="Vanilla Collection",
        slug="vanilla-collection",
        description="Warm Madagascar vanilla bean & caramel gourmand blends",
        banner_image="https://images.unsplash.com/photo-1596435452227-886313d0130f?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="🍦",
        is_featured=True
    )

    col4, _ = Collection.objects.get_or_create(
        name="Coffee Collection",
        slug="coffee-collection",
        description="Rich roasted Arabica & dark espresso morning candles",
        banner_image="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="☕",
        is_featured=True
    )

    col5, _ = Collection.objects.get_or_create(
        name="Festive Collection",
        slug="festive-collection",
        description="Spiced cinnamon, glowing amber & holiday celebration lights",
        banner_image="https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="🎄",
        is_featured=True
    )

    col6, _ = Collection.objects.get_or_create(
        name="Gift Boxes",
        slug="gift-boxes",
        description="Curated luxury gift hampers with customized gold ribbon",
        banner_image="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="🎁",
        is_featured=True
    )

    col7, _ = Collection.objects.get_or_create(
        name="Home Decor Candles",
        slug="home-decor",
        description="Sculptural minimalist candles that double as art pieces",
        banner_image="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="🏡",
        is_featured=False
    )

    col8, _ = Collection.objects.get_or_create(
        name="Luxury Collection",
        slug="luxury-collection",
        description="Rare botanical essences poured into crystal vessels",
        banner_image="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
        icon_symbol="💎",
        is_featured=True
    )

    cat_luxury, _ = Category.objects.get_or_create(name="Luxury", slug="luxury")

    p1, _ = Product.objects.get_or_create(
        name="Velvet Amber & Smoked Oud",
        slug="velvet-amber-smoked-oud",
        tagline="Deep resinous wood with a glowing honey warm core",
        price=899,
        original_price=1299,
        category=cat_luxury,
        wax_type="Soy Wax",
        wick_type="Wooden Crackling Wick",
        burn_time_hours=55,
        weight_grams=280,
        top_notes=["Golden Amber", "Bergamot Crisp"],
        middle_notes=["Smoked Oud Wood", "Wild Patchouli"],
        base_notes=["French Vanilla Bean", "Sandalwood"],
        fragrance_strength=4,
        room_size="Medium (Living Room)",
        is_best_seller=True,
        stock=45,
        description="An intoxicating blend crafted to evoke warm fireside evenings."
    )
    p1.collections.add(col1, col8)

    print("Initial seed data created successfully!")

if __name__ == '__main__':
    seed()
