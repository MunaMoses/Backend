from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterView,
    WhoAmIView,
    ProductViewSet,
    CartViewSet,
    OrderViewSet,
    ReviewViewSet,
    LoginView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'cart', CartViewSet, basename='cart')  # POST /cart/ for ordering products
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('whoami/', WhoAmIView.as_view(), name='whoami'),
    path('login/', LoginView.as_view(), name='login'),
]
