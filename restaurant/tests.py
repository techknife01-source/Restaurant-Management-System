import json
from django.test import TestCase
from django.urls import reverse
from .models import Booking, Order, Bill


class BookingApiTests(TestCase):
    def test_create_booking_via_api(self):
        response = self.client.post(
            reverse('booking-list'),
            {
                'customer_name': 'Amina',
                'phone': '+971501234567',
                'booking_date': '2026-07-20',
                'booking_time': '19:30',
                'guest_count': 4,
                'table_number': 2,
                'special_request': 'Window seat',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.get().guest_count, 4)

    def test_create_order_and_bill(self):
        booking = Booking.objects.create(
            customer_name='Sam',
            phone='+971500000123',
            booking_date='2026-07-22',
            booking_time='20:00',
            guest_count=2,
            table_number=3,
        )
        order = Order.objects.create(
            booking=booking,
            item_name='Burger',
            quantity=2,
            unit_price=15.00,
        )

        self.assertEqual(order.total_price, 30.00)
        bill = Bill.generate_for_booking(booking)
        self.assertEqual(str(bill.grand_total), '46.00')

    def test_create_parcel_order_via_api_generates_bill(self):
        booking = Booking.objects.create(
            customer_name='Maya',
            phone='+971501234000',
            booking_date='2026-08-01',
            booking_time='18:00',
            guest_count=1,
            table_number=5,
        )
        payload = {
            'booking': booking.id,
            'order_type': 'PARCEL',
            'delivery_address': '123 Main Street, Dubai',
            'item_name': 'Sushi Box',
            'quantity': 3,
            'unit_price': '12.50'
        }
        response = self.client.post(
            reverse('order-list'),
            json.dumps(payload),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertEqual(order.order_type, 'PARCEL')
        self.assertEqual(order.delivery_address, '123 Main Street, Dubai')

        bill = Bill.objects.get(booking=booking)
        self.assertEqual(str(bill.grand_total), '54.62')

    def test_records_page_shows_booking_order_and_bill(self):
        booking = Booking.objects.create(
            customer_name='Noura',
            phone='+971509999888',
            booking_date='2026-08-05',
            booking_time='20:30',
            guest_count=4,
            table_number=1,
        )
        Order.objects.create(
            booking=booking,
            order_type='DINE_IN',
            item_name='Steak',
            quantity=2,
            unit_price=32.00,
        )
        Bill.generate_for_booking(booking)

        response = self.client.get(reverse('records'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Noura')
        self.assertContains(response, 'Steak')
        self.assertContains(response, 'Grand Total')

    def test_home_page_post_creates_booking(self):
        response = self.client.post(reverse('home'), {
            'customer_name': 'Sana',
            'phone': '+971501112233',
            'booking_date': '2026-08-10',
            'booking_time': '18:30',
            'guest_count': 3,
            'table_number': 4,
            'special_request': 'Corner seating',
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertContains(response, 'Reservation saved successfully.')

    def test_booking_generate_bill_api(self):
        booking = Booking.objects.create(
            customer_name='Rami',
            phone='+971501110011',
            booking_date='2026-08-12',
            booking_time='19:00',
            guest_count=2,
            table_number=2,
        )
        Order.objects.create(
            booking=booking,
            item_name='Pasta',
            quantity=2,
            unit_price=18.00,
        )

        url = f'/api/bookings/{booking.id}/generate_bill/'
        response = self.client.post(url, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Bill.objects.count(), 1)
        self.assertContains(response, 'grand_total')
        bill = Bill.objects.get(booking=booking)
        self.assertEqual(str(bill.grand_total), '52.90')
