from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Collection, Category, Product, Review
from .serializers import CollectionSerializer, CategorySerializer, ProductSerializer, ReviewSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    """
    API ViewSet supporting full dynamic CRUD operations for Collections
    Endpoints:
    - GET /api/v1/collections/ (List all collections)
    - POST /api/v1/collections/ (Create collection)
    - GET /api/v1/collections/{id}/ (Detail)
    - PUT / PATCH /api/v1/collections/{id}/ (Update)
    - DELETE /api/v1/collections/{id}/ (Delete)
    """
    queryset = Collection.objects.all().order_by('-created_at')
    serializer_class = CollectionSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

    @action(detail=False, methods=['post'])
    def fragrance_quiz_match(self, request):
        """
        AI Fragrance Quiz Scent Recommendation Engine Endpoint
        """
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
