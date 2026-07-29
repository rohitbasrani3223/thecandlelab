from django.test import TestCase
from django.utils import timezone
from marketing.models import FlashSale, MarketingRule

class MarketingTests(TestCase):
    def setUp(self):
        self.sale = FlashSale.objects.create(
            title="Festive Flash Sale",
            discount_percent=25,
            start_time=timezone.now(),
            end_time=timezone.now() + timezone.timedelta(days=2),
            is_active=True
        )

    def test_flash_sale(self):
        self.assertEqual(self.sale.discount_percent, 25)
        self.assertTrue(self.sale.is_active)
