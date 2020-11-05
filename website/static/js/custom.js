$(document).ready(function () {

	// reset scroll on load page
    window.scrollBy({
        top: 0,                          
        left: 0, 
        behavior: 'smooth'
    });
    
	// all gloabal vars to set initial state for elements in webpage, used in various functions below
    $("#preloader2").hide();
    $(".container").removeAttr('hidden');
    var current_tab = 'LIVE-TV';
    var currentActiveTab = 'LIVE-TV';
    var csrf_token = $("#csrf_token input:hidden").val();
    var isFilterApplied = false;
    var selectedCategoryTV, selectedLanguageTV, selectedCategoryTVSHOWS, selectedLanguageTVSHOWS,
    selectedCategoryMOVIES,
    selectedLanguageMOVIES = null;
    var filterResultsdata = "null"; 
    $("button.resetBtn").hide();
    $("div#episodesDiv").hide();
    $("a#showEpisode1").hide();
    $("a#showEpisode2").hide();
	
	var widthofInputFiledSearcHBox = $('input#searchBoxInputField1').css('width');
	$('div#listGroupSearchResultsDiv1').width(widthofInputFiledSearcHBox);
	$('div#listGroupSearchResultsDiv11').width($('input#searchBoxInputField11').css('width'));
	$('div#listGroupSearchResultsDiv22').width($('input#searchBoxInputField11').css('width'));
	$('div#listGroupSearchResultsDiv33').width($('input#searchBoxInputField11').css('width'));
	$('div#listGroupSearchResultsDiv2').width(widthofInputFiledSearcHBox);
	$('div#listGroupSearchResultsDiv3').width(widthofInputFiledSearcHBox);
	var widthofInputFiledSearcHBox = $('input#searchBoxInputField').css('width');
	$('div#listGroupSearchResultsDiv').width(widthofInputFiledSearcHBox);

// remove fade animation from body after page is loaded
	setTimeout(function () {
		$("body").removeClass("animate__animated");
	}, 3000);
	
// on scroll fetch more content from database
	$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        if (current_tab == 'LIVE-TV') {
            scrollLiveTvFecth();
        } else if (current_tab == 'TV-SHOWS') {
            scrollTV_Shows_Fetch();
        } else if (current_tab == 'MOVIES') {
            scrollMoviesFetch();
        } else {
        }
    }
});


// initialize videoplayer for modal with id my_video_1
	var player = videojs('my_video_1');
	player.isFullscreen(false);


//perform some actions when each tab( LIVE TV, TV-SHOWS, MOVIES) is clicked
$('.nav-tabs a').on('shown.bs.tab', function (e) {
        current_tab = $(this).text().trim();
        currentActiveTab = $(this).text().trim();
        if(current_tab == 'TV-SHOWS'){
            $("a#showEpisode1").show();
            $("a#showEpisode2").show();
        }
        else{
        }
    })
	
//disable right click on webpage
$(document).bind("contextmenu",function(e){
    return false;
});

//clear search results from searchBox div, when outside the search box is clicked
$(document).on("click", function (event) {
    if (event.target.id == 'searchBoxResultsDiv1' | event.target.id == 'searchBoxResultsDiv2' | event.target.id == 'searchBoxResultsDiv3' | event.target.id == 'searchBoxInputField1' | event.target.id == 'searchBoxInputField2' | event.target.id == 'searchBoxInputField3') {
        $('#searchBoxResultsDiv1').show();
        $('#searchBoxResultsDiv2').show();
        $('#searchBoxResultsDiv3').show();
    } else {
        $('#searchBoxResultsDiv1').hide();
        $('#searchBoxResultsDiv2').hide();
        $('#searchBoxResultsDiv3').hide();
        $('#searchBoxInputField1').val('');
        $('#searchBoxInputField2').val('');
        $('#searchBoxInputField3').val('');
    }
});

$('a.nav-toggle').click(function () {
    var collapse_content_selector = $(this).attr('href');
    var toggle_switch = $(this);
});

//call resetFilter() function when resetBTn class is clicked on all 3 resetButtons
$(document).on("click", "button.resetBtn ",resetFilter);

//launch modal and play content when play button is clicked, only for TV-SHOWS tab content
$(document).on("click", "span.playButton ", function () {
    var showNumber = $(this).attr('showNumber');
    var itemName = $(this).attr('itemName');
    var poster = $(this).attr('poster');
    var userAgent = navigator.userAgent
    if(userAgent.includes('Chrome')==false){             
        player.poster(poster);
    }
    $('#ModalplayerItemName').text(itemName);
    $('#showID').text(showNumber);
    TvFirstEpisodeFetchBySeasonIDshowID_AND_LaunchTV_showsModal(showNumber);
});

//show season select option and episodes menu on chevron down click arrow1
$(document).on("click", "a#showEpisode1", function () {
    if(current_tab == 'TV-SHOWS'){
        $("div#episodesDiv").show();
    }        
});

