from django.db import models

class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    sku_capacity = models.IntegerField(default=5000)

    def __str__(self):
        return f"{self.name} ({self.city})"

class ShipmentTracking(models.Model):
    COURIER_CHOICES = [
        ('Shiprocket', 'Shiprocket Express'),
        ('Delhivery', 'Delhivery Priority'),
        ('BlueDart', 'BlueDart Premium'),
        ('DTDC', 'DTDC Express'),
    ]

    order_number = models.CharField(max_length=50, unique=True)
    waybill_number = models.CharField(max_length=100, unique=True)
    courier_partner = models.CharField(max_length=50, choices=COURIER_CHOICES, default='Shiprocket')
    current_status = models.CharField(max_length=100, default='Dispatched from Atelier Warehouse')
    estimated_delivery = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.courier_partner} - Waybill {self.waybill_number}"

class AuditLog(models.Model):
    action = models.CharField(max_length=200)
    user_email = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} by {self.user_email}"
