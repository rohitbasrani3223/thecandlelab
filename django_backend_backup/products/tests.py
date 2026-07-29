from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Collection, Category, Product

class CandleLabBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.collection = Collection.objects.create(
            name="Test Luxury Collection",
            slug="test-luxury-collection",
            description="Testing luxury aromas",
            icon_symbol="💎",
            is_featured=True
        )
        self.category = Category.objects.create(name="Luxury", slug="luxury")
        self.product = Product.objects.create(
            name="Test Velvet Oud",
            slug="test-velvet-oud",
            tagline="Deep resinous wood",
            price=899,
            category=self.category,
            wax_type="Soy Wax",
            wick_type="Wooden Crackling Wick",
            burn_time_hours=55,
            stock=10
        )

    def test_collections_list_api(self):
        response = self.client.get('/api/v1/collections/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data.get('results', [])), 1)

    def test_create_collection_api(self):
        data = {
            "name": "New Seasonal Collection",
            "description": "Autumn Spice",
            "icon_symbol": "🍁",
            "is_featured": True
        }
        response = self.client.post('/api/v1/collections/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Collection.objects.filter(name="New Seasonal Collection").count(), 1)

    def test_products_list_api(self):
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_fragrance_quiz_match_api(self):
        data = {"scent_family": "Luxury", "room_size": "Medium"}
        response = self.client.post('/api/v1/products/fragrance_quiz_match/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
