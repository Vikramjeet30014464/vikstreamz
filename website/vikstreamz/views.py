from django.shortcuts import render, redirect
from rest_framework.response import Response
from django.http import request, HttpResponse
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from .models import *
from .serializer import *
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import  bleach
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from itertools import chain



# FUNCTION TO RETURN LIVETV'S AS JSON RESPONSE 
@login_required(login_url='/login/')
@api_view(['POST'])
def LiveTv_fetch(request):
    if request.method == 'POST':
        try:
            alreadyDisplayedID = int(bleach.clean(request.POST.get('id')))
            allLiveTVTableElements = LiveTV.objects.filter(Q(id__gt=alreadyDisplayedID))[:12]
            serialized = LiveTV_Serializer(allLiveTVTableElements, many=True)
            return Response(serialized.data)
        except:
            return HttpResponse('')

    if request.method == 'GET':
        return HttpResponse('Method Not Allowed')


# FUNCTION TO RETURN TVSHOWS'S AS JSON RESPONSE 
@login_required(login_url='/login/')
@api_view(['POST'])
def TvShowsfetch(request):
    if request.method == 'POST':
        try:
            alreadyDisplayedID = int(bleach.clean(request.POST.get('id')))
            allTV_ShowTableElements = TvShow.objects.filter(Q(id__gt=alreadyDisplayedID))[:8]
            serialized = TV_Show_Serializer(allTV_ShowTableElements, many=True)
            return Response(serialized.data)
        except:
            return HttpResponse('')

    if request.method == 'GET':
        return HttpResponse('Method Not Allowed')

# FUNCTION TO RETURN MOVIES'S AS JSON RESPONSE 
@login_required(login_url='/login/')
@api_view(['POST'])
def Moviefetch(request):
    if request.method == 'POST':
        try:
            alreadyDisplayedID = int(bleach.clean(request.POST.get('id')))
            allTV_ShowTableElements = Movie.objects.filter(Q(id__gt=alreadyDisplayedID))[:12]
            serialized = Movie_Serializer(allTV_ShowTableElements, many=True)
            return Response(serialized.data)
        except:
            return HttpResponse('')

    if request.method == 'GET':
        return HttpResponse('Method Not Allowed')

# FUNCTION TO RETURN SINGLE FIRST EPISODE FOR REQURESTED SHOW 
@login_required(login_url='/login/')
@api_view(['POST'])
def TvShowEpisodeFetch(request):
    if request.method == 'POST':
        try:
            showID   = int(bleach.clean(request.POST.get('showID')))
            seasonID = int(bleach.clean(request.POST.get('seasonID')))
            filterResults = TvShowEpisode.objects.filter(Q(SelectShow_id=showID) & Q(SelectSeason_id=seasonID))
            serialized = TvShowEpisode_Serializer(filterResults, many=True)
            return Response(serialized.data)
        except:
            return HttpResponse('')

    if request.method == 'GET':
        return HttpResponse('Method Not Allowed')


# FUNCTION TO RETURN SINGLE FIRST EPISODE FOR REQURESTED SHOW 
@login_required(login_url='/login/')
@api_view(['POST'])
def TvShowFirstEpisodeFetch(request):
    if request.method == 'POST':
        try:
            showID   = int(bleach.clean(request.POST.get('showID')))
            seasonID = int(bleach.clean(request.POST.get('seasonID')))
            filterResults = TvShowEpisode.objects.filter(Q(SelectShow_id=showID) & Q(SelectSeason_id=seasonID))
            serialized = TvShowEpisode_Serializer(filterResults, many=True)
            # print(serialized.data[0]['Ep1URL'])
            return Response(serialized.data[0]['Ep1URL'])
        except:
            return HttpResponse('')

    if request.method == 'GET':
        return HttpResponse('Method Not Allowed')



########################################### filters for category, language ###################################
@login_required(login_url='/login/')
@api_view(['POST'])
def filter_category_Lang_Tv(request):
    if request.method == 'POST':
        try:
            cat = bleach.clean(request.POST.get('Category'))
            lang = bleach.clean(request.POST.get('Language'))
            filterResults = LiveTV.objects.filter(Q(category__Category=cat) & Q(Language__Language=lang))
            serialized = LiveTV_Serializer(filterResults, many=True)
            return Response(serialized.data)
        except:
            return HttpResponse('')

@login_required(login_url='/login/')
@api_view(['POST'])
def filter_category_Lang_Tv_Shows(request):
    if request.method == 'POST':
        cat = bleach.clean(request.POST.get('Category'))
        lang = bleach.clean(request.POST.get('Language'))
        TvShowfilterResults = TvShow.objects.filter(Q(category__Category=cat) & Q(Language__Language=lang))        
        serialized = TV_Show_Serializer(TvShowfilterResults, many=True)
        return Response(serialized.data)

@login_required(login_url='/login/')
@api_view(['POST'])
def filter_category_Lang_Movies(request):
    if request.method == 'POST':
        try:
            cat = bleach.clean(request.POST.get('Category'))
            lang = bleach.clean(request.POST.get('Language'))
            filterResults = Movie.objects.filter(Q(category__Category=cat) & Q(Language__Language=lang))
            serialized = Movie_filter_Serializer(filterResults, many=True)
            return Response(serialized.data)
        except:
            return HttpResponse('')


