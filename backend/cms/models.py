from django.db import models

class HeroBanner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    cta_text = models.CharField(max_length=50, default="Shop Now")
    cta_link = models.CharField(max_length=200, default="#shop-catalog")
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=1)

    def __str__(self):
        return self.title

class AnnouncementBar(models.Model):
    text = models.CharField(max_length=255)
    link = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.text

class PromoPopup(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    coupon_code = models.CharField(max_length=30, default="GLOW15")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.CharField(max_length=50, default="General")
    display_order = models.IntegerField(default=1)

    def __str__(self):
        return self.question

class BlogArticle(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    content = models.TextField()
    banner_image = models.URLField(blank=True)
    author = models.CharField(max_length=100, default="The Candle Lab Atelier")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=150, default="The Candle Lab")
    tagline = models.CharField(max_length=255, default="Artisanal Luxury Candles & Fragrances")
    logo_url = models.URLField(blank=True, default="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=80")
    dark_logo_url = models.URLField(blank=True, default="")
    favicon_url = models.URLField(blank=True, default="")
    support_email = models.CharField(max_length=100, default="care@thecandlelab.in")
    support_phone = models.CharField(max_length=50, default="+91 98765 43210")
    store_address = models.TextField(default="108 Atelier Avenue, Cyber City, HR 122002")
    social_instagram = models.CharField(max_length=200, default="https://instagram.com/thecandlelab")
    social_facebook = models.CharField(max_length=200, default="https://facebook.com/thecandlelab")
    social_whatsapp = models.CharField(max_length=50, default="+919876543210")
    currency_symbol = models.CharField(max_length=10, default="₹")
    currency_code = models.CharField(max_length=10, default="INR")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.site_name} Configuration"

class ThemeSettings(models.Model):
    primary_color = models.CharField(max_length=20, default="#d97706")
    secondary_color = models.CharField(max_length=20, default="#7c2d12")
    accent_color = models.CharField(max_length=20, default="#fbbf24")
    background_color = models.CharField(max_length=20, default="#0f172a")
    surface_color = models.CharField(max_length=20, default="#1e293b")
    text_primary = models.CharField(max_length=20, default="#f8fafc")
    text_secondary = models.CharField(max_length=20, default="#94a3b8")
    border_radius = models.CharField(max_length=20, default="12px")
    font_family = models.CharField(max_length=100, default="Inter, sans-serif")
    dark_mode_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Theme Settings"

class CheckoutSettings(models.Model):
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=399.00)
    max_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=100000.00)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=1499.00)
    standard_shipping_charge = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    cod_charge = models.DecimalField(max_digits=10, decimal_places=2, default=49.00)
    cod_enabled = models.BooleanField(default=True)
    guest_checkout_enabled = models.BooleanField(default=True)
    otp_verification_required = models.BooleanField(default=False)
    gift_wrap_charge = models.DecimalField(max_digits=10, decimal_places=2, default=49.00)
    handling_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Checkout Settings"

class SearchConfig(models.Model):
    popular_searches = models.TextField(default="Lavender, Soy Wax, Scented Pillars, Vanilla Dream, Aromatherapy")
    trending_searches = models.TextField(default="Midnight Jasmine, Rose Garden, Oud Wood")
    synonyms_json = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Search Engine Configuration"

