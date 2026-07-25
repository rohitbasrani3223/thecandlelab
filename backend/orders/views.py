from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from products.models import Product, Collection
from users.models import User

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_analytics_overview(request):
    """Real SQL database aggregation metrics for Admin Dashboard"""
    total_revenue = Order.objects.filter(status='DELIVERED').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_revenue = Order.objects.filter(created_at__gte=today_start).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

    return Response({
        "total_revenue": float(total_revenue),
        "today_revenue": float(today_revenue),
        "total_orders": Order.objects.count(),
        "pending_orders": Order.objects.filter(status='PENDING').count(),
        "total_customers": User.objects.filter(role='CUSTOMER').count(),
        "total_sellers": User.objects.filter(role='SELLER').count(),
        "total_products": Product.objects.count(),
        "low_stock_products": Product.objects.filter(stock__lte=5).count(),
        "total_collections": Collection.objects.count(),
    })
