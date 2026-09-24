"""
URL configuration for restaurant_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from restaurant.views import BookingViewSet, OrderViewSet, BillViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api/bookings', BookingViewSet, basename='booking')
router.register(r'api/orders', OrderViewSet, basename='order')
router.register(r'api/bills', BillViewSet, basename='bill')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('restaurant.urls')),
    path('', include(router.urls)),
]