//fetch and put all episdes to episodelist div, when any season select button is clicked in TV-SHOWS modal window
$(document).on("click", "a.EachSeason", function () {
    var seasonID = $(this).attr('seasonid').trim();
    var showID   = $('#showID').text().trim();
    $(this).toggleClass("animate__animated animate__bounceIn");
    $.post("TvEpisodeFetchBySeasonIDshowID/",{
        "seasonID": seasonID,
        "showID": showID,
        "csrfmiddlewaretoken": csrf_token,
    },
    function (data, status,xhr)
    {
        if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
        }
        $('.episodesListForEachSeason').empty();
        var EpList = [];
        for (var i = 0; i < data.length; i++)
        {
            var jsonObject = data[i];
            for (x in jsonObject)
            {
                var value =  jsonObject[x];
                if(value != "null"){
                    EpList.push(value);
                }
            }             
		}  // for (var i = 0;

		var oneDivEpisodesListHtml1 =  `<div id="S`+seasonID+`" class=" animate__animated animate__flipInX">`;                    
		for(var i = 1; i < EpList.length; i++){
			if(EpList[i] != "" && EpList[i].length >5){
				oneDivEpisodesListHtml1 +=  `<a class="AllEpisodeListAnchor btn btn-sm  btn-primary  mr-1" showURL="`+EpList[i]+`"> EP`+i+`</a>`;         
			}    //if(EpList[i] !                
		} //for(var i = 1; i < EpList.length; i++){
		oneDivEpisodesListHtml1 += `</div>`;
		$('.episodesListForEachSeason').prepend(oneDivEpisodesListHtml1);
	});
});

//show episodes list  on click season button, episodesDiv is hidden by default
$(document).on("click", "a#showEpisode2", function () {
    if(current_tab == 'TV-SHOWS'){
        $("div#episodesDiv").show();
    }
});


//toggle activate state on hover pointer, for dropdown list for searchbox results
$('a.list-group-item').hover(function () {
    $(this).toggleClass("active ");
});

//toggle activate state on hover pointer, for dropdown list for searchbox results child elements
$('.list-group-item a').hover(function () {
    $(this).toggleClass("active");
});

//fetch relevent search content, when user enter charcter in searchbox, put in searchBoxResultsDivs..
$(".tab-content input").keyup(function () {
    $("div#searchBoxResultsDiv1").removeAttr('hidden');
    $("div#searchBoxResultsDiv2").removeAttr('hidden');
    $("div#searchBoxResultsDiv3").removeAttr('hidden');
    $("div#searchBoxResultsDiv11").removeAttr('hidden');
    $("div#searchBoxResultsDiv22").removeAttr('hidden');
    $("div#searchBoxResultsDiv33").removeAttr('hidden');
    searchQuery = $(this).val().trim();
    if (searchQuery != '') {
        searchFunction(currentActiveTab, searchQuery);
    } else {
        $("#listGroupSearchResultsDiv1 a").remove('.list-group-item');
        $("#listGroupSearchResultsDiv11 a").remove('.list-group-item');
        $("#listGroupSearchResultsDiv2 a").remove('.list-group-item');
        $("#listGroupSearchResultsDiv22 a").remove('.list-group-item');
        $("#listGroupSearchResultsDiv3 a").remove('.list-group-item');
        $("#listGroupSearchResultsDiv33 a").remove('.list-group-item');
    }
});

//toggle on bounce/pulse animation, on hover images/thumbnail for LIVE-TV AND MOVIES tab 
$(document).on("mouseenter", "div.LiveTvThumnails  , div.Movies_Thumnails", function () {
    $(this).toggleClass("animate__animated animate__pulse animate__faster 100");
});

//toggle off bounce/pulse animation, on hover images/thumbnail for LIVE-TV AND MOVIES tab
$(document).on("mouseleave", "div.LiveTvThumnails  , div.Movies_Thumnails", function () {
    $(this).toggleClass("animate__animated animate__pulse animate__faster 100");
});

//various action to perform when any tab is clicked> LIVETV,SHOWS,MOVIES
$(document).on("click", ".nav-link", function () {
    $(this).toggleClass("animate__animated animate__bounceIn");
    isFilterApplied = false;
    $("#showEpisode1").hide();
    $("#showEpisode2").hide();
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
    });
});

// modal show or hide animation with timeout
var stopHide = true;
$('#myModal').on('hide.bs.modal', function (e) {
    if (stopHide) {
        $('.mc2').removeClass('animate__animated animate__zoomIn animate__faster 100').addClass('animate__animated animate__zoomOut animate__faster 100');
        stopHide = false;
        $("div#episodesDiv").hide();
        setTimeout(function () {
            $('#myModal').modal('hide');
            $('.mc2').removeClass('animate__animated animate__zoomOut animate__faster 100').addClass('animate__animated animate__zoomIn animate__faster 100');
        }, 300);
        return false;
    }
    stopHide = true;
    return true;
});

