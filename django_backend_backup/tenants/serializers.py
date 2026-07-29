from rest_framework import serializers
from .models import Tenant, PluginExtension, PluginInstallation, FeatureFlag

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'

class PluginExtensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PluginExtension
        fields = '__all__'

class PluginInstallationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PluginInstallation
        fields = '__all__'

class FeatureFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureFlag
        fields = '__all__'
