from django.urls import path
from .views import menu, records, checkout

urlpatterns = [
    path('', menu, name='home'),
    path('menu/', menu, name='menu'),
    path('checkout/', checkout, name='checkout'),
    path('records/', records, name='records'),
]
