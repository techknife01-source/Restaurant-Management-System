from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0002_bill_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='order_type',
            field=models.CharField(choices=[('DINE_IN', 'Dine-in'), ('PARCEL', 'Parcel')], default='DINE_IN', max_length=10),
        ),
        migrations.AddField(
            model_name='order',
            name='delivery_address',
            field=models.CharField(blank=True, max_length=255, default=''),
        ),
    ]
