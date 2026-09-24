from django.urls import path
from .views import home, menu, records, checkout

urlpatterns = [
    path('', home, name='home'),
    path('menu/', menu, name='menu'),
    path('checkout/', checkout, name='checkout'),
    path('records/', records, name='records'),
]
