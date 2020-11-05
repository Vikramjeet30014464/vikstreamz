from django.contrib import admin
from .models import *

admin.site.site_header = 'Vik-Streamz Admin'
# Register your models here.
admin.site.register(LiveTV)

admin.site.register(TvShow)
admin.site.register(TvShowSeason)
admin.site.register(TvShowEpisode)


admin.site.register(Movie)

admin.site.register(Language)

admin.site.register(Categories4LiveTv)
admin.site.register(Categories4TvShow)
admin.site.register(Categories4Movie)

admin.site.register(FrontView_LiveTV)
admin.site.register(FrontView_TVSHOW)
admin.site.register(FrontView_MOVIE)