from rest_framework import serializers
from .models import Collection, Category, Product, ProductHistory, Review



class CollectionSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'slug', 'description', 'banner_image', 'icon_symbol', 'is_featured', 'product_count', 'created_at']

    def get_product_count(self, obj):
        return obj.products.count()

class ProductHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductHistory
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()

class ProductSerializer(serializers.ModelSerializer):
    collections_data = CollectionSerializer(source='collections', many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    collection_slugs = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_collection_slugs(self, obj):
        return [c.slug for c in obj.collections.all()]

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

