from django.db import models

class Tenant(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True)
    brand_logo = models.URLField(blank=True)
    custom_domain = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PluginExtension(models.Model):
    name = models.CharField(max_length=100)
    plugin_key = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50, default="Marketing")
    version = models.CharField(max_length=20, default="1.0.0")
    icon_symbol = models.CharField(max_length=20, default="🔌")
    description = models.TextField()
    is_installed_by_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class PluginInstallation(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='plugins')
    plugin = models.ForeignKey(PluginExtension, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    settings = models.JSONField(default=dict, blank=True)
    installed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.plugin.name}"

class FeatureFlag(models.Model):
    key = models.CharField(max_length=100, unique=True) # e.g., '3D_CUSTOMIZER', 'AI_CONCIERGE'
    description = models.CharField(max_length=255, blank=True)
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.key} ({'ON' if self.is_enabled else 'OFF'})"
