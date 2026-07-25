from django.test import TestCase
from orders.models import Order, OrderItem
from products.models import Product, Category

class OrdersModelTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Luxury", slug="luxury")
        self.product = Product.objects.create(
            name="Velvet Oud Candle",
            price=899.00,
            category=self.category
        )
        self.order = Order.objects.create(
            order_number="TCL-1001",
            customer_name="Aarav Sharma",
            customer_email="aarav@example.com",
            phone="+919876543210",
            total_amount=899.00,
            status="PENDING",
            is_gift_wrapped=True
        )

    def test_order_creation(self):
        self.assertEqual(self.order.order_number, "TCL-1001")
        self.assertTrue(self.order.is_gift_wrapped)

    def test_order_item(self):
        item = OrderItem.objects.create(order=self.order, product=self.product, quantity=2, price=899.00)
        self.assertEqual(item.quantity, 2)
