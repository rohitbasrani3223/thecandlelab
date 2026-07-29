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

import csv
from django.http import HttpResponse
from rest_framework.decorators import action
from django.db.models import Q

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        status_param = self.request.query_params.get('status')

        if search:
            qs = qs.filter(
                Q(order_number__icontains=search) |
                Q(customer_name__icontains=search) |
                Q(customer_email__icontains=search) |
                Q(phone__icontains=search)
            )
        if status_param:
            qs = qs.filter(status__iexact=status_param)

        return qs

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        courier = request.data.get('courier')
        tracking = request.data.get('tracking_number')

        if new_status:
            order.status = new_status
        if courier:
            order.courier = courier
        if tracking:
            order.tracking_number = tracking

        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def export(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['Order #', 'Customer Name', 'Email', 'Phone', 'Total Amount', 'Status', 'Gift Wrapped', 'Created At'])

        for o in self.get_queryset():
            writer.writerow([
                o.order_number, o.customer_name, o.customer_email, o.phone,
                o.total_amount, o.status, o.is_gift_wrapped, o.created_at.strftime('%Y-%m-%d %H:%M')
            ])

        return response


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