################################### END_filters ###################################



################################## FRONT VIEWS returns the items which are first seen while each tab(   LITVETV, TVSHOWS, MOVIES) is clikced on mainpage ###################################

def get_FrontView_LiveTV():
    try:
        list = []
        FrontView_LiveTV_querset = FrontView_LiveTV.objects.filter(id__lte=18)
        for x in FrontView_LiveTV_querset:
            y = LiveTV.objects.get(id=x.LiveTV_id)
            list.append(y)
        return list
    except:
        return list


def get_FrontView_TvShow():
    try:
        list = []
        FrontView_TVSHOW_querset = FrontView_TVSHOW.objects.filter(id__lte=18)
        for x in FrontView_TVSHOW_querset:
            y = TvShow.objects.get(id=x.TvShow_id)
            list.append(y)
        return list
    except:
        return list


def get_FrontView_Movie():
    try:
        list = []
        FrontView_Movie_querset = FrontView_MOVIE.objects.filter(id__lte=18)
        for x in FrontView_Movie_querset:
            y = Movie.objects.get(id=x.Movie_id)
            list.append(y)
        return list
    except:
        return list


################################## END FRONT VIEWS ###################################





#THIS IS MAIN FUNCTION WHICH LOAD _0_index.html file from /website/templates/vikstreamz/ diredtory
#IT RUN FIRST AFTER SUCCESSFULL LOGIN 

def index(request):
    try:
        if request.user.is_authenticated:
            _Language = Language.objects.all()
            _Categories4LiveTv = Categories4LiveTv.objects.all()
            _Categories4Tvshows = Categories4TvShow.objects.all()
            _Categories4Movies = Categories4Movie.objects.all()
            _TvSeasons = TvShowSeason.objects.all()
            FrontView_LiveTV_querset_LIST = get_FrontView_LiveTV()
            FrontView_TvShow_querset_LIST = get_FrontView_TvShow()
            FrontView_Movie_querset_LIST = get_FrontView_Movie()


            passTotemplate = {
                "Languages": _Language,
                "Categories4LiveTv": _Categories4LiveTv,
                "Categories4Tvshows": _Categories4Tvshows,
                "Categories4Movies": _Categories4Movies,
                "TvSeasons": _TvSeasons,
                "FrontView_LiveTV_querset_LIST": FrontView_LiveTV_querset_LIST,
                "FrontView_TvShow_querset_LIST": FrontView_TvShow_querset_LIST,
                "FrontView_Movie_querset_LIST": FrontView_Movie_querset_LIST,
                "CurrentUser": request.user,
            }
            return render(request, 'vikstreamz/_0_index.html', passTotemplate)
        else:
            return redirect('/login/')
    except:
        return HttpResponse('Error Index.html')



# THIS FUNCTION IS USED TO RETURN SEARCH RESUTLS BASED ON SEARCH QUERY  FROM EITHER TAB>LIVETV,MOVIES,TVHOWS 
@api_view(['POST'])
@login_required(login_url='/login/')
def search(request):
    try:
        if request.method == 'POST' and bleach.clean(request.POST.get('Tab')) == 'LIVE-TV' and bleach.clean(request.POST.get('searchQuery')) != '':
            searchQuery = request.POST.get('searchQuery')
            filterResults = LiveTV.objects.filter(channelName__contains=searchQuery)[:5]
            serialized = LiveTV_Serializer(filterResults, many=True)
            return Response(serialized.data)

        if request.method == 'POST' and bleach.clean(request.POST.get('Tab')) == 'TV-SHOWS' and bleach.clean(request.POST.get('searchQuery')) != '':
            searchQuery = request.POST.get('searchQuery')
            filterResults = TvShow.objects.filter(ShowName__contains=searchQuery)[:5]
            serialized = TV_Show_Serializer(filterResults, many=True)
            return Response(serialized.data)

        if request.method == 'POST' and bleach.clean(request.POST.get('Tab')) == 'MOVIES' and bleach.clean(request.POST.get('searchQuery')) != '':
            searchQuery = bleach.clean(request.POST.get('searchQuery'))
            filterResults = Movie.objects.filter(MovieName__contains=searchQuery)[:5]
            serialized = Movie_Serializer(filterResults, many=True)
            return Response(serialized.data)
    except:
        return Response('')


# FUNCTION IS USED TO LOGIN USER TO SITE
@csrf_exempt
def Login(request):
    context = {
        "Status": ''
    }

    if request.method == 'POST':
        try:
            Username         = bleach.clean(request.POST.get('Username'))
            Password         = bleach.clean(request.POST.get('Password'))
            LoggedInUser     = authenticate(request, username=Username, password=Password)
            if LoggedInUser:
                login(request, LoggedInUser)
                context["Status"] = "Login Successfull"
                return redirect('/')
            else:
                context["Status"] = "Incorrect Username or Password"
        except:
            context["Status"] = "Server Error"
            return render(request, 'vikstreamz/login.html', context)

    return render(request, 'vikstreamz/login.html', context)


# FUNCTION IS USED TO LOGOUT USER FROM SITE
@login_required(login_url='/login/')
def Logout(request):
    logout(request)
    return redirect('/login/')