from decimal import Decimal
from django.shortcuts import render
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking, Order, Bill
from .serializers import BookingSerializer, OrderSerializer, BillSerializer


def home(request):
    message = None
    message_type = 'success'

    if request.method == 'POST':
        try:
            customer_name = request.POST.get('customer_name', '').strip()
            phone = request.POST.get('phone', '').strip()
            booking_date = request.POST.get('booking_date')
            booking_time = request.POST.get('booking_time')
            guest_count = int(request.POST.get('guest_count') or 1)
            table_number = int(request.POST.get('table_number') or 1)
            special_request = request.POST.get('special_request', '').strip()

            if not all([customer_name, phone, booking_date, booking_time]):
                raise ValueError('Please fill in all required booking fields.')
            if guest_count < 1:
                raise ValueError('Guest count must be at least 1.')
            if table_number not in range(1, 9):
                raise ValueError('Please choose a table from 1 to 8.')

            booking = Booking.objects.create(
                customer_name=customer_name, phone=phone, booking_date=booking_date,
                booking_time=booking_time, guest_count=guest_count,
                table_number=table_number, special_request=special_request,
            )

            item_name = request.POST.get('item_name', '').strip()
            order_type = request.POST.get('order_type', Order.DINE_IN)
            if order_type not in {Order.DINE_IN, Order.PARCEL}:
                raise ValueError('Invalid order type.')
            quantity = int(request.POST.get('quantity') or 1)
            unit_price = Decimal(request.POST.get('unit_price') or '0')
            delivery_address = request.POST.get('delivery_address', '').strip()

            if item_name:
                if quantity < 1 or unit_price < 0:
                    raise ValueError('Quantity and price must be valid.')
                if order_type == Order.PARCEL and not delivery_address:
                    raise ValueError('Delivery address is required for parcel orders.')
                Order.objects.create(
                    booking=booking, order_type=order_type, delivery_address=delivery_address,
                    item_name=item_name, quantity=quantity, unit_price=unit_price,
                )
                Bill.generate_for_booking(booking)
                message = 'Reservation and order saved successfully.'
            else:
                message = 'Reservation saved successfully.'
        except (ValueError, TypeError, ArithmeticError) as exc:
            message = str(exc) or 'Unable to save the reservation. Please check all fields and try again.'
            message_type = 'error'
        except Exception:
            message = 'Unable to save the reservation. Please check all fields and try again.'
            message_type = 'error'

    bookings = Booking.objects.all().order_by('-created_at')
    return render(request, 'restaurant/index.html', {
        'bookings': bookings, 'message': message, 'message_type': message_type,
    })


def menu(request):
    return render(request, 'restaurant/menu.html')


def checkout(request):
    return render(request, 'restaurant/checkout.html')


def records(request):
    dine_in_orders = Order.objects.filter(order_type=Order.DINE_IN).order_by('-created_at')
    parcel_orders = Order.objects.filter(order_type=Order.PARCEL).order_by('-created_at')
    dine_in_bookings = Booking.objects.filter(orders__order_type=Order.DINE_IN).distinct().order_by('-created_at')
    bills = Bill.objects.all().order_by('-created_at')
    return render(request, 'restaurant/records.html', {
        'dine_in_bookings': dine_in_bookings,
        'dine_in_orders': dine_in_orders,
        'parcel_orders': parcel_orders,
        'bills': bills,
    })


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'])
    def generate_bill(self, request, pk=None):
        booking = self.get_object()
        bill = Bill.generate_for_booking(booking)
        serializer = BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        order = serializer.save()
        Bill.generate_for_booking(order.booking)

    def perform_update(self, serializer):
        order = serializer.save()
        Bill.generate_for_booking(order.booking)

    def perform_destroy(self, instance):
        booking = instance.booking
        super().perform_destroy(instance)
        Bill.generate_for_booking(booking)


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all().order_by('-created_at')
    serializer_class = BillSerializer
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