//change text from category to >(clicked category) for LIVE-TV
$(".LiveTvDropDownCategoryoption a").click(function () {
    selectedCategoryTV = $(this).text().trim();
    $(".LiveTvDropDownCategoryNamePlate").text(selectedCategoryTV);
});

//change Language text to selected
$(".LiveTvDropDownLanguageoption a").click(function () {
    selectedLanguageTV = $(this).text().trim();
    $(".LiveTvDropDownLanguageNamePlate").text(selectedLanguageTV);
});

//on click search icon performs actions - search with fitlers applies such as category,language 
$(".searchIconLiveTV").click(function () {
    if (selectedCategoryTV != null && selectedLanguageTV != null) {
        var data = filter_category_Lang_TV(selectedCategoryTV, selectedLanguageTV);
        $(".LiveTvThumnails").fadeOut();
        $(".pressTofilterButton").hide();
        $("button#btnSpinner1").removeAttr('hidden');
        $("button#btnSpinner1").fadeIn();
        ;
        setTimeout(
            function () {
                AppendLiveTvFilterResults(filterResultsdata);                   
                $("button#btnSpinner1").attr('hidden',true);                                
                $("button.resetBtn").show();
                $(".pressTofilterButton").fadeIn();
                $(".resetBtn").addClass('btn-success');
            }, 2000);
    } else {
        alert('Please select both category and Language option');
    }
});

//change language text to selected
$(".TvshowsDropDownLanguageoption a").click(function () {
    selectedLanguageTVSHOWS = $(this).text().trim();
    $(".TvshowsDropDownLanguageNamePlate").text(selectedLanguageTVSHOWS);
});

//change text from category to >(clicked category) for TV-SHOWS
$(".TvshowsDropDownCategoryoption a").click(function () {
    selectedCategoryTVSHOWS = $(this).text().trim();
    $(".TvshowsDropDownCategoryNamePlate").text(selectedCategoryTVSHOWS);
});

//on click search icon performs actions - search with fitlers applies such as category,language 
$(".searchIconTVshows").click(function () {
    if (selectedCategoryTVSHOWS != null && selectedLanguageTVSHOWS != null) {
        var data = filter_category_Tv_shows(selectedCategoryTVSHOWS, selectedLanguageTVSHOWS);
        $(".Tv_Shows_Thumnails").fadeOut();
        $(".pressTofilterButton").hide();
        $("button#btnSpinner2").removeAttr('hidden');
        $("button#btnSpinner2").fadeIn();
        $("button.resetBtn").show();
        ;
        setTimeout(
            function () {
                AppendTV_SHOWS_FilterResults(filterResultsdata);                   
                $("button#btnSpinner2").attr('hidden',true);
                $(".pressTofilterButton").fadeIn();
                 $(".resetBtn").addClass('btn-success');
            }, 2000);
    } else {
        alert('Please select both category and Language option');
    }
});

//change text from category to >(clicked category)
$(".MovieSDropDownLanguageoption a").click(function () {
    selectedLanguageMOVIES = $(this).text().trim();
    $(".MovieSDropDownLanguageNamePlate").text(selectedLanguageMOVIES);
});

//change text from category to >(clicked category)
$(".MovieSDropDownCategoryoption a").click(function () {
    selectedCategoryMOVIES = $(this).text().trim();
    $(".MovieSDropDownCategoryNamePlate").text(selectedCategoryMOVIES);
});

//on click search icon performs actions - search with fitlers applies such as category,language 
$("div#searchIconMoviesN").click(function () {       
    if (selectedCategoryMOVIES != null && selectedLanguageMOVIES != null) {            
        var data = filter_category_Movies(selectedCategoryMOVIES, selectedLanguageMOVIES);
        $(".Movies_Thumnails").fadeOut();
        $(".pressTofilterButton").hide();
        $("button#btnSpinner3").removeAttr('hidden');
        $("button#btnSpinner3").fadeIn();
        $("button.resetBtn").show();
        ;
        setTimeout(
            function () {
                AppendMOVIES_FilterResults(filterResultsdata);
                $("button#btnSpinner3").attr('hidden',true);
                $(".pressTofilterButton").fadeIn();
                 $(".resetBtn").addClass('btn-success');
            }, 2000);
    } else {
        alert('Please select both category and Language option');
    }
});

//fullscreen toogle on double click on video player 
$('.modal-body video').dblclick(function () {
    if (player.isFullscreen() != true) {
        fullscreen(player);
        player.isFullscreen(true);
    }
    if (player.isFullscreen() == true) {
        player.exitFullscreen();
        player.isFullscreen(false);
    }
});

