from django.test import TestCase
from django.urls import reverse
from .models import Booking, Order, Bill
from decimal import Decimal

class RestaurantTests(TestCase):
    def test_pages_load(self):
        for name in ['home','menu','checkout','records']:
            self.assertEqual(self.client.get(reverse(name)).status_code, 200)

    def test_bill_generation(self):
        b=Booking.objects.create(customer_name='Test User',phone='9999999999',booking_date='2026-09-03',booking_time='12:00',guest_count=2,table_number=1)
        Order.objects.create(booking=b,item_name='Pizza',quantity=2,unit_price=Decimal('100.00'))
        bill=Bill.generate_for_booking(b)
        self.assertGreater(bill.grand_total, Decimal('200.00'))
