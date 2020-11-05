"""website URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from vikstreamz import  views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('login/', views.Login),
    path('logout/', views.Logout),
    path('LiveTvfetch/', views.LiveTv_fetch),
    path('TvShowsfetch/', views.TvShowsfetch),
    path('Moviefetch/', views.Moviefetch),
    path('filterCategoryLanguageLiveTv/', views.filter_category_Lang_Tv),
    path('filterCategoryLanguageTvshows/', views.filter_category_Lang_Tv_Shows),
    path('filterCategoryLanguageMovies/', views.filter_category_Lang_Movies),
    path('search/', views.search),
    path('TvEpisodeFetchBySeasonIDshowID/', views.TvShowEpisodeFetch),
    path('TvFirstEpisodeFetchBySeasonIDshowID/', views.TvShowFirstEpisodeFetch),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)