//play each item by loading its source url to modal(web player)
$(document).on("click", ".vidAnchor", function (event) {
    var thumbSRC = $(this).next('img').prevObject[0].firstChild.nextElementSibling.currentSrc;
    var itemName = $(this).text().trim();
    var showNumber = $(this).attr('showNumber');
    $('#ModalplayerItemName').text(itemName);
    $('#showID').text(showNumber);
    var userAgent = navigator.userAgent
    if(userAgent.includes('Chrome')==false){             
        player.poster(thumbSRC);
    }
    if(current_tab != 'TV-SHOWS'){
        var fileName, fileExtension;
        fileName = $(this).attr('VideoSrc');            
        fileExtension = fileName.replace(/^.*\./, '');
        if (fileExtension == 'mp4') {
            player.src({
                type: "video/mp4",
                src: $(this).attr('VideoSrc')
            });
        } else if (fileExtension == 'm3u8') {
            player.src({
                type: "application/x-mpegURL",
                src: $(this).attr('VideoSrc')
            });
        }
        else if (fileExtension == 'mkv') {
            player.src({
                type: "video/mp4",
                src: $(this).attr('VideoSrc')
            });
        }
        else{
            player.src({
                type: "application/x-mpegURL",
                src: $(this).attr('VideoSrc')
            });
        }
} // if(current_tab != 'TV-SHOWS')
	
else if(current_tab == 'TV-SHOWS'){
    TvFirstEpisodeFetchBySeasonIDshowID_AND_LaunchTV_showsModal(showNumber);
}
});

//reset video source and poster, pause video when modal window outside is clicked.
$('.modal').on('hidden.bs.modal', {
    arg1: player
}, function (e) {
    var player = e.data.arg1;
    player.poster('');
    player.pause();
    player.src('');
});

//play the selected episode when buttion such as EP1, EP2, .... etc are clicked on player window.
$(document).on("click", "a.AllEpisodeListAnchor", function () {
    var fileName, fileExtension;
    var data = $(this).attr("showURL");
    $(this).toggleClass("animate__animated animate__bounceIn");
    fileName = data;
    fileExtension = fileName.replace(/^.*\./, '');                    
    if (fileExtension == 'mp4') {
        player.src({
            type: "video/mp4",
            src: data
        });
        player.play();
    } 
    else if (fileExtension == 'mkv') {
        player.src({
            type: "video/mp4",
            src: data
        });
        player.play();
    } 
    else if (fileExtension == 'webm') {
        player.src({
            type: "video/webm",
            src: data
        });
        player.play();
    } 
    else if (fileExtension == 'm3u8') {
        player.src({
            type: "application/x-mpegURL",
            src: data
        });
        player.play();
    }
});







//toogle fullcscreen 
function fullscreen(player) {
    player.requestFullscreen();
}

//APPLY FILTER FOR LIVETV
function filter_category_Lang_TV(cat, lang) {
    $.post("filterCategoryLanguageLiveTv/", {
        "Category": cat,
        "Language": lang,
        "csrfmiddlewaretoken": csrf_token,
    },
    function (data, status,xhr) {
        if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
        }
        selectedCategoryTV= null;
        selectedLanguageTV= null;
        selectedCategoryTVSHOWS= null;
        selectedLanguageTVSHOWS= null;
        selectedCategoryMOVIES = null;
        selectedLanguageMOVIES = null;
        selectedLanguageMOVIES = null;
        filterResultsdata = data;
    });
}

//APPLY FILTER FOR TV SHOWS
function filter_category_Tv_shows(cat, lang) {
    $.post("filterCategoryLanguageTvshows/", {
        "Category": cat,
        "Language": lang,
        "csrfmiddlewaretoken": csrf_token,
    },
    function (data, status,xhr) {
        if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
        }
        selectedCategoryTV= null;
        selectedLanguageTV= null;
        selectedCategoryTVSHOWS= null;
        selectedLanguageTVSHOWS= null;
        selectedCategoryMOVIES = null;
        selectedLanguageMOVIES = null;
        filterResultsdata = data;
    });
}

//APPLY FILTER FOR MOVIES
function filter_category_Movies(cat, lang) {
    $.post("filterCategoryLanguageMovies/", {
        "Category": cat,
        "Language": lang,
        "csrfmiddlewaretoken": csrf_token,
    },
    function (data, status,xhr) {
        if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
        }
        selectedCategoryTV= null;
        selectedLanguageTV= null;
        selectedCategoryTVSHOWS= null;
        selectedLanguageTVSHOWS= null;
        selectedCategoryMOVIES = null;
        selectedLanguageMOVIES = null;
        filterResultsdata = data;
    });
}

