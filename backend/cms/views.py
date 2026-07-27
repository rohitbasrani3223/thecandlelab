from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import (
    HeroBanner, AnnouncementBar, PromoPopup, FAQ, BlogArticle,
    SiteSettings, ThemeSettings, CheckoutSettings, SearchConfig
)
from .serializers import (
    HeroBannerSerializer, AnnouncementBarSerializer,
    PromoPopupSerializer, FAQSerializer, BlogArticleSerializer,
    SiteSettingsSerializer, ThemeSettingsSerializer,
    CheckoutSettingsSerializer, SearchConfigSerializer
)

class HeroBannerViewSet(viewsets.ModelViewSet):
    queryset = HeroBanner.objects.all().order_by('display_order')
    serializer_class = HeroBannerSerializer

class AnnouncementBarViewSet(viewsets.ModelViewSet):
    queryset = AnnouncementBar.objects.all()
    serializer_class = AnnouncementBarSerializer

class PromoPopupViewSet(viewsets.ModelViewSet):
    queryset = PromoPopup.objects.all()
    serializer_class = PromoPopupSerializer

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all().order_by('display_order')
    serializer_class = FAQSerializer

class BlogArticleViewSet(viewsets.ModelViewSet):
    queryset = BlogArticle.objects.all().order_by('-created_at')
    serializer_class = BlogArticleSerializer

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

class ThemeSettingsViewSet(viewsets.ModelViewSet):
    queryset = ThemeSettings.objects.all()
    serializer_class = ThemeSettingsSerializer

class CheckoutSettingsViewSet(viewsets.ModelViewSet):
    queryset = CheckoutSettings.objects.all()
    serializer_class = CheckoutSettingsSerializer

class SearchConfigViewSet(viewsets.ModelViewSet):
    queryset = SearchConfig.objects.all()
    serializer_class = SearchConfigSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def global_store_config(request):
    """
    Unified cached API endpoint returning all dynamic configurations for Frontend hydration.
    Zero hardcoded values required on frontend.
    """
    site_obj, _ = SiteSettings.objects.get_or_create(id=1)
    theme_obj, _ = ThemeSettings.objects.get_or_create(id=1)
    checkout_obj, _ = CheckoutSettings.objects.get_or_create(id=1)
    search_obj, _ = SearchConfig.objects.get_or_create(id=1)

    announcements = AnnouncementBar.objects.filter(is_active=True)
    popups = PromoPopup.objects.filter(is_active=True)
    hero_banners = HeroBanner.objects.filter(is_active=True).order_by('display_order')

    return Response({
        "site": SiteSettingsSerializer(site_obj).data,
        "theme": ThemeSettingsSerializer(theme_obj).data,
        "checkout": CheckoutSettingsSerializer(checkout_obj).data,
        "search": SearchConfigSerializer(search_obj).data,
        "announcements": AnnouncementBarSerializer(announcements, many=True).data,
        "popups": PromoPopupSerializer(popups, many=True).data,
        "hero_banners": HeroBannerSerializer(hero_banners, many=True).data,
    })

