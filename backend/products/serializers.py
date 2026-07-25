from rest_framework import serializers
from .models import Collection, Category, Product, Review

class CollectionSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'slug', 'description', 'banner_image', 'icon_symbol', 'is_featured', 'product_count', 'created_at']

    def get_product_count(self, obj):
        return obj.products.count()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    collections_data = CollectionSerializer(source='collections', many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