//DISPLAY FILTER RESPONSE DATA INTO LIVETV TAB CONTENT AREA.
function AppendLiveTvFilterResults(data) {
    if(data.length ==0){
        alert('Sorry no results found for this category');
    }
    for (var i = 0; i < data.length; i++) {
        var jsonObject = data[i];
        var channelNumber = jsonObject.id;
        var channelName = jsonObject.channelName;
        var poster = jsonObject.poster;
        var channelURL = jsonObject.channelURL;
        var oneDivHtml = `<div class="LiveTvThumnails  col-lg-2 col-md-4 col-6 mb-2 text-center pr-2 pl-2" >
        <a channelNumber="` + channelNumber + `" VideoSrc="` + channelURL + `"  data-toggle="modal" data-target=".PLAYER_MODAL" class="vidAnchor d-block mb-4 text-decoration-none">
        <img class="animate__animated animate__fadeIn img-fluid img-thumbnail border border-light border-3 shadow"  src="` + poster + `" alt="` + channelName + `">
        <br><strong>` + channelName + `</strong>
        </a>
        </div> `;
        $(oneDivHtml).insertAfter($(".LiveTvThumnails").last());
    }

    isFilterApplied = true;
}

//DISPLAY FILTER RESPONSE DATA INTO TV SHOWS TAB CONTENT AREA.
function AppendTV_SHOWS_FilterResults(data) {
    if(data.length ==0){
        alert('Sorry no results found for this category');
    }
    for (var i = 0; i < data.length; i++) {
        var jsonObject = data[i];
        var showNumber = jsonObject.id;
        var ShowName = jsonObject.ShowName;
        var poster = jsonObject.poster;
        var showURL = jsonObject.channelURL;
        var oneDivHtml = `<div class="Tv_Shows_Thumnails  col-lg-2 col-md-4 col-6 mb-2 text-center pr-2 pl-2" >
        <a showNumber="` + showNumber + `" VideoSrc="` + showURL + `"  data-toggle="modal" data-target=".PLAYER_MODAL" class="vidAnchor d-block mb-4 text-decoration-none">
        <img class=" animate__animated animate__fadeIn img-fluid img-thumbnail border border-light border-3 shadow"  src="` + poster + `" alt="` + ShowName + `">
        <br><strong>` + ShowName + `</strong>
        </a>
        </div> `;
        $(oneDivHtml).insertAfter($(".Tv_Shows_Thumnails").last());
    }
    isFilterApplied = true;
}

//DISPLAY FILTER RESPONSE DATA INTO MOVIES TAB CONTENT AREA.
function AppendMOVIES_FilterResults(data) {
    if(data.length ==0){
        alert('Sorry no results found for this category');
    }
    for (var i = 0; i < data.length; i++) {
        var jsonObject = data[i];
        var MovieNumber = jsonObject.id;
        var MovieName = jsonObject.MovieName;
        var poster = jsonObject.poster;
        var MovieURL = jsonObject.MovieURL;
        var oneDivHtml = `<div class="Movies_Thumnails  col-lg-2 col-md-4 col-6 mb-2 text-center pr-2 pl-2" >
        <a MovieNumber="` + MovieNumber + `" VideoSrc="` + MovieURL + `"  data-toggle="modal" data-target=".PLAYER_MODAL" class="vidAnchor d-block mb-4 text-decoration-none">
        <img class=" animate__animated animate__fadeIn img-fluid img-thumbnail border border-light border-3 shadow"  src="` + poster + `" alt="` + MovieName + `">
        <br><strong>` + MovieName + `</strong>
        </a>
        </div> `;
        $(oneDivHtml).insertAfter($(".Movies_Thumnails").last());
    }
    isFilterApplied = true;
}

//FETCH LIVE TV CHANNELS AND PUT IN LIVE TV CONTENT AREA
function scrollLiveTvFecth(){
    var lastLiveTvChild = $(".LiveTvThumnails a:last").attr('channelNumber');
    if (isFilterApplied == false) {
        $.post("LiveTvfetch/?format=json", {
            "id": lastLiveTvChild,
            "csrfmiddlewaretoken": csrf_token,
        },
        function (data, status,xhr) {
            if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
            }else{
                    for (var i = 0; i < data.length; i++) {
                    var jsonObject = data[i];
                    var channelNumber = jsonObject.id;
                    var channelName = jsonObject.channelName;
                    var poster = jsonObject.poster;
                    var channelURL = jsonObject.channelURL;
                    
                    var oneDivHtml = `<div class="LiveTvThumnails  col-lg-2 col-md-4 col-6 mb-2 text-center pr-2 pl-2" >
                    <a channelNumber="` + channelNumber + `" VideoSrc="` + channelURL + `"  data-toggle="modal" data-target=".PLAYER_MODAL" class="vidAnchor d-block mb-4 text-decoration-none">
                    <img class="animate__animated animate__fadeIn img-fluid img-thumbnail border border-light border-3 shadow"  src="` + poster + `" alt="` + channelName + `">
                    <br><strong>` + channelName + `</strong>
                    </a>
                    </div> `;
                    $(oneDivHtml).insertAfter($(".LiveTvThumnails").last());

                }
                removeDuplicates('a[channelNumber]');
                window.scrollBy({
                    top: 220,                          
                    left: 0, 
                    behavior: 'smooth'
                });
            }        


		}); //end of call function .post request
    }
} //end of scrollLiveTvfetch

