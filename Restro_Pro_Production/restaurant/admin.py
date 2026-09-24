from django.contrib import admin
from .models import Booking, Order, Bill


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'booking_date', 'booking_time', 'guest_count', 'table_number', 'phone')
    search_fields = ('customer_name', 'phone', 'table_number')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('booking', 'order_type', 'item_name', 'quantity', 'unit_price', 'delivery_address', 'created_at')
    list_filter = ('order_type',)
    search_fields = ('item_name', 'booking__customer_name', 'delivery_address')


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('booking', 'service_charge', 'tax_rate', 'grand_total', 'created_at')
    search_fields = ('booking__customer_name',)
