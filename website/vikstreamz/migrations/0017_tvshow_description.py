# Generated by Django 2.2 on 2020-10-21 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vikstreamz', '0016_auto_20201021_1753'),
    ]

    operations = [
        migrations.AddField(
            model_name='tvshow',
            name='description',
            field=models.TextField(blank=True, default='', max_length=5000),
        ),
    ]
