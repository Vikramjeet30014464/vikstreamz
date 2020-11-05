from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Categories4LiveTv(models.Model):
    Category = models.CharField(max_length=50, blank=False, default='News')

    def __str__(self):
        return self.Category


class Categories4Movie(models.Model):
    Category = models.CharField(max_length=50, blank=False, default='Drama')

    def __str__(self):
        return self.Category


class Categories4TvShow(models.Model):
    Category = models.CharField(max_length=50, blank=False, default='Science')

    def __str__(self):
        return self.Category


class Language(models.Model):
    Language = models.CharField(max_length=30, blank=False, default='English')

    def __str__(self):
        return self.Language


class LiveTV(models.Model):
    channelName = models.CharField(max_length=30, blank=False, default='channel',unique=True)
    # poster = models.CharField(max_length=100, blank=False, default='/static/images/aajtak.png')
    poster = models.ImageField(upload_to='LiveTV/images/')
    channelURL = models.CharField(max_length=500, blank=False,
                                  default='https://aajtakhdlive-amd.akamaized.net/hls/live/2014415-b/aajtakhd/aajtakhdlive/aajtakhd_5/chunklist.m3u8')

    # important to learn ForeignKey concept
    category = models.ForeignKey(Categories4LiveTv, on_delete=models.CASCADE, default=1)
    Language = models.ForeignKey(Language, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.channelName


class TvShow(models.Model):
    ShowName = models.CharField(max_length=30, blank=False, default='channel', unique=True)
    poster = models.ImageField(upload_to='TvShow/images/')
    description = models.TextField(max_length=5000, blank=True, default='Show description')
    # showURL = models.CharField(max_length=500, blank=False,null=True)


    category = models.ForeignKey(Categories4TvShow, on_delete=models.CASCADE, default=1)
    Language = models.ForeignKey(Language, on_delete=models.CASCADE, default=1)
    ratings =  models.FloatField(null=True, blank=True, default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    def __str__(self):
        return self.ShowName


class Movie(models.Model):
    MovieName = models.CharField(max_length=30, blank=False, default='Movie',unique=True)
    poster = models.ImageField(upload_to='Movie/images/')
    MovieURL = models.CharField(max_length=500, blank=False,
                                default='https://aajtakhdlive-amd.akamaized.net/hls/live/2014415-b/aajtakhd/aajtakhdlive/aajtakhd_5/chunklist.m3u8')

    # important to learn ForeignKey concept
    category = models.ForeignKey(Categories4Movie, on_delete=models.CASCADE, default=1)
    Language = models.ForeignKey(Language, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.MovieName


class FrontView_LiveTV(models.Model):
    LiveTV           = models.ForeignKey(LiveTV, on_delete=models.PROTECT, default=1)

    def __str__(self):
        return str(self.LiveTV.channelName)

class FrontView_TVSHOW(models.Model):
    TvShow           = models.ForeignKey(TvShow, on_delete=models.PROTECT, default=1)

    def __str__(self):
        return str(self.TvShow.ShowName)


class FrontView_MOVIE(models.Model):
    Movie           = models.ForeignKey(Movie, on_delete=models.PROTECT, default=1)

    def __str__(self):
        return str(self.Movie.MovieName)



class TvShowSeason(models.Model):
    Season = models.PositiveSmallIntegerField(validators=[MaxValueValidator(20)])

    def __str__(self):
        return str(self.Season)
    
class TvShowEpisode(models.Model):

    SelectShow = models.ForeignKey(TvShow, on_delete=models.CASCADE, default=1)
    SelectSeason = models.ForeignKey(TvShowSeason, on_delete=models.CASCADE, default=1)

    Ep1URL = models.CharField(max_length=500, blank=True, default='')
    Ep2URL = models.CharField(max_length=500, blank=True, default='')
    Ep3URL = models.CharField(max_length=500, blank=True, default='')
    Ep4URL = models.CharField(max_length=500, blank=True, default='')
    Ep5URL = models.CharField(max_length=500, blank=True, default='')
    Ep6URL = models.CharField(max_length=500, blank=True, default='')
    Ep7URL = models.CharField(max_length=500, blank=True, default='')
    Ep8URL = models.CharField(max_length=500, blank=True, default='')
    Ep9URL = models.CharField(max_length=500, blank=True, default='')
    Ep10URL = models.CharField(max_length=500, blank=True, default='')
    Ep11URL = models.CharField(max_length=500, blank=True, default='')
    Ep12URL = models.CharField(max_length=500, blank=True, default='')
    Ep13URL = models.CharField(max_length=500, blank=True, default='')
    Ep14URL = models.CharField(max_length=500, blank=True, default='')
    Ep15URL = models.CharField(max_length=500, blank=True, default='')
    Ep16URL = models.CharField(max_length=500, blank=True, default='')
    Ep17URL = models.CharField(max_length=500, blank=True, default='')
    Ep18URL = models.CharField(max_length=500, blank=True, default='')
    Ep19URL = models.CharField(max_length=500, blank=True, default='')
    Ep20URL = models.CharField(max_length=500, blank=True, default='')

    def __str__(self):
        return str(self.SelectShow.ShowName)