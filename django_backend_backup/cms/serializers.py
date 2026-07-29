from rest_framework import serializers
from .models import (
    HeroBanner, AnnouncementBar, PromoPopup, FAQ, BlogArticle,
    SiteSettings, ThemeSettings, CheckoutSettings, SearchConfig
)

class HeroBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroBanner
        fields = '__all__'

class AnnouncementBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementBar
        fields = '__all__'

class PromoPopupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoPopup
        fields = '__all__'

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class BlogArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogArticle
        fields = '__all__'

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class ThemeSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeSettings
        fields = '__all__'

class CheckoutSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckoutSettings
        fields = '__all__'

class SearchConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchConfig
        fields = '__all__'