//FETCH TVSHOWS  AND PUT IN TVSHOWS CONTENT AREA
function scrollTV_Shows_Fetch(){
    if (isFilterApplied == false) {
        var lastTv_show_element = $(".GetshowNumber a:last").attr('showNumber');
        $.post("TvShowsfetch/?format=json", {
            "id": lastTv_show_element,
            "csrfmiddlewaretoken": csrf_token,
        },
        function (data, status,xhr) {
            if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
            }
            else{
                for (var i = 0; i < data.length; i++) {
                var jsonObject = data[i];
                var showNumber = jsonObject.id;
                var ShowName = jsonObject.ShowName;
                var poster = jsonObject.poster;
                var description = jsonObject.description;                 
                var showURL = jsonObject.showURL;
                var ratings = jsonObject.ratings;
                var oneDivHtml = `<div class="Tv_Shows_Thumnails   col-lg-6 col-md-12 col-sm-12   text-center ">
                <div class="row bg-light mb-3 ml-1 mr-1">
                <div class="GetshowNumber col-4 pr-2 pl-0 ">
                <a showNumber="` + showNumber + `" VideoSrc="` + showURL + `" data-toggle="modal"
                data-target=".PLAYER_MODAL" class="vidAnchor d-block mb-4 h-120 text-decoration-none  ">
                <img class=" shadow-lg animate__animated animate__fadeIn img-fluid img-thumbnail shadow-lg " src="` + poster + `" alt="">
                <strong hidden="true"> ` + ShowName + `</strong>
                </a>
                </div>
                <div class="col-8 pl-2 pr-2 text-justify shadow-lg" style="height: 170px;">
                <div class="text-center mx-auto h6 text-primary mt-1"> ` + ShowName + `</div>
                <p ><strong>`+description.substr(0,80)+`</strong>
                <a href="#collapse" class="toggleReadMore" data-toggle="modal" data-target="#show1modal` + showNumber + `">Read More</a>
                </p>
                <div class="modal animate__animated animate__headShake animate__faster 100" id="show1modal` + showNumber + `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                <div class="modal-content">                         
                <div class="modal-body ">
                <div class="d-flex justify-content-center" ><img  class="w-50" src="`+poster+`"></div>
                <div class="text-center mx-auto h6 text-primary mt-1"> ` + ShowName + `</div>
                <p>`+description+`</p>
                <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-sm btn-primary text-capitalize" data-dismiss="modal">Close</button>
                </div>
                </div>
                </div>
                </div>
                </div>
                <div class="row ml-1 mr-1  ">
                
                <span class="btn btn-primary p-2 shadow"><i class="fa fa-md fa-star" aria-hidden="true"></i>8.0</a></span>
                <span poster="` + poster + `" itemName="` + ShowName + `" data-toggle="modal" data-target=".PLAYER_MODAL" showNumber="` + showNumber + `" VideoSrc="` + poster + `" class="playButton btn btn-primary p-2 ml-1 text-capitalize shadow">
                <i class="fa fa-lg fa-play-circle" aria-hidden="true"></i>Play</span>                
                </div>
                </div>
                </div>
                </div>`;
                // console.log(oneDivHtml);
                $(oneDivHtml).insertAfter($(".Tv_Shows_Thumnails").last());                
                
            }
            removeDuplicates('a[showNumber]');
            window.scrollBy({
                    top: 400,                          
                    left: 0, 
                    behavior: 'smooth'
                });
            }
            
		}); //end of call function .post request
    }
} //end of scrollTVSHOWS

//SESSION EXPIRE CHECK
function isSessionExpiredCheckJson(xhr){
            var type = xhr.getResponseHeader("content-type");
            var Content_Length = xhr.getResponseHeader("content-length");
            if(type != 'application/json' & Content_Length > 0){                
                alert('Session timeout, Please login again.');
                location.reload()
                return true;
            }
            else if(Content_Length == 0){                                
                return false;
            }           
}
//FETCH MOVIES  AND PUT IN MOVIES CONTENT AREA
function scrollMoviesFetch() {
    var lastMovieNumber = $(".Movies_Thumnails a:last").attr('MovieNumber');
    if (isFilterApplied == false) {
        $.post("Moviefetch/?format=json", {
            "id": lastMovieNumber,
            "csrfmiddlewaretoken": csrf_token,
        },
        function (data, status, xhr) {                        
            if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
            }
            else{
                for (var i = 0; i < data.length; i++) {
                var jsonObject = data[i];
                var MovieNumber = jsonObject.id;
                var MovieName = jsonObject.MovieName;
                var poster = jsonObject.poster;
                var MovieURL = jsonObject.MovieURL;
                var oneDivHtml = `<div class="Movies_Thumnails  col-lg-2 col-md-4 col-5 mb-2 text-center pr-1 pl-1" >
                <a MovieNumber="` + MovieNumber + `" VideoSrc="` + MovieURL + `"  data-toggle="modal" data-target=".PLAYER_MODAL" class="vidAnchor d-block mb-3 text-decoration-none">
                <img class="animate__animated animate__fadeIn img-fluid   shadow"  src="` + poster + `" alt="` + MovieName + `">
                <br><strong>` + MovieName + `</strong>
                </a>
                </div>`;
                $(oneDivHtml).insertAfter($(".Movies_Thumnails").last());
               
            }
             removeDuplicates('a[MovieNumber]');
              window.scrollBy({
                    top: 200,                          
                    left: 0, 
                    behavior: 'smooth'
                });
            }
		}); //end of call function .post request
    }
} //end of scrollLiveTvfetch

