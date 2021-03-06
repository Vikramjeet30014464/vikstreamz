# Generated by Django 2.2 on 2020-10-06 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vikstreamz', '0006_auto_20201006_1637'),
    ]

    operations = [
        migrations.AlterField(
            model_name='livetv',
            name='poster',
            field=models.ImageField(upload_to='LiveTV/images/'),
        ),
        migrations.AlterField(
            model_name='movie',
            name='posterLocation',
            field=models.ImageField(upload_to='Movie/images/'),
        ),
        migrations.AlterField(
            model_name='tvshow',
            name='posterLocation',
            field=models.ImageField(upload_to='TvShow/images/'),
        ),
    ]
