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
