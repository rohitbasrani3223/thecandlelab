from django.db import models
from django.utils.text import slugify

class Collection(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    banner_image = models.URLField(blank=True, null=True)
    icon_symbol = models.CharField(max_length=20, default="🕯️")
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    WAX_CHOICES = [
        ('Soy Wax', 'Soy Wax'),
        ('Beeswax', 'Beeswax'),
        ('Coconut Wax', 'Coconut Wax'),
        ('Paraffin Blend', 'Paraffin Blend'),
    ]
    WICK_CHOICES = [
        ('Wooden Crackling Wick', 'Wooden Crackling Wick'),
        ('Cotton Wick', 'Cotton Wick'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    rating = models.FloatField(default=5.0)
    reviews_count = models.IntegerField(default=0)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    collections = models.ManyToManyField(Collection, related_name='products', blank=True)

    wax_type = models.CharField(max_length=50, choices=WAX_CHOICES, default='Soy Wax')
    wick_type = models.CharField(max_length=50, choices=WICK_CHOICES, default='Wooden Crackling Wick')
    burn_time_hours = models.IntegerField(default=50)
    weight_grams = models.IntegerField(default=250)

    top_notes = models.JSONField(default=list)
    middle_notes = models.JSONField(default=list)
    base_notes = models.JSONField(default=list)

    fragrance_strength = models.IntegerField(default=4) # 1-5 scale
    room_size = models.CharField(max_length=50, default="Medium (Living Room)")

    is_vegan = models.BooleanField(default=True)
    is_handmade = models.BooleanField(default=True)
    is_eco_friendly = models.BooleanField(default=True)
    is_best_seller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)

    stock = models.IntegerField(default=50)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    verified_purchase = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.product.name} ({self.rating} stars)"
