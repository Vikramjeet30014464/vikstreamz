# Generated by Django 2.2 on 2020-10-06 11:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vikstreamz', '0005_auto_20201006_1627'),
    ]

    operations = [
        migrations.RenameField(
            model_name='livetv',
            old_name='posterLocation',
            new_name='poster',
        ),
    ]
