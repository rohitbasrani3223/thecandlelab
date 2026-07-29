from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FlashSale, MarketingRule, Coupon
from .serializers import FlashSaleSerializer, MarketingRuleSerializer, CouponSerializer

class FlashSaleViewSet(viewsets.ModelViewSet):
    queryset = FlashSale.objects.all().order_by('-start_time')
    serializer_class = FlashSaleSerializer

class MarketingRuleViewSet(viewsets.ModelViewSet):
    queryset = MarketingRule.objects.all()
    serializer_class = MarketingRuleSerializer

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by('-created_at')
    serializer_class = CouponSerializer

    @action(detail=False, methods=['post'])
    def validate_code(self, request):
        code = request.data.get('code', '').strip().upper()
        spend = float(request.data.get('spend', 0.0))

        try:
            coupon = Coupon.objects.get(code__iexact=code, status='Active')
            if spend < float(coupon.min_spend):
                return Response({'valid': False, 'message': f'Minimum spend of ₹{coupon.min_spend} required for this coupon.'}, status=status.HTTP_400_BAD_REQUEST)
            
            discount = float(coupon.value) if coupon.discount_type == 'Fixed' else (spend * float(coupon.value) / 100.0)
            return Response({
                'valid': True,
                'code': coupon.code,
                'discount_type': coupon.discount_type,
                'value': float(coupon.value),
                'calculated_discount': discount,
                'message': f'Coupon {coupon.code} applied successfully!'
            }, status=status.HTTP_200_OK)
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid or expired coupon code.'}, status=status.HTTP_404_NOT_FOUND)

