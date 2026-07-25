from django.test import TestCase
from operations.models import Warehouse, ShipmentTracking

class OperationsTests(TestCase):
    def setUp(self):
        self.warehouse = Warehouse.objects.create(name="Mumbai Atelier Hub", city="Mumbai", sku_capacity=5000)
        self.tracking = ShipmentTracking.objects.create(
            order_number="TCL-1001",
            waybill_number="SR-9482103859",
            courier_partner="Shiprocket"
        )

    def test_warehouse(self):
        self.assertEqual(self.warehouse.city, "Mumbai")

    def test_tracking(self):
        self.assertEqual(self.tracking.courier_partner, "Shiprocket")
