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
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()

class ProductSerializer(serializers.ModelSerializer):
    collections_data = CollectionSerializer(source='collections', many=True, read_only=True)
    category_name = serializers.SerializerMethodField()
    collection_slugs = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'slug': {'required': False},
        }

    def get_category_name(self, obj):
        return obj.category.name if obj.category else "Luxury Aromatherapy"

    def get_collection_slugs(self, obj):
        return [c.slug for c in obj.collections.all()]

    def create(self, validated_data):
        # Handle category by name if sent as string
        category_name = self.initial_data.get('category_name') or self.initial_data.get('category')
        if category_name and isinstance(category_name, str) and not category_name.isdigit():
            cat, _ = Category.objects.get_or_create(name=category_name)
            validated_data['category'] = cat

        # Handle collections by slug list
        collection_slugs = self.initial_data.get('collection_slugs', [])
        collections = validated_data.pop('collections', [])

        product = super().create(validated_data)

        # Set collections from slugs
        if collection_slugs:
            for slug in collection_slugs:
                col = Collection.objects.filter(slug=slug).first()
                if col:
                    product.collections.add(col)
        elif collections:
            product.collections.set(collections)

        # Auto generate SKU
        if not product.sku:
            product.sku = f"SKU-{product.id:04d}"
            product.save(update_fields=['sku'])

        return product

    def update(self, instance, validated_data):
        # Handle category by name
        category_name = self.initial_data.get('category_name') or self.initial_data.get('category')
        if category_name and isinstance(category_name, str) and not category_name.isdigit():
            cat, _ = Category.objects.get_or_create(name=category_name)
            validated_data['category'] = cat

        return super().update(instance, validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
