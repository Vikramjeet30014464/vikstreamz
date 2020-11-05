# Generated by Django 2.2 on 2020-10-06 09:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vikstreamz', '0002_frontview_movies_frontview_tvshows'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FrontView_TVSHOWS',
            new_name='FrontView_MOVIE',
        ),
        migrations.RenameModel(
            old_name='FrontView_MOVIES',
            new_name='FrontView_TVSHOW',
        ),
        migrations.RemoveField(
            model_name='frontview_movie',
            name='TvShow',
        ),
        migrations.RemoveField(
            model_name='frontview_tvshow',
            name='Movie',
        ),
        migrations.AddField(
            model_name='frontview_movie',
            name='Movie',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='vikstreamz.Movie'),
        ),
        migrations.AddField(
            model_name='frontview_tvshow',
            name='TvShow',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='vikstreamz.TvShow'),
        ),
    ]
