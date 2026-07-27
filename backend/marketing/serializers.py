from rest_framework import serializers
from .models import FlashSale, MarketingRule, Coupon

class FlashSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashSale
        fields = '__all__'

class MarketingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingRule
        fields = '__all__'

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

