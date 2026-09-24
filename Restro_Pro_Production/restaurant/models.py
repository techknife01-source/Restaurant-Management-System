from decimal import Decimal
from django.db import models


class Booking(models.Model):
    customer_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    guest_count = models.PositiveIntegerField()
    table_number = models.PositiveIntegerField()
    special_request = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - Table {self.table_number}"


class Order(models.Model):
    DINE_IN = 'DINE_IN'
    PARCEL = 'PARCEL'
    ORDER_TYPES = [
        (DINE_IN, 'Dine-in'),
        (PARCEL, 'Parcel'),
    ]

    booking = models.ForeignKey(Booking, related_name='orders', on_delete=models.CASCADE)
    order_type = models.CharField(max_length=10, choices=ORDER_TYPES, default=DINE_IN)
    delivery_address = models.CharField(max_length=255, blank=True)
    item_name = models.CharField(max_length=150)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.item_name} - {self.quantity}"


class Bill(models.Model):
    booking = models.OneToOneField(Booking, related_name='bill', on_delete=models.CASCADE)
    service_charge = models.DecimalField(max_digits=8, decimal_places=2, default=10.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15.00)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def generate_for_booking(cls, booking):
        order_total = sum(order.total_price for order in booking.orders.all())
        service_charge = Decimal('10.00')
        tax_rate = Decimal('15.00')
        tax_amount = (order_total + service_charge) * tax_rate / 100
        grand_total = (order_total + service_charge + tax_amount).quantize(Decimal('0.01'))
        bill, created = cls.objects.get_or_create(
            booking=booking,
            defaults={
                'service_charge': service_charge,
                'tax_rate': tax_rate,
                'grand_total': grand_total,
            },
        )
        if not created:
            bill.service_charge = service_charge
            bill.tax_rate = tax_rate
            bill.grand_total = grand_total
            bill.save()
        return bill

    def __str__(self):
        return f"Bill for {self.booking.customer_name}"