//FETCH EACH SHOW'S FIRST EPISODE, PUT IN MODAL PLAYER WINDOW 
function TvFirstEpisodeFetchBySeasonIDshowID_AND_LaunchTV_showsModal(showNumber){
    if(showNumber !=''){
        var showID   = showNumber;
    }
    else{
        var showID   = $('#showID').text().trim();
    }
    var seasonID = $('a.EachSeason').attr('seasonid').trim();
    $.post("TvFirstEpisodeFetchBySeasonIDshowID/",{
        "seasonID": seasonID,
        "showID": showID,
        "csrfmiddlewaretoken": csrf_token,
    },
    function (data, status,xhr)
    {
        if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
        }
        var fileName, fileExtension;
        fileName = data;
        fileExtension = fileName.replace(/^.*\./, '');
        if (fileExtension == 'mp4') {
            player.src({
                type: "video/mp4",
                src: data
            });
        } 
        else if (fileExtension == 'mkv') {
            player.src({
                type: "video/mp4",
                src: data
            });
        } 
        else if (fileExtension == 'webm') {
            player.src({
                type: "video/webm",
                src: data
            });
        } 
        else if (fileExtension == 'm3u8') {
            player.src({
                type: "application/x-mpegURL",
                src: data
            });
        }
    });
}

