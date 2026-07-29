from rest_framework import viewsets
from .models import Tenant, PluginExtension, PluginInstallation, FeatureFlag
from .serializers import (
    TenantSerializer, PluginExtensionSerializer,
    PluginInstallationSerializer, FeatureFlagSerializer
)

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer

class PluginExtensionViewSet(viewsets.ModelViewSet):
    queryset = PluginExtension.objects.all()
    serializer_class = PluginExtensionSerializer

class PluginInstallationViewSet(viewsets.ModelViewSet):
    queryset = PluginInstallation.objects.all()
    serializer_class = PluginInstallationSerializer

class FeatureFlagViewSet(viewsets.ModelViewSet):
    queryset = FeatureFlag.objects.all()
    serializer_class = FeatureFlagSerializer
