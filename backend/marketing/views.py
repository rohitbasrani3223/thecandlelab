from rest_framework import viewsets
from .models import FlashSale, MarketingRule
from .serializers import FlashSaleSerializer, MarketingRuleSerializer

class FlashSaleViewSet(viewsets.ModelViewSet):
    queryset = FlashSale.objects.all().order_by('-start_time')
    serializer_class = FlashSaleSerializer

class MarketingRuleViewSet(viewsets.ModelViewSet):
    queryset = MarketingRule.objects.all()
    serializer_class = MarketingRuleSerializer
