from rest_framework import viewsets
from .models import HeroBanner, AnnouncementBar, PromoPopup, FAQ, BlogArticle
from .serializers import (
    HeroBannerSerializer, AnnouncementBarSerializer,
    PromoPopupSerializer, FAQSerializer, BlogArticleSerializer
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
