from decimal import Decimal
from rest_framework import serializers
from .models import Booking, Order, Bill


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate_guest_count(self, value):
        if value < 1:
            raise serializers.ValidationError('Guest count must be at least 1.')
        return value

    def validate_table_number(self, value):
        if value not in range(1, 9):
            raise serializers.ValidationError('Please choose a table from 1 to 8.')
        return value


class OrderSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be at least 1.')
        return value

    def validate_unit_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Unit price cannot be negative.')
        return value

    class Meta:
        model = Order
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'
