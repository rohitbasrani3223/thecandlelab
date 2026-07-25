from rest_framework import viewsets
from .models import Warehouse, ShipmentTracking, AuditLog
from .serializers import WarehouseSerializer, ShipmentTrackingSerializer, AuditLogSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class ShipmentTrackingViewSet(viewsets.ModelViewSet):
    queryset = ShipmentTracking.objects.all()
    serializer_class = ShipmentTrackingSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-created_at')
    serializer_class = AuditLogSerializer
