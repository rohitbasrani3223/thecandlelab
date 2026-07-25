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
