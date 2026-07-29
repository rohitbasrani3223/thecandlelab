from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from cms.models import HeroBanner, AnnouncementBar, FAQ

class CMSTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.banner = HeroBanner.objects.create(
            title="HANDCRAFTED TO GLOW",
            subtitle="Luxury soy candles",
            is_active=True
        )

    def test_hero_banners_api(self):
        response = self.client.get('/api/v1/cms/banners/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_faq_creation(self):
        faq = FAQ.objects.create(question="What wax is used?", answer="100% natural soy wax")
        self.assertEqual(faq.question, "What wax is used?")
