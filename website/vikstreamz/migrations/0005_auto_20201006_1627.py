# Generated by Django 2.2 on 2020-10-06 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vikstreamz', '0004_auto_20201006_1511'),
    ]

    operations = [
        migrations.AlterField(
            model_name='livetv',
            name='posterLocation',
            field=models.ImageField(upload_to='images/'),
        ),
    ]
