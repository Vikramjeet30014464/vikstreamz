# Generated by Django 2.2 on 2020-10-09 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vikstreamz', '0009_auto_20201008_2058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='MovieName',
            field=models.CharField(default='Movie', max_length=30),
        ),
    ]
