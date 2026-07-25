from django.test import TestCase
from tenants.models import Tenant, FeatureFlag, PluginExtension

class TenantsTests(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="The Candle Lab", slug="the-candle-lab")
        self.flag = FeatureFlag.objects.create(key="3D_CUSTOMIZER", is_enabled=True)

    def test_tenant_creation(self):
        self.assertEqual(self.tenant.slug, "the-candle-lab")

    def test_feature_flag(self):
        self.assertTrue(self.flag.is_enabled)