//FUNCTION TO SEARCH LIVE TV CHANNELS, TV-SHOWS, MOVIES , wHEN USER INPUT DATA
function searchFunction(_tab, _query) {
    $.post("search/", {
        "Tab": _tab,
        "searchQuery": _query,
        "csrfmiddlewaretoken": csrf_token,
    },
    function (data, status,xhr) {
        if(isSessionExpiredCheckJson(xhr)){ 
                 return;              
            }
        if (_tab == 'LIVE-TV')
		{
            $("#listGroupSearchResultsDiv1 a").remove('.list-group-item');
            $("#listGroupSearchResultsDiv11 a").remove('.list-group-item');
            if (data.length == 0)
			{
                $("#listGroupSearchResultsDiv1").append(`<a href='#' class='list-group-item list-group-item-action'><strong> No results</strong></a>`);
                $("#listGroupSearchResultsDiv11").append(`<a href='#' class='list-group-item list-group-item-action'><strong> No results</strong></a>`);
			} //if(data.leng
			for (var i = 0; i < data.length; i++)
			{
				var jsonObject = data[i];
				var channelNumber = jsonObject.id;
				var channelName = jsonObject.channelName;
				var poster = jsonObject.poster;
				var channelURL = jsonObject.channelURL;
				$("#listGroupSearchResultsDiv1").append(`
					<a VideoSrc="` + channelURL + `" data-toggle="modal"
					data-target=".PLAYER_MODAL" class="vidAnchor list-group-item list-group-item-action">
					<img  style="height:35px;width: 35px;" class="animate__animated animate__fadeIn img-fluid img-thumbnail" src="` + poster + `" alt="">
					<strong>` + channelName + `</strong>
					</a>`);
				$("#listGroupSearchResultsDiv11").append(`
					<a VideoSrc="` + channelURL + `" data-toggle="modal"
					data-target=".PLAYER_MODAL" class="vidAnchor list-group-item list-group-item-action">
					<img  style="height:35px;width: 35px;" class="animate__animated animate__fadeIn img-fluid img-thumbnail" src="` + poster + `" alt="">
					<strong>` + channelName + `</strong>
					</a>`);
			} //for (va
		} // if(_tab=='LIVE-TV')
			
		if (_tab == 'TV-SHOWS')
		{
			$("#listGroupSearchResultsDiv2 a").remove('.list-group-item');
			$("#listGroupSearchResultsDiv22 a").remove('.list-group-item');
			if (data.length == 0)
			{
				$("#listGroupSearchResultsDiv2").append(`<a href="#" class="list-group-item list-group-item-action "><strong> No results</strong>
					</a>`);
				$("#listGroupSearchResultsDiv22").append(`<a href="#" class="list-group-item list-group-item-action "><strong> No results</strong>
					</a>`);
			} //if(data.leng
				for (var i = 0; i < data.length; i++)
				{
					var jsonObject = data[i];
					var showNumber = jsonObject.id;
					var ShowName = jsonObject.ShowName;
					var poster = jsonObject.poster;
					var showURL = jsonObject.showURL;
					$("#listGroupSearchResultsDiv2").append(`
						<a showNumber="` + showNumber + `" VideoSrc="` + showURL + `" data-toggle="modal"
						data-target=".PLAYER_MODAL" class="vidAnchor list-group-item list-group-item-action">
						<img  style="height:35px;width: 35px;" class="animate__animated animate__fadeIn img-fluid img-thumbnail" src="` + poster + `" alt="">
						<strong>` + ShowName + `</strong>
						</a>`);
					$("#listGroupSearchResultsDiv22").append(`
						<a showNumber="` + showNumber + `" VideoSrc="` + showURL + `" data-toggle="modal"
						data-target=".PLAYER_MODAL" class="vidAnchor list-group-item list-group-item-action">
						<img  style="height:35px;width: 35px;" class="animate__animated animate__fadeIn img-fluid img-thumbnail" src="` + poster + `" alt="">
						<strong>` + ShowName + `</strong>
						</a>`);
				} //for (va
		} //  if(_tab=='TV-SHOWS')
			
		if (_tab == 'MOVIES')
		{
			$("#listGroupSearchResultsDiv3 a").remove('.list-group-item');
			$("#listGroupSearchResultsDiv33 a").remove('.list-group-item');
			if (data.length == 0)
			{
				$("#listGroupSearchResultsDiv3").append(`<a href="#" class="list-group-item list-group-item-action "><strong> No results</strong>
					</a>`);
				$("#listGroupSearchResultsDiv33").append(`<a href="#" class="list-group-item list-group-item-action "><strong> No results</strong>
					</a>`);
			} //if(data.leng
		
			for (var i = 0; i < data.length; i++) 
			{
				var jsonObject = data[i];
				var channelNumber = jsonObject.id;
				var MovieName = jsonObject.MovieName;
				var poster = jsonObject.poster;
				var MovieURL = jsonObject.MovieURL;
 
				$("#listGroupSearchResultsDiv3").append(`
					<a VideoSrc="` + MovieURL + `" data-toggle="modal"
					data-target=".PLAYER_MODAL" class="vidAnchor list-group-item list-group-item-action">
					<img  style="height:35px;width: 35px;" class=" animate__animated animate__fadeIn img-fluid img-thumbnail" src="` + poster + `" alt="">
					<strong>` + MovieName + `</strong>
					</a>`);
			
				$("#listGroupSearchResultsDiv33").append(`
					<a VideoSrc="` + MovieURL + `" data-toggle="modal"
					data-target=".PLAYER_MODAL" class="vidAnchor list-group-item list-group-item-action">
					<img  style="height:35px;width: 35px;" class=" animate__animated animate__fadeIn img-fluid img-thumbnail" src="` + poster + `" alt="">
					<strong>` + MovieName + `</strong>
					</a>`);
			} //for (va
			
		} // if(_tab=='MOVIES')
			
	}); //post("search/",
} //searchFunction

//RESET APPLIED FILTER, REMOVE SEARCH RESUTLS FROM VISIBLE SCREEN,AND HIDE SOME DIVS AND ICONS..
function resetFilter() {
    $(".fa-arrow-alt-circle-right").removeClass('btn-success').addClass('btn-primary');
    $(".LiveTvThumnails").fadeIn();
    $(".Tv_Shows_Thumnails").fadeIn();
    $(".Movies_Thumnails").fadeIn();
    $("button.resetBtn").hide();
    $(".LiveTvDropDownCategoryNamePlate").text('Category');
    $(".TvshowsDropDownCategoryNamePlate").text('Category');
    $(".MovieSDropDownCategoryNamePlate").text('Category');
    $(".LiveTvDropDownLanguageNamePlate").text('Language');
    $(".TvshowsDropDownLanguageNamePlate").text('Language');
    $(".MovieSDropDownLanguageNamePlate").text('Language');
    isFilterApplied = false;
}



//remove duplicate items from DOM
function removeDuplicates(attributeCustom){
    var map = {};
    $(attributeCustom).each(function(){
        var value = $(this).text();
        if (map[value] == null){
            map[value] = true;
        } else {
            $(this).remove();
        }
    });      
}

// var channels = "a[channelNumber]";
// var shows = "a[showNumber]";
// var movies = "a[MovieNumber]";
// removeDuplicates(channels);      
// removeDuplicates(shows);      
// removeDuplicates(movies);      
}); //document.ready
