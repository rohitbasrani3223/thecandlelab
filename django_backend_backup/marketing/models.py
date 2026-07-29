from django.db import models

class FlashSale(models.Model):
    title = models.CharField(max_length=150)
    discount_percent = models.IntegerField(default=20)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.discount_percent}% OFF)"

class MarketingRule(models.Model):
    RULE_TYPES = [
        ('BOGO', 'Buy 1 Get 1 Free'),
        ('HAPPY_HOUR', 'Happy Hour Discount'),
        ('CROSS_SELL', 'Cross Sell Bundle'),
    ]
    title = models.CharField(max_length=150)
    rule_type = models.CharField(max_length=30, choices=RULE_TYPES, default='BOGO')
    discount_percent = models.IntegerField(default=15)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.rule_type}"

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, default='Percentage') # Percentage or Fixed
    value = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)
    min_spend = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    usage_limit = models.IntegerField(default=500)
    times_used = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default='Active') # Active, Expired, Scheduled
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

