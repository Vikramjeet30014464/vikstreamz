from rest_framework import serializers
from vikstreamz.models import *
from django.db.models import Q

class LiveTV_Serializer(serializers.ModelSerializer):
    class Meta:
        model = LiveTV
        fields = '__all__'


class TV_Show_Serializer(serializers.ModelSerializer):
    class Meta:
        model = TvShow
        fields = '__all__'


class Movie_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class Movie_filter_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class TvShowEpisode_Serializer(serializers.ModelSerializer):
    class Meta:
        model = TvShowEpisode
        fields = '__all__'

