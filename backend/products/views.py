import csv
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Collection, Category, Product, ProductHistory, Review
from .serializers import CollectionSerializer, CategorySerializer, ProductSerializer, ProductHistorySerializer, ReviewSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all().order_by('-created_at')
    serializer_class = CollectionSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        collection = self.request.query_params.get('collection')
        status_param = self.request.query_params.get('status')
        featured = self.request.query_params.get('featured')
        best_seller = self.request.query_params.get('best_seller')
        new_arrival = self.request.query_params.get('new_arrival')

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(tagline__icontains=search) |
                Q(description__icontains=search) |
                Q(sku__icontains=search)
            )
        if category:
            qs = qs.filter(Q(category__name__iexact=category) | Q(category__slug__iexact=category) | Q(category_id=category if category.isdigit() else None))
        if collection:
            qs = qs.filter(collections__slug__iexact=collection)
        if status_param:
            qs = qs.filter(status__iexact=status_param)
        if featured == 'true':
            qs = qs.filter(collections__is_featured=True)
        if best_seller == 'true':
            qs = qs.filter(is_best_seller=True)
        if new_arrival == 'true':
            qs = qs.filter(is_new_arrival=True)

        return qs.distinct()

    def perform_create(self, serializer):
        product = serializer.save()
        ProductHistory.objects.create(
            product=product,
            action="Created",
            changed_by="Admin",
            new_value=f"Product '{product.name}' created with price ₹{product.price}"
        )

    def perform_update(self, serializer):
        product = serializer.save()
        ProductHistory.objects.create(
            product=product,
            action="Updated",
            changed_by="Admin",
            new_value=f"Product details updated for '{product.name}'"
        )

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        product = self.get_object()
        logs = product.history_logs.all().order_by('-created_at')
        serializer = ProductHistorySerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        product = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            new_status = 'Draft' if product.status == 'Active' else 'Active'
        old_status = product.status
        product.status = new_status
        product.save()

        ProductHistory.objects.create(
            product=product,
            action="Status Changed",
            changed_by="Admin",
            old_value=old_status,
            new_value=new_status
        )

        return Response({'id': product.id, 'status': product.status}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def bulk_action(self, request):
        action_type = request.data.get('action') # 'activate', 'deactivate', 'delete'
        product_ids = request.data.get('product_ids', [])

        if not product_ids or not action_type:
            return Response({'error': 'product_ids and action required'}, status=status.HTTP_400_BAD_REQUEST)

        products = Product.objects.filter(id__in=product_ids)
        if action_type == 'activate':
            products.update(status='Active')
        elif action_type == 'deactivate':
            products.update(status='Draft')
        elif action_type == 'delete':
            products.delete()
            return Response({'message': f'Deleted {len(product_ids)} products'}, status=status.HTTP_200_OK)

        return Response({'message': f'Bulk action {action_type} applied to {products.count()} products'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def export(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'SKU', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Is Best Seller', 'Created At'])

        for p in self.get_queryset():
            writer.writerow([
                p.id, p.sku or '', p.name, p.category.name if p.category else '',
                p.price, p.stock, p.status, p.is_best_seller, p.created_at.strftime('%Y-%m-%d %H:%M')
            ])

        return response

    @action(detail=False, methods=['post'])
    def fragrance_quiz_match(self, request):
        scent_family = request.data.get('scent_family', '')
        room_size = request.data.get('room_size', '')

        queryset = self.queryset
        if scent_family:
            queryset = queryset.filter(category__name__icontains=scent_family)
        if room_size:
            queryset = queryset.filter(room_size__icontains=room_size)

        results = queryset[:3]
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

