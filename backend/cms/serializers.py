from rest_framework import serializers
from .models import HeroBanner, AnnouncementBar, PromoPopup, FAQ, BlogArticle

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
