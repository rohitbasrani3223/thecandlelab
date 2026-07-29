from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, jwt_login
from products.views import CollectionViewSet, CategoryViewSet, ProductViewSet, ReviewViewSet
from orders.views import OrderViewSet, OrderItemViewSet, admin_analytics_overview
from cms.views import (
    HeroBannerViewSet, AnnouncementBarViewSet, PromoPopupViewSet, FAQViewSet, BlogArticleViewSet,
    SiteSettingsViewSet, ThemeSettingsViewSet, CheckoutSettingsViewSet, SearchConfigViewSet,
    global_store_config
)
from marketing.views import FlashSaleViewSet, MarketingRuleViewSet, CouponViewSet

from operations.views import WarehouseViewSet, ShipmentTrackingViewSet, AuditLogViewSet
from tenants.views import TenantViewSet, PluginExtensionViewSet, PluginInstallationViewSet, FeatureFlagViewSet
from core.health import health_check

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'order-items', OrderItemViewSet, basename='order-item')

# CMS & Settings Endpoints
router.register(r'cms/banners', HeroBannerViewSet, basename='hero-banner')
router.register(r'cms/announcements', AnnouncementBarViewSet, basename='announcement')
router.register(r'cms/popups', PromoPopupViewSet, basename='promo-popup')
router.register(r'cms/faqs', FAQViewSet, basename='faq')
router.register(r'cms/blogs', BlogArticleViewSet, basename='blog')
router.register(r'settings/site', SiteSettingsViewSet, basename='site-settings')
router.register(r'settings/theme', ThemeSettingsViewSet, basename='theme-settings')
router.register(r'settings/checkout', CheckoutSettingsViewSet, basename='checkout-settings')
router.register(r'settings/search', SearchConfigViewSet, basename='search-config')

# Marketing Endpoints
router.register(r'marketing/flash-sales', FlashSaleViewSet, basename='flash-sale')
router.register(r'marketing/rules', MarketingRuleViewSet, basename='marketing-rule')
router.register(r'marketing/coupons', CouponViewSet, basename='coupon')

# Operations Endpoints
router.register(r'operations/warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'operations/tracking', ShipmentTrackingViewSet, basename='tracking')
router.register(r'operations/audit-logs', AuditLogViewSet, basename='audit-log')

# Tenant & Plugin SaaS Endpoints
router.register(r'tenants', TenantViewSet, basename='tenant')
router.register(r'plugins/extensions', PluginExtensionViewSet, basename='plugin-extension')
router.register(r'plugins/installations', PluginInstallationViewSet, basename='plugin-installation')
router.register(r'feature-flags', FeatureFlagViewSet, basename='feature-flag')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health-check'),
    path('api/v1/store/config/', global_store_config, name='global-store-config'),
    path('api/v1/auth/login/', jwt_login, name='jwt-login'),
    path('api/v1/admin/analytics/', admin_analytics_overview, name='admin-analytics'),
    path('api/v1/', include(router.urls)),
]